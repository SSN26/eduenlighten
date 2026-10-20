import { Router, Request, Response, NextFunction } from 'express';
import { AssessmentsService } from './assessments.service.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';

const router = Router();

// Student: Get quiz questions (without answers)
router.get('/quizzes/:quizId', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizId = Array.isArray(req.params.quizId) ? req.params.quizId[0] : req.params.quizId;
    const quiz = await AssessmentsService.getQuizForStudent(quizId);
    res.status(200).json({ success: true, quiz });
  } catch (err) {
    next(err);
  }
});

// Student: Submit quiz attempt and get evaluation
router.post('/quizzes/:quizId/attempt', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizId = Array.isArray(req.params.quizId) ? req.params.quizId[0] : req.params.quizId;
    const { answers, timeSpentSeconds } = req.body;
    const result = await AssessmentsService.submitQuizAttempt(
      quizId,
      req.user!.userId,
      answers,
      timeSpentSeconds
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
});

// Student/Teacher: Get assignments for a course
router.get('/courses/:courseId/assignments', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = Array.isArray(req.params.courseId) ? req.params.courseId[0] : req.params.courseId;
    const assignments = await AssessmentsService.getAssignmentsByCourse(courseId);
    res.status(200).json({ success: true, assignments });
  } catch (err) {
    next(err);
  }
});

// Student: Submit an assignment
router.post('/assignments/:assignmentId/submit', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const assignmentId = Array.isArray(req.params.assignmentId) ? req.params.assignmentId[0] : req.params.assignmentId;
    const submission = await AssessmentsService.submitAssignment(
      assignmentId,
      req.user!.userId,
      req.body
    );
    res.status(201).json({ success: true, message: 'Assignment submitted successfully', submission });
  } catch (err) {
    next(err);
  }
});

// Teacher: View all submissions to mark
router.get(
  '/submissions/to-grade',
  requireAuth,
  requireRoles('teacher', 'super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submissions = await AssessmentsService.getSubmissionsForTeacher(req.user!.userId);
      res.status(200).json({ success: true, submissions });
    } catch (err) {
      next(err);
    }
  }
);

// Teacher: Grade submission
router.post(
  '/submissions/:submissionId/grade',
  requireAuth,
  requireRoles('teacher', 'super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submissionId = Array.isArray(req.params.submissionId) ? req.params.submissionId[0] : req.params.submissionId;
      const { score, feedback } = req.body;
      const submission = await AssessmentsService.gradeSubmission(
        submissionId,
        req.user!.userId,
        score,
        feedback
      );
      res.status(200).json({ success: true, message: 'Submission graded successfully', submission });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
