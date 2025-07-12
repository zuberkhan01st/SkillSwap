import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Rating, { IRating } from '../models/Rating';
import SwapRequest from '../models/SwapRequest';
import User from '../models/User';
import mongoose from 'mongoose';

interface AuthedRequest extends Request {
  user?: string | JwtPayload;
}

// Helper function to update user's average rating
const updateUserAverageRating = async (userId: string) => {
  try {
    const ratings = await Rating.find({ rated: userId });
    
    if (ratings.length === 0) {
      await User.findByIdAndUpdate(userId, { 
        averageRating: 0, 
        totalRatings: 0 
      });
      return;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;

    await User.findByIdAndUpdate(userId, { 
      averageRating: Math.round(averageRating * 10) / 10, 
      totalRatings: ratings.length 
    });
  } catch (error) {
    console.error('Error updating user average rating:', error);
  }
};

// Rate a user after a completed swap
export const rateUser = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const raterId = (req.user as JwtPayload).id;
    const { swapRequestId, rating, feedback } = req.body;

    // Validation
    if (!swapRequestId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Swap request ID and rating are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(swapRequestId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid swap request ID'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    // Check if swap request exists and is completed
    const swapRequest = await SwapRequest.findOne({
      _id: swapRequestId,
      $or: [{ requester: raterId }, { provider: raterId }],
      status: 'completed'
    });

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Completed swap request not found'
      });
    }

    // Determine who is being rated
    const ratedUserId = swapRequest.requester.toString() === raterId 
      ? swapRequest.provider 
      : swapRequest.requester;

    // Check if rating already exists
    const existingRating = await Rating.findOne({
      swapRequest: swapRequestId,
      rater: raterId
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        error: 'You have already rated this swap'
      });
    }

    // Create rating
    const newRating = new Rating({
      swapRequest: swapRequestId,
      rater: raterId,
      rated: ratedUserId,
      rating,
      feedback
    });

    await newRating.save();

    // Update user's average rating
    await updateUserAverageRating(ratedUserId.toString());

    const populatedRating = await Rating.findById(newRating._id)
      .populate('rater', 'name profilePhoto')
      .populate('rated', 'name profilePhoto');

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: populatedRating
    });
  } catch (err: any) {
    console.error('Rate user error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// Get ratings for a specific user
export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const ratings = await Rating.find({ rated: userId })
      .populate('rater', 'name profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Rating.countDocuments({ rated: userId });

    // Calculate rating statistics
    const ratingStats = await Rating.aggregate([
      { $match: { rated: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingBreakdown: {
            $push: '$rating'
          }
        }
      }
    ]);

    const stats = ratingStats[0] || { totalRatings: 0, averageRating: 0, ratingBreakdown: [] };
    
    // Count ratings by star level
    const breakdown = {
      5: stats.ratingBreakdown.filter((r: number) => r === 5).length,
      4: stats.ratingBreakdown.filter((r: number) => r === 4).length,
      3: stats.ratingBreakdown.filter((r: number) => r === 3).length,
      2: stats.ratingBreakdown.filter((r: number) => r === 2).length,
      1: stats.ratingBreakdown.filter((r: number) => r === 1).length
    };

    res.status(200).json({
      success: true,
      data: {
        ratings,
        statistics: {
          totalRatings: stats.totalRatings,
          averageRating: Math.round(stats.averageRating * 10) / 10,
          breakdown
        },
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (err) {
    console.error('Get user ratings error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get my given ratings
export const getMyGivenRatings = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const ratings = await Rating.find({ rater: userId })
      .populate('rated', 'name profilePhoto')
      .populate('swapRequest', 'skillRequested skillOffered')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Rating.countDocuments({ rater: userId });

    res.status(200).json({
      success: true,
      data: {
        ratings,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (err) {
    console.error('Get my given ratings error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get my received ratings
export const getMyReceivedRatings = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const ratings = await Rating.find({ rated: userId })
      .populate('rater', 'name profilePhoto')
      .populate('swapRequest', 'skillRequested skillOffered')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Rating.countDocuments({ rated: userId });

    res.status(200).json({
      success: true,
      data: {
        ratings,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (err) {
    console.error('Get my received ratings error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update a rating (only by the rater)
export const updateRating = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { ratingId } = req.params;
    const { rating, feedback } = req.body;

    if (!mongoose.Types.ObjectId.isValid(ratingId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid rating ID'
      });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    const existingRating = await Rating.findOne({
      _id: ratingId,
      rater: userId
    });

    if (!existingRating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found or you are not authorized to update it'
      });
    }

    // Update rating
    if (rating) existingRating.rating = rating;
    if (feedback !== undefined) existingRating.feedback = feedback;

    await existingRating.save();

    // Update user's average rating
    await updateUserAverageRating(existingRating.rated.toString());

    const populatedRating = await Rating.findById(existingRating._id)
      .populate('rater', 'name profilePhoto')
      .populate('rated', 'name profilePhoto');

    res.status(200).json({
      success: true,
      message: 'Rating updated successfully',
      data: populatedRating
    });
  } catch (err) {
    console.error('Update rating error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
