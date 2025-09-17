// Common constants used across all microservices

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const SERVICE_PORTS = {
  API_GATEWAY: 3000,
  AUTH_SERVICE: 3001,
  USER_SERVICE: 3002,
  VIDEO_SERVICE: 3003,
  CHAT_CALL_SERVICE: 3004,
  PAYMENT_SERVICE: 3005,
  NOTIFICATION_SERVICE: 3006
} as const;

export const SERVICE_URLS = {
  API_GATEWAY: `http://localhost:${SERVICE_PORTS.API_GATEWAY}`,
  AUTH_SERVICE: `http://localhost:${SERVICE_PORTS.AUTH_SERVICE}`,
  USER_SERVICE: `http://localhost:${SERVICE_PORTS.USER_SERVICE}`,
  VIDEO_SERVICE: `http://localhost:${SERVICE_PORTS.VIDEO_SERVICE}`,
  CHAT_CALL_SERVICE: `http://localhost:${SERVICE_PORTS.CHAT_CALL_SERVICE}`,
  PAYMENT_SERVICE: `http://localhost:${SERVICE_PORTS.PAYMENT_SERVICE}`,
  NOTIFICATION_SERVICE: `http://localhost:${SERVICE_PORTS.NOTIFICATION_SERVICE}`
} as const;

export const DATABASE_CONFIG = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT || '5432'),
  USERNAME: process.env.DB_USERNAME || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || 'password',
  DATABASE: process.env.DB_NAME || 'lms_db'
} as const;

export const REDIS_CONFIG = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: parseInt(process.env.REDIS_PORT || '6379'),
  PASSWORD: process.env.REDIS_PASSWORD || undefined
} as const;

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
} as const;

export const CORS_CONFIG = {
  ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CREDENTIALS: true
} as const;

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads'
} as const;

export const EMAIL_CONFIG = {
  FROM: process.env.EMAIL_FROM || 'noreply@lms.com',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || ''
} as const;

export const PAYMENT_CONFIG = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || ''
} as const;

export const VIDEO_CONFIG = {
  MAX_DURATION: 7200, // 2 hours in seconds
  SUPPORTED_FORMATS: ['mp4', 'webm', 'ogg'],
  THUMBNAIL_GENERATION: true,
  QUALITY_LEVELS: ['360p', '720p', '1080p']
} as const;

export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MESSAGE_RATE_LIMIT: 10, // messages per minute
  ROOM_CAPACITY: 100
} as const;

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;

export const CACHE_CONFIG = {
  TTL: {
    USER_PROFILE: 3600, // 1 hour
    COURSE_DETAILS: 1800, // 30 minutes
    LESSON_CONTENT: 900, // 15 minutes
    CHAT_MESSAGES: 300 // 5 minutes
  }
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  COURSE_NOT_FOUND: 'Course not found',
  LESSON_NOT_FOUND: 'Lesson not found',
  PAYMENT_FAILED: 'Payment failed',
  FILE_TOO_LARGE: 'File size too large',
  INVALID_FILE_TYPE: 'Invalid file type'
} as const;

export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  COURSE_CREATED: 'Course created successfully',
  COURSE_UPDATED: 'Course updated successfully',
  COURSE_DELETED: 'Course deleted successfully',
  LESSON_CREATED: 'Lesson created successfully',
  LESSON_UPDATED: 'Lesson updated successfully',
  LESSON_DELETED: 'Lesson deleted successfully',
  ENROLLMENT_SUCCESS: 'Enrolled successfully',
  PAYMENT_SUCCESS: 'Payment completed successfully',
  MESSAGE_SENT: 'Message sent successfully'
} as const;
