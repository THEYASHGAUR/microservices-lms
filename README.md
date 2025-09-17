# LMS - Learning Management System

A full-stack Learning Management System built with microservices architecture.

## Architecture

This project follows a microservices architecture with the following services:

- **API Gateway** (Port 3000) - Routes requests to appropriate microservices
- **Auth Service** (Port 3001) - Handles authentication and authorization
- **User Service** (Port 3002) - Manages user profiles and roles
- **Video Service** (Port 3003) - Handles video processing and streaming
- **Chat & Call Service** (Port 3004) - Real-time chat and video calls
- **Payment Service** (Port 3005) - Payment processing and subscriptions
- **Notification Service** (Port 3006) - Email, SMS, and push notifications
- **Frontend** (Port 3007) - Next.js React application

## Tech Stack

### Backend Services
- Node.js with TypeScript
- Express.js
- PostgreSQL
- Redis
- Socket.io (for real-time features)
- JWT for authentication
- Docker for containerization

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Socket.io Client

### Infrastructure
- Docker & Docker Compose
- Kubernetes (for production deployment)
- PostgreSQL
- Redis

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lms
```

2. Start all services with Docker Compose:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3007
- API Gateway: http://localhost:3000
- Individual services: http://localhost:3001-3006

### Development

To run services individually for development:

1. Install dependencies for each service:
```bash
cd services/auth-service
npm install
npm run dev
```

2. Repeat for other services as needed.

## Project Structure

```
lms/
├── services/
│   ├── api-gateway/          # API Gateway service
│   ├── auth-service/         # Authentication service
│   ├── user-service/         # User management service
│   ├── video-service/        # Video processing service
│   ├── chat-call-service/    # Real-time chat & calls
│   ├── payment-service/      # Payment processing
│   └── notification-service/ # Notifications
├── frontend/                 # Next.js frontend
├── shared/                   # Shared utilities and types
├── kubernetes/              # K8s deployment files
├── docker-compose.yml       # Local development setup
└── README.md
```

## Environment Variables

Create `.env` files in each service directory with the following variables:

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

## API Documentation

Each service exposes its own API endpoints:

- Auth Service: `/api/auth/*`
- User Service: `/api/users/*`
- Video Service: `/api/videos/*`
- Chat Service: `/api/chat/*`
- Payment Service: `/api/payments/*`
- Notification Service: `/api/notifications/*`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
