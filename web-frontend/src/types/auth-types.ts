export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'student' | 'instructor'
}

export interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'instructor' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface AuthError {
  message: string
  field?: string
}
