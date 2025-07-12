import mongoose, { Document, Schema } from 'mongoose';

export interface IRating extends Document {
  swapRequest: mongoose.Types.ObjectId;
  rater: mongoose.Types.ObjectId;
  rated: mongoose.Types.ObjectId;
  rating: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ratingSchema = new Schema<IRating>({
  swapRequest: {
    type: Schema.Types.ObjectId,
    ref: 'SwapRequest',
    required: [true, 'Swap request is required']
  },
  rater: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rater is required']
  },
  rated: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Rated user is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot exceed 500 characters'],
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
ratingSchema.index({ rated: 1 });
ratingSchema.index({ rater: 1 });
ratingSchema.index({ swapRequest: 1 });

// Prevent duplicate ratings for same swap
ratingSchema.index(
  { swapRequest: 1, rater: 1 },
  { unique: true }
);

export default mongoose.model<IRating>('Rating', ratingSchema);
