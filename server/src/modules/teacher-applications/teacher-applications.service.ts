import { TeacherApplication, ApplicationStatus } from '../../models/TeacherApplication.js';
import { User } from '../../models/User.js';
import { TeacherProfile } from '../../models/TeacherProfile.js';
import { AppError } from '../../middleware/errorHandler.js';

export class TeacherApplicationService {
  static async submitApplication(data: {
    applicantId: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    bio: string;
    qualificationsSummary: string;
    teachingExperienceYears: number;
    curriculaExpertise: string[];
    subjectsToTeach: string[];
    preferredFormat: 'live_classes' | 'recorded_courses' | 'blended';
    timeZone: string;
    cvUrl?: string;
    sampleLessonUrl?: string;
    safeguardingAgreed: boolean;
    termsAgreed: boolean;
  }) {
    if (!data.safeguardingAgreed || !data.termsAgreed) {
      throw new AppError('You must agree to the Teacher Safeguarding Policy and Terms.', 400);
    }

    const application = new TeacherApplication({
      applicant: data.applicantId,
      fullName: data.fullName,
      email: data.email.toLowerCase().trim(),
      phone: data.phone,
      country: data.country || 'Zimbabwe',
      city: data.city || 'Harare',
      bio: data.bio,
      qualificationsSummary: data.qualificationsSummary,
      teachingExperienceYears: data.teachingExperienceYears,
      curriculaExpertise: data.curriculaExpertise,
      subjectsToTeach: data.subjectsToTeach,
      preferredFormat: data.preferredFormat,
      timeZone: data.timeZone || 'Africa/Harare',
      cvUrl: data.cvUrl || '',
      sampleLessonUrl: data.sampleLessonUrl || '',
      safeguardingAgreed: true,
      termsAgreed: true,
      status: 'submitted',
      statusNotes: 'Application submitted and queued for academic administrative review.',
    });

    await application.save();
    return application;
  }

  static async getMyApplication(userId: string) {
    return TeacherApplication.findOne({ applicant: userId }).sort({ createdAt: -1 });
  }

  static async listApplications(filters: {
    status?: string;
    curriculum?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const query: any = {};
    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }
    if (filters.curriculum && filters.curriculum !== 'all') {
      query.curriculaExpertise = filters.curriculum;
    }
    if (filters.search) {
      query.$or = [
        { fullName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { subjectsToTeach: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 20);
    const skip = (page - 1) * limit;

    const [applications, total] = await Promise.all([
      TeacherApplication.find(query)
        .populate('applicant', 'name email role avatar')
        .populate('reviewedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      TeacherApplication.countDocuments(query),
    ]);

    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    adminNotes: string,
    reviewedById: string,
    interviewDate?: Date
  ) {
    const application = await TeacherApplication.findById(applicationId);
    if (!application) {
      throw new AppError('Teacher application not found', 404);
    }

    application.status = status;
    application.adminReviewNotes = adminNotes;
    application.reviewedBy = reviewedById as any;
    application.reviewedAt = new Date();
    if (interviewDate) {
      application.interviewDate = interviewDate;
    }

    await application.save();

    // If approved, elevate user role to 'teacher' and create/update TeacherProfile
    if (status === 'approved') {
      await User.findByIdAndUpdate(application.applicant, {
        role: 'teacher',
      });

      let profile = await TeacherProfile.findOne({ user: application.applicant });
      if (!profile) {
        profile = new TeacherProfile({
          user: application.applicant,
          headline: `Instructor in ${application.subjectsToTeach.join(', ')}`,
          bio: application.bio,
          teachingExperienceYears: application.teachingExperienceYears,
          curriculumSpecialties: application.curriculaExpertise,
          authorizedSubjects: application.subjectsToTeach,
          isApproved: true,
          safeguardingVetted: true,
          safeguardingVettedAt: new Date(),
          safeguardingVettedBy: reviewedById as any,
          qualifications: [
            {
              degree: application.qualificationsSummary,
              institution: 'Verified Credential',
            },
          ],
        });
      } else {
        profile.isApproved = true;
        profile.safeguardingVetted = true;
        profile.safeguardingVettedAt = new Date();
        profile.safeguardingVettedBy = reviewedById as any;
        profile.authorizedSubjects = Array.from(
          new Set([...profile.authorizedSubjects, ...application.subjectsToTeach])
        );
      }
      await profile.save();
    }

    return application;
  }
}
