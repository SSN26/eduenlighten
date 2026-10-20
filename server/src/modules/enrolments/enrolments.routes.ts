import { Router, Request, Response, NextFunction } from 'express';
import { EnrolmentService } from './enrolments.service.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();
const getParam = (param: string | string[]): string => (Array.isArray(param) ? param[0] : param);

// Student: Get my enrolled courses
router.get('/my', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const enrolments = await EnrolmentService.getStudentEnrolments(req.user!.userId);
    res.status(200).json({ success: true, enrolments });
  } catch (err) {
    next(err);
  }
});

// Student: Enrol in a course (for free courses; paid courses use payments route)
router.post('/courses/:courseId/enrol', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = getParam(req.params.courseId);
    const enrolment = await EnrolmentService.enrolInCourse(req.user!.userId, courseId);
    res.status(201).json({ success: true, message: 'Enrolled successfully!', enrolment });
  } catch (err) {
    next(err);
  }
});

// Student: Mark lesson completed
router.post('/courses/:courseId/lessons/:lessonId/complete', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = getParam(req.params.courseId);
    const lessonId = getParam(req.params.lessonId);
    const enrolment = await EnrolmentService.markLessonCompleted(
      req.user!.userId,
      courseId,
      lessonId
    );
    res.status(200).json({ success: true, message: 'Lesson progress updated', enrolment });
  } catch (err) {
    next(err);
  }
});

export default router;
