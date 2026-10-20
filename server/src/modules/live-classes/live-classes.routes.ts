import { Router, Request, Response, NextFunction } from 'express';
import { LiveClassesService } from './live-classes.service.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';

const router = Router();
const getParam = (param: string | string[]): string => (Array.isArray(param) ? param[0] : param);

// Get list of upcoming/past live classes for the user's role
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await LiveClassesService.listSessions(req.user!.userId, req.user!.role);
    res.status(200).json({ success: true, sessions });
  } catch (err) {
    next(err);
  }
});

// Teacher: Schedule a live class session
router.post(
  '/',
  requireAuth,
  requireRoles('teacher', 'super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await LiveClassesService.createSession(req.user!.userId, {
        ...req.body,
        scheduledStartTime: new Date(req.body.scheduledStartTime),
        scheduledEndTime: new Date(req.body.scheduledEndTime),
      });
      res.status(201).json({ success: true, message: 'Live class scheduled successfully', session });
    } catch (err) {
      next(err);
    }
  }
);

// Student: Join a live class session
router.post('/:sessionId/join', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = getParam(req.params.sessionId);
    const joinData = await LiveClassesService.joinSession(sessionId, req.user!.userId);
    res.status(200).json({ success: true, ...joinData });
  } catch (err) {
    next(err);
  }
});

export default router;
