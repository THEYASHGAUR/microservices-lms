/**
 * Secure API client with proper error handling and CSRF protection
 * Implements security best practices for API communication
 */

import { CSRFProtection } from './csrf-protection'

export interface ApiErrorResponse {
  message: string
  code?: string
  field?: string
}

export class SecureApiError extends Error {
  public readonly status: number
  public readonly code?: string
  public readonly field?: string

  constructor(message: string, status: number, code?: string, field?: string) {
    super(message)
    this.name = 'SecureApiError'
    this.status = status
    this.code = code
    this.field = field
  }
}

export class SecureApiClient {
  private readonly baseUrl: string
  private readonly defaultHeaders: Record<string, string>

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  // Makes secure HTTP requests with proper error handling and CSRF protection
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Add CSRF protection for state-changing operations
    const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')
    const headers = { ...this.defaultHeaders, ...options.headers }
    
    // Skip CSRF for auth endpoints as they handle their own security
    const isAuthEndpoint = endpoint.includes('/auth/')
    
    if (isStateChanging && !isAuthEndpoint) {
      Object.assign(headers, CSRFProtection.addCSRFHeader(headers))
    }
    
    const requestOptions: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, requestOptions)
      const data = await response.json()

      if (!response.ok) {
        throw this.createSecureError(data, response.status)
      }

      return data
    } catch (error) {
      if (error instanceof SecureApiError) {
        throw error
      }
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new SecureApiError(
          'Unable to connect to the server. Please ensure the API Gateway is running on port 3000.',
          0,
          'NETWORK_ERROR'
        )
      }
      
      // Other errors
      throw new SecureApiError(
        'An unexpected error occurred. Please try again.',
        0,
        'UNKNOWN_ERROR'
      )
    }
  }

  // Creates secure error with sanitized messages
  private createSecureError(data: any, status: number): SecureApiError {
    // Sanitize error message to prevent information disclosure
    let message = 'An error occurred. Please try again.'
    let code = 'UNKNOWN_ERROR'
    let field: string | undefined

    if (data && typeof data === 'object') {
      // Only expose safe error messages
      if (typeof data.message === 'string' && this.isSafeErrorMessage(data.message)) {
        message = data.message
      }
      
      if (typeof data.code === 'string') {
        code = data.code
      }
      
      if (typeof data.field === 'string') {
        field = data.field
      }
    }

    // Map HTTP status codes to user-friendly messages
    if (status >= 500) {
      message = 'Server error. Please try again later.'
      code = 'SERVER_ERROR'
    } else if (status === 401) {
      message = 'Authentication required. Please log in.'
      code = 'UNAUTHORIZED'
    } else if (status === 403) {
      message = 'Access denied. You do not have permission.'
      code = 'FORBIDDEN'
    } else if (status === 404) {
      message = 'Resource not found.'
      code = 'NOT_FOUND'
    } else if (status === 429) {
      message = 'Too many requests. Please wait before trying again.'
      code = 'RATE_LIMITED'
    }

    return new SecureApiError(message, status, code, field)
  }

  // Validates error messages to prevent information disclosure
  private isSafeErrorMessage(message: string): boolean {
    // Allow only safe, user-friendly error messages
    const safePatterns = [
      /^[A-Za-z0-9\s.,!?-]+$/, // Only alphanumeric, spaces, and basic punctuation
    ]

    // Block potentially dangerous patterns
    const dangerousPatterns = [
      /localhost/i,
      /127\.0\.0\.1/,
      /database/i,
      /sql/i,
      /query/i,
      /table/i,
      /column/i,
      /index/i,
      /constraint/i,
      /foreign key/i,
      /primary key/i,
      /stack trace/i,
      /error at line/i,
      /file:/i,
      /path:/i,
      /system/i,
      /internal/i,
      /debug/i,
    ]

    // Check if message contains dangerous patterns
    if (dangerousPatterns.some(pattern => pattern.test(message))) {
      return false
    }

    // Check if message matches safe patterns
    return safePatterns.some(pattern => pattern.test(message))
  }

  // Gets authentication token from secure cookie
  getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie => 
      cookie.trim().startsWith('auth-token=')
    )
    
    if (!authCookie) return null
    
    return authCookie.split('=')[1]?.trim() || null
  }

  // Makes authenticated request
  async authenticatedRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken()
    
    if (!token) {
      throw new SecureApiError(
        'Authentication required. Please log in.',
        401,
        'UNAUTHORIZED'
      )
    }

    const authOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    }

    return this.request<T>(endpoint, authOptions)
  }
}
