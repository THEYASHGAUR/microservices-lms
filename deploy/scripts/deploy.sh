#!/bin/bash

# Deployment script for LMS
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${ENVIRONMENT:-"development"}
NAMESPACE=${NAMESPACE:-"lms"}
REGISTRY=${DOCKER_REGISTRY:-"lms"}
TAG=${DOCKER_TAG:-"latest"}

echo -e "${BLUE}Deploying LMS to $ENVIRONMENT environment...${NC}"
echo "Namespace: $NAMESPACE"
echo "Registry: $REGISTRY"
echo "Tag: $TAG"

# Function to check if kubectl is available
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}kubectl is not installed or not in PATH${NC}"
        exit 1
    fi
}

# Function to check if helm is available
check_helm() {
    if ! command -v helm &> /dev/null; then
        echo -e "${RED}helm is not installed or not in PATH${NC}"
        exit 1
    fi
}

# Function to create namespace
create_namespace() {
    echo -e "${YELLOW}Creating namespace $NAMESPACE...${NC}"
    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
}

# Function to deploy with Docker Compose
deploy_docker_compose() {
    echo -e "${YELLOW}Deploying with Docker Compose...${NC}"
    
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose -f deploy/docker/docker-compose.prod.yml up -d
    else
        docker-compose -f deploy/docker/docker-compose.dev.yml up -d
    fi
    
    echo -e "${GREEN}Docker Compose deployment completed!${NC}"
}

# Function to deploy with Kubernetes
deploy_kubernetes() {
    echo -e "${YELLOW}Deploying with Kubernetes...${NC}"
    
    check_kubectl
    create_namespace
    
    # Apply Kubernetes manifests
    echo -e "${YELLOW}Applying Kubernetes manifests...${NC}"
    kubectl apply -f deploy/k8s/ -n $NAMESPACE
    
    # Wait for deployments to be ready
    echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"
    kubectl wait --for=condition=available --timeout=300s deployment --all -n $NAMESPACE
    
    echo -e "${GREEN}Kubernetes deployment completed!${NC}"
}

# Function to deploy with Helm
deploy_helm() {
    echo -e "${YELLOW}Deploying with Helm...${NC}"
    
    check_kubectl
    check_helm
    create_namespace
    
    # Add Helm repositories
    echo -e "${YELLOW}Adding Helm repositories...${NC}"
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    
    # Install dependencies
    echo -e "${YELLOW}Installing Helm dependencies...${NC}"
    helm dependency update deploy/helm/
    
    # Deploy with Helm
    echo -e "${YELLOW}Deploying with Helm...${NC}"
    helm upgrade --install lms deploy/helm/ \
        --namespace $NAMESPACE \
        --set global.imageRegistry=$REGISTRY \
        --set global.imageTag=$TAG \
        --set environment=$ENVIRONMENT \
        --wait
    
    echo -e "${GREEN}Helm deployment completed!${NC}"
}

# Function to deploy infrastructure with Terraform
deploy_infrastructure() {
    echo -e "${YELLOW}Deploying infrastructure with Terraform...${NC}"
    
    if ! command -v terraform &> /dev/null; then
        echo -e "${RED}terraform is not installed or not in PATH${NC}"
        exit 1
    fi
    
    cd deploy/terraform/aws/
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan -var-file="terraform.tfvars"
    
    # Apply deployment
    read -p "Do you want to apply the Terraform plan? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        terraform apply -var-file="terraform.tfvars" -auto-approve
        echo -e "${GREEN}Infrastructure deployment completed!${NC}"
    else
        echo -e "${YELLOW}Terraform deployment cancelled${NC}"
    fi
    
    cd ../../../
}

# Main deployment logic
case "$1" in
    "docker")
        deploy_docker_compose
        ;;
    "k8s")
        deploy_kubernetes
        ;;
    "helm")
        deploy_helm
        ;;
    "infra")
        deploy_infrastructure
        ;;
    "all")
        deploy_infrastructure
        deploy_helm
        ;;
    *)
        echo "Usage: $0 {docker|k8s|helm|infra|all}"
        echo ""
        echo "Options:"
        echo "  docker  - Deploy using Docker Compose"
        echo "  k8s     - Deploy using Kubernetes manifests"
        echo "  helm    - Deploy using Helm charts"
        echo "  infra   - Deploy infrastructure using Terraform"
        echo "  all     - Deploy infrastructure and application"
        echo ""
        echo "Environment variables:"
        echo "  ENVIRONMENT    - Deployment environment (default: development)"
        echo "  NAMESPACE      - Kubernetes namespace (default: lms)"
        echo "  DOCKER_REGISTRY - Docker registry (default: lms)"
        echo "  DOCKER_TAG     - Docker image tag (default: latest)"
        exit 1
        ;;
esac
