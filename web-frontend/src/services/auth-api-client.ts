import type { LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth-types'

const API_BASE_URL = 'http://localhost:3000'

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// Makes HTTP requests to auth service API endpoints
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/api/auth${endpoint}`
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status)
  }

  return data
}

export const authService = {
  // Authenticates user with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest<{ success: boolean; data: AuthResponse }>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    return response.data
  },

  // Creates new user account with provided credentials
  async signup(credentials: Omit<SignupCredentials, 'confirmPassword'>): Promise<AuthResponse> {
    const response = await apiRequest<{ success: boolean; data: AuthResponse }>('/signup', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    return response.data
  },

  // Logs out user and invalidates session
  async logout(token: string, refreshToken?: string): Promise<void> {
    await apiRequest('/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ refreshToken }),
    })
  },

  // Verifies JWT token and returns user data
  async verifyToken(token: string): Promise<any> {
    const response = await apiRequest<{ success: boolean; data: { user: any } }>('/verify', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.data.user
  },

  // Refreshes expired access token using refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiRequest<{ success: boolean; data: AuthResponse }>('/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })

    return response.data
  },

  // Updates user profile information
  async updateProfile(data: { name: string; email: string }, token: string): Promise<any> {
    const response = await apiRequest<{ success: boolean; data: any }>('/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    return response.data
  },

  // Changes user password with current password verification
  async changePassword(data: { currentPassword: string; newPassword: string }, token: string): Promise<void> {
    await apiRequest('/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
  },

  // Sends password reset email to user
  async requestPasswordReset(email: string): Promise<void> {
    await apiRequest('/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  // Resets user password using reset token
  async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
    await apiRequest('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
