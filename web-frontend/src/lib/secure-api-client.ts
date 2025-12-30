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

  /**
   * Generic request method (used for auth & public APIs)
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
      options.method || 'GET'
    )

    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    }

    const isAuthEndpoint = endpoint.includes('/auth/')

    if (isStateChanging && !isAuthEndpoint) {
      Object.assign(headers, CSRFProtection.addCSRFHeader(headers))
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include', // ✅ REQUIRED for httpOnly cookies
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

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new SecureApiError(
          'Unable to connect to the server. Please ensure the API Gateway is running.',
          0,
          'NETWORK_ERROR'
        )
      }

      throw new SecureApiError(
        'An unexpected error occurred. Please try again.',
        0,
        'UNKNOWN_ERROR'
      )
    }
  }

  /**
   * Authenticated request wrapper
   * Used by CourseApiClient and other protected APIs
   */
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, options)
  }

  private createSecureError(
    data: ApiErrorResponse,
    status: number
  ): SecureApiError {
    const message = data.message || 'An error occurred'
    const code = data.code || 'UNKNOWN_ERROR'
    const field = data.field

    return new SecureApiError(message, status, code, field)
  }
}
