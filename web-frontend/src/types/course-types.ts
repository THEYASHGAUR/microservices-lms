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

export interface CreateCourseData {
  title: string
  description: string
  thumbnailUrl?: string
  price: number
  duration: number
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  status: 'draft' | 'published'
}

export interface UpdateCourseData {
  title?: string
  description?: string
  thumbnailUrl?: string
  price?: number
  duration?: number
  level?: 'beginner' | 'intermediate' | 'advanced'
  category?: string
  status?: 'draft' | 'published' | 'archived'
}
