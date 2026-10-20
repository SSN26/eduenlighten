import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IStudentProfile extends Document {
  user: mongoose.Types.ObjectId;
  curriculum: 'cambridge' | 'zimsec' | 'digital_skills' | 'both';
  currentLevel: string;
  learningGoals: string[];
  dateOfBirth?: Date;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  parentConsentApproved?: boolean;
  schoolName?: string;
  city?: string;
  country?: string;
  completedLessonsCount: number;
  assignmentsSubmittedCount: number;
  averageGradePercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    curriculum: {
      type: String,
      enum: ['cambridge', 'zimsec', 'digital_skills', 'both'],
      default: 'both',
    },
    currentLevel: { type: String, default: 'IGCSE / O-Level' },
    learningGoals: [{ type: String }],
    dateOfBirth: { type: Date },
    guardianName: { type: String, default: '' },
    guardianEmail: { type: String, default: '' },
    guardianPhone: { type: String, default: '' },
    parentConsentApproved: { type: Boolean, default: false },
    schoolName: { type: String, default: '' },
    city: { type: String, default: 'Harare' },
    country: { type: String, default: 'Zimbabwe' },
    completedLessonsCount: { type: Number, default: 0 },
    assignmentsSubmittedCount: { type: Number, default: 0 },
    averageGradePercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const StudentProfile: Model<IStudentProfile> =
  mongoose.models.StudentProfile || mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);
