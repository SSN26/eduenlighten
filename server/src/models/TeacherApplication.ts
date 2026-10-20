import mongoose, { Document, Schema, Model } from 'mongoose';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'approved'
  | 'rejected'
  | 'more_info_required';

export interface ITeacherApplication extends Document {
  applicant: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  bio: string;
  qualificationsSummary: string;
  teachingExperienceYears: number;
  curriculaExpertise: string[]; // Cambridge, ZIMSEC, Digital Skills
  subjectsToTeach: string[];
  preferredFormat: 'live_classes' | 'recorded_courses' | 'blended';
  timeZone: string;
  cvUrl: string;
  sampleLessonUrl?: string;
  nationalIdOrPassportUrl?: string;
  policeClearanceUrl?: string;
  safeguardingAgreed: boolean;
  termsAgreed: boolean;
  status: ApplicationStatus;
  statusNotes: string;
  adminReviewNotes: string;
  interviewDate?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherApplicationSchema = new Schema<ITeacherApplication>(
  {
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    country: { type: String, default: 'Zimbabwe' },
    city: { type: String, default: 'Harare' },
    bio: { type: String, required: true },
    qualificationsSummary: { type: String, required: true },
    teachingExperienceYears: { type: Number, required: true, default: 0 },
    curriculaExpertise: [{ type: String }],
    subjectsToTeach: [{ type: String, required: true }],
    preferredFormat: {
      type: String,
      enum: ['live_classes', 'recorded_courses', 'blended'],
      default: 'blended',
    },
    timeZone: { type: String, default: 'Africa/Harare' },
    cvUrl: { type: String, default: '' },
    sampleLessonUrl: { type: String, default: '' },
    nationalIdOrPassportUrl: { type: String, default: '' },
    policeClearanceUrl: { type: String, default: '' },
    safeguardingAgreed: { type: Boolean, required: true, default: false },
    termsAgreed: { type: Boolean, required: true, default: false },
    status: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'under_review',
        'shortlisted',
        'interview_scheduled',
        'approved',
        'rejected',
        'more_info_required',
      ],
      default: 'submitted',
      index: true,
    },
    statusNotes: { type: String, default: '' },
    adminReviewNotes: { type: String, default: '' },
    interviewDate: { type: Date },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const TeacherApplication: Model<ITeacherApplication> =
  mongoose.models.TeacherApplication ||
  mongoose.model<ITeacherApplication>('TeacherApplication', TeacherApplicationSchema);
