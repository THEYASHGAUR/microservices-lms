import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/auth-api-client'
import type { User, AuthResponse } from '@/types/auth-types'
import { SecureApiClient } from '@/lib/secure-api-client'

// Create secure API client instance for token management
const secureApiClient = new SecureApiClient(process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000')

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (response: AuthResponse) => void
  logout: () => Promise<void>
  updateUser: (user: User) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  initializeAuth: () => Promise<void>
  refreshAuthToken: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (response: AuthResponse) => {
        set({
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
          error: null,
        })
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          // Logout continues even if server request fails
          // Error is handled securely in the auth service
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      updateUser: (user: User) => {
        set({ user })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      clearError: () => {
        set({ error: null })
      },

      initializeAuth: async () => {
        // Get token from secure cookie instead of localStorage
        const token = secureApiClient.getAuthToken()
        
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          set({ isLoading: true })
          
          const user = await authService.verifyToken(token)
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          // Token is invalid, try to refresh
          await get().refreshAuthToken()
        }
      },

      refreshAuthToken: async () => {
        try {
          set({ isLoading: true })
          
          const response = await authService.refreshToken()
          
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          // Token refresh failed, clear auth state
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist tokens - they're stored in secure cookies
      }),
    }
  )
)
