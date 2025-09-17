# LMS Deployment Guide

This directory contains all deployment-related configurations and scripts for the LMS (Learning Management System) microservices architecture.

## 📁 Directory Structure

```
deploy/
├── docker/                 # Docker Compose configurations
│   ├── docker-compose.dev.yml
│   ├── docker-compose.prod.yml
│   └── nginx/              # Nginx configuration
├── k8s/                    # Kubernetes manifests
├── helm/                   # Helm charts
├── terraform/              # Infrastructure as Code
│   ├── aws/                # AWS infrastructure
│   ├── gcp/                # GCP infrastructure (future)
│   └── modules/            # Reusable Terraform modules
├── monitoring/             # Monitoring configurations
├── scripts/                # Deployment and utility scripts
│   ├── build.sh           # Build all services
│   ├── deploy.sh          # Deploy to various environments
│   ├── monitoring.sh      # Setup monitoring
│   └── backup.sh          # Backup and restore
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Kubernetes cluster (for K8s deployment)
- Helm (for Helm deployment)
- Terraform (for infrastructure deployment)
- kubectl (for Kubernetes operations)

### Development Environment

1. **Start with Docker Compose:**
```bash
cd deploy/docker
docker-compose -f docker-compose.dev.yml up -d
```

2. **Access services:**
- Frontend: http://localhost:3007
- API Gateway: http://localhost:3000
- Individual services: http://localhost:3001-3006

### Production Deployment

#### Option 1: Docker Compose (Single Server)

```bash
# Set environment variables
export DB_PASSWORD="your-secure-password"
export JWT_SECRET="your-jwt-secret"
export REDIS_PASSWORD="your-redis-password"

# Deploy
cd deploy/docker
docker-compose -f docker-compose.prod.yml up -d
```

#### Option 2: Kubernetes with Helm

```bash
# Deploy infrastructure first
./deploy/scripts/deploy.sh infra

# Deploy application
./deploy/scripts/deploy.sh helm
```

#### Option 3: Kubernetes with Manifests

```bash
# Deploy infrastructure
./deploy/scripts/deploy.sh infra

# Deploy application
./deploy/scripts/deploy.sh k8s
```

## 🏗️ Infrastructure Deployment

### AWS Infrastructure

1. **Configure AWS credentials:**
```bash
aws configure
```

2. **Set up Terraform variables:**
```bash
cd deploy/terraform/aws
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

3. **Deploy infrastructure:**
```bash
terraform init
terraform plan
terraform apply
```

### GCP Infrastructure (Future)

GCP infrastructure configurations will be added in the future.

## 📊 Monitoring Setup

### Deploy Monitoring Stack

```bash
# Deploy all monitoring components
./deploy/scripts/monitoring.sh all

# Or deploy individually
./deploy/scripts/monitoring.sh prometheus
./deploy/scripts/monitoring.sh grafana
./deploy/scripts/monitoring.sh node-exporter
```

### Access Monitoring

```bash
# Prometheus
kubectl port-forward -n monitoring svc/prometheus 9090:9090
# Open: http://localhost:9090

# Grafana
kubectl port-forward -n monitoring svc/grafana 3000:3000
# Open: http://localhost:3000 (admin/admin)
```

## 🔧 Build and Deploy Scripts

### Build All Services

```bash
# Build for development
./deploy/scripts/build.sh

# Build for production
ENVIRONMENT=production ./deploy/scripts/build.sh

# Build and push to registry
PUSH_TO_REGISTRY=true ./deploy/scripts/build.sh
```

### Deploy Application

```bash
# Deploy with Docker Compose
./deploy/scripts/deploy.sh docker

# Deploy with Kubernetes
./deploy/scripts/deploy.sh k8s

# Deploy with Helm
./deploy/scripts/deploy.sh helm

# Deploy infrastructure and application
./deploy/scripts/deploy.sh all
```

## 💾 Backup and Restore

### Create Backup

```bash
# Create full backup
./deploy/scripts/backup.sh backup

# List available backups
./deploy/scripts/backup.sh list
```

### Restore from Backup

```bash
# Restore from specific backup
./deploy/scripts/backup.sh restore 20240101_120000
```

## 🔒 Security Considerations

### Production Security

1. **Use strong passwords:**
   - Database passwords
   - Redis auth tokens
   - JWT secrets

2. **Enable SSL/TLS:**
   - Configure SSL certificates in nginx
   - Use HTTPS for all communications

3. **Network Security:**
   - Use private subnets for databases
   - Configure security groups properly
   - Enable VPC flow logs

4. **Access Control:**
   - Use IAM roles and policies
   - Enable RBAC in Kubernetes
   - Regular security updates

## 📈 Scaling

### Horizontal Scaling

- **Kubernetes HPA:** Configured in Helm values
- **Load Balancer:** AWS ALB or GCP Load Balancer
- **Database:** Read replicas for read-heavy workloads

### Vertical Scaling

- **Node Groups:** Different instance types for different workloads
- **Resource Limits:** Configured in deployment manifests
- **Auto-scaling:** EKS/GKE cluster auto-scaling

## 🔍 Troubleshooting

### Common Issues

1. **Service not starting:**
   ```bash
   # Check logs
   kubectl logs -f deployment/service-name
   docker-compose logs service-name
   ```

2. **Database connection issues:**
   ```bash
   # Check database connectivity
   kubectl exec -it pod-name -- psql -h db-host -U username -d database
   ```

3. **Resource constraints:**
   ```bash
   # Check resource usage
   kubectl top nodes
   kubectl top pods
   ```

### Health Checks

All services expose health check endpoints:
- `/health` - Basic health check
- `/metrics` - Prometheus metrics

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## 🤝 Contributing

1. Follow the existing directory structure
2. Update documentation when adding new configurations
3. Test deployments in development environment first
4. Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License.
