import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { SupportTicket } from '../../models/SupportAndAudit.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';

const router = Router();

// Public / Authenticated: Submit a support ticket or enquiry
router.post('/tickets', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, category, message } = req.body;
    const ticketNumber = `TKT-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const ticket = new SupportTicket({
      ticketNumber,
      user: req.user?.userId || undefined,
      name,
      email,
      subject,
      category: category || 'general',
      message,
      status: 'open',
      priority: category === 'safeguarding' ? 'urgent' : 'medium',
    });

    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully. Our support team will follow up via email.',
      ticketNumber: ticket.ticketNumber,
    });
  } catch (err) {
    next(err);
  }
});

// Admin: List support tickets
router.get(
  '/tickets',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await SupportTicket.find().sort({ createdAt: -1 }).limit(50);
      res.status(200).json({ success: true, tickets });
    } catch (err) {
      next(err);
    }
  }
);

// Admin: Update ticket status
router.patch(
  '/tickets/:id',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, resolutionNotes } = req.body;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const ticket = await SupportTicket.findById(id);
      if (!ticket) {
        res.status(404).json({ success: false, message: 'Ticket not found' });
        return;
      }

      ticket.status = status;
      if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
      if (status === 'resolved' || status === 'closed') {
        ticket.resolvedAt = new Date();
      }
      ticket.assignedTo = req.user!.userId as any;

      await ticket.save();
      res.status(200).json({ success: true, message: 'Ticket updated', ticket });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
