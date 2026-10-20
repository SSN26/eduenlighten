import mongoose, { Document, Schema, Model } from 'mongoose';

export type EnrolmentStatus = 'active' | 'completed' | 'expired' | 'cancelled';

export interface IEnrolment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  payment?: mongoose.Types.ObjectId;
  status: EnrolmentStatus;
  progressPercentage: number;
  completedLessons: mongoose.Types.ObjectId[];
  lastAccessedLesson?: mongoose.Types.ObjectId;
  lastAccessedAt: Date;
  completedAt?: Date;
  certificateIssued: boolean;
  certificateRef?: mongoose.Types.ObjectId;
  finalGrade?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EnrolmentSchema = new Schema<IEnrolment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired', 'cancelled'],
      default: 'active',
      index: true,
    },
    progressPercentage: { type: Number, default: 0 },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    lastAccessedLesson: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    lastAccessedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    certificateIssued: { type: Boolean, default: false },
    certificateRef: { type: Schema.Types.ObjectId, ref: 'Certificate' },
    finalGrade: { type: Number },
  },
  { timestamps: true }
);

EnrolmentSchema.index({ student: 1, course: 1 }, { unique: true });

export const Enrolment: Model<IEnrolment> =
  mongoose.models.Enrolment || mongoose.model<IEnrolment>('Enrolment', EnrolmentSchema);
