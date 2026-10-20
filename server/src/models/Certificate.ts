import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICertificate extends Document {
  certificateNumber: string; // e.g. 'EDU-2026-789012'
  student: mongoose.Types.ObjectId;
  studentName: string;
  course: mongoose.Types.ObjectId;
  courseTitle: string;
  curriculumName: string;
  programmeName: string;
  gradePercentage?: number;
  issueDate: Date;
  verificationHash: string;
  isRevoked: boolean;
  revocationReason?: string;
  issuingOrganization: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    studentName: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    courseTitle: { type: String, required: true },
    curriculumName: { type: String, required: true },
    programmeName: { type: String, required: true },
    gradePercentage: { type: Number },
    issueDate: { type: Date, default: Date.now },
    verificationHash: { type: String, required: true, unique: true },
    isRevoked: { type: Boolean, default: false },
    revocationReason: { type: String, default: '' },
    issuingOrganization: { type: String, default: 'EduEnlighten Digital School' },
  },
  { timestamps: true }
);

export const Certificate: Model<ICertificate> =
  mongoose.models.Certificate || mongoose.model<ICertificate>('Certificate', CertificateSchema);
