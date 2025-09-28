// Auth Service specific Supabase configuration
// This file contains auth-specific Supabase operations and types

import { getSupabaseClient, createSupabaseUserClientWithToken } from '../index'
import type { AuthUser, AuthResponse, LoginCredentials, CreateUserData } from '../types'

export class AuthServiceSupabase {
  private supabase = getSupabaseClient()

  // Authenticates user with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials

    const { data, error } = await this.supabase.auth.signInWithPassword({
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
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name: profile?.name || profile?.full_name || data.user.user_metadata?.name || 'User',
      role: profile?.role || data.user.user_metadata?.role || 'student',
      created_at: new Date(data.user.created_at).toISOString(),
      updated_at: new Date(data.user.updated_at || data.user.created_at).toISOString()
    }

    return {
      user,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    }
  }

  // Creates new user account
  async signup(userData: CreateUserData): Promise<AuthResponse> {
    const { email, name, password, role = 'student' } = userData

    const { data, error } = await this.supabase.auth.signUp({
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
      throw new Error('Failed to create user account')
    }

    if (!data.user || !data.session) {
      throw new Error('Signup failed')
    }

    // Create user profile
    const { error: profileError } = await this.supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: name,
        role
      })

    if (profileError) {
      console.error('Failed to create user profile:', profileError)
    }

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      name,
      role,
      created_at: new Date(data.user.created_at).toISOString(),
      updated_at: new Date(data.user.updated_at || data.user.created_at).toISOString()
    }

    return {
      user,
      token: data.session.access_token,
      refreshToken: data.session.refresh_token
    }
  }

  // Validates JWT token
  async validateToken(token: string): Promise<AuthUser | null> {
    try {
      const userClient = createSupabaseUserClientWithToken(token)
      const { data: { user }, error } = await userClient.auth.getUser()

      if (error || !user) {
        return null
      }

      // Get user profile
      const { data: profile } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return {
        id: user.id,
        email: user.email!,
        name: profile?.name || profile?.full_name || user.user_metadata?.name || 'User',
        role: profile?.role || user.user_metadata?.role || 'student',
        created_at: new Date(user.created_at).toISOString(),
        updated_at: new Date(user.updated_at || user.created_at).toISOString()
      }
    } catch (error) {
      return null
    }
  }

  // Logs out user
  async logout(token: string): Promise<void> {
    const userClient = createSupabaseUserClientWithToken(token)
    await userClient.auth.signOut()
  }

  // Refreshes access token
  async refreshToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken
    })

    if (error || !data.session) {
      throw new Error('Failed to refresh token')
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token
    }
  }
}
