import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  // Basic Info
  name: string;
  email: string;
  password: string;
  location?: string;
  profilePhoto?: string;
  bio?: string;
  
  // Skills
  skillsOffered: string[];
  skillsWanted: string[];
  
  // Availability
  availability: {
    weekdays: boolean;
    weekends: boolean;
    evenings: boolean;
    mornings: boolean;
    afternoons: boolean;
  };
  
  // Privacy & Status
  isPublic: boolean;
  isActive: boolean;
  isBanned: boolean;
  
  // Profile Stats
  totalSwaps: number;
  averageRating: number;
  totalRatings: number;
  
  // Admin
  role: 'user' | 'admin';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  // Basic Info
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  profilePhoto: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    trim: true
  },
  
  // Skills
  skillsOffered: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  skillsWanted: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  
  // Availability
  availability: {
    weekdays: { type: Boolean, default: false },
    weekends: { type: Boolean, default: false },
    evenings: { type: Boolean, default: false },
    mornings: { type: Boolean, default: false },
    afternoons: { type: Boolean, default: false }
  },
  
  // Privacy & Status
  isPublic: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
  
  // Profile Stats
  totalSwaps: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  
  // Admin
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ skillsOffered: 1 });
userSchema.index({ skillsWanted: 1 });
userSchema.index({ location: 1 });
userSchema.index({ isPublic: 1, isActive: 1, isBanned: 1 });

// Methods
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};


export default mongoose.model<IUser>('User', userSchema);