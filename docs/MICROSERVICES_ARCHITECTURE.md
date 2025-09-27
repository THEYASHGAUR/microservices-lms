# 🏗️ Microservices Architecture Guide

## 📋 **CRITICAL RULES FOR THIS PROJECT**

### 🚫 **NEVER DO:**
- ❌ Direct API calls from frontend to individual services
- ❌ Frontend knowing about service ports (3001, 3002, etc.)
- ❌ Bypassing the API Gateway
- ❌ Duplicating code across services

### ✅ **ALWAYS DO:**
- ✅ All API calls go through API Gateway (port 3000)
- ✅ Frontend only knows about port 3000
- ✅ Use shared/ folder for common utilities
- ✅ Follow single responsibility principle per service

---

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Frontend  │    │   Mobile App    │    │   Admin Panel   │
│   (Port 3000)   │    │   (Future)      │    │   (Future)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │      API Gateway          │
                    │      (Port 3000)          │
                    │   Single Entry Point      │
                    └─────────────┬─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐    ┌──────────▼──────────┐    ┌────────▼────────┐
│  Auth Service  │    │   User Service      │    │  Video Service  │
│  (Port 3001)   │    │   (Port 3002)       │    │  (Port 3003)    │
└────────────────┘    └─────────────────────┘    └─────────────────┘
        │                         │                         │
┌───────▼────────┐    ┌──────────▼──────────┐    ┌────────▼────────┐
│ Payment Service│    │Notification Service │    │  Chat Service   │
│  (Port 3005)   │    │   (Port 3006)       │    │  (Port 3004)    │
└────────────────┘    └─────────────────────┘    └─────────────────┘
        │                         │                         │
        └─────────────────────────┼─────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Supabase Database    │
                    │    (External Service)     │
                    └───────────────────────────┘
```

---

## 🔄 **Request Flow**

### **Frontend → API Gateway → Service**

```
1. Frontend makes request to: http://localhost:3000/api/auth/login
2. API Gateway receives request on port 3000
3. Gateway routes to Auth Service: http://localhost:3001/auth/login
4. Auth Service processes request
5. Response flows back through Gateway to Frontend
```

### **API Gateway Routing Rules**

| Frontend Request | Gateway Route | Target Service | Service Port |
|------------------|---------------|----------------|--------------|
| `/api/auth/*`    | `/auth/*`     | Auth Service   | 3001         |
| `/api/users/*`   | `/api/*`      | User Service   | 3002         |
| `/api/videos/*`  | `/api/*`      | Video Service  | 3003         |
| `/api/chat/*`    | `/api/*`      | Chat Service   | 3004         |
| `/api/payments/*`| `/api/*`      | Payment Service| 3005         |
| `/api/notifications/*`| `/api/*` | Notification Service| 3006 |

---

## 📁 **Service Responsibilities**

### **🔐 Auth Service (Port 3001)**
- User authentication (login/signup)
- JWT token management
- Password reset
- User profile management
- Role-based access control

### **👥 User Service (Port 3002)**
- User profile management
- User preferences
- User statistics
- User search and discovery

### **🎥 Video Service (Port 3003)**
- Video upload and processing
- Video streaming
- Video metadata management
- Thumbnail generation

### **💬 Chat Service (Port 3004)**
- Real-time messaging
- Video calls
- Chat rooms
- Message history

### **💳 Payment Service (Port 3005)**
- Payment processing
- Subscription management
- Billing
- Payment history

### **🔔 Notification Service (Port 3006)**
- Email notifications
- Push notifications
- SMS notifications
- Notification preferences

---

## 🛠️ **Development Workflow**

### **Starting Services**

```bash
# Option 1: Use startup script (Recommended)
./start-microservices.sh

# Option 2: Manual startup
# Terminal 1: Auth Service
cd services/auth-service && npm run dev

# Terminal 2: API Gateway
cd services/api-gateway && npm run dev

# Terminal 3: Web Frontend
cd web-frontend && npm run dev
```

### **Adding New Services**

1. **Create service directory**: `services/new-service/`
2. **Add to constants**: Update `shared/constants/index.ts`
3. **Add to API Gateway**: Update routing in `services/api-gateway/src/index.ts`
4. **Update startup script**: Add service to `start-microservices.sh`

### **Frontend API Calls**

```typescript
// ✅ CORRECT: Use API Gateway
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});

// ❌ WRONG: Direct service call
const response = await fetch('http://localhost:3001/auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials)
});
```

---

## 🔧 **Shared Resources**

### **shared/constants/index.ts**
- Service ports and URLs
- HTTP status codes
- Error messages
- Configuration constants

### **shared/logger.ts**
- Centralized logging
- Winston configuration
- Service identification

### **shared/middlewares/**
- Authentication middleware
- Rate limiting
- Input validation

### **shared/types/index.ts**
- Common TypeScript types
- API response formats
- Event types

---

## 🚀 **Benefits of This Architecture**

### **Scalability**
- Each service can scale independently
- Load balancing at API Gateway level
- Horizontal scaling support

### **Maintainability**
- Single responsibility per service
- Shared utilities prevent duplication
- Clear separation of concerns

### **Development**
- Teams can work on services independently
- Easy to add new services
- Consistent API patterns

### **Deployment**
- Independent service deployment
- Blue-green deployments
- Service-specific rollbacks

---

## 🔍 **Debugging**

### **Service Health Checks**
```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/auth/verify

# Individual services
curl http://localhost:3002/health
curl http://localhost:3003/health
```

### **Logs**
- Each service logs to its own directory
- Centralized logging through shared/logger.ts
- API Gateway logs all requests

---

## 📚 **Best Practices**

1. **Always use API Gateway** for external requests
2. **Keep services stateless** for scalability
3. **Use shared utilities** to avoid duplication
4. **Implement proper error handling** in all services
5. **Add health checks** to all services
6. **Use consistent API patterns** across services
7. **Document service APIs** clearly
8. **Test services independently** and together

---

## 🎯 **Next Steps**

1. Implement remaining services (User, Video, Chat, Payment, Notification)
2. Add service discovery mechanism
3. Implement circuit breakers
4. Add monitoring and metrics
5. Set up CI/CD pipelines
6. Add comprehensive testing
7. Implement caching strategies
8. Add API versioning

This architecture ensures your LMS is **scalable**, **maintainable**, and **production-ready**! 🚀
