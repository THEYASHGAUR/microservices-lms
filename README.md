# LMS - Learning Management System

A production-ready, full-stack Learning Management System built with microservices architecture, designed for scalability and easy deployment on cloud platforms like AWS and GCP.

## 🆕 Recent Updates & Fixes

### ✅ Authentication System Overhaul (Latest)
- **Fixed Supabase Integration**: Resolved URL configuration issues and database schema conflicts
- **Updated Database Schema**: Migrated from custom users table to Supabase Auth integration
- **Enhanced Error Handling**: Added comprehensive debugging and better error messages
- **Environment Configuration**: Fixed environment variable setup for both frontend and backend services

### 🔧 Key Fixes Applied
1. **Database Schema Migration**: Created `004_fix_auth_setup.sql` to resolve conflicts between custom users table and Supabase auth.users
2. **Environment Variables**: Fixed Supabase URL configuration and API key setup
3. **TypeScript Errors**: Resolved type compatibility issues in auth service
4. **Frontend Integration**: Updated auth service to work seamlessly with Supabase Auth

### 📋 Migration Status
- ✅ Database schema updated and tested
- ✅ Environment variables configured
- ✅ Frontend-backend integration working
- ✅ Error handling improved

### 🎯 Current Project Status
- ✅ **Frontend**: Next.js application with authentication UI
- ✅ **Authentication**: Supabase Auth integration working
- ✅ **Database**: PostgreSQL with proper schema and triggers
- ✅ **Environment**: Configuration files set up correctly
- 🔄 **Backend Services**: Individual microservices ready for development
- 🔄 **API Gateway**: Ready for integration with other services
- 🔄 **Deployment**: Docker and Kubernetes configurations available

### 🚀 What's Working Now
1. **User Registration**: Signup form with Supabase integration
2. **User Login**: Authentication flow with session management
3. **Database Operations**: Profile creation and user management
4. **Frontend UI**: Complete authentication interface
5. **Error Handling**: Comprehensive error messages and debugging

## 🏗️ Architecture

This project follows a microservices architecture with the following services:

- **API Gateway** (Port 3000) - Routes requests to appropriate microservices
- **Auth Service** (Port 3001) - Handles authentication and authorization
- **User Service** (Port 3002) - Manages user profiles and roles
- **Video Service** (Port 3003) - Handles video processing and streaming
- **Chat & Call Service** (Port 3004) - Real-time chat and video calls
- **Payment Service** (Port 3005) - Payment processing and subscriptions
- **Notification Service** (Port 3006) - Email, SMS, and push notifications
- **Frontend** (Port 3007) - Next.js React application
- **Database Service** - PostgreSQL with initialization scripts

## 🛠️ Tech Stack

### Backend Services
- **Node.js** with TypeScript
- **Express.js** for REST APIs
- **PostgreSQL** for data persistence
- **Redis** for caching and sessions
- **Socket.io** for real-time features
- **JWT** for authentication
- **Docker** for containerization

### Frontend
- **Next.js 14** with React 18
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Socket.io Client** for real-time communication

### Infrastructure & DevOps
- **Docker & Docker Compose** for containerization
- **Kubernetes** for orchestration
- **Helm** for package management
- **Terraform** for Infrastructure as Code
- **AWS/GCP** cloud platforms
- **Nginx** for load balancing and SSL
- **Prometheus & Grafana** for monitoring

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Docker & Docker Compose**
- **Git**
- **kubectl** (for Kubernetes deployment)
- **Helm** (for Helm deployment)
- **Terraform** (for infrastructure deployment)

### 🏃‍♂️ Development Environment

1. **Clone the repository:**
```bash
git clone <repository-url>
cd microservices-lms
```

2. **Set up Supabase (Required for Authentication):**
   - Create a Supabase project at https://supabase.com
   - Get your project URL and API keys
   - Apply the database migration (see Database Setup section below)

3. **Configure Environment Variables:**
```bash
# Frontend environment
cd web-frontend
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Auth service environment  
cd ../services/auth-service
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Start All Services (Microservices Architecture):**
```bash
# Option 1: Use the startup script (Recommended)
./start-microservices.sh

# Option 2: Start manually in separate terminals
# Terminal 1: Auth Service
cd services/auth-service && npm run dev

# Terminal 2: API Gateway  
cd services/api-gateway && npm run dev

# Terminal 3: Web Frontend
cd web-frontend && npm run dev
```

5. **Or start with Docker Compose (Full Stack):**
```bash
cd deploy/docker
docker-compose -f docker-compose.dev.yml up -d
```

6. **Access the application:**
- **Frontend**: http://localhost:3000 (Next.js dev server)
- **API Gateway**: http://localhost:3000/api (Single entry point)
- **Individual services**: http://localhost:3001-3006 (Direct access for debugging)

### 🏭 Production Deployment

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

### 🔧 Development

To run services individually for development:

1. **Install all dependencies:**
```bash
npm run install:all
```

2. **Start all services:**
```bash
npm run dev
```

3. **Or start individual services:**
```bash
npm run dev:auth    # Auth service only
npm run dev:user    # User service only
# ... etc
```

## 📁 Project Structure

```
lms/
├── services/                 # Microservices
│   ├── api-gateway/          # API Gateway service
│   ├── auth-service/         # Authentication service
│   ├── user-service/         # User management service
│   ├── video-service/        # Video processing service
│   ├── chat-call-service/    # Real-time chat & calls
│   ├── payment-service/      # Payment processing
│   ├── notification-service/ # Notifications
│   └── database/             # Database service & init scripts
├── frontend/                 # Next.js frontend
├── shared/                   # Shared utilities and types
│   ├── types/                # TypeScript type definitions
│   ├── constants/            # Application constants
│   ├── middlewares/          # Shared middleware
│   └── logger.ts             # Centralized logging
├── deploy/                   # Deployment configurations
│   ├── docker/               # Docker Compose files
│   ├── k8s/                  # Kubernetes manifests
│   ├── helm/                 # Helm charts
│   ├── terraform/            # Infrastructure as Code
│   ├── monitoring/           # Monitoring configurations
│   ├── nginx/                # Nginx configurations
│   └── scripts/              # Deployment scripts
├── docs/                     # Documentation
├── tests/                    # Test files
├── scripts/                  # Utility scripts
└── README.md
```

## 🔧 Build & Deploy Scripts

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

### Monitoring Setup
```bash
# Deploy all monitoring components
./deploy/scripts/monitoring.sh all

# Access monitoring
kubectl port-forward -n monitoring svc/prometheus 9090:9090
kubectl port-forward -n monitoring svc/grafana 3000:3000
```

### Backup & Restore
```bash
# Create backup
./deploy/scripts/backup.sh backup

# Restore from backup
./deploy/scripts/backup.sh restore 20240101_120000
```

## 🌍 Environment Variables

### Supabase Configuration (Required)
```env
# Frontend (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Auth Service (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Development
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=lms_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key
```

### Production
```env
NODE_ENV=production
DB_HOST=your-rds-endpoint
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password
DB_NAME=lms_db
REDIS_HOST=your-redis-endpoint
REDIS_PORT=6379
JWT_SECRET=your-production-jwt-secret
AWS_S3_BUCKET=your-s3-bucket
STRIPE_SECRET_KEY=your-stripe-key
```

## 🗄️ Database Setup

### Supabase Database Migration
1. **Go to your Supabase SQL Editor**: https://supabase.com/dashboard/project/[your-project]/sql
2. **Apply the migration**: Copy and run the SQL from `services/auth-service/migrations/004_fix_auth_setup.sql`
3. **Verify the setup**: Check that the `profiles` table is created with proper triggers

### Migration Files
- `001_create_profiles_table.sql` - Initial schema (legacy)
- `002_create_user_sessions_table.sql` - Session management
- `003_create_password_reset_tokens_table.sql` - Password reset functionality
- `004_fix_auth_setup.sql` - **Latest migration** - Fixes Supabase integration

## 📚 API Documentation

Each service exposes its own API endpoints:

- **Auth Service**: `/api/auth/*` - Authentication & authorization
- **User Service**: `/api/users/*` - User management
- **Video Service**: `/api/videos/*` - Video processing & streaming
- **Chat Service**: `/api/chat/*` - Real-time messaging
- **Payment Service**: `/api/payments/*` - Payment processing
- **Notification Service**: `/api/notifications/*` - Notifications

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Rate Limiting** on all endpoints
- **Input Validation** with express-validator
- **CORS** configuration
- **Helmet** security headers
- **SSL/TLS** encryption
- **Database encryption** at rest
- **Redis authentication**

## 📈 Scalability Features

- **Horizontal Pod Autoscaling** (HPA)
- **Load Balancing** with Nginx/ALB
- **Database read replicas** support
- **Redis clustering**
- **CDN integration** for static assets
- **Microservices** independent scaling
- **Container orchestration** with Kubernetes

## 🏗️ Infrastructure

### AWS Infrastructure (Terraform)
- **EKS Cluster** with managed node groups
- **RDS PostgreSQL** with backup and encryption
- **ElastiCache Redis** with clustering
- **S3 Bucket** for file storage
- **Application Load Balancer** with SSL
- **VPC** with public/private subnets
- **CloudWatch** for logging and monitoring

### Monitoring & Observability
- **Prometheus** for metrics collection
- **Grafana** for visualization
- **Node Exporter** for system metrics
- **Health checks** for all services
- **Centralized logging** with Winston

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Authentication Issues
**Problem**: "Failed to fetch" or "Signup failed" errors
**Solution**: 
- Verify Supabase URL and API keys in environment files
- Ensure database migration `004_fix_auth_setup.sql` is applied
- Check browser console for detailed error messages

#### 2. Environment Variable Issues
**Problem**: "Environment variable not found" errors
**Solution**:
```bash
# Check if .env.local exists in web-frontend
ls web-frontend/.env.local

# Check if .env exists in auth-service
ls services/auth-service/.env

# Verify environment variables are loaded
cd web-frontend && npm run dev
# Look for console logs showing Supabase configuration
```

#### 3. Database Connection Issues
**Problem**: "Database error" or "Column does not exist" errors
**Solution**:
- Apply the latest migration: `004_fix_auth_setup.sql`
- Check Supabase project status and connectivity
- Verify Row Level Security policies are set up correctly

#### 4. TypeScript Errors
**Problem**: Type compatibility issues in auth service
**Solution**:
- Ensure all dependencies are installed: `npm install`
- Check TypeScript configuration in `tsconfig.json`
- Verify type definitions in `shared/types/`

#### 5. Development Server Issues
**Problem**: Server won't start or crashes
**Solution**:
```bash
# Clear Next.js cache
rm -rf web-frontend/.next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Restart development server
npm run dev
```

### Debug Mode
Enable detailed logging by checking browser console for:
- 🔍 Supabase configuration logs
- Signup attempt details
- Error stack traces
- Network request responses

### Getting Help
1. **Check the console logs** for detailed error messages
2. **Verify environment setup** using the configuration guide above
3. **Apply database migrations** if you see schema-related errors
4. **Open an issue** with console logs and error details

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Open an issue on GitHub with console logs
- **Discussions**: Use GitHub Discussions for questions
- **Recent Fixes**: Check the "Recent Updates & Fixes" section above

## 🚀 Deployment Status

[![Deploy to AWS](https://img.shields.io/badge/Deploy%20to-AWS-orange)](./deploy/terraform/aws/)
[![Deploy to GCP](https://img.shields.io/badge/Deploy%20to-GCP-blue)](./deploy/terraform/gcp/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./deploy/docker/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-green)](./deploy/k8s/)
[![Helm](https://img.shields.io/badge/Helm-Ready-purple)](./deploy/helm/)
