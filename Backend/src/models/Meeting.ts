import mongoose, { Document, Schema } from 'mongoose';

export interface IMeeting extends Document {
  swapRequest: mongoose.Types.ObjectId;
  requester: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  meetingLink: string;
  meetingId: string;
  scheduledDate: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no-show';
  skillRequested: string;
  skillOffered: string;
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new Schema<IMeeting>({
  swapRequest: {
    type: Schema.Types.ObjectId,
    ref: 'SwapRequest',
    required: [true, 'Swap request reference is required']
  },
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester is required']
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Provider is required']
  },
  meetingLink: {
    type: String,
    required: [true, 'Meeting link is required']
  },
  meetingId: {
    type: String,
    required: [true, 'Meeting ID is required'],
    unique: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 60, // 1 hour default
    min: [15, 'Duration must be at least 15 minutes'],
    max: [180, 'Duration cannot exceed 180 minutes']
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },
  skillRequested: {
    type: String,
    required: true,
    trim: true
  },
  skillOffered: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
meetingSchema.index({ requester: 1, scheduledDate: 1 });
meetingSchema.index({ provider: 1, scheduledDate: 1 });
meetingSchema.index({ status: 1, scheduledDate: 1 });
meetingSchema.index({ swapRequest: 1 });

export default mongoose.model<IMeeting>('Meeting', meetingSchema);
