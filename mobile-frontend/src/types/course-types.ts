export interface Course {
  id: string
  title: string
  description: string
  instructorId: string
  instructorName: string
  thumbnailUrl?: string
  price: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
  lessons?: Lesson[]
  enrolledStudents?: number
  rating?: number
  category?: string
}

export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  videoUrl?: string
  duration?: number
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface Enrollment {
  id: string
  studentId: string
  courseId: string
  enrolledAt: string
  progress: number
  completedLessons: string[]
}

export interface CourseProgress {
  courseId: string
  totalLessons: number
  completedLessons: number
  progressPercentage: number
  lastAccessedAt: string
}
