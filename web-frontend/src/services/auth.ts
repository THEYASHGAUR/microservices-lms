import { supabase, auth } from '@/lib/supabase'
import type { LoginCredentials, SignupCredentials, AuthResponse } from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data, error } = await auth.signIn(credentials.email, credentials.password)
    
    if (error) {
      throw new Error(error.message)
    }

    if (!data.user || !data.session) {
      throw new Error('Login failed')
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    const user = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.full_name || data.user.user_metadata?.name || 'User',
      role: data.user.user_metadata?.role || 'student',
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at || data.user.created_at
    }

    return {
      user,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    }
  },

  async signup(credentials: Omit<SignupCredentials, 'confirmPassword'>): Promise<AuthResponse> {
    console.log('Attempting signup with:', { 
      email: credentials.email, 
      name: credentials.name, 
      role: credentials.role 
    })
    
    const { data, error } = await auth.signUp(
      credentials.email, 
      credentials.password,
      { name: credentials.name, role: credentials.role || 'student' }
    )
    
    if (error) {
      console.error('Supabase signup error:', error)
      throw new Error(error.message)
    }

    console.log('Supabase signup response:', { 
      user: data.user ? 'exists' : 'null', 
      session: data.session ? 'exists' : 'null',
      userConfirmed: data.user?.email_confirmed_at ? 'confirmed' : 'pending'
    })

    if (!data.user) {
      throw new Error('User creation failed')
    }

    // If no session, user needs to confirm email
    if (!data.session) {
      throw new Error('Please check your email and click the confirmation link to complete signup')
    }

    // Profile is automatically created by database trigger
    // No need to manually insert here

    // Get the profile created by the trigger
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    const user = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.full_name || credentials.name,
      role: credentials.role || 'student',
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at || data.user.created_at
    }

    return {
      user,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    }
  },

  async logout(): Promise<void> {
    const { error } = await auth.signOut()
    if (error) {
      console.error('Logout error:', error)
    }
  },

  async verifyToken(): Promise<any> {
    const { data, error } = await auth.getUser()
    
    if (error || !data.user) {
      throw new Error('Invalid token')
    }

    return data.user
  },

  async getSession(): Promise<any> {
    const { data, error } = await auth.getSession()
    
    if (error) {
      throw new Error('Session error')
    }

    return data.session
  },

  async updateProfile(data: { name: string; email: string }): Promise<any> {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', (await auth.getUser()).data.user?.id)

    if (error) {
      throw new Error('Failed to update profile')
    }

    return data
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    const { error } = await auth.updatePassword(data.newPassword)
    
    if (error) {
      throw new Error('Failed to change password')
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    const { error } = await auth.resetPassword(email)
    
    if (error) {
      throw new Error('Failed to send reset email')
    }
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
    const { error } = await auth.updatePassword(data.newPassword)
    
    if (error) {
      throw new Error('Failed to reset password')
    }
  },
}
