import type { LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth-types'
import { SecureApiClient, SecureApiError } from '@/lib/secure-api-client'
import { SecureCookieManager } from '@/lib/secure-cookie-utils'

// Resolves base URL for auth API (gateway by default; can point directly to auth service via env)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'

// Creates secure API client instance
const secureApiClient = new SecureApiClient(API_BASE_URL)

export const authService = {
  // Authenticates user with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await secureApiClient.request<{ success: boolean; data: AuthResponse }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    // Store tokens securely in httpOnly cookies
    SecureCookieManager.setAuthCookie(response.data.token)
    SecureCookieManager.setRefreshCookie(response.data.refreshToken)

    return response.data
  },

  // Creates new user account with provided credentials
  async signup(credentials: Omit<SignupCredentials, 'confirmPassword'>): Promise<AuthResponse> {
    const response = await secureApiClient.request<{ success: boolean; data: AuthResponse }>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    // Store tokens securely in httpOnly cookies
    SecureCookieManager.setAuthCookie(response.data.token)
    SecureCookieManager.setRefreshCookie(response.data.refreshToken)

    return response.data
  },

  // Logs out user and invalidates session
  async logout(): Promise<void> {
    try {
      await secureApiClient.authenticatedRequest('/api/auth/logout', {
        method: 'POST',
      })
    } catch (error) {
      // Continue with logout even if server request fails
      if (error instanceof SecureApiError && error.status !== 401) {
        throw error
      }
    } finally {
      // Always clear local cookies
      SecureCookieManager.clearAuthCookies()
    }
  },

  // Verifies JWT token and returns user data
  async verifyToken(token: string): Promise<any> {
    const response = await secureApiClient.request<{ success: boolean; data: { user: any } }>('/api/auth/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.data.user
  },

  // Refreshes expired access token using refresh token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = SecureCookieManager.getCookie('refresh-token')
    
    if (!refreshToken) {
      throw new SecureApiError(
        'No refresh token available. Please log in again.',
        401,
        'NO_REFRESH_TOKEN'
      )
    }

    const response = await secureApiClient.request<{ success: boolean; data: AuthResponse }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })

    // Update tokens in secure cookies
    SecureCookieManager.setAuthCookie(response.data.token)
    SecureCookieManager.setRefreshCookie(response.data.refreshToken)

    return response.data
  },

  // Updates user profile information
  async updateProfile(data: { name: string; email: string }): Promise<any> {
    const response = await secureApiClient.authenticatedRequest<{ success: boolean; data: any }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    return response.data
  },

  // Changes user password with current password verification
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    await secureApiClient.authenticatedRequest('/api/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Sends password reset email to user
  async requestPasswordReset(email: string): Promise<void> {
    await secureApiClient.request('/api/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // Resets user password using reset token
  async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
    await secureApiClient.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
