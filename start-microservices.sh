#!/bin/bash

# Microservices LMS Startup Script
# This script starts all services in the correct order following microservices architecture

echo "🚀 Starting LMS Microservices..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use. Killing existing process..."
        kill -9 $(lsof -ti:$1) 2>/dev/null || true
        sleep 2
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port/health >/dev/null 2>&1; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        
        echo "   Attempt $attempt/$max_attempts - waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name failed to start within expected time"
    return 1
}

# Check and free up ports
echo "🔍 Checking ports..."
check_port 3000  # API Gateway
check_port 3001  # Auth Service
check_port 4000  # Web Frontend

# Start Auth Service first (dependency for API Gateway)
echo "🔐 Starting Auth Service..."
cd services/auth-service
npm run dev &
AUTH_PID=$!
cd ../..

# Wait for Auth Service to be ready
wait_for_service 3001 "Auth Service"

# Start API Gateway
echo "🌐 Starting API Gateway..."
cd services/api-gateway
npm run dev &
GATEWAY_PID=$!
cd ../..

# Wait for API Gateway to be ready
wait_for_service 3000 "API Gateway"

# Start Web Frontend
echo "💻 Starting Web Frontend..."
cd web-frontend
NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-http://localhost:3000} npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "🎉 All services started successfully!"
echo ""
echo "📱 Access Points:"
echo "   Frontend:     http://localhost:4000"
echo "   API Gateway:  http://localhost:3000/api"
echo "   Auth Service: http://localhost:3001/auth"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $AUTH_PID $GATEWAY_PID $FRONTEND_PID 2>/dev/null || true
    echo "✅ All services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
