import { authService } from './auth-api-client'

export interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledAt: string
  progress: number // percentage
  lastAccessedAt: string
  status: 'active' | 'inactive' | 'completed'
  courseId: string
  courseTitle: string
}

export interface StudentStats {
  totalStudents: number
  activeStudents: number
  completedStudents: number
  averageProgress: number
}

class StudentApiClient {
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

  // Fetches all students enrolled in instructor's courses
  async getInstructorStudents(): Promise<Student[]> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/students/instructor`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch instructor students')
    }

    return response.json()
  }

  // Fetches student statistics for the instructor
  async getInstructorStudentStats(): Promise<StudentStats> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/students/instructor/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch student statistics')
    }

    return response.json()
  }

  // Fetches students for a specific course
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

  // Updates student enrollment status
  async updateStudentStatus(studentId: string, courseId: string, status: Student['status']): Promise<void> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/students/${studentId}/courses/${courseId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error('Failed to update student status')
    }
  }

  // Removes student from course
  async removeStudentFromCourse(studentId: string, courseId: string): Promise<void> {
    const token = this.getToken()
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${this.baseUrl}/api/students/${studentId}/courses/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to remove student from course')
    }
  }
}

export const studentApiClient = new StudentApiClient()
