import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { LoginCredentials, CreateUserData } from '../models/user.model';
import logger from '../../../../shared/logger';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginCredentials = req.body;
      
      // Basic validation
      if (!credentials.email || !credentials.password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
        return;
      }

      const result = await authService.login(credentials);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      logger.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

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

  async verify(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'No token provided'
        });
        return;
      }

      const token = authHeader.substring(7);
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

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'No token provided'
        });
        return;
      }

      const token = authHeader.substring(7);
      const result = await authService.refreshToken(token);
      
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

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        await authService.logout(token);
      }
      
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
}

export const authController = new AuthController();
