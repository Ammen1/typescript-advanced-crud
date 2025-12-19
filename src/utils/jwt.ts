import jwt, { SignOptions } from 'jsonwebtoken';
import { IJWTPayload } from '../types';

export const generateToken = (payload: IJWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: (process.env.JWT_EXPIRE || '24h') as any,
  });
};

export const verifyToken = (token: string): IJWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as IJWTPayload;
};

