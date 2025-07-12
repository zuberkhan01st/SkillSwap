import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

interface AuthedRequest extends Request {
  user?: string | JwtPayload;
  file?: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  };
}

// Get current user profile
export const getMe = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized: User not found' 
      });
    }

    const id = (req.user as JwtPayload).id;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error' 
    });
  }
};

// Update user profile
export const updateProfile = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const {
      name,
      location,
      bio,
      skillsOffered,
      skillsWanted,
      availability
    } = req.body;

    // Validate skills arrays
    if (skillsOffered && (!Array.isArray(skillsOffered) || skillsOffered.length > 20)) {
      return res.status(400).json({
        success: false,
        error: 'Skills offered must be an array with maximum 20 items'
      });
    }

    if (skillsWanted && (!Array.isArray(skillsWanted) || skillsWanted.length > 20)) {
      return res.status(400).json({
        success: false,
        error: 'Skills wanted must be an array with maximum 20 items'
      });
    }

    const updateData: Partial<IUser> = {};
    if (name) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (skillsOffered) updateData.skillsOffered = skillsOffered.map((skill: string) => skill.toLowerCase().trim());
    if (skillsWanted) updateData.skillsWanted = skillsWanted.map((skill: string) => skill.toLowerCase().trim());
    if (availability) updateData.availability = availability;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// Toggle profile visibility (public/private)
export const toggleProfileVisibility = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { isPublic } = req.body;

    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'isPublic must be a boolean value'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isPublic },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Profile is now ${isPublic ? 'public' : 'private'}`,
      data: { isPublic: user.isPublic }
    });
  } catch (err) {
    console.error('Toggle visibility error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Search users by skill
export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { 
      skill, 
      location, 
      page = 1, 
      limit = 10,
      sortBy = 'averageRating',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build search query
    const searchQuery: any = {
      isPublic: true,
      isActive: true,
      isBanned: false
    };

    if (skill) {
      searchQuery.skillsOffered = { 
        $in: [new RegExp(skill as string, 'i')] 
      };
    }

    if (location) {
      searchQuery.location = { 
        $regex: new RegExp(location as string, 'i') 
      };
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(searchQuery)
      .select('-password -email')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await User.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          hasNext: pageNum < Math.ceil(total / limitNum),
          hasPrev: pageNum > 1
        }
      }
    });
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get users by specific skill
export const getUsersBySkill = async (req: Request, res: Response) => {
  try {
    const { skill } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!skill) {
      return res.status(400).json({
        success: false,
        error: 'Skill parameter is required'
      });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find({
      skillsOffered: { $in: [new RegExp(skill, 'i')] },
      isPublic: true,
      isActive: true,
      isBanned: false
    })
    .select('-password -email')
    .sort({ averageRating: -1, totalSwaps: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

    const total = await User.countDocuments({
      skillsOffered: { $in: [new RegExp(skill, 'i')] },
      isPublic: true,
      isActive: true,
      isBanned: false
    });

    res.status(200).json({
      success: true,
      data: {
        skill,
        users,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (err) {
    console.error('Get users by skill error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get user profile by ID (public profiles only)
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    const user = await User.findOne({
      _id: userId,
      isPublic: true,
      isActive: true,
      isBanned: false
    }).select('-password -email').lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found or profile is private'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const userId = (req.user as JwtPayload).id;
    const profilePhoto = `/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePhoto },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      data: { profilePhoto: user.profilePhoto }
    });
  } catch (err) {
    console.error('Upload profile photo error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
