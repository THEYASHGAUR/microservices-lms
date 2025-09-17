# LMS - Learning Management System

A production-ready, full-stack Learning Management System built with microservices architecture, designed for scalability and easy deployment on cloud platforms like AWS and GCP.

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
cd lms
```

2. **Start with Docker Compose:**
```bash
cd deploy/docker
docker-compose -f docker-compose.dev.yml up -d
```

3. **Access the application:**
- Frontend: http://localhost:3007
- API Gateway: http://localhost:3000
- Individual services: http://localhost:3001-3006

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

## 🆘 Support

- **Documentation**: Check the `docs/` directory
- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🚀 Deployment Status

[![Deploy to AWS](https://img.shields.io/badge/Deploy%20to-AWS-orange)](./deploy/terraform/aws/)
[![Deploy to GCP](https://img.shields.io/badge/Deploy%20to-GCP-blue)](./deploy/terraform/gcp/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./deploy/docker/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-green)](./deploy/k8s/)
[![Helm](https://img.shields.io/badge/Helm-Ready-purple)](./deploy/helm/)
