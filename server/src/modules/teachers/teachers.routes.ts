import { Router, Request, Response } from 'express';
import { store } from '../../services/store.service.js';
import { TeacherProfile } from '../../models/TeacherProfile.js';
import { User } from '../../models/User.js';
import { AuthService } from '../auth/auth.service.js';

const router = Router();

// GET /api/teachers - List independent teachers with search and filters
router.get('/', async (req: Request, res: Response) => {
  const { curriculum, subject, maxRate, search } = req.query;

  const teachers = store.getAllIndependentTeachers({
    curriculum: curriculum as string,
    subject: subject as string,
    maxRate: maxRate ? Number(maxRate) : undefined,
    search: search as string,
  });

  return res.status(200).json({
    success: true,
    count: teachers.length,
    data: teachers,
  });
});

// GET /api/teachers/:id - Get independent teacher profile
router.get('/:id', async (req: Request, res: Response) => {
  const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;

  const teacher = store.getIndependentTeacherById(id);
  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Independent teacher profile not found.',
    });
  }

  return res.status(200).json({
    success: true,
    data: teacher,
  });
});

// POST /api/teachers/register - Create independent teacher profile & onboarding
router.post('/register', async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    avatar,
    headline,
    bio,
    qualifications,
    teachingExperienceYears,
    curriculumSpecialties,
    authorizedSubjects,
    hourlyRateUsd,
    sessionBookingPriceUsd,
    languages,
    availabilitySchedule,
    introVideoUrl,
  } = req.body;

  if (!name || !email || !headline || !bio) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, headline, and bio are required to register as a teacher.',
    });
  }

  // Also create/link a login account for the teacher
  let authUser: any = null;
  let authToken: string | null = null;
  try {
    const authResult = await AuthService.register({
      name,
      email,
      password: password || 'TeacherPass123!',
      role: 'teacher',
    });
    authUser = authResult.user;
    authToken = authResult.token;
  } catch (err: any) {
    console.log('Teacher user creation notice:', err.message);
  }

  const newTeacher = store.registerIndependentTeacher({
    name,
    email,
    avatar:
      avatar ||
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    headline,
    bio,
    qualifications: Array.isArray(qualifications)
      ? qualifications
      : [
          {
            degree: 'Degree in Education / Subject Field',
            institution: 'Accredited University',
            yearCompleted: 2018,
          },
        ],
    teachingExperienceYears: Number(teachingExperienceYears) || 3,
    curriculumSpecialties: Array.isArray(curriculumSpecialties)
      ? curriculumSpecialties
      : ['Cambridge International'],
    authorizedSubjects: Array.isArray(authorizedSubjects)
      ? authorizedSubjects
      : ['General Subject Instruction'],
    hourlyRateUsd: Number(hourlyRateUsd) || 20,
    sessionBookingPriceUsd: Number(sessionBookingPriceUsd) || Number(hourlyRateUsd) || 20,
    languages: Array.isArray(languages) ? languages : ['English'],
    availabilitySchedule,
    introVideoUrl,
  });

  return res.status(201).json({
    success: true,
    message: 'Teacher profile registered successfully. You are now live and visible on Start Learning.',
    data: newTeacher,
    user: authUser,
    token: authToken,
  });
});

// POST /api/teachers/:id/book - Connect student with teacher for 1-on-1 private lesson
router.post('/:id/book', async (req: Request, res: Response) => {
  const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
  const {
    studentId,
    studentName,
    studentEmail,
    subject,
    curriculum,
    scheduledDate,
    timeSlot,
    learningGoals,
    priceUsd,
  } = req.body;

  const teacher = store.getIndependentTeacherById(id);
  if (!teacher) {
    return res.status(404).json({
      success: false,
      message: 'Teacher not found.',
    });
  }

  if (!studentName || !studentEmail || !scheduledDate || !timeSlot || !learningGoals) {
    return res.status(400).json({
      success: false,
      message: 'Student name, email, scheduled date, time slot, and learning goals are required.',
    });
  }

  const booking = store.createTeacherBooking({
    studentId,
    studentName,
    studentEmail,
    teacherId: teacher._id,
    subject: subject || teacher.authorizedSubjects[0] || '1-on-1 Private Tuition',
    curriculum: curriculum || teacher.curriculumSpecialties[0] || 'General',
    scheduledDate,
    timeSlot,
    learningGoals,
    priceUsd: priceUsd || teacher.sessionBookingPriceUsd || 20,
  });

  return res.status(201).json({
    success: true,
    message: `1-on-1 tuition session booked successfully with ${teacher.name}! Live virtual classroom room created.`,
    data: booking,
  });
});

// GET /api/teachers/:id/bookings - List booked sessions for teacher
router.get('/:id/bookings', (req: Request, res: Response) => {
  const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
  const bookings = store.getTeacherBookings(id);

  return res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

export default router;
