import { authService } from './auth-api-client'
import type { Student } from './student-api-client'

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
  private baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001'

  // Gets authentication token from localStorage or cookies
  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    
    // Try localStorage first
    const token = localStorage.getItem('auth-token')
    if (token) return token
    
    // Try cookies as fallback
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
    if (authCookie) {
      return authCookie.split('=')[1]
    }
    
    return null
  }

  // Fetches all courses for the current instructor
  async getInstructorCourses(): Promise<Course[]> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/courses/instructor`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch instructor courses')
    }

    return response.json()
  }

  // Fetches course statistics for the instructor
  async getInstructorCourseStats(): Promise<CourseStats> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/courses/instructor/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch course statistics')
    }

    return response.json()
  }

  // Creates a new course
  async createCourse(courseData: Omit<Course, 'id' | 'instructorId' | 'instructorName' | 'enrolledStudents' | 'rating' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/courses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    })

    if (!response.ok) {
      throw new Error('Failed to create course')
    }

    return response.json()
  }

  // Updates an existing course
  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    })

    if (!response.ok) {
      throw new Error('Failed to update course')
    }

    return response.json()
  }

  // Deletes a course
  async deleteCourse(courseId: string): Promise<void> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete course')
    }
  }

  // Fetches students enrolled in a specific course
  async getCourseStudents(courseId: string): Promise<Student[]> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/courses/${courseId}/students`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch course students')
    }

    return response.json()
  }
}

export const courseApiClient = new CourseApiClient()
