import { User } from '../../models/User.js';
import { Course } from '../../models/Course.js';
import { Enrolment } from '../../models/Enrolment.js';
import { TeacherApplication } from '../../models/TeacherApplication.js';
import { Payment } from '../../models/Payment.js';
import { Submission } from '../../models/Submission.js';
import { LiveSession } from '../../models/LiveSession.js';
import { Certificate } from '../../models/Certificate.js';

export class AnalyticsService {
  static async getAdminMetrics() {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      pendingApplications,
      totalCourses,
      totalEnrolments,
      payments,
      totalCertificates,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      TeacherApplication.countDocuments({ status: { $in: ['submitted', 'under_review'] } }),
      Course.countDocuments({ isPublished: true }),
      Enrolment.countDocuments({ status: 'active' }),
      Payment.find({ status: 'paid' }),
      Certificate.countDocuments({ isRevoked: false }),
    ]);

    const totalRevenueUsd = payments
      .filter((p) => p.currency === 'USD')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalRevenueZwl = payments
      .filter((p) => p.currency === 'ZWL')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
      overview: {
        totalUsers,
        totalStudents,
        totalTeachers,
        pendingApplications,
        totalCourses,
        totalEnrolments,
        totalCertificates,
        totalRevenueUsd,
        totalRevenueZwl,
      },
      curriculaBreakdown: {
        cambridge: await Course.countDocuments({ isPublished: true, level: { $regex: 'Cambridge|IGCSE|AS|A Level', $options: 'i' } }),
        zimsec: await Course.countDocuments({ isPublished: true, level: { $regex: 'ZIMSEC|O-Level', $options: 'i' } }),
        digitalSkills: await Course.countDocuments({ isPublished: true, level: { $regex: 'Professional|Developer|Marketing', $options: 'i' } }),
      },
    };
  }

  static async getTeacherMetrics(teacherId: string) {
    const myCourses = await Course.find({ teacher: teacherId });
    const courseIds = myCourses.map((c) => c._id);

    const [totalEnrolments, pendingGrading, upcomingSessions] = await Promise.all([
      Enrolment.countDocuments({ course: { $in: courseIds } }),
      Submission.countDocuments({ course: { $in: courseIds }, status: 'submitted' }),
      LiveSession.countDocuments({
        teacher: teacherId,
        scheduledStartTime: { $gte: new Date() },
        status: 'scheduled',
      }),
    ]);

    return {
      coursesCount: myCourses.length,
      totalEnrolments,
      pendingGrading,
      upcomingSessions,
      courses: myCourses.map((c) => ({
        id: c._id,
        title: c.title,
        level: c.level,
        enrolledCount: c.enrolledStudentsCount,
        rating: c.rating,
        status: c.approvalStatus,
      })),
    };
  }

  static async getStudentMetrics(studentId: string) {
    const [enrolments, certificates, submissions] = await Promise.all([
      Enrolment.find({ student: studentId }).populate('course', 'title level thumbnail durationHours'),
      Certificate.find({ student: studentId, isRevoked: false }),
      Submission.find({ student: studentId }).populate('assignment', 'title maxPoints'),
    ]);

    const activeEnrolments = enrolments.filter((e) => e.status === 'active');
    const completedEnrolments = enrolments.filter((e) => e.status === 'completed');

    const averageProgress =
      enrolments.length > 0
        ? Math.round(enrolments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0) / enrolments.length)
        : 0;

    return {
      totalEnrolled: enrolments.length,
      activeCount: activeEnrolments.length,
      completedCount: completedEnrolments.length,
      certificatesCount: certificates.length,
      averageProgress,
      submissionsCount: submissions.length,
      enrolments,
    };
  }
}
