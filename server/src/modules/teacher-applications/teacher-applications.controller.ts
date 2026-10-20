import { Request, Response, NextFunction } from 'express';
import { TeacherApplicationService } from './teacher-applications.service.js';

export class TeacherApplicationController {
  static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applicantId = req.user?.userId;
      if (!applicantId) {
        res.status(401).json({ success: false, message: 'You must be logged in to submit an application.' });
        return;
      }

      const application = await TeacherApplicationService.submitApplication({
        applicantId,
        ...req.body,
      });

      res.status(201).json({
        success: true,
        message: 'Your teacher application has been submitted successfully! Our academic team will review it shortly.',
        application,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const applicantId = req.user!.userId;
      const application = await TeacherApplicationService.getMyApplication(applicantId);

      res.status(200).json({
        success: true,
        application,
      });
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, curriculum, search, page, limit } = req.query;
      const result = await TeacherApplicationService.listApplications({
        status: status as string,
        curriculum: curriculum as string,
        search: search as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status, adminNotes, interviewDate } = req.body;
      const reviewerId = req.user!.userId;

      const updated = await TeacherApplicationService.updateStatus(
        id,
        status,
        adminNotes || '',
        reviewerId,
        interviewDate ? new Date(interviewDate) : undefined
      );

      res.status(200).json({
        success: true,
        message: `Teacher application status updated to ${status}.`,
        application: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}
