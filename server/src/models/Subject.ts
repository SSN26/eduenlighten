import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISubject extends Document {
  curriculum: mongoose.Types.ObjectId;
  programme: mongoose.Types.ObjectId;
  name: string;
  code: string;
  slug: string;
  category: 'Sciences' | 'Commercials' | 'Humanities' | 'Languages' | 'Technology' | 'Professional Skills';
  level: string; // e.g. 'IGCSE', 'A Level', 'O Level', 'Professional'
  syllabusCode?: string; // e.g. '0580' for Cambridge Math, '4004' for ZIMSEC Math
  description: string;
  keyTopics: string[];
  icon: string;
  isActive: boolean;
  order: number;
}

const SubjectSchema = new Schema<ISubject>(
  {
    curriculum: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: true, index: true },
    programme: { type: Schema.Types.ObjectId, ref: 'Programme', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Sciences', 'Commercials', 'Humanities', 'Languages', 'Technology', 'Professional Skills'],
      default: 'Sciences',
    },
    level: { type: String, required: true, default: 'IGCSE' },
    syllabusCode: { type: String, default: '' },
    description: { type: String, default: '' },
    keyTopics: [{ type: String }],
    icon: { type: String, default: 'BookOpen' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SubjectSchema.index({ curriculum: 1, slug: 1 }, { unique: true });

export const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);
