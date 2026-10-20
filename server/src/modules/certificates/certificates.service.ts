import crypto from 'crypto';
import { Certificate, ICertificate } from '../../models/Certificate.js';
import { Course } from '../../models/Course.js';
import { User } from '../../models/User.js';
import { AppError } from '../../middleware/errorHandler.js';

export class CertificateService {
  static async issueCertificate(studentId: string, courseId: string, gradePercentage?: number): Promise<ICertificate> {
    const [student, course] = await Promise.all([
      User.findById(studentId),
      Course.findById(courseId).populate('curriculum').populate('programme'),
    ]);

    if (!student || !course) {
      throw new AppError('Student or Course record not found', 404);
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({ student: studentId, course: courseId });
    if (existing) {
      return existing;
    }

    // Generate unique verifiable certificate number
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const certificateNumber = `EDU-${year}-${randomHex}`;

    // Generate SHA-256 tamper-proof verification hash
    const rawData = `${certificateNumber}:${student.name}:${course.title}:${Date.now()}`;
    const verificationHash = crypto.createHash('sha256').update(rawData).digest('hex');

    const certificate = new Certificate({
      certificateNumber,
      student: student._id,
      studentName: student.name,
      course: course._id,
      courseTitle: course.title,
      curriculumName: (course.curriculum as any)?.name || 'EduEnlighten Curriculum',
      programmeName: (course.programme as any)?.name || 'Digital School Academy',
      gradePercentage: gradePercentage || 100,
      issueDate: new Date(),
      verificationHash,
      isRevoked: false,
    });

    await certificate.save();
    return certificate;
  }

  static async getStudentCertificates(studentId: string) {
    return Certificate.find({ student: studentId, isRevoked: false }).sort({ issueDate: -1 });
  }

  static async verifyCertificate(certificateNumber: string) {
    const cert = await Certificate.findOne({
      certificateNumber: certificateNumber.trim().toUpperCase(),
    });

    if (!cert) {
      return {
        isValid: false,
        message: 'No certificate found with this verification number.',
      };
    }

    if (cert.isRevoked) {
      return {
        isValid: false,
        isRevoked: true,
        message: 'This certificate has been revoked by platform administration.',
        revocationReason: cert.revocationReason,
      };
    }

    // Return safe public metadata (does not expose private personal identifiable data)
    return {
      isValid: true,
      certificateNumber: cert.certificateNumber,
      studentName: cert.studentName,
      courseTitle: cert.courseTitle,
      curriculumName: cert.curriculumName,
      programmeName: cert.programmeName,
      issueDate: cert.issueDate,
      issuingOrganization: cert.issuingOrganization,
      verificationHash: cert.verificationHash,
    };
  }
}
