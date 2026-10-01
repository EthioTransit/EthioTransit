import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response.utils';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendSuccess(res, result, 'Account registered successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400, 'REGISTRATION_FAILED');
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      return sendSuccess(res, result, 'Logged in successfully');
    } catch (err: any) {
      return sendError(res, err.message, 401, 'LOGIN_FAILED');
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      return sendSuccess(res, tokens, 'Token refreshed successfully');
    } catch (err: any) {
      return sendError(res, err.message, 401, 'REFRESH_FAILED');
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      }
      const profile = await AuthService.getUserProfile(req.user.userId);
      return sendSuccess(res, profile);
    } catch (err: any) {
      return sendError(res, err.message, 404, 'USER_NOT_FOUND');
    }
  }
}
