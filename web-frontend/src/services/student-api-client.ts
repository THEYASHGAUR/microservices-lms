import { SecureApiClient } from '@/lib/secure-api-client'

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
  private secureApiClient: SecureApiClient

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:3001'
    this.secureApiClient = new SecureApiClient(baseUrl)
  }

  // Fetches all students enrolled in instructor's courses
  async getInstructorStudents(): Promise<Student[]> {
    return this.secureApiClient.authenticatedRequest<Student[]>('/api/students/instructor')
  }

  // Fetches student statistics for the instructor
  async getInstructorStudentStats(): Promise<StudentStats> {
    return this.secureApiClient.authenticatedRequest<StudentStats>('/api/students/instructor/stats')
  }

  // Fetches students for a specific course
  async getCourseStudents(courseId: string): Promise<Student[]> {
    return this.secureApiClient.authenticatedRequest<Student[]>(`/api/courses/${courseId}/students`)
  }

  // Updates student enrollment status
  async updateStudentStatus(studentId: string, courseId: string, status: Student['status']): Promise<void> {
    return this.secureApiClient.authenticatedRequest<void>(`/api/students/${studentId}/courses/${courseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // Removes student from course
  async removeStudentFromCourse(studentId: string, courseId: string): Promise<void> {
    return this.secureApiClient.authenticatedRequest<void>(`/api/students/${studentId}/courses/${courseId}`, {
      method: 'DELETE',
    })
  }
}

export const studentApiClient = new StudentApiClient()
