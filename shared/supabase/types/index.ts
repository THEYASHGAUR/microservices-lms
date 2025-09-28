// Centralized Supabase Types for all services
// This file contains all shared TypeScript types for Supabase operations

// Base Supabase types
export interface SupabaseUser {
  id: string
  email: string
  role: 'admin' | 'instructor' | 'student'
  created_at: string
  updated_at: string
}

export interface SupabaseProfile {
  id: string
  user_id: string
  full_name?: string
  avatar_url?: string
  bio?: string
  role: 'admin' | 'instructor' | 'student'
  created_at: string
  updated_at: string
}

// Auth Service Types
export interface AuthUser extends SupabaseUser {
  name: string
  avatar_url?: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface CreateUserData {
  email: string
  name: string
  password: string
  role?: 'admin' | 'instructor' | 'student'
}

// Course Service Types
export interface Course {
  id: string
  title: string
  description: string
  short_description?: string
  instructor_id: string
  category_id?: string
  thumbnail_url?: string
  price: number
  currency: string
  level: 'beginner' | 'intermediate' | 'advanced'
  status: 'draft' | 'published' | 'archived'
  is_published: boolean
  estimated_duration: number
  language: string
  tags: string[]
  requirements: string[]
  learning_outcomes: string[]
  total_lessons: number
  total_enrollments: number
  average_rating: number
  total_ratings: number
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  description?: string
  content?: string
  video_url?: string
  video_duration: number
  video_size: number
  thumbnail_url?: string
  order_index: number
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment'
  is_published: boolean
  is_preview: boolean
  resources: Record<string, unknown>[]
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: string
  user_id: string
  course_id: string
  enrolled_at: string
  progress: number
  completed_lessons: string[]
  last_accessed_at: string
  completion_date?: string
  certificate_issued: boolean
  certificate_url?: string
  status: 'active' | 'completed' | 'dropped' | 'suspended'
}

export interface CourseCategory {
  id: string
  name: string
  description?: string
  icon_url?: string
  color: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Payment Service Types
export interface Payment {
  id: string
  user_id: string
  course_id?: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  transaction_id?: string
  stripe_payment_intent_id?: string
  created_at: string
}

// User Service Types
export interface UserProfile extends SupabaseProfile {
  courses_enrolled: number
  courses_completed: number
  total_learning_time: number
  achievements: string[]
}

// Common Response Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ServiceResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Database Table Types (for migrations)
export interface DatabaseTable {
  name: string
  columns: DatabaseColumn[]
  indexes: DatabaseIndex[]
  constraints: DatabaseConstraint[]
}

export interface DatabaseColumn {
  name: string
  type: string
  nullable: boolean
  default?: string
  primary_key?: boolean
  foreign_key?: {
    table: string
    column: string
  }
}

export interface DatabaseIndex {
  name: string
  columns: string[]
  unique: boolean
}

export interface DatabaseConstraint {
  name: string
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK'
  definition: string
}
