import mongoose, { Document, Schema, Model } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type BookingPaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface ITeacherBooking extends Document {
  student: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  subject: string;
  curriculum: string; // 'cambridge' | 'zimsec' | 'digital_skills' | 'vocational'
  scheduledDate: string;
  timeSlot: string;
  durationMinutes: number;
  learningGoals: string;
  status: BookingStatus;
  meetingUrl: string;
  roomId: string;
  priceUsd: number;
  paymentStatus: BookingPaymentStatus;
  teacherNotes?: string;
  studentFeedbackRating?: number;
  studentReview?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherBookingSchema = new Schema<ITeacherBooking>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subject: { type: String, required: true },
    curriculum: { type: String, default: 'cambridge' },
    scheduledDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    durationMinutes: { type: Number, default: 60 },
    learningGoals: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    meetingUrl: { type: String, required: true },
    roomId: { type: String, required: true },
    priceUsd: { type: Number, default: 20 },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'paid',
    },
    teacherNotes: { type: String, default: '' },
    studentFeedbackRating: { type: Number },
    studentReview: { type: String },
  },
  { timestamps: true }
);

export const TeacherBooking: Model<ITeacherBooking> =
  mongoose.models.TeacherBooking || mongoose.model<ITeacherBooking>('TeacherBooking', TeacherBookingSchema);
