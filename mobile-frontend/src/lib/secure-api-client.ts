import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import * as SecureStore from 'expo-secure-store'
import { ApiError } from '@/types'

// Custom error class for API errors
export class SecureApiError extends Error {
  public status: number
  public code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'SecureApiError'
    this.status = status
    this.code = code
  }
}

// Secure token storage using Expo SecureStore
export class SecureTokenManager {
  private static readonly TOKEN_KEY = 'auth-token'
  private static readonly REFRESH_TOKEN_KEY = 'refresh-token'

  // Stores authentication token securely
  static async setAuthToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(this.TOKEN_KEY, token)
  }

  // Retrieves authentication token from secure storage
  static async getAuthToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(this.TOKEN_KEY)
  }

  // Stores refresh token securely
  static async setRefreshToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, token)
  }

  // Retrieves refresh token from secure storage
  static async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY)
  }

  // Clears all authentication tokens
  static async clearTokens(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(this.TOKEN_KEY),
      SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY)
    ])
  }
}

// Secure API client for mobile with token management
export class SecureApiClient {
  private client: AxiosInstance
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  // Sets up request and response interceptors for token management
  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await SecureTokenManager.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = await SecureTokenManager.getRefreshToken()
            if (refreshToken) {
              const response = await axios.post(`${this.baseURL}/api/auth/refresh`, {
                refreshToken
              })

              const { token, refreshToken: newRefreshToken } = response.data.data
              await SecureTokenManager.setAuthToken(token)
              await SecureTokenManager.setRefreshToken(newRefreshToken)

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`
              return this.client(originalRequest)
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            await SecureTokenManager.clearTokens()
            throw new SecureApiError(
              'Session expired. Please log in again.',
              401,
              'SESSION_EXPIRED'
            )
          }
        }

        // Convert axios error to SecureApiError
        const apiError = new SecureApiError(
          error.response?.data?.message || error.message || 'An error occurred',
          error.response?.status || 500,
          error.response?.data?.code
        )
        throw apiError
      }
    )
  }

  // Makes authenticated API request
  async authenticatedRequest<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.request<T>({
      url,
      ...config,
    })
    return response.data
  }

  // Makes public API request (no auth required)
  async request<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.request<T>({
      url,
      ...config,
    })
    return response.data
  }

  // Gets current auth token
  async getAuthToken(): Promise<string | null> {
    return await SecureTokenManager.getAuthToken()
  }

  // Checks if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await SecureTokenManager.getAuthToken()
    return !!token
  }
}
