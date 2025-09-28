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

export interface CourseReview {
  id: string
  user_id: string
  course_id: string
  rating: number
  review_text?: string
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface CourseProgress {
  id: string
  user_id: string
  course_id: string
  lesson_id: string
  completed_at: string
  time_spent: number
  progress_percentage: number
}

export interface CourseWishlist {
  id: string
  user_id: string
  course_id: string
  added_at: string
}

// Request/Response DTOs
export interface CreateCourseRequest {
  title: string
  description: string
  short_description?: string
  category_id?: string
  thumbnail_url?: string
  price: number
  currency?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration: number
  language?: string
  tags?: string[]
  requirements?: string[]
  learning_outcomes?: string[]
}

export interface UpdateCourseRequest {
  title?: string
  description?: string
  short_description?: string
  category_id?: string
  thumbnail_url?: string
  price?: number
  currency?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  status?: 'draft' | 'published' | 'archived'
  estimated_duration?: number
  language?: string
  tags?: string[]
  requirements?: string[]
  learning_outcomes?: string[]
}

export interface CreateLessonRequest {
  title: string
  description?: string
  content?: string
  video_url?: string
  video_duration?: number
  video_size?: number
  thumbnail_url?: string
  order_index: number
  lesson_type?: 'video' | 'text' | 'quiz' | 'assignment'
  is_preview?: boolean
  resources?: Record<string, unknown>[]
}

export interface UpdateLessonRequest {
  title?: string
  description?: string
  content?: string
  video_url?: string
  video_duration?: number
  video_size?: number
  thumbnail_url?: string
  order_index?: number
  lesson_type?: 'video' | 'text' | 'quiz' | 'assignment'
  is_published?: boolean
  is_preview?: boolean
  resources?: Record<string, unknown>[]
}

export interface CourseStats {
  total_courses: number
  published_courses: number
  draft_courses: number
  total_enrollments: number
  total_revenue: number
  average_rating: number
  total_lessons: number
}

export interface CourseWithDetails extends Course {
  instructor_name: string
  instructor_avatar?: string
  category_name?: string
  lessons: Lesson[]
  reviews: CourseReview[]
  enrollment_count: number
  user_enrollment?: Enrollment
  user_progress?: number
}
