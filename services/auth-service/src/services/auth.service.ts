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

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

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

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User ${email} logged in successfully`);

    return {
      user: userWithoutPassword,
      token
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

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    logger.info(`New user ${email} registered successfully`);

    return {
      user: userWithoutPassword,
      token
    };
  }

  async verifyToken(token: string): Promise<Omit<User, 'password'>> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
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

  async refreshToken(token: string): Promise<AuthResponse> {
    const user = await this.verifyToken(token);
    
    // Generate new token
    const newToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    return {
      user,
      token: newToken
    };
  }

  async logout(token: string): Promise<void> {
    // In a real application, you would add the token to a blacklist
    // For now, we'll just log the logout
    logger.info('User logged out');
  }

  // Helper method to get all users (for admin purposes)
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return users.map(({ password, ...user }) => user);
  }
}

export const authService = new AuthService();
