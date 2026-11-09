import { Router, Request, Response } from 'express';
import { AITeachersService } from './ai-teachers.service.js';

const router = Router();

// GET /api/ai-teachers - List all AI Teacher Agents
router.get('/', (req: Request, res: Response) => {
  const { curriculum, subject } = req.query;
  let teachers = AITeachersService.getAllTeachers();

  if (curriculum && curriculum !== 'all') {
    const curr = (curriculum as string).toLowerCase();
    teachers = teachers.filter((t) =>
      t.curricula.some((c) => c.toLowerCase().includes(curr))
    );
  }

  if (subject && subject !== 'all') {
    const subj = (subject as string).toLowerCase();
    teachers = teachers.filter((t) =>
      t.subjects.some((s) => s.toLowerCase().includes(subj))
    );
  }

  return res.status(200).json({
    success: true,
    count: teachers.length,
    data: teachers,
  });
});

// GET /api/ai-teachers/:id - Get specific AI Teacher details
router.get('/:id', (req: Request, res: Response) => {
  const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
  const teacher = AITeachersService.getTeacherById(id);

  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: `AI Teacher Agent with ID '${id}' not found.`,
    });
  }

  return res.status(200).json({
    success: true,
    data: teacher,
  });
});

// POST /api/ai-teachers/:id/chat - Interactive conversation with AI Teacher
router.post('/:id/chat', async (req: Request, res: Response) => {
  const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
  const { message, history, mode } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Message text is required for the AI Teacher session.',
    });
  }

  try {
    const response = await AITeachersService.generateChatResponse(
      id,
      message,
      Array.isArray(history) ? history : [],
      mode || 'academic'
    );

    return res.status(200).json({
      success: true,
      teacherId: id,
      mode: mode || 'academic',
      reply: response.content,
      suggestedFollowUps: response.suggestedFollowUps,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI Teacher response. Please try again.',
      error: err.message,
    });
  }
});

// POST /api/ai-teachers/:id/practice-question - Generate targeted exam practice question
router.post('/:id/practice-question', (req: Request, res: Response) => {
  const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
  const { topic } = req.body;

  try {
    const question = AITeachersService.generatePracticeQuestion(id, topic);
    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate practice question.',
      error: err.message,
    });
  }
});

// POST /api/ai-teachers/:id/evaluate-answer - Grade and evaluate student's answer
router.post('/:id/evaluate-answer', (req: Request, res: Response) => {
  const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
  const { question, studentAnswer } = req.body;

  if (!studentAnswer) {
    return res.status(400).json({
      success: false,
      message: 'Student answer is required for evaluation.',
    });
  }

  try {
    const evaluation = AITeachersService.evaluateStudentAnswer(id, question, studentAnswer);
    return res.status(200).json({
      success: true,
      data: evaluation,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to evaluate student answer.',
      error: err.message,
    });
  }
});

export default router;
