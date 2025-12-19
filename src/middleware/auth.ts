import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IJWTPayload, UserRole } from '../types';
import { User } from '../models/User';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: IJWTPayload;
    }
  }
}

export interface AuthRequest extends Request {
  user: IJWTPayload;
  body: any;
  params: any;
  query: any;
}

export const authenticate = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authReq = req as AuthRequest;
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as IJWTPayload;

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User no longer exists or is inactive.',
      });
      return;
    }

    // Attach user to request
    authReq.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate.',
      });
      return;
    }

    if (!roles.includes(authReq.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
      });
      return;
    }

    next();
  };
};

// Helper to extract user from request
export const getCurrentUser = (req: AuthRequest): IJWTPayload => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  return req.user;
};

