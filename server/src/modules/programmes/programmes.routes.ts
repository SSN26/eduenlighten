import { Router, Request, Response, NextFunction } from 'express';
import { ProgrammesService } from './programmes.service.js';
import { requireAuth, requireRoles } from '../../middleware/auth.js';

const router = Router();
const getParam = (param: string | string[]): string => (Array.isArray(param) ? param[0] : param);

// Public: Get all programmes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const programmes = await ProgrammesService.getAllProgrammes();
    res.status(200).json({ success: true, programmes });
  } catch (err) {
    next(err);
  }
});

// Public: Get curricula
router.get('/curricula', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { programme } = req.query;
    const curricula = await ProgrammesService.getCurriculaByProgramme(programme as string);
    res.status(200).json({ success: true, curricula });
  } catch (err) {
    next(err);
  }
});

// Public: Get curriculum detail by code (e.g. 'cambridge', 'zimsec', 'digital_skills')
router.get('/curricula/:code', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = getParam(req.params.code);
    const curriculum = await ProgrammesService.getCurriculumByCode(code);
    res.status(200).json({ success: true, curriculum });
  } catch (err) {
    next(err);
  }
});

// Public: Get subjects
router.get('/subjects', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { curriculum, category } = req.query;
    const subjects = await ProgrammesService.getSubjects(curriculum as string, category as string);
    res.status(200).json({ success: true, subjects });
  } catch (err) {
    next(err);
  }
});

// Admin: Create subject
router.post(
  '/subjects',
  requireAuth,
  requireRoles('super_admin', 'academic_admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const subject = await ProgrammesService.createSubject(req.body);
      res.status(201).json({ success: true, subject });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
