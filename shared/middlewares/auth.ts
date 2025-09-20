import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { JWTPayload, UserRole } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import logger from '../logger';

// Supabase client for JWT verification
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn('Authentication failed: No token provided', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_MESSAGES.UNAUTHORIZED
    });
  }

  try {
    // Verify token with Supabase
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

    const userPayload: JWTPayload = {
      userId: data.user.id,
      email: data.user.email!,
      role: profile?.role || data.user.user_metadata?.role || 'student',
      name: profile?.name || data.user.user_metadata?.name || 'User'
    };

    req.user = userPayload;
    
    logger.info('User authenticated successfully', {
      userId: userPayload.userId,
      email: userPayload.email,
      role: userPayload.role,
      path: req.path
    });
    
    next();
  } catch (error) {
    logger.warn('Authentication failed: Invalid token', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: ERROR_MESSAGES.UNAUTHORIZED
    });
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Authorization failed: No user in request', {
        path: req.path
      });
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Authorization failed: Insufficient permissions', {
        userId: req.user.userId,
        userRole: req.user.role,
        requiredRoles: roles,
        path: req.path
      });
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: ERROR_MESSAGES.FORBIDDEN
      });
    }

    logger.info('User authorized successfully', {
      userId: req.user.userId,
      role: req.user.role,
      path: req.path
    });

    next();
  };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      // Verify token with Supabase
      const { data, error } = await supabase.auth.getUser(token);
      
      if (!error && data.user) {
        // Get user profile with role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userPayload: JWTPayload = {
          userId: data.user.id,
          email: data.user.email!,
          role: profile?.role || data.user.user_metadata?.role || 'student',
          name: profile?.name || data.user.user_metadata?.name || 'User'
        };

        req.user = userPayload;
      }
    } catch (error) {
      // Token is invalid, but we don't fail the request
      logger.debug('Optional auth failed: Invalid token', {
        error: error instanceof Error ? error.message : 'Unknown error',
        path: req.path
      });
    }
  }

  next();
};

export const validateOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGES.UNAUTHORIZED
      });
    }

    // Admin can access everything
    if (req.user.role === UserRole.ADMIN) {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId !== req.user.userId) {
      logger.warn('Ownership validation failed', {
        userId: req.user.userId,
        resourceUserId,
        path: req.path
      });
      
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        error: ERROR_MESSAGES.FORBIDDEN
      });
    }

    next();
  };
};
