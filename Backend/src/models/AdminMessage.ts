import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminMessage extends Document {
  title: string;
  content: string;
  type: 'update' | 'alert' | 'maintenance' | 'announcement';
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const adminMessageSchema = new Schema<IAdminMessage>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    maxlength: [1000, 'Content cannot exceed 1000 characters']
  },
  type: {
    type: String,
    enum: ['update', 'alert', 'maintenance', 'announcement'],
    required: [true, 'Message type is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  }
}, {
  timestamps: true
});

// Indexes
adminMessageSchema.index({ isActive: 1, createdAt: -1 });
adminMessageSchema.index({ type: 1 });

export default mongoose.model<IAdminMessage>('AdminMessage', adminMessageSchema);
