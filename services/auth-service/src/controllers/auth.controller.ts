import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { LoginCredentials, CreateUserData } from '../models/user.model';
import { logger } from '#shared';

export class AuthController {
  // Handles user login request and returns authentication response
  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log('Login request received:', { email: req.body?.email, timestamp: new Date().toISOString() });

      const credentials: LoginCredentials = req.body;

      // Basic validation
      if (!credentials.email || !credentials.password) {
        console.log('Login validation failed: missing email or password');
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      console.log('Attempting login for email:', credentials.email);
      const result = await authService.login(credentials);

      // Set httpOnly, Secure cookies for auth-token and refresh-token
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' as const : 'lax' as const, // Explicitly set allowed values with correct type
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
      };

      res.cookie('auth-token', result.token, cookieOptions);
      console.log('Auth token cookie set:', { token: result.token, options: cookieOptions });

      res.cookie('refresh-token', result.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      console.log('Refresh token cookie set:', { refreshToken: result.refreshToken, options: cookieOptions });

      console.log('Login successful for email:', credentials.email);
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: result.user
        }
      });
    } catch (error: any) {
      console.error('Login error for email:', req.body?.email, error);
      logger.error('Login error:', error);

      // Standardize error response
      const errorMessage = error.message.includes('Invalid email or password')
        ? 'Invalid credentials. Please try again.'
        : 'Login failed. Please contact support.';

      res.status(401).json({
        success: false,
        message: errorMessage
      });
    }
  }

  // Handles user registration request and creates new account
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserData = req.body;
      
      // Basic validation
      if (!userData.email || !userData.password || !userData.name) {
        res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
        return;
      }

      if (userData.password.length < 6) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
        return;
      }

      const result = await authService.signup(userData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result
      });
    } catch (error: any) {
      logger.error('Signup error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Signup failed'
      });
    }
  }

  // Verifies JWT token and returns user information
  async verify(req: Request, res: Response): Promise<void> {
    try {
      let token = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else if (req.cookies && req.cookies['auth-token']) {
        token = req.cookies['auth-token'];
      }
      if (!token) {
        res.status(401).json({
          success: false,
          message: 'No token provided'
        });
        return;
      }
      const user = await authService.verifyToken(token);
      res.status(200).json({
        success: true,
        message: 'Token is valid',
        data: { user }
      });
    } catch (error: any) {
      logger.error('Token verification error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Invalid token'
      });
    }
  }

  // Refreshes expired access token using refresh token
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
        return;
      }

      const result = await authService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error: any) {
      logger.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed'
      });
    }
  }

  // Handles user logout and invalidates session
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const { refreshToken } = req.body;
      
      let accessToken = '';
      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }
      
      await authService.logout(accessToken, refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error: any) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  // Retrieves all users for admin purposes
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await authService.getAllUsers();
      
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: { users }
      });
    } catch (error: any) {
      logger.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users'
      });
    }
  }

  // Updates user profile information
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { name, email } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const result = await authService.updateUserProfile(userId, { name, email });
      
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result
      });
    } catch (error: any) {
      logger.error('Update profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile'
      });
    }
  }

  // Changes user password with current password verification
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { currentPassword, newPassword } = req.body;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      if (!currentPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
        return;
      }

      await authService.changePassword(userId, currentPassword, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error: any) {
      logger.error('Change password error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to change password'
      });
    }
  }

  // Sends password reset email to user
  async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        res.status(400).json({
          success: false,
          message: 'Email is required'
        });
        return;
      }

      await authService.requestPasswordReset(email);
      
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    } catch (error: any) {
      logger.error('Password reset request error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request'
      });
    }
  }

  // Resets user password using reset token
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Token and new password are required'
        });
        return;
      }

      if (newPassword.length < 6) {
        res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
        return;
      }

      await authService.resetPassword(token, newPassword);
      
      res.status(200).json({
        success: true,
        message: 'Password has been reset successfully'
      });
    } catch (error: any) {
      logger.error('Password reset error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to reset password'
      });
    }
  }
}

export const authController = new AuthController();
