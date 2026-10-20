import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProgramme extends Document {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  bannerImage: string;
  isActive: boolean;
  order: number;
}

const ProgrammeSchema = new Schema<IProgramme>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    icon: { type: String, default: 'GraduationCap' },
    bannerImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Programme: Model<IProgramme> =
  mongoose.models.Programme || mongoose.model<IProgramme>('Programme', ProgrammeSchema);
