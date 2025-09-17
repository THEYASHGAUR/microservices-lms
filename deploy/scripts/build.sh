#!/bin/bash

# Build script for LMS microservices
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY=${DOCKER_REGISTRY:-"lms"}
TAG=${DOCKER_TAG:-"latest"}
ENVIRONMENT=${ENVIRONMENT:-"development"}

echo -e "${GREEN}Building LMS microservices...${NC}"
echo "Registry: $REGISTRY"
echo "Tag: $TAG"
echo "Environment: $ENVIRONMENT"

# Function to build service
build_service() {
    local service=$1
    local service_path="services/$service"
    
    if [ ! -d "$service_path" ]; then
        echo -e "${RED}Service directory $service_path not found${NC}"
        return 1
    fi
    
    echo -e "${YELLOW}Building $service...${NC}"
    
    # Check if production Dockerfile exists
    if [ -f "$service_path/Dockerfile.prod" ] && [ "$ENVIRONMENT" = "production" ]; then
        docker build -f "$service_path/Dockerfile.prod" -t "$REGISTRY/$service:$TAG" "$service_path"
    else
        docker build -t "$REGISTRY/$service:$TAG" "$service_path"
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $service built successfully${NC}"
    else
        echo -e "${RED}✗ Failed to build $service${NC}"
        return 1
    fi
}

# Function to build frontend
build_frontend() {
    echo -e "${YELLOW}Building frontend...${NC}"
    
    if [ ! -d "frontend" ]; then
        echo -e "${RED}Frontend directory not found${NC}"
        return 1
    fi
    
    # Check if production Dockerfile exists
    if [ -f "frontend/Dockerfile.prod" ] && [ "$ENVIRONMENT" = "production" ]; then
        docker build -f "frontend/Dockerfile.prod" -t "$REGISTRY/frontend:$TAG" "frontend"
    else
        docker build -t "$REGISTRY/frontend:$TAG" "frontend"
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Frontend built successfully${NC}"
    else
        echo -e "${RED}✗ Failed to build frontend${NC}"
        return 1
    fi
}

# Build all services
services=("api-gateway" "auth-service" "user-service" "video-service" "chat-call-service" "payment-service" "notification-service")

for service in "${services[@]}"; do
    build_service "$service"
done

# Build frontend
build_frontend

echo -e "${GREEN}All services built successfully!${NC}"

# Optional: Push to registry
if [ "$PUSH_TO_REGISTRY" = "true" ]; then
    echo -e "${YELLOW}Pushing images to registry...${NC}"
    
    for service in "${services[@]}"; do
        echo "Pushing $REGISTRY/$service:$TAG"
        docker push "$REGISTRY/$service:$TAG"
    done
    
    echo "Pushing $REGISTRY/frontend:$TAG"
    docker push "$REGISTRY/frontend:$TAG"
    
    echo -e "${GREEN}All images pushed successfully!${NC}"
fi
