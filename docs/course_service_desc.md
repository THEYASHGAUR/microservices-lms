# 📚 Course Service Documentation

## 🎯 Overview

The Course Service is a comprehensive microservice responsible for managing all aspects of course creation, enrollment, progress tracking, and content delivery within the Learning Management System (LMS). It serves as the central hub for educational content management, providing RESTful APIs for course operations, lesson management, and student progress tracking.

## 🏗️ Architecture & Design Principles

### Core Principles
- **Single Responsibility**: Focused solely on course and lesson management
- **Scalability**: Designed to handle thousands of concurrent users and courses
- **Maintainability**: Clean separation of concerns with modular architecture
- **Security**: Role-based access control and data protection
- **Performance**: Optimized database queries and caching strategies

### Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Course Service                           │
├─────────────────────────────────────────────────────────────┤
│  Controllers Layer                                         │
│  ├── CourseController                                      │
│  ├── LessonController                                      │
│  └── ProgressController                                    │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                            │
│  ├── CourseService                                        │
│  ├── LessonService                                        │
│  ├── EnrollmentService                                     │
│  └── AnalyticsService                                      │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer                                         │
│  ├── CourseRepository                                      │
│  ├── LessonRepository                                      │
│  └── ProgressRepository                                    │
├─────────────────────────────────────────────────────────────┤
│  Database Layer (Supabase PostgreSQL)                     │
│  ├── courses table                                         │
│  ├── lessons table                                         │
│  ├── enrollments table                                     │
│  ├── course_progress table                                 │
│  └── course_categories table                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Database Schema Design

### Core Tables

#### 1. **courses** - Main course information
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    instructor_id UUID NOT NULL REFERENCES auth.users(id),
    category_id UUID REFERENCES course_categories(id),
    thumbnail_url TEXT,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    level VARCHAR(20) DEFAULT 'beginner',
    status VARCHAR(20) DEFAULT 'draft',
    is_published BOOLEAN DEFAULT false,
    estimated_duration INTEGER DEFAULT 0,
    language VARCHAR(10) DEFAULT 'en',
    tags TEXT[] DEFAULT '{}',
    requirements TEXT[] DEFAULT '{}',
    learning_outcomes TEXT[] DEFAULT '{}',
    total_lessons INTEGER DEFAULT 0,
    total_enrollments INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **lessons** - Course content structure
```sql
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    video_duration INTEGER DEFAULT 0,
    video_size BIGINT DEFAULT 0,
    thumbnail_url TEXT,
    order_index INTEGER NOT NULL,
    lesson_type VARCHAR(20) DEFAULT 'video',
    is_published BOOLEAN DEFAULT false,
    is_preview BOOLEAN DEFAULT false,
    resources JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. **enrollments** - Student course enrollment tracking
```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    progress DECIMAL(5,2) DEFAULT 0.00,
    completed_lessons UUID[] DEFAULT '{}',
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP WITH TIME ZONE,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    UNIQUE(user_id, course_id)
);
```

#### 4. **course_progress** - Detailed lesson progress tracking
```sql
CREATE TABLE course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    lesson_id UUID NOT NULL REFERENCES lessons(id),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    time_spent INTEGER DEFAULT 0,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    UNIQUE(user_id, lesson_id)
);
```

#### 5. **course_categories** - Course categorization
```sql
CREATE TABLE course_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Database Relationships

```
courses (1) ──→ (many) lessons
courses (1) ──→ (many) enrollments
courses (1) ──→ (1) course_categories
users (1) ──→ (many) enrollments
users (1) ──→ (many) course_progress
lessons (1) ──→ (many) course_progress
```

## 🚀 API Endpoints & Functionality

### Public Endpoints (No Authentication Required)
- `GET /api/courses` - List published courses with filters
- `GET /api/courses/:courseId` - Get course details
- `GET /api/courses/:courseId/lessons` - Get course lessons
- `GET /api/courses/categories` - Get course categories

### Student Endpoints (Student Role Required)
- `POST /api/courses/:courseId/enroll` - Enroll in course
- `DELETE /api/courses/:courseId/enroll` - Unenroll from course
- `GET /api/courses/user/enrolled` - Get enrolled courses
- `POST /api/courses/:courseId/wishlist` - Add to wishlist
- `DELETE /api/courses/:courseId/wishlist` - Remove from wishlist
- `GET /api/courses/user/wishlist` - Get wishlist
- `PUT /api/courses/:courseId/lessons/:lessonId/progress` - Update lesson progress

### Instructor Endpoints (Instructor/Admin Role Required)
- `GET /api/courses/instructor/courses` - Get instructor's courses
- `GET /api/courses/instructor/stats` - Get instructor statistics
- `POST /api/courses` - Create new course
- `PUT /api/courses/:courseId` - Update course
- `DELETE /api/courses/:courseId` - Delete course
- `PUT /api/courses/:courseId/publish` - Publish/unpublish course
- `POST /api/courses/:courseId/lessons` - Create lesson
- `PUT /api/courses/lessons/:lessonId` - Update lesson
- `DELETE /api/courses/lessons/:lessonId` - Delete lesson
- `PUT /api/courses/:courseId/lessons/reorder` - Reorder lessons

## 📁 Service Folder Structure

```
services/course-service/
├── Dockerfile                          # Container configuration
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript configuration
├── src/
│   ├── index.ts                        # Service entry point
│   ├── config/
│   │   └── supabase.ts                 # Database configuration
│   ├── controllers/
│   │   └── course.controller.ts        # Request handlers
│   ├── middleware/
│   │   └── auth.middleware.ts          # Authentication middleware
│   ├── models/
│   │   └── course.model.ts             # TypeScript interfaces
│   ├── routes/
│   │   └── course.routes.ts           # API route definitions
│   ├── services/
│   │   ├── course.service.ts           # Business logic
│   │   └── lesson.service.ts           # Lesson management logic
│   └── utils/
│       └── validation.ts               # Input validation utilities
└── logs/                               # Service logs directory
```

## 🔄 Data Flow Architecture

### Course Creation Flow
```
Instructor → Frontend → API Gateway → Course Service → Database
     ↓
Course Created → Response → Frontend → Success Notification
```

### Student Enrollment Flow
```
Student → Frontend → API Gateway → Course Service → Database
     ↓
Enrollment Created → Progress Tracking Initialized → Response
```

### Progress Tracking Flow
```
Student Activity → Frontend → API Gateway → Course Service → Database
     ↓
Progress Updated → Analytics Calculated → Response → Frontend Update
```

## 🎯 Key Features & Functionalities

### 1. **Course Management**
- **Create/Edit/Delete Courses**: Full CRUD operations for course content
- **Course Publishing**: Draft/Published status management
- **Course Categories**: Organized content categorization
- **Rich Metadata**: Tags, requirements, learning outcomes
- **Multi-language Support**: Internationalization ready

### 2. **Lesson Management**
- **Structured Content**: Organized lesson hierarchy
- **Multiple Content Types**: Video, text, quiz, assignment support
- **Preview Lessons**: Free content for course marketing
- **Resource Management**: Additional materials and downloads
- **Lesson Ordering**: Drag-and-drop reordering capability

### 3. **Student Enrollment & Progress**
- **Easy Enrollment**: One-click course enrollment
- **Progress Tracking**: Detailed lesson completion tracking
- **Certificate Generation**: Automatic certificate issuance
- **Wishlist Management**: Save courses for later enrollment
- **Learning Analytics**: Comprehensive progress insights

### 4. **Instructor Tools**
- **Course Analytics**: Revenue, enrollment, and performance metrics
- **Student Management**: View enrolled students and their progress
- **Content Management**: Easy course and lesson editing
- **Bulk Operations**: Efficient content management tools

### 5. **Admin Capabilities**
- **System Overview**: Platform-wide statistics and health
- **User Management**: Student and instructor administration
- **Content Moderation**: Course approval and quality control
- **Analytics Dashboard**: Comprehensive platform insights

## 🔒 Security & Access Control

### Role-Based Access Control (RBAC)
- **Students**: Can enroll, view content, track progress
- **Instructors**: Can create/manage their courses and view their students
- **Admins**: Full system access and management capabilities

### Data Protection
- **Row Level Security (RLS)**: Database-level access control
- **Input Validation**: Comprehensive data validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📈 Performance Optimization

### Database Optimization
- **Indexed Queries**: Optimized database indexes
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Efficient data retrieval
- **Caching Strategy**: Redis integration for frequently accessed data

### API Performance
- **Pagination**: Efficient large dataset handling
- **Filtering**: Advanced search and filter capabilities
- **Rate Limiting**: API abuse prevention
- **Response Compression**: Optimized data transfer

## 🧪 Testing Strategy

### Unit Testing
- Service layer business logic testing
- Controller endpoint testing
- Database operation testing

### Integration Testing
- API endpoint integration tests
- Database integration tests
- Service communication tests

### Performance Testing
- Load testing for concurrent users
- Database performance testing
- API response time optimization

## 🚀 Deployment & Scaling

### Container Deployment
- **Docker**: Containerized service deployment
- **Kubernetes**: Orchestrated scaling and management
- **Health Checks**: Service monitoring and recovery

### Horizontal Scaling
- **Load Balancing**: Distributed request handling
- **Database Scaling**: Read replicas and connection pooling
- **Caching Layer**: Redis for performance optimization

## 📊 Monitoring & Analytics

### Service Monitoring
- **Health Endpoints**: Service status monitoring
- **Performance Metrics**: Response time and throughput
- **Error Tracking**: Comprehensive error logging
- **Usage Analytics**: API usage patterns

### Business Analytics
- **Course Performance**: Enrollment and completion rates
- **Student Engagement**: Learning progress analytics
- **Revenue Tracking**: Financial performance metrics
- **Content Analytics**: Popular courses and lessons

## 🔧 Development Best Practices

### Code Quality
- **TypeScript**: Strong typing for better code quality
- **ESLint**: Code style and quality enforcement
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit quality checks

### API Design
- **RESTful Principles**: Consistent API design patterns
- **Error Handling**: Comprehensive error responses
- **Documentation**: OpenAPI/Swagger documentation
- **Versioning**: API version management

### Database Design
- **Normalization**: Efficient data structure
- **Constraints**: Data integrity enforcement
- **Migrations**: Version-controlled schema changes
- **Backup Strategy**: Data protection and recovery

## 🎯 Future Enhancements

### Planned Features
- **AI-Powered Recommendations**: Personalized course suggestions
- **Advanced Analytics**: Machine learning insights
- **Mobile API**: Enhanced mobile app support
- **Real-time Notifications**: WebSocket integration
- **Content Delivery Network**: Global content distribution

### Scalability Improvements
- **Microservice Decomposition**: Further service separation
- **Event-Driven Architecture**: Asynchronous processing
- **Caching Optimization**: Advanced caching strategies
- **Database Sharding**: Horizontal database scaling

## 📚 Integration Points

### External Services
- **Payment Service**: Course purchase integration
- **Notification Service**: User communication
- **Video Service**: Content delivery
- **Analytics Service**: Data insights

### Internal Services
- **Auth Service**: User authentication and authorization
- **User Service**: User profile management
- **API Gateway**: Request routing and load balancing

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- TypeScript 4.9+
- Supabase account
- Docker (optional)

### Installation
```bash
cd services/course-service
npm install
npm run dev
```

### Environment Variables
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3002
NODE_ENV=development
```

## 📖 API Documentation

### Request/Response Examples

#### Create Course
```typescript
POST /api/courses
{
  "title": "React Fundamentals",
  "description": "Learn React from scratch",
  "price": 99.99,
  "level": "beginner",
  "estimated_duration": 20,
  "tags": ["react", "javascript", "frontend"]
}
```

#### Get Courses with Filters
```typescript
GET /api/courses?category=programming&level=beginner&page=1&limit=10
```

#### Update Lesson Progress
```typescript
PUT /api/courses/:courseId/lessons/:lessonId/progress
{
  "progress": 100
}
```

## 🎉 Conclusion

The Course Service is a robust, scalable, and feature-rich microservice designed to handle all aspects of course management in a modern Learning Management System. With its comprehensive API, secure architecture, and performance optimizations, it provides a solid foundation for educational content delivery and student engagement.

The service follows industry best practices for microservice architecture, ensuring maintainability, scalability, and security. Its modular design allows for easy extension and integration with other system components, making it a cornerstone of the LMS platform.

---

*This documentation is maintained by the development team and should be updated as the service evolves.*
