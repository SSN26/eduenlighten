import mongoose, { Document, Schema, Model } from 'mongoose';

export type InstitutionType = 'high_school' | 'vocational_institution';
export type SubscriptionPlan = 'starter' | 'standard' | 'enterprise';
export type SubscriptionStatus = 'active' | 'trial' | 'past_due' | 'cancelled';

export interface IInstitution extends Document {
  name: string;
  slug: string; // e.g. 'st-georges-college', 'harare-polytechnic'
  type: InstitutionType;
  tagline: string;
  description: string;
  adminUser?: mongoose.Types.ObjectId;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  country: string;
  branding: {
    logoUrl?: string;
    bannerUrl?: string;
    primaryColor: string; // e.g. '#1e3e62'
    secondaryColor: string; // e.g. '#0e7490'
    accentColor: string; // e.g. '#f59e0b'
  };
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    billingCycle: 'per_term' | 'annual' | 'monthly';
    termPriceUsd: number;
    maxStudents: number;
    maxTeachers: number;
    startDate: Date;
    renewalDate: Date;
  };
  curriculaSupported: ('cambridge' | 'zimsec' | 'digital_skills' | 'vocational_trades')[];
  enrolledStudentsCount: number;
  assignedTeachersCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    type: {
      type: String,
      enum: ['high_school', 'vocational_institution'],
      required: true,
      index: true,
    },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    adminUser: { type: Schema.Types.ObjectId, ref: 'User' },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: 'Harare' },
    country: { type: String, default: 'Zimbabwe' },
    branding: {
      logoUrl: { type: String, default: '' },
      bannerUrl: { type: String, default: '' },
      primaryColor: { type: String, default: '#1e3e62' },
      secondaryColor: { type: String, default: '#0e7490' },
      accentColor: { type: String, default: '#f59e0b' },
    },
    subscription: {
      plan: {
        type: String,
        enum: ['starter', 'standard', 'enterprise'],
        default: 'standard',
      },
      status: {
        type: String,
        enum: ['active', 'trial', 'past_due', 'cancelled'],
        default: 'active',
      },
      billingCycle: {
        type: String,
        enum: ['per_term', 'annual', 'monthly'],
        default: 'per_term',
      },
      termPriceUsd: { type: Number, default: 450 },
      maxStudents: { type: Number, default: 300 },
      maxTeachers: { type: Number, default: 25 },
      startDate: { type: Date, default: Date.now },
      renewalDate: {
        type: Date,
        default: () => new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 4 months (1 academic term)
      },
    },
    curriculaSupported: [
      {
        type: String,
        enum: ['cambridge', 'zimsec', 'digital_skills', 'vocational_trades'],
      },
    ],
    enrolledStudentsCount: { type: Number, default: 0 },
    assignedTeachersCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Institution: Model<IInstitution> =
  mongoose.models.Institution || mongoose.model<IInstitution>('Institution', InstitutionSchema);
