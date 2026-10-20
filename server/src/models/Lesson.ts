import mongoose, { Document, Schema, Model } from 'mongoose';

export type LessonType = 'video' | 'live' | 'reading' | 'quiz' | 'assignment';

export interface ILesson extends Document {
  course: mongoose.Types.ObjectId;
  module: mongoose.Types.ObjectId;
  title: string;
  order: number;
  type: LessonType;
  durationMinutes: number;
  content: string; // Markdown or rich text notes
  videoUrl?: string;
  isFreePreview: boolean;
  downloadableResources: {
    title: string;
    fileUrl: string;
    fileSizeMb?: number;
    fileType?: string;
  }[];
  assignmentRef?: mongoose.Types.ObjectId;
  quizRef?: mongoose.Types.ObjectId;
  liveSessionRef?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true, default: 0 },
    type: {
      type: String,
      enum: ['video', 'live', 'reading', 'quiz', 'assignment'],
      default: 'video',
      index: true,
    },
    durationMinutes: { type: Number, default: 20 },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    isFreePreview: { type: Boolean, default: false },
    downloadableResources: [
      {
        title: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileSizeMb: { type: Number },
        fileType: { type: String },
      },
    ],
    assignmentRef: { type: Schema.Types.ObjectId, ref: 'Assignment' },
    quizRef: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    liveSessionRef: { type: Schema.Types.ObjectId, ref: 'LiveSession' },
  },
  { timestamps: true }
);

export const Lesson: Model<ILesson> =
  mongoose.models.Lesson || mongoose.model<ILesson>('Lesson', LessonSchema);
