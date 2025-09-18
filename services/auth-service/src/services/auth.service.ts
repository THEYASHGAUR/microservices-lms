import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, CreateUserData, LoginCredentials, AuthResponse } from '../models/user.model';
import logger from '../../../../shared/logger';

// Default test users for development
const DEFAULT_USERS: User[] = [
  {
    id: '1',
    email: 'admin@lms.com',
    name: 'Admin User',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'instructor@lms.com',
    name: 'John Instructor',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    role: 'instructor',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'student@lms.com',
    name: 'Jane Student',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    role: 'student',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    email: 'deepanshu@gmail.com',
    name: 'Deepanshu',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
    role: 'student',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// In-memory storage for demo purposes
let users: User[] = [...DEFAULT_USERS];

// Token blacklist for logout functionality
const tokenBlacklist = new Set<string>();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m'; // Short-lived access token
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'; // Long-lived refresh token

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate access token
    const accessToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User ${email} logged in successfully`);

    return {
      user: userWithoutPassword,
      token: accessToken,
      refreshToken
    };
  }

  async signup(userData: CreateUserData): Promise<AuthResponse> {
    const { email, name, password, role = 'student' } = userData;

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User = {
      id: (users.length + 1).toString(),
      email,
      name,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);

    // Generate access token
    const accessToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role,
        type: 'refresh'
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    logger.info(`New user ${email} registered successfully`);

    return {
      user: userWithoutPassword,
      token: accessToken,
      refreshToken
    };
  }

  async verifyToken(token: string): Promise<Omit<User, 'password'>> {
    try {
      // Check if token is blacklisted
      if (tokenBlacklist.has(token)) {
        throw new Error('Token has been revoked');
      }

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Verify token type
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Check if refresh token is blacklisted
      if (tokenBlacklist.has(refreshToken)) {
        throw new Error('Refresh token has been revoked');
      }

      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
      
      // Verify token type
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token type');
      }

      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          type: 'access'
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      // Generate new refresh token
      const newRefreshToken = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          role: user.role,
          type: 'refresh'
        },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
      );

      // Blacklist the old refresh token
      tokenBlacklist.add(refreshToken);

      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        token: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    // Add access token to blacklist
    tokenBlacklist.add(accessToken);
    
    // Add refresh token to blacklist if provided
    if (refreshToken) {
      tokenBlacklist.add(refreshToken);
    }
    
    logger.info('User logged out and tokens blacklisted');
  }

  // Helper method to get all users (for admin purposes)
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return users.map(({ password, ...user }) => user);
  }

  // Update user profile
  async updateUserProfile(userId: string, updateData: { name?: string; email?: string }): Promise<Omit<User, 'password'>> {
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Check if email is already taken by another user
    if (updateData.email) {
      const existingUser = users.find(u => u.email.toLowerCase() === updateData.email!.toLowerCase() && u.id !== userId);
      if (existingUser) {
        throw new Error('Email is already taken');
      }
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };

    const { password: _, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  // Change user password
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();

    logger.info(`Password changed for user ${user.email}`);
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<void> {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      // Don't reveal if user exists or not for security
      logger.info(`Password reset requested for email: ${email}`);
      return;
    }

    // In a real application, you would:
    // 1. Generate a secure reset token
    // 2. Store it in database with expiration
    // 3. Send email with reset link
    // For now, we'll just log it
    logger.info(`Password reset requested for user: ${user.email}`);
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // In a real application, you would:
    // 1. Verify the reset token
    // 2. Check if it's expired
    // 3. Find the user associated with the token
    // 4. Update the password
    // 5. Invalidate the token
    
    // For demo purposes, we'll just log it
    logger.info(`Password reset attempted with token: ${token.substring(0, 10)}...`);
    
    // Simulate token validation
    if (token.length < 10) {
      throw new Error('Invalid reset token');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // In a real app, you'd find the user by token and update their password
    logger.info('Password reset completed successfully');
  }
}

export const authService = new AuthService();
