import { Router, Request, Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';

const router = Router();

// Student: Initiate checkout for course purchase
router.post('/initiate', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { courseId, paymentMethod, currency } = req.body;
    const checkout = await PaymentsService.initiatePayment({
      studentId: req.user!.userId,
      courseId,
      paymentMethod,
      currency,
    });
    res.status(201).json({ success: true, ...checkout });
  } catch (err) {
    next(err);
  }
});

// Student/Gateway Webhook: Confirm payment completion
router.post('/complete', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transactionReference, providerRef } = req.body;
    const result = await PaymentsService.completePayment(transactionReference, providerRef);
    res.status(200).json({
      success: true,
      message: 'Payment verified and course access granted!',
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

// Student: View payment and invoice history
router.get('/my', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payments = await PaymentsService.getMyPayments(req.user!.userId);
    res.status(200).json({ success: true, payments });
  } catch (err) {
    next(err);
  }
});

// Admin: Grant scholarship / sponsored access
router.post(
  '/scholarship',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { studentId, courseId, reason } = req.body;
      const payment = await PaymentsService.grantScholarship({
        studentId,
        courseId,
        reason,
        grantedBy: req.user!.userId,
      });
      res.status(201).json({
        success: true,
        message: 'Scholarship granted and student enrolled successfully',
        payment,
      });
    } catch (err) {
      next(err);
    }
  }
);

// Admin: Review platform transactions
router.get(
  '/all',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payments = await PaymentsService.listAllPayments();
      res.status(200).json({ success: true, payments });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
