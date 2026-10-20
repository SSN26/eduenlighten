import mongoose, { Document, Schema, Model } from 'mongoose';

export type SubmissionStatus = 'submitted' | 'graded' | 'resubmission_required';

export interface ISubmission extends Document {
  assignment: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  content: string; // text, repository url, live site link, or comments
  fileUrl?: string;
  fileName?: string;
  fileSizeMb?: number;
  status: SubmissionStatus;
  score?: number; // 0 to maxPoints
  feedback?: string;
  gradedBy?: mongoose.Types.ObjectId;
  gradedAt?: Date;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, default: '' },
    fileUrl: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileSizeMb: { type: Number },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'resubmission_required'],
      default: 'submitted',
      index: true,
    },
    score: { type: Number },
    feedback: { type: String, default: '' },
    gradedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    gradedAt: { type: Date },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
