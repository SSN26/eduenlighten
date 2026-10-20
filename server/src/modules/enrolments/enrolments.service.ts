import { Enrolment } from '../../models/Enrolment.js';
import { Course } from '../../models/Course.js';
import { Lesson } from '../../models/Lesson.js';
import { Module } from '../../models/Module.js';
import { CertificateService } from '../certificates/certificates.service.js';
import { AppError } from '../../middleware/errorHandler.js';

export class EnrolmentService {
  static async enrolInCourse(studentId: string, courseId: string, paymentId?: string) {
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      throw new AppError('Course is not available for enrolment.', 404);
    }

    if (course.pricingType === 'paid' && !paymentId) {
      throw new AppError('This course requires payment before enrolment.', 402);
    }

    let enrolment = await Enrolment.findOne({ student: studentId, course: courseId });
    if (enrolment) {
      if (enrolment.status === 'active') {
        return enrolment;
      }
      enrolment.status = 'active';
      if (paymentId) enrolment.payment = paymentId as any;
      await enrolment.save();
      return enrolment;
    }

    enrolment = new Enrolment({
      student: studentId,
      course: courseId,
      payment: paymentId || undefined,
      status: 'active',
      progressPercentage: 0,
      completedLessons: [],
    });

    await enrolment.save();

    // Increment enrolled student count on course
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledStudentsCount: 1 } });

    return enrolment;
  }

  static async getStudentEnrolments(studentId: string) {
    return Enrolment.find({ student: studentId, status: { $ne: 'cancelled' } })
      .populate({
        path: 'course',
        populate: [
          { path: 'curriculum', select: 'name code' },
          { path: 'subject', select: 'name code' },
          { path: 'teacher', select: 'name avatar' },
        ],
      })
      .populate('certificateRef')
      .sort({ updatedAt: -1 });
  }

  static async markLessonCompleted(studentId: string, courseId: string, lessonId: string) {
    const enrolment = await Enrolment.findOne({ student: studentId, course: courseId });
    if (!enrolment) {
      throw new AppError('You are not enrolled in this course.', 403);
    }

    // Add lesson to completedLessons if not already present
    const lessonIdStr = lessonId.toString();
    const alreadyCompleted = enrolment.completedLessons.some((id) => id.toString() === lessonIdStr);
    if (!alreadyCompleted) {
      enrolment.completedLessons.push(lessonId as any);
    }

    enrolment.lastAccessedLesson = lessonId as any;
    enrolment.lastAccessedAt = new Date();

    // Calculate total lessons in course
    const modules = await Module.find({ course: courseId });
    const moduleIds = modules.map((m) => m._id);
    const totalLessons = await Lesson.countDocuments({ module: { $in: moduleIds } });

    if (totalLessons > 0) {
      const percentage = Math.min(100, Math.round((enrolment.completedLessons.length / totalLessons) * 100));
      enrolment.progressPercentage = percentage;

      if (percentage >= 100 && enrolment.status !== 'completed') {
        enrolment.status = 'completed';
        enrolment.completedAt = new Date();

        // Automatically issue certificate if eligible
        const course = await Course.findById(courseId);
        if (course && course.certificateEligible && !enrolment.certificateIssued) {
          const cert = await CertificateService.issueCertificate(studentId, courseId);
          enrolment.certificateIssued = true;
          enrolment.certificateRef = cert._id as any;
        }
      }
    }

    await enrolment.save();
    return enrolment;
  }
}
