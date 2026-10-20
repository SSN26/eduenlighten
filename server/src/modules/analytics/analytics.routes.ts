import { Router, Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';

const router = Router();

// Platform Admin metrics
router.get(
  '/admin',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AnalyticsService.getAdminMetrics();
      res.status(200).json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  }
);

// Teacher metrics
router.get(
  '/teacher',
  requireAuth,
  requireRoles('teacher', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AnalyticsService.getTeacherMetrics(req.user!.userId);
      res.status(200).json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  }
);

// Student learning dashboard metrics
router.get('/student', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await AnalyticsService.getStudentMetrics(req.user!.userId);
    res.status(200).json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
});

export default router;
