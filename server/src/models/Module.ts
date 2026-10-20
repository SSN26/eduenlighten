import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IModule extends Document {
  course: mongoose.Types.ObjectId;
  title: string;
  description: string;
  order: number;
  learningObjectives: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModule>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    order: { type: Number, required: true, default: 0 },
    learningObjectives: [{ type: String }],
  },
  { timestamps: true }
);

export const Module: Model<IModule> =
  mongoose.models.Module || mongoose.model<IModule>('Module', ModuleSchema);
