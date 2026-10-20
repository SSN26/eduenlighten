import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICurriculum extends Document {
  programme: mongoose.Types.ObjectId;
  name: string;
  code: string; // 'cambridge', 'zimsec', 'digital_skills'
  slug: string;
  tagline: string;
  description: string;
  stages: {
    name: string; // e.g. 'Cambridge IGCSE', 'Cambridge A Level', 'ZIMSEC Ordinary Level'
    code: string;
    description: string;
    targetAgeGroup?: string;
  }[];
  officialExamDisclaimer: string;
  badgeText: string;
  colorScheme: {
    primary: string;
    secondary: string;
  };
  isActive: boolean;
  order: number;
}

const CurriculumSchema = new Schema<ICurriculum>(
  {
    programme: { type: Schema.Types.ObjectId, ref: 'Programme', required: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, lowercase: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    stages: [
      {
        name: { type: String, required: true },
        code: { type: String, required: true },
        description: { type: String, default: '' },
        targetAgeGroup: { type: String, default: '' },
      },
    ],
    officialExamDisclaimer: {
      type: String,
      default:
        'EduEnlighten is an independent digital school offering syllabus-aligned preparation and structured instruction. We are not an official examination board or examination centre.',
    },
    badgeText: { type: String, default: 'Curriculum' },
    colorScheme: {
      primary: { type: String, default: '#0284c7' },
      secondary: { type: String, default: '#0369a1' },
    },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Curriculum: Model<ICurriculum> =
  mongoose.models.Curriculum || mongoose.model<ICurriculum>('Curriculum', CurriculumSchema);
