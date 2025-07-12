import mongoose, { Document, Schema } from 'mongoose';

export interface ISwapRequest extends Document {
  requester: mongoose.Types.ObjectId;
  provider: mongoose.Types.ObjectId;
  skillRequested: string;
  skillOffered: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  scheduledDate?: Date;
  completedDate?: Date;
  meeting?: mongoose.Types.ObjectId; // Reference to Meeting
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new Schema<ISwapRequest>({
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
  skillRequested: {
    type: String,
    required: [true, 'Skill requested is required'],
    trim: true,
    lowercase: true
  },
  skillOffered: {
    type: String,
    required: [true, 'Skill offered is required'],
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date
  },
  completedDate: {
    type: Date
  },
  meeting: {
    type: Schema.Types.ObjectId,
    ref: 'Meeting'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ provider: 1, status: 1 });
swapRequestSchema.index({ status: 1 });
swapRequestSchema.index({ createdAt: -1 });

// Prevent duplicate pending requests
swapRequestSchema.index(
  { requester: 1, provider: 1, skillRequested: 1, skillOffered: 1, status: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: 'pending' }
  }
);

export default mongoose.model<ISwapRequest>('SwapRequest', swapRequestSchema);
