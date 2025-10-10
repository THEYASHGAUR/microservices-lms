export * from './auth-types'
export * from './course-types'
export * from './student-types'

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error types
export interface ApiError {
  message: string
  status: number
  code?: string
  field?: string
}
