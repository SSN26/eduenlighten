import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'student' | 'teacher' | 'parent' | 'academic_admin' | 'super_admin' | 'institution_admin';
export type UserStatus = 'active' | 'suspended' | 'pending_verification';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  country?: string;
  institution?: mongoose.Types.ObjectId;
  isIndependentTeacher?: boolean;
  isEmailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  status: UserStatus;
  preferences: {
    emailNotifications: boolean;
    classReminders: boolean;
    smsNotifications: boolean;
  };
  linkedStudents?: mongoose.Types.ObjectId[]; // For parents
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['student', 'teacher', 'parent', 'academic_admin', 'super_admin', 'institution_admin'],
      default: 'student',
      index: true,
    },
    institution: { type: Schema.Types.ObjectId, ref: 'Institution' },
    isIndependentTeacher: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
    country: { type: String, default: 'Zimbabwe' },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending_verification'],
      default: 'active',
      index: true,
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      classReminders: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
    },
    linkedStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
