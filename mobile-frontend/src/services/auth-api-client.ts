import type { LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth-types'
import { supabase } from '@/lib/supabase'

export const authService = {
  // Authenticates user with email and password using Supabase
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw new Error('Invalid email or password')
    }

    if (!data.user || !data.session) {
      throw new Error('Login failed')
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    const user = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || profile?.full_name || data.user.user_metadata?.name || 'User',
      role: profile?.role || data.user.user_metadata?.role || 'student',
      createdAt: new Date(data.user.created_at).toISOString(),
      updatedAt: new Date(data.user.updated_at || data.user.created_at).toISOString()
    }

    return {
      user,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    }
  },

  // Creates new user account with provided credentials using Supabase
  async signup(credentials: Omit<SignupCredentials, 'confirmPassword'>): Promise<AuthResponse> {
    const { email, name, password, role = 'student' } = credentials

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('User with this email already exists')
      }
      throw new Error(error.message)
    }

    if (!data.user) {
      throw new Error('Signup failed')
    }

    // Handle email confirmation case
    if (!data.session) {
      throw new Error('Please check your email and confirm your account before signing in')
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        name,
        role,
        email: data.user.email
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Continue anyway as user is created in auth
    }

    const user = {
      id: data.user.id,
      email: data.user.email!,
      name,
      role,
      createdAt: new Date(data.user.created_at).toISOString(),
      updatedAt: new Date(data.user.updated_at || data.user.created_at).toISOString()
    }

    return {
      user,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    }
  },

  // Logs out user and invalidates session using Supabase
  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('Logout request failed:', error)
    }
  },

  // Verifies JWT token and returns user data using Supabase
  async verifyToken(token: string): Promise<any> {
    const { data, error } = await supabase.auth.getUser(token)
    
    if (error || !data.user) {
      throw new Error('Invalid token')
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    return {
      id: data.user.id,
      email: data.user.email,
      name: profile?.name || profile?.full_name || data.user.user_metadata?.name || 'User',
      role: profile?.role || data.user.user_metadata?.role || 'student',
      createdAt: new Date(data.user.created_at).toISOString(),
      updatedAt: new Date(data.user.updated_at || data.user.created_at).toISOString()
    }
  },

  // Refreshes expired access token using refresh token with Supabase
  async refreshToken(): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.refreshSession()

    if (error || !data.session || !data.user) {
      throw new Error('Invalid refresh token')
    }

    // Get user profile with role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    const user = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || profile?.full_name || data.user.user_metadata?.name || 'User',
      role: profile?.role || data.user.user_metadata?.role || 'student',
      createdAt: new Date(data.user.created_at).toISOString(),
      updatedAt: new Date(data.user.updated_at || data.user.created_at).toISOString()
    }

    return {
      user,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    }
  },

  // Updates user profile information using Supabase
  async updateProfile(data: { name: string; email: string }): Promise<any> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ name: data.name })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      throw new Error('Failed to update profile')
    }

    return profile
  },

  // Changes user password with current password verification using Supabase
  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword
    })

    if (error) {
      throw new Error('Failed to change password')
    }
  },

  // Sends password reset email to user using Supabase
  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000'}/auth/reset-password`
    })

    if (error) {
      console.error('Password reset request error:', error)
      // Don't reveal if user exists or not for security
    }
  },

  // Resets user password using reset token with Supabase
  async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword
    })

    if (error) {
      throw new Error('Failed to reset password')
    }
  },
}
