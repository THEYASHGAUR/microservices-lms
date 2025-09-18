import axios from 'axios'
import type { LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token') || 
    document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1]
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = localStorage.getItem('refresh-token')
      
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', { refreshToken })
          const { token, refreshToken: newRefreshToken } = response.data.data
          
          localStorage.setItem('auth-token', token)
          localStorage.setItem('refresh-token', newRefreshToken)
          document.cookie = `auth-token=${token}; path=/; max-age=${15 * 60}` // 15 minutes
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('auth-token')
          localStorage.removeItem('refresh-token')
          document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          window.location.href = '/auth/login'
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('auth-token')
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        window.location.href = '/auth/login'
      }
    }
    
    return Promise.reject(error)
  }
)

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    const authData = response.data.data
    
    // Store tokens
    localStorage.setItem('auth-token', authData.token)
    localStorage.setItem('refresh-token', authData.refreshToken)
    document.cookie = `auth-token=${authData.token}; path=/; max-age=${15 * 60}` // 15 minutes
    
    return authData
  },

  async signup(credentials: Omit<SignupCredentials, 'confirmPassword'>): Promise<AuthResponse> {
    const response = await api.post('/auth/signup', credentials)
    const authData = response.data.data
    
    // Store tokens
    localStorage.setItem('auth-token', authData.token)
    localStorage.setItem('refresh-token', authData.refreshToken)
    document.cookie = `auth-token=${authData.token}; path=/; max-age=${15 * 60}` // 15 minutes
    
    return authData
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh-token')
    await api.post('/auth/logout', { refreshToken })
    localStorage.removeItem('auth-token')
    localStorage.removeItem('refresh-token')
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  },

  async verifyToken(token: string): Promise<AuthResponse> {
    const response = await api.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.data
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await api.post('/auth/refresh')
    return response.data.data
  },

  async updateProfile(data: { name: string; email: string }): Promise<AuthResponse> {
    const response = await api.put('/auth/profile', data)
    return response.data.data
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await api.put('/auth/change-password', data)
  },

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/request-password-reset', { email })
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
    await api.post('/auth/reset-password', data)
  },
}
