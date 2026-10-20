import { Router } from 'express';
import { z } from 'zod';
import { TeacherApplicationController } from './teacher-applications.controller.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate.js';

const router = Router();

const applySchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone number is required'),
  country: z.string().default('Zimbabwe'),
  city: z.string().default('Harare'),
  bio: z.string().min(20, 'Please provide a detailed biography (minimum 20 characters)'),
  qualificationsSummary: z.string().min(5, 'Please summarize your academic or professional qualifications'),
  teachingExperienceYears: z.number().min(0, 'Experience years must be 0 or more'),
  curriculaExpertise: z.array(z.string()).min(1, 'Select at least one curriculum expertise'),
  subjectsToTeach: z.array(z.string()).min(1, 'Specify at least one subject you want to teach'),
  preferredFormat: z.enum(['live_classes', 'recorded_courses', 'blended']),
  timeZone: z.string().default('Africa/Harare'),
  cvUrl: z.string().optional(),
  sampleLessonUrl: z.string().optional(),
  safeguardingAgreed: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Teacher Safeguarding Policy',
  }),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Teacher Agreement & Terms',
  }),
});

const updateStatusSchema = z.object({
  status: z.enum([
    'submitted',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'approved',
    'rejected',
    'more_info_required',
  ]),
  adminNotes: z.string().optional(),
  interviewDate: z.string().optional(),
});

// Any authenticated user can submit an application
router.post('/apply', requireAuth, validateRequest(applySchema), TeacherApplicationController.submit);

// Applicant checks their own application
router.get('/my', requireAuth, TeacherApplicationController.getMy);

// Admins review and manage applications
router.get(
  '/',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  TeacherApplicationController.list
);

router.patch(
  '/:id/status',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  validateRequest(updateStatusSchema),
  TeacherApplicationController.updateStatus
);

export default router;
