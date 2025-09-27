export interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  enrolledAt: string
  progress: number // percentage
  lastAccessedAt: string
  status: 'active' | 'inactive' | 'completed' | 'suspended'
  courseId: string
  courseTitle: string
  enrolledCourses: string[]
  joinedAt: string
}

export interface StudentStats {
  totalStudents: number
  activeStudents: number
  inactiveStudents: number
  completedStudents: number
  averageProgress: number
  newStudentsThisMonth: number
}

export interface StudentEnrollment {
  studentId: string
  courseId: string
  enrolledAt: string
  progress: number
  status: 'active' | 'inactive' | 'completed'
}
