import crypto from 'crypto';
import { LiveSession, ILiveSession } from '../../models/LiveSession.js';
import { Course } from '../../models/Course.js';
import { Enrolment } from '../../models/Enrolment.js';
import { AppError } from '../../middleware/errorHandler.js';

export class LiveClassesService {
  static async listSessions(userId: string, role: string) {
    if (role === 'teacher' || role === 'super_admin' || role === 'academic_admin') {
      const query = role === 'teacher' ? { teacher: userId } : {};
      return LiveSession.find(query)
        .populate('course', 'title level')
        .populate('teacher', 'name avatar')
        .sort({ scheduledStartTime: 1 });
    }

    // Student: find sessions for courses they are enrolled in
    const enrolments = await Enrolment.find({ student: userId, status: 'active' });
    const courseIds = enrolments.map((e) => e.course);

    return LiveSession.find({
      course: { $in: courseIds },
      scheduledEndTime: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .populate('course', 'title level')
      .populate('teacher', 'name avatar')
      .sort({ scheduledStartTime: 1 });
  }

  static async createSession(teacherId: string, data: {
    courseId: string;
    title: string;
    description?: string;
    scheduledStartTime: Date;
    scheduledEndTime: Date;
    meetingProvider?: 'jitsi' | 'zoom' | 'google_meet' | 'custom';
  }) {
    const course = await Course.findById(data.courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    const roomId = `edu-${course.slug.slice(0, 15)}-${crypto.randomBytes(3).toString('hex')}`;
    const provider = data.meetingProvider || 'jitsi';
    const joinUrl =
      provider === 'jitsi'
        ? `https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false&userInfo.displayName=EduEnlighten`
        : `https://meet.jit.si/${roomId}`;

    const session = new LiveSession({
      course: data.courseId,
      teacher: teacherId,
      title: data.title,
      description: data.description || '',
      scheduledStartTime: data.scheduledStartTime,
      scheduledEndTime: data.scheduledEndTime,
      meetingProvider: provider,
      roomId,
      joinUrl,
      status: 'scheduled',
    });

    await session.save();
    return session;
  }

  static async joinSession(sessionId: string, studentId: string) {
    const session = await LiveSession.findById(sessionId).populate('course');
    if (!session) {
      throw new AppError('Live session not found', 404);
    }

    // Verify student is enrolled in course
    const isEnrolled = await Enrolment.exists({ student: studentId, course: session.course });
    if (!isEnrolled) {
      throw new AppError('You must be enrolled in this course to join the live session.', 403);
    }

    // Record attendance if not already recorded
    const alreadyAttended = session.attendees.some((a) => a.student.toString() === studentId);
    if (!alreadyAttended) {
      session.attendees.push({
        student: studentId as any,
        joinedAt: new Date(),
      });
      await session.save();
    }

    return {
      sessionTitle: session.title,
      joinUrl: session.joinUrl,
      roomId: session.roomId,
      meetingProvider: session.meetingProvider,
      scheduledEndTime: session.scheduledEndTime,
    };
  }
}
