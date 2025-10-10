export interface StudentProfile {
  id: string
  userId: string
  name: string
  email: string
  avatar?: string
  bio?: string
  enrolledCourses: string[]
  completedCourses: string[]
  totalProgress: number
  createdAt: string
  updatedAt: string
}

export interface StudentDashboard {
  enrolledCourses: number
  completedCourses: number
  totalProgress: number
  recentActivity: Activity[]
  upcomingDeadlines: Deadline[]
}

export interface Activity {
  id: string
  type: 'lesson_completed' | 'course_enrolled' | 'course_completed' | 'quiz_passed'
  title: string
  description: string
  courseId?: string
  lessonId?: string
  timestamp: string
}

export interface Deadline {
  id: string
  title: string
  courseId: string
  courseTitle: string
  dueDate: string
  type: 'assignment' | 'quiz' | 'exam'
}
