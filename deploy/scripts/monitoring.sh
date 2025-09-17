#!/bin/bash

# Monitoring setup script for LMS
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE=${NAMESPACE:-"lms"}
ENVIRONMENT=${ENVIRONMENT:-"development"}

echo -e "${BLUE}Setting up monitoring for LMS...${NC}"
echo "Namespace: $NAMESPACE"
echo "Environment: $ENVIRONMENT"

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}kubectl is not installed or not in PATH${NC}"
        exit 1
    fi
}

# Function to create monitoring namespace
create_monitoring_namespace() {
    echo -e "${YELLOW}Creating monitoring namespace...${NC}"
    kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -
}

# Function to deploy Prometheus
deploy_prometheus() {
    echo -e "${YELLOW}Deploying Prometheus...${NC}"
    
    # Create Prometheus ConfigMap
    kubectl create configmap prometheus-config \
        --from-file=deploy/monitoring/prometheus.yml \
        --namespace=monitoring \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy Prometheus
    kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: config
          mountPath: /etc/prometheus
        - name: storage
          mountPath: /prometheus
        command:
        - '/bin/prometheus'
        - '--config.file=/etc/prometheus/prometheus.yml'
        - '--storage.tsdb.path=/prometheus'
        - '--web.console.libraries=/etc/prometheus/console_libraries'
        - '--web.console.templates=/etc/prometheus/consoles'
        - '--storage.tsdb.retention.time=200h'
        - '--web.enable-lifecycle'
      volumes:
      - name: config
        configMap:
          name: prometheus-config
      - name: storage
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: monitoring
spec:
  selector:
    app: prometheus
  ports:
  - port: 9090
    targetPort: 9090
  type: ClusterIP
EOF

    echo -e "${GREEN}Prometheus deployed successfully!${NC}"
}

# Function to deploy Grafana
deploy_grafana() {
    echo -e "${YELLOW}Deploying Grafana...${NC}"
    
    # Create Grafana ConfigMap for datasources
    kubectl create configmap grafana-datasources \
        --from-literal=datasources.yaml="
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
" \
        --namespace=monitoring \
        --dry-run=client -o yaml | kubectl apply -f -
    
    # Deploy Grafana
    kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - containerPort: 3000
        env:
        - name: GF_SECURITY_ADMIN_PASSWORD
          value: "admin"
        volumeMounts:
        - name: grafana-storage
          mountPath: /var/lib/grafana
        - name: grafana-datasources
          mountPath: /etc/grafana/provisioning/datasources
      volumes:
      - name: grafana-storage
        emptyDir: {}
      - name: grafana-datasources
        configMap:
          name: grafana-datasources
---
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitoring
spec:
  selector:
    app: grafana
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
EOF

    echo -e "${GREEN}Grafana deployed successfully!${NC}"
}

# Function to deploy Node Exporter
deploy_node_exporter() {
    echo -e "${YELLOW}Deploying Node Exporter...${NC}"
    
    kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: monitoring
spec:
  selector:
    matchLabels:
      app: node-exporter
  template:
    metadata:
      labels:
        app: node-exporter
    spec:
      containers:
      - name: node-exporter
        image: prom/node-exporter:latest
        ports:
        - containerPort: 9100
        volumeMounts:
        - name: proc
          mountPath: /host/proc
          readOnly: true
        - name: sys
          mountPath: /host/sys
          readOnly: true
        - name: root
          mountPath: /rootfs
          readOnly: true
        args:
        - '--path.procfs=/host/proc'
        - '--path.rootfs=/rootfs'
        - '--path.sysfs=/host/sys'
        - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
      volumes:
      - name: proc
        hostPath:
          path: /proc
      - name: sys
        hostPath:
          path: /sys
      - name: root
        hostPath:
          path: /
      hostNetwork: true
      hostPID: true
---
apiVersion: v1
kind: Service
metadata:
  name: node-exporter
  namespace: monitoring
spec:
  selector:
    app: node-exporter
  ports:
  - port: 9100
    targetPort: 9100
  type: ClusterIP
EOF

    echo -e "${GREEN}Node Exporter deployed successfully!${NC}"
}

# Function to setup port forwarding
setup_port_forwarding() {
    echo -e "${YELLOW}Setting up port forwarding...${NC}"
    
    echo "To access monitoring services, run the following commands in separate terminals:"
    echo ""
    echo -e "${BLUE}Prometheus:${NC}"
    echo "kubectl port-forward -n monitoring svc/prometheus 9090:9090"
    echo "Then open: http://localhost:9090"
    echo ""
    echo -e "${BLUE}Grafana:${NC}"
    echo "kubectl port-forward -n monitoring svc/grafana 3000:3000"
    echo "Then open: http://localhost:3000 (admin/admin)"
    echo ""
}

# Main monitoring setup
check_kubectl
create_monitoring_namespace

case "$1" in
    "prometheus")
        deploy_prometheus
        ;;
    "grafana")
        deploy_grafana
        ;;
    "node-exporter")
        deploy_node_exporter
        ;;
    "all")
        deploy_prometheus
        deploy_grafana
        deploy_node_exporter
        setup_port_forwarding
        ;;
    *)
        echo "Usage: $0 {prometheus|grafana|node-exporter|all}"
        echo ""
        echo "Options:"
        echo "  prometheus    - Deploy Prometheus only"
        echo "  grafana       - Deploy Grafana only"
        echo "  node-exporter - Deploy Node Exporter only"
        echo "  all           - Deploy all monitoring components"
        echo ""
        echo "Environment variables:"
        echo "  NAMESPACE     - Kubernetes namespace (default: lms)"
        echo "  ENVIRONMENT   - Deployment environment (default: development)"
        exit 1
        ;;
esac
