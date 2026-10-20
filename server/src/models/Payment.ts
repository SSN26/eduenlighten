import mongoose, { Document, Schema, Model } from 'mongoose';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentProvider = 'mock_paynow' | 'paynow' | 'stripe' | 'ecocash' | 'scholarship';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  transactionReference: string; // unique reference generated for provider
  providerReference?: string; // reference returned by provider
  amount: number;
  currency: 'USD' | 'ZWL';
  provider: PaymentProvider;
  status: PaymentStatus;
  paymentMethod: string; // e.g. 'EcoCash', 'OneMoney', 'Visa/Mastercard', 'Scholarship'
  receiptNumber: string;
  payerEmail: string;
  payerPhone?: string;
  notes?: string;
  isScholarship: boolean;
  scholarshipReason?: string;
  paidAt?: Date;
  rawWebhookPayload?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    transactionReference: { type: String, required: true, unique: true, index: true },
    providerReference: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'ZWL'], default: 'USD' },
    provider: {
      type: String,
      enum: ['mock_paynow', 'paynow', 'stripe', 'ecocash', 'scholarship'],
      default: 'mock_paynow',
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentMethod: { type: String, default: 'Online' },
    receiptNumber: { type: String, required: true, unique: true },
    payerEmail: { type: String, required: true },
    payerPhone: { type: String, default: '' },
    notes: { type: String, default: '' },
    isScholarship: { type: Boolean, default: false },
    scholarshipReason: { type: String, default: '' },
    paidAt: { type: Date },
    rawWebhookPayload: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
