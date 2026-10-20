import { Router } from 'express';
import { z } from 'zod';
import { AuthController } from './auth.controller.js';
import { validateRequest } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  country: z.string().optional(),
  role: z.enum(['student', 'parent']).optional(),
  curriculumPreference: z.enum(['cambridge', 'zimsec', 'digital_skills', 'both']).optional(),
  currentLevel: z.string().optional(),
});

const loginSchema = z
  .object({
    email: z.string().min(1).optional(),
    username: z.string().min(1).optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((data) => Boolean(data.email || data.username), {
    message: 'Username or email is required',
    path: ['username'],
  });

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/me', requireAuth, AuthController.getMe);

export default router;
