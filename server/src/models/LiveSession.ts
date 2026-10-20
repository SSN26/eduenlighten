import mongoose, { Document, Schema, Model } from 'mongoose';

export type LiveSessionStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

export interface ILiveSession extends Document {
  course: mongoose.Types.ObjectId;
  teacher: mongoose.Types.ObjectId;
  title: string;
  description: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  meetingProvider: 'jitsi' | 'zoom' | 'google_meet' | 'custom';
  roomId: string;
  joinUrl: string;
  passcode?: string;
  recordingUrl?: string;
  status: LiveSessionStatus;
  attendees: {
    student: mongoose.Types.ObjectId;
    joinedAt: Date;
    leftAt?: Date;
    durationMinutes?: number;
  }[];
  notesAndResources: string;
  createdAt: Date;
  updatedAt: Date;
}

const LiveSessionSchema = new Schema<ILiveSession>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    scheduledStartTime: { type: Date, required: true, index: true },
    scheduledEndTime: { type: Date, required: true },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    meetingProvider: {
      type: String,
      enum: ['jitsi', 'zoom', 'google_meet', 'custom'],
      default: 'jitsi',
    },
    roomId: { type: String, required: true },
    joinUrl: { type: String, required: true },
    passcode: { type: String, default: '' },
    recordingUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
    attendees: [
      {
        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        joinedAt: { type: Date, default: Date.now },
        leftAt: { type: Date },
        durationMinutes: { type: Number, default: 0 },
      },
    ],
    notesAndResources: { type: String, default: '' },
  },
  { timestamps: true }
);

export const LiveSession: Model<ILiveSession> =
  mongoose.models.LiveSession || mongoose.model<ILiveSession>('LiveSession', LiveSessionSchema);
