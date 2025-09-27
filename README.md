# Microservices Learning Management System (LMS)

A modern, scalable Learning Management System built with microservices architecture, featuring role-based access control for Students, Instructors, and Administrators.

## 🏗️ Architecture Overview

This project follows a microservices architecture with separate services for different domains:

- **API Gateway**: Routes requests to appropriate microservices
- **Auth Service**: Handles authentication and authorization
- **User Service**: Manages user profiles and data
- **Video Service**: Handles video streaming and content
- **Payment Service**: Processes payments and transactions
- **Notification Service**: Manages notifications and alerts
- **Chat/Call Service**: Real-time communication features

## 📁 Project Structure

```
microservices-lms/
├── 📁 deploy/                          # Deployment configurations
│   ├── 📁 docker/                      # Docker configurations
│   ├── 📁 helm/                        # Kubernetes Helm charts
│   ├── 📁 k8s/                         # Kubernetes manifests
│   ├── 📁 monitoring/                  # Monitoring configurations
│   ├── 📁 nginx/                       # Nginx configurations
│   ├── 📁 scripts/                     # Deployment scripts
│   └── 📁 terraform/                   # Infrastructure as Code
│
├── 📁 docs/                            # Documentation
│   ├── aim.md                          # Project objectives
│   ├── MICROSERVICES_ARCHITECTURE.md   # Architecture documentation
│   └── TEST_CREDENTIALS.md             # Test credentials
│
├── 📁 services/                        # Microservices
│   ├── 📁 api-gateway/                 # API Gateway service
│   ├── 📁 auth-service/                # Authentication service
│   ├── 📁 chat-call-service/           # Real-time communication
│   ├── 📁 database/                    # Database service
│   ├── 📁 notification-service/        # Notification service
│   ├── 📁 payment-service/             # Payment processing
│   ├── 📁 user-service/                # User management
│   └── 📁 video-service/               # Video streaming
│
├── 📁 shared/                          # Shared utilities
│   ├── 📁 constants/
│   ├── logger.ts
│   ├── 📁 middlewares/
│   └── 📁 types/
│
├── 📁 web-frontend/                    # Next.js 15 Web Application
│   └── src/
│       ├── 📁 app/                     # Next.js 15 App Router
│       │   ├── 📁 admin/               # Admin role pages
│       │   │   ├── 📁 dashboard/       # Admin dashboard
│       │   │   ├── 📁 profile/         # Admin profile
│       │   │   ├── 📁 system-settings/ # System settings
│       │   │   ├── 📁 user-management/ # User management
│       │   │   ├── layout.tsx          # Admin layout
│       │   │   └── page.tsx            # Admin redirect
│       │   │
│       │   ├── 📁 auth/                # Authentication pages
│       │   │   ├── 📁 forgot-password/
│       │   │   ├── 📁 login/
│       │   │   └── 📁 signup/
│       │   │
│       │   ├── 📁 instructor/          # Instructor role pages
│       │   │   ├── 📁 courses/         # Instructor courses
│       │   │   ├── 📁 dashboard/       # Instructor dashboard
│       │   │   ├── 📁 profile/         # Instructor profile
│       │   │   ├── 📁 students/        # Students list
│       │   │   ├── layout.tsx          # Instructor layout
│       │   │   └── page.tsx            # Instructor redirect
│       │   │
│       │   ├── 📁 student/             # Student role pages
│       │   │   ├── 📁 assignments/     # Student assignments
│       │   │   ├── 📁 chats/           # Student chats
│       │   │   ├── 📁 courses/         # Student courses
│       │   │   ├── 📁 dashboard/       # Student dashboard
│       │   │   ├── 📁 live-class/      # Live classes
│       │   │   ├── 📁 payment/         # Payment page
│       │   │   ├── 📁 profile/         # Student profile
│       │   │   ├── 📁 settings/        # Student settings
│       │   │   ├── layout.tsx          # Student layout
│       │   │   └── page.tsx            # Student redirect
│       │   │
│       │   ├── globals.css             # Global styles
│       │   ├── layout.tsx              # Root layout
│       │   ├── middleware.ts           # Route middleware
│       │   └── page.tsx                # Home page
│       │
│       ├── 📁 components/              # Reusable components
│       │   ├── 📁 auth/                # Authentication components
│       │   ├── 📁 dashboard/           # Dashboard components
│       │   ├── 📁 providers/           # Context providers
│       │   └── 📁 ui/                  # UI components
│       │
│       ├── 📁 lib/                     # Utility libraries
│       ├── 📁 services/                # API clients
│       ├── 📁 stores/                  # State management
│       └── 📁 types/                   # TypeScript types
│
├── start-microservices.sh              # Start script
├── package.json                        # Root package.json
└── README.md                           # This file
```

## 🎯 Key Features

### Role-Based Access Control
- **Students**: Course access, assignments, live classes, chats, payments
- **Instructors**: Course management, student tracking, analytics
- **Administrators**: User management, system settings, analytics

### Modern Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Supabase
- **Authentication**: JWT with refresh tokens
- **Deployment**: Docker, Kubernetes, Terraform

## 📱 Role-Specific Features

### Student Panel (`/student/`)
- **Dashboard**: Learning progress, upcoming events
- **Courses**: Enrolled courses with progress tracking
- **Chats**: Course discussions and peer communication
- **Live Classes**: Scheduled live sessions
- **Assignments**: Submit and track assignments
- **Payment**: Course payments via Razorpay
- **Settings**: Profile and preferences

### Instructor Panel (`/instructor/`)
- **Dashboard**: Teaching statistics and analytics
- **Courses**: Create and manage courses
- **Students**: Track student progress and engagement
- **Profile**: Instructor profile management

### Admin Panel (`/admin/`)
- **Dashboard**: System overview and health
- **User Management**: Manage all users and roles
- **System Settings**: Configure system parameters
- **Profile**: Admin profile management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL (or use Docker)

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd microservices-lms
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd web-frontend && npm install
   ```

3. **Start the microservices**
   ```bash
   ./start-microservices.sh
   ```

4. **Start the web frontend**
   ```bash
   cd web-frontend
   npm run dev
   ```

## 🔧 Development

### Code Standards
- **File Naming**: Descriptive names (e.g., `auth-api-client.ts`)
- **Function Comments**: Every function has a single-line comment
- **TypeScript**: Strict typing, no `any` types
- **Consistent Patterns**: Same structure across all services

## 🚀 Deployment

### Docker
```bash
docker-compose -f deploy/docker/docker-compose.prod.yml up -d
```

### Kubernetes
```bash
helm install lms deploy/helm/
```

### AWS (Terraform)
```bash
cd deploy/terraform/aws
terraform init
terraform apply
```

## 📊 Monitoring

- **Prometheus**: Metrics collection
- **Grafana**: Dashboards and visualization
- **Logs**: Centralized logging across services

## 🤝 Contributing

1. Follow the coding standards
2. Add comments to all functions
3. Use descriptive file names
4. Maintain consistent patterns
5. Test all changes

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using modern microservices architecture**