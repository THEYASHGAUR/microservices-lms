import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { authService } from '@/services/auth-api-client'
import { supabase } from '@/lib/supabase'
import type { User, AuthResponse } from '@/types/auth-types'

interface AuthState {
  user: User | null
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
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: (response: AuthResponse) => {
        set({
          user: response.user,
          isAuthenticated: true,
          error: null,
        })
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          // Logout continues even if server request fails
          console.warn('Logout request failed:', error)
        } finally {
          set({
            user: null,
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
        try {
          set({ isLoading: true })
          
          // Get current session from Supabase
          const { data: { session } } = await supabase.auth.getSession()
          
          if (!session) {
            set({ isLoading: false, isAuthenticated: false, user: null })
            return
          }

          // Get user profile with role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          const user = {
            id: session.user.id,
            email: session.user.email!,
            name: profile?.name || profile?.full_name || session.user.user_metadata?.name || 'User',
            role: profile?.role || session.user.user_metadata?.role || 'student',
            createdAt: new Date(session.user.created_at).toISOString(),
            updatedAt: new Date(session.user.updated_at || session.user.created_at).toISOString()
          }
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      refreshAuthToken: async () => {
        try {
          set({ isLoading: true })
          
          const response = await authService.refreshToken()
          
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          // Token refresh failed, clear auth state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Supabase handles token persistence automatically
      }),
    }
  )
)
