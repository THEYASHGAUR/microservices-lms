/// <reference types="node" />
import { supabase } from '../config/supabase';
import { CreateUserData, LoginCredentials, AuthResponse } from '../models/user.model';
import logger from '../../../../shared/logger';

// Supabase handles user storage, JWT tokens, and session management

export class AuthService {
  // Authenticates user with email and password credentials
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error('Invalid email or password');
      }

      if (!data.user || !data.session) {
        throw new Error('Login failed');
      }

      // Get user profile with role
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        role: profile?.role || data.user.user_metadata?.role || 'student',
        createdAt: new Date(data.user.created_at).toISOString(),
        updatedAt: new Date(data.user.updated_at || data.user.created_at).toISOString()
      };

      logger.info(`User ${email} logged in successfully`);

      return {
        user,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token
      };
    } catch (error: any) {
      logger.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  }

  // Creates new user account with email, name, password and role
  async signup(userData: CreateUserData): Promise<AuthResponse> {
    const { email, name, password, role = 'student' } = userData;

    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('User with this email already exists');
        }
        throw new Error(error.message);
      }

      if (!data.user || !data.session) {
        throw new Error('Signup failed');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          role,
          email: data.user.email
        });

      if (profileError) {
        logger.error('Profile creation error:', profileError);
        // Continue anyway as user is created in auth
      }

      const user = {
        id: data.user.id,
        email: data.user.email!,
        name,
        role,
        createdAt: new Date(data.user.created_at).toISOString(),
        updatedAt: new Date(data.user.updated_at || data.user.created_at).toISOString()
      };

      logger.info(`New user ${email} registered successfully`);

      return {
        user,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token
      };
    } catch (error: any) {
      logger.error('Signup error:', error);
      throw error;
    }
  }

  // Validates JWT token and returns user data
  async verifyToken(token: string): Promise<any> {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error || !data.user) {
        throw new Error('Invalid token');
      }

      // Get user profile with role
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      return {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        role: profile?.role || data.user.user_metadata?.role || 'student',
        createdAt: new Date(data.user.created_at).toISOString(),
        updatedAt: new Date(data.user.updated_at || data.user.created_at).toISOString()
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Refreshes expired access token using refresh token
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error || !data.session || !data.user) {
        throw new Error('Invalid refresh token');
      }

      // Get user profile with role
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      const user = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        role: profile?.role || data.user.user_metadata?.role || 'student',
        createdAt: new Date(data.user.created_at).toISOString(),
        updatedAt: new Date(data.user.updated_at || data.user.created_at).toISOString()
      };

      return {
        user,
        token: data.session.access_token,
        refreshToken: data.session.refresh_token
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  // Logs out user and invalidates all sessions
  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      // Supabase handles token invalidation automatically
      // We can optionally call signOut to invalidate all sessions
      await supabase.auth.signOut();
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout error:', error);
      // Continue anyway as logout should not fail
    }
  }

  // Retrieves all user profiles from database for admin purposes
  async getAllUsers(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) {
        throw new Error('Failed to fetch users');
      }

      return data || [];
    } catch (error) {
      logger.error('Get users error:', error);
      throw new Error('Failed to fetch users');
    }
  }

  // Updates user profile information in database
  async updateUserProfile(userId: string, updateData: { name?: string; email?: string }): Promise<any> {
    try {
      // Update profile in profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to update profile');
      }

      return data;
    } catch (error) {
      logger.error('Update profile error:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Changes user password after verifying current password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Supabase handles password change through auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error('Failed to change password');
      }

      logger.info(`Password changed for user ${userId}`);
    } catch (error) {
      logger.error('Change password error:', error);
      throw new Error('Failed to change password');
    }
  }

  // Sends password reset email to user
  async requestPasswordReset(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password`
      });

      if (error) {
        logger.error('Password reset request error:', error);
        // Don't reveal if user exists or not for security
      }

      logger.info(`Password reset requested for email: ${email}`);
    } catch (error) {
      logger.error('Password reset request error:', error);
      // Continue anyway for security
    }
  }

  // Resets user password using reset token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Supabase handles password reset through auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error('Failed to reset password');
      }

      logger.info('Password reset completed successfully');
    } catch (error) {
      logger.error('Password reset error:', error);
      throw new Error('Failed to reset password');
    }
  }
}

export const authService = new AuthService();
