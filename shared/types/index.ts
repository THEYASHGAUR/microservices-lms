// Common types used across all microservices

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  thumbnail?: string;
  price: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  progress: number;
  completedLessons: string[];
}

export interface Payment {
  id: string;
  userId: string;
  courseId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface ChatMessage {
  id: string;
  userId: string;
  courseId?: string;
  content: string;
  timestamp: Date;
  type: MessageType;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file'
}

export interface VideoCall {
  id: string;
  courseId: string;
  instructorId: string;
  startTime: Date;
  endTime?: Date;
  participants: string[];
  status: CallStatus;
}

export enum CallStatus {
  SCHEDULED = 'scheduled',
  ONGOING = 'ongoing',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
}

export enum NotificationType {
  COURSE_ENROLLMENT = 'course_enrollment',
  LESSON_COMPLETED = 'lesson_completed',
  PAYMENT_SUCCESS = 'payment_success',
  COURSE_UPDATE = 'course_update',
  LIVE_CLASS = 'live_class'
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// JWT Token types
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

// Service configuration types
export interface ServiceConfig {
  port: number;
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

// Event types for inter-service communication
export interface BaseEvent {
  id: string;
  type: string;
  timestamp: Date;
  source: string;
}

export interface UserCreatedEvent extends BaseEvent {
  type: 'user.created';
  data: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export interface CourseEnrolledEvent extends BaseEvent {
  type: 'course.enrolled';
  data: {
    userId: string;
    courseId: string;
    instructorId: string;
  };
}

export interface PaymentCompletedEvent extends BaseEvent {
  type: 'payment.completed';
  data: {
    userId: string;
    courseId?: string;
    amount: number;
    transactionId: string;
  };
}
