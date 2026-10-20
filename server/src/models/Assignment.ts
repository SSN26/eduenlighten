import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAssignment extends Document {
  course: mongoose.Types.ObjectId;
  module: mongoose.Types.ObjectId;
  title: string;
  instructions: string;
  rubricSummary: string;
  maxPoints: number;
  weightPercentage: number;
  dueDate: Date;
  allowedFileTypes: string[];
  maxFileSizeMb: number;
  practicalProjectType?: 'web_development' | 'marketing_campaign' | 'product_backlog' | 'exam_past_paper' | 'essay';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    title: { type: String, required: true, trim: true },
    instructions: { type: String, required: true },
    rubricSummary: { type: String, default: '' },
    maxPoints: { type: Number, default: 100 },
    weightPercentage: { type: Number, default: 20 },
    dueDate: { type: Date, required: true },
    allowedFileTypes: [{ type: String, default: 'pdf' }],
    maxFileSizeMb: { type: Number, default: 10 },
    practicalProjectType: {
      type: String,
      enum: ['web_development', 'marketing_campaign', 'product_backlog', 'exam_past_paper', 'essay'],
    },
  },
  { timestamps: true }
);

export const Assignment: Model<IAssignment> =
  mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
