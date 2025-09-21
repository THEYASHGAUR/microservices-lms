import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/auth-api-client'
import type { User, AuthResponse } from '@/types/auth-types'

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
        const { token, refreshToken } = get()
        
        try {
          if (token) {
            await authService.logout(token, refreshToken || undefined)
          }
        } catch (error) {
          console.error('Logout error:', error)
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
        const { token } = get()
        
        if (!token) {
          set({ isLoading: false })
          return
        }

        try {
          set({ isLoading: true })
          
          const user = await authService.verifyToken(token)
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          // Token is invalid, try to refresh
          await get().refreshAuthToken()
        }
      },

      refreshAuthToken: async () => {
        const { refreshToken } = get()
        
        if (!refreshToken) {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false
          })
          return
        }

        try {
          set({ isLoading: true })
          
          const response = await authService.refreshToken(refreshToken)
          
          set({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          console.error('Token refresh error:', error)
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
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
