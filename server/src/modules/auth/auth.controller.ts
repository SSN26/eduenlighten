import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ENV } from '../../config/env.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, token } = await AuthService.register(req.body);

      res.cookie(ENV.COOKIE_NAME, token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to EduEnlighten.',
        token,
        user,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const identifier = (req.body.username || req.body.email || '').toString();
      const password = req.body.password;
      const { user, token, profile } = await AuthService.login(identifier, password);

      res.cookie(ENV.COOKIE_NAME, token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user,
        profile,
      });
    } catch (err) {
      next(err);
    }
  }

  static logout(req: Request, res: Response): void {
    res.clearCookie(ENV.COOKIE_NAME, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const { user, profile } = await AuthService.getMe(req.user.userId);
      res.status(200).json({
        success: true,
        user,
        profile,
      });
    } catch (err) {
      next(err);
    }
  }
}
