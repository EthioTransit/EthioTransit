import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { UserRole } from '../types';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  operatorId?: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '1d' });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as TokenPayload;
}
