import { Router, Request, Response, NextFunction } from 'express';
import { CoursesService } from './courses.service.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';

const router = Router();

const getParam = (param: string | string[]): string => (Array.isArray(param) ? param[0] : param);

// Public: Browse and search courses
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { curriculum, programme, subject, level, deliveryFormat, pricingType, search, featured, page, limit } = req.query;
    const result = await CoursesService.listCourses({
      curriculum: curriculum as string,
      programme: programme as string,
      subject: subject as string,
      level: level as string,
      deliveryFormat: deliveryFormat as string,
      pricingType: pricingType as string,
      search: search as string,
      featured: featured === 'true' ? true : undefined,
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 12,
    });
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// Public: Get course details
router.get('/:slugOrId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slugOrId = getParam(req.params.slugOrId);
    const result = await CoursesService.getCourseDetail(slugOrId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// Teacher: Create course draft
router.post(
  '/',
  requireAuth,
  requireRoles('teacher', 'super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await CoursesService.createCourse(req.user!.userId, req.body);
      res.status(201).json({ success: true, course });
    } catch (err) {
      next(err);
    }
  }
);

// Teacher: Add module to course
router.post(
  '/:courseId/modules',
  requireAuth,
  requireRoles('teacher', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = getParam(req.params.courseId);
      const module = await CoursesService.addModule(courseId, req.user!.userId, req.body);
      res.status(201).json({ success: true, module });
    } catch (err) {
      next(err);
    }
  }
);

// Teacher: Add lesson to module
router.post(
  '/:courseId/modules/:moduleId/lessons',
  requireAuth,
  requireRoles('teacher', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = getParam(req.params.courseId);
      const moduleId = getParam(req.params.moduleId);
      const lesson = await CoursesService.addLesson(
        courseId,
        moduleId,
        req.user!.userId,
        req.body
      );
      res.status(201).json({ success: true, lesson });
    } catch (err) {
      next(err);
    }
  }
);

// Teacher: Submit course for academic review
router.post(
  '/:courseId/submit',
  requireAuth,
  requireRoles('teacher', 'super_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = getParam(req.params.courseId);
      const course = await CoursesService.submitForApproval(courseId, req.user!.userId);
      res.status(200).json({ success: true, message: 'Course submitted for review', course });
    } catch (err) {
      next(err);
    }
  }
);

// Admin: Review course (approve/reject)
router.patch(
  '/:courseId/review',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = getParam(req.params.courseId);
      const { status, rejectionReason } = req.body;
      const course = await CoursesService.reviewCourse(courseId, status, rejectionReason);
      res.status(200).json({ success: true, message: `Course ${status}`, course });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
