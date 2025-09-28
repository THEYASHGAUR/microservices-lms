import type { Student } from './student-api-client'
import { SecureApiClient } from '@/lib/secure-api-client'

export interface Course {
  id: string
  title: string
  description: string
  short_description?: string
  instructor_id: string
  instructor_name?: string
  instructor_avatar?: string
  category_id?: string
  category_name?: string
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

export interface CourseStats {
  total_courses: number
  published_courses: number
  draft_courses: number
  total_enrollments: number
  total_revenue: number
  average_rating: number
  total_lessons: number
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

class CourseApiClient {
  private secureApiClient: SecureApiClient

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3000'
    this.secureApiClient = new SecureApiClient(baseUrl)
  }

  // Fetches all published courses with filters
  async getCourses(filters?: {
    category?: string
    level?: string
    search?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{ courses: Course[], total: number }> {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString())
      })
    }
    
    const url = `/api/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.secureApiClient.authenticatedRequest<{ courses: Course[], total: number }>(url)
  }

  // Fetches all courses for the current instructor
  async getInstructorCourses(): Promise<Course[]> {
    return this.secureApiClient.authenticatedRequest<Course[]>('/api/courses/instructor/courses')
  }

  // Fetches course statistics for the instructor
  async getInstructorCourseStats(): Promise<CourseStats> {
    return this.secureApiClient.authenticatedRequest<CourseStats>('/api/courses/instructor/stats')
  }

  // Fetches a single course by ID
  async getCourseById(courseId: string): Promise<Course> {
    return this.secureApiClient.authenticatedRequest<Course>(`/api/courses/${courseId}`)
  }

  // Creates a new course
  async createCourse(courseData: {
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
  }): Promise<Course> {
    return this.secureApiClient.authenticatedRequest<Course>('/api/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    })
  }

  // Updates an existing course
  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    return this.secureApiClient.authenticatedRequest<Course>(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    })
  }

  // Deletes a course
  async deleteCourse(courseId: string): Promise<void> {
    return this.secureApiClient.authenticatedRequest<void>(`/api/courses/${courseId}`, {
      method: 'DELETE',
    })
  }

  // Publishes/unpublishes a course
  async toggleCoursePublish(courseId: string, publish: boolean): Promise<Course> {
    return this.secureApiClient.authenticatedRequest<Course>(`/api/courses/${courseId}/publish`, {
      method: 'PUT',
      body: JSON.stringify({ publish }),
    })
  }

  // Fetches course categories
  async getCourseCategories(): Promise<CourseCategory[]> {
    return this.secureApiClient.authenticatedRequest<CourseCategory[]>('/api/courses/categories')
  }

  // Enrolls user in a course
  async enrollInCourse(courseId: string): Promise<Enrollment> {
    return this.secureApiClient.authenticatedRequest<Enrollment>(`/api/courses/${courseId}/enroll`, {
      method: 'POST',
    })
  }

  // Unenrolls user from a course
  async unenrollFromCourse(courseId: string): Promise<void> {
    return this.secureApiClient.authenticatedRequest<void>(`/api/courses/${courseId}/enroll`, {
      method: 'DELETE',
    })
  }

  // Fetches user's enrolled courses
  async getUserEnrolledCourses(): Promise<Course[]> {
    return this.secureApiClient.authenticatedRequest<Course[]>('/api/courses/user/enrolled')
  }

  // Adds course to wishlist
  async addToWishlist(courseId: string): Promise<void> {
    return this.secureApiClient.authenticatedRequest<void>(`/api/courses/${courseId}/wishlist`, {
      method: 'POST',
    })
  }

  // Removes course from wishlist
  async removeFromWishlist(courseId: string): Promise<void> {
    return this.secureApiClient.authenticatedRequest<void>(`/api/courses/${courseId}/wishlist`, {
      method: 'DELETE',
    })
  }

  // Fetches user's wishlist
  async getUserWishlist(): Promise<Course[]> {
    return this.secureApiClient.authenticatedRequest<Course[]>('/api/courses/user/wishlist')
  }

  // Fetches course lessons
  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    return this.secureApiClient.authenticatedRequest<Lesson[]>(`/api/courses/${courseId}/lessons`)
  }

  // Fetches a single lesson
  async getLessonById(lessonId: string): Promise<Lesson> {
    return this.secureApiClient.authenticatedRequest<Lesson>(`/api/courses/lessons/${lessonId}`)
  }

  // Creates a new lesson
  async createLesson(courseId: string, lessonData: {
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
  }): Promise<Lesson> {
    return this.secureApiClient.authenticatedRequest<Lesson>(`/api/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(lessonData),
    })
  }

  // Updates an existing lesson
  async updateLesson(lessonId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
    return this.secureApiClient.authenticatedRequest<Lesson>(`/api/courses/lessons/${lessonId}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    })
  }

  // Deletes a lesson
  async deleteLesson(lessonId: string): Promise<void> {
    return this.secureApiClient.authenticatedRequest<void>(`/api/courses/lessons/${lessonId}`, {
      method: 'DELETE',
    })
  }

  // Updates lesson progress
  async updateLessonProgress(courseId: string, lessonId: string, progress: number): Promise<void> {
    return this.secureApiClient.authenticatedRequest<void>(`/api/courses/${courseId}/lessons/${lessonId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress }),
    })
  }

  // Fetches students enrolled in a specific course
  async getCourseStudents(courseId: string): Promise<Student[]> {
    return this.secureApiClient.authenticatedRequest<Student[]>(`/api/courses/${courseId}/students`)
  }
}

export const courseApiClient = new CourseApiClient()
