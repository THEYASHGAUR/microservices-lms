import type { Student } from './student-api-client'
import { SecureApiClient } from '@/lib/secure-api-client'

export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructorName: string
  thumbnailUrl?: string
  price: number
  duration: number // in hours
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  status: 'draft' | 'published' | 'archived'
  enrolledStudents: number
  rating: number
  totalLessons: number
  createdAt: string
  updatedAt: string
}

export interface CourseStats {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalEnrollments: number
  averageRating: number
}

class CourseApiClient {
  private secureApiClient: SecureApiClient

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001'
    this.secureApiClient = new SecureApiClient(baseUrl)
  }

  // Fetches all courses for the current instructor
  async getInstructorCourses(): Promise<Course[]> {
    return this.secureApiClient.authenticatedRequest<Course[]>('/api/courses/instructor')
  }

  // Fetches course statistics for the instructor
  async getInstructorCourseStats(): Promise<CourseStats> {
    return this.secureApiClient.authenticatedRequest<CourseStats>('/api/courses/instructor/stats')
  }

  // Creates a new course
  async createCourse(courseData: Omit<Course, 'id' | 'instructorId' | 'instructorName' | 'enrolledStudents' | 'rating' | 'createdAt' | 'updatedAt'>): Promise<Course> {
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

  // Fetches students enrolled in a specific course
  async getCourseStudents(courseId: string): Promise<Student[]> {
    return this.secureApiClient.authenticatedRequest<Student[]>(`/api/courses/${courseId}/students`)
  }
}

export const courseApiClient = new CourseApiClient()
