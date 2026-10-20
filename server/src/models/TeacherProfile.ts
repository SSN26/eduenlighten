import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITeacherProfile extends Document {
  user: mongoose.Types.ObjectId;
  headline: string;
  bio: string;
  qualifications: {
    degree: string;
    institution: string;
    yearCompleted?: number;
    certificateUrl?: string;
  }[];
  teachingExperienceYears: number;
  curriculumSpecialties: string[];
  authorizedSubjects: string[];
  isApproved: boolean;
  isIndependentTeacher: boolean;
  institution?: mongoose.Types.ObjectId;
  sessionBookingPriceUsd: number;
  languages: string[];
  introVideoUrl?: string;
  safeguardingVetted: boolean;
  safeguardingVettedAt?: Date;
  safeguardingVettedBy?: mongoose.Types.ObjectId;
  hourlyRateUsd: number;
  totalStudentsTaught: number;
  rating: number;
  reviewsCount: number;
  availabilitySchedule: {
    dayOfWeek: string;
    slots: string[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const TeacherProfileSchema = new Schema<ITeacherProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    headline: { type: String, default: 'Educator & Subject Specialist' },
    bio: { type: String, default: '' },
    isIndependentTeacher: { type: Boolean, default: true, index: true },
    institution: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    sessionBookingPriceUsd: { type: Number, default: 20 },
    languages: [{ type: String, default: 'English' }],
    introVideoUrl: { type: String, default: '' },
    qualifications: [
      {
        degree: { type: String, required: true },
        institution: { type: String, required: true },
        yearCompleted: { type: Number },
        certificateUrl: { type: String, default: '' },
      },
    ],
    teachingExperienceYears: { type: Number, default: 0 },
    curriculumSpecialties: [{ type: String }],
    authorizedSubjects: [{ type: String }],
    isApproved: { type: Boolean, default: false, index: true },
    safeguardingVetted: { type: Boolean, default: false, index: true },
    safeguardingVettedAt: { type: Date },
    safeguardingVettedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    hourlyRateUsd: { type: Number, default: 0 },
    totalStudentsTaught: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    availabilitySchedule: [
      {
        dayOfWeek: { type: String },
        slots: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

export const TeacherProfile: Model<ITeacherProfile> =
  mongoose.models.TeacherProfile || mongoose.model<ITeacherProfile>('TeacherProfile', TeacherProfileSchema);
