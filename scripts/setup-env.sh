#!/bin/bash

# LMS Microservices Environment Setup Script
# This script helps set up environment variables for all services

set -e

echo "🚀 Setting up LMS Microservices Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if .env file exists in root
if [ ! -f ".env" ]; then
    print_warning "No .env file found in root directory"
    print_info "Creating SINGLE .env file from template..."
    cp shared/env.example .env
    print_status "Created SINGLE .env file in root directory"
    print_warning "Please update the .env file with your actual Supabase credentials"
else
    print_info "Root .env file already exists, skipping..."
fi

print_info "All services will read Supabase credentials from the SINGLE root .env file"
print_info "This ensures a single source of truth for all Supabase configuration"

# Create web-frontend .env.local if it doesn't exist
if [ -d "web-frontend" ]; then
    frontend_env="web-frontend/.env.local"
    if [ ! -f "$frontend_env" ]; then
        print_info "Creating .env.local file for web-frontend..."
        cat > "$frontend_env" << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=\${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=\${SUPABASE_ANON_KEY}

# API Configuration
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000
EOF
        print_status "Created $frontend_env"
    else
        print_info "$frontend_env already exists, skipping..."
    fi
fi

echo ""
print_status "Environment setup completed!"
echo ""
print_warning "IMPORTANT: Please update the SINGLE .env file with your actual Supabase credentials:"
echo "  - .env (root directory) - SINGLE SOURCE OF TRUTH"
echo "  - web-frontend/.env.local (frontend only)"
echo ""
print_info "You can get your Supabase credentials from:"
print_info "  https://supabase.com/dashboard > Settings > API"
echo ""
print_info "Required environment variables in root .env:"
print_info "  - SUPABASE_URL"
print_info "  - SUPABASE_SERVICE_ROLE_KEY"
print_info "  - SUPABASE_ANON_KEY"
echo ""
print_status "All services will automatically read from the root .env file"
print_status "After updating the credentials, run: ./start-microservices.sh"
