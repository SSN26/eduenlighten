import mongoose, { Document, Schema, Model } from 'mongoose';

export type DeliveryFormat = 'self_paced' | 'scheduled_live' | 'blended';
export type CourseApprovalStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface ICourse extends Document {
  title: string;
  slug: string;
  tagline: string;
  description: string;
  shortDescription: string;
  programme: mongoose.Types.ObjectId;
  curriculum: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  level: string; // e.g. 'Cambridge IGCSE', 'ZIMSEC O-Level', 'Advanced Professional'
  deliveryFormat: DeliveryFormat;
  prerequisites: string[];
  learningOutcomes: string[];
  thumbnail: string;
  pricingType: 'free' | 'paid';
  priceUsd: number;
  discountPriceUsd?: number;
  priceZwl?: number;
  isPublished: boolean;
  approvalStatus: CourseApprovalStatus;
  rejectionReason?: string;
  enrolledStudentsCount: number;
  rating: number;
  reviewsCount: number;
  durationHours: number;
  certificateEligible: boolean;
  featured: boolean;
  scope: 'marketplace' | 'institutional';
  institution?: mongoose.Types.ObjectId;
  syllabusCoveredSummary: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    programme: { type: Schema.Types.ObjectId, ref: 'Programme', required: true, index: true },
    curriculum: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: true, index: true },
    subject: { type: Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    level: { type: String, required: true },
    deliveryFormat: {
      type: String,
      enum: ['self_paced', 'scheduled_live', 'blended'],
      default: 'blended',
      index: true,
    },
    prerequisites: [{ type: String }],
    learningOutcomes: [{ type: String, required: true }],
    thumbnail: { type: String, default: '' },
    pricingType: { type: String, enum: ['free', 'paid'], default: 'paid', index: true },
    priceUsd: { type: Number, default: 0 },
    discountPriceUsd: { type: Number },
    priceZwl: { type: Number },
    isPublished: { type: Boolean, default: false, index: true },
    approvalStatus: {
      type: String,
      enum: ['draft', 'submitted', 'approved', 'rejected'],
      default: 'draft',
      index: true,
    },
    rejectionReason: { type: String, default: '' },
    enrolledStudentsCount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 0 },
    durationHours: { type: Number, default: 20 },
    certificateEligible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false, index: true },
    scope: { type: String, enum: ['marketplace', 'institutional'], default: 'marketplace', index: true },
    institution: { type: Schema.Types.ObjectId, ref: 'Institution', index: true },
    syllabusCoveredSummary: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
