import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import SwapRequest from '../models/SwapRequest';
import Rating from '../models/Rating';
import AdminMessage from '../models/AdminMessage';
import mongoose from 'mongoose';

interface AuthedRequest extends Request {
  user?: string | JwtPayload;
}

// Ban/Unban a user
export const toggleUserBan = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const { userId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user ID'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Cannot ban admin users'
      });
    }

    // Toggle ban status
    user.isBanned = !user.isBanned;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        isBanned: user.isBanned,
        reason
      }
    });
  } catch (err) {
    console.error('Toggle user ban error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all users with pagination and filters
export const getAllUsers = async (req: AuthedRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'all', 
      role = 'all',
      search 
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query: any = {};

    if (status === 'active') query.isActive = true;
    else if (status === 'inactive') query.isActive = false;
    
    if (status === 'banned') query.isBanned = true;
    else if (status === 'unbanned') query.isBanned = false;

    if (role !== 'all') query.role = role;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Send platform-wide message
export const sendPlatformMessage = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const adminId = (req.user as JwtPayload).id;
    const { title, content, type } = req.body;

    // Validation
    if (!title || !content || !type) {
      return res.status(400).json({
        success: false,
        error: 'Title, content, and type are required'
      });
    }

    if (!['update', 'alert', 'maintenance', 'announcement'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be one of: update, alert, maintenance, announcement'
      });
    }

    const message = new AdminMessage({
      title,
      content,
      type,
      createdBy: adminId
    });

    await message.save();

    const populatedMessage = await AdminMessage.findById(message._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Platform message sent successfully',
      data: populatedMessage
    });
  } catch (err) {
    console.error('Send platform message error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get platform messages
export const getPlatformMessages = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type, isActive } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const messages = await AdminMessage.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await AdminMessage.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (err) {
    console.error('Get platform messages error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get swap statistics
export const getSwapStatistics = async (req: AuthedRequest, res: Response) => {
  try {
    // Overall stats
    const totalSwaps = await SwapRequest.countDocuments();
    const completedSwaps = await SwapRequest.countDocuments({ status: 'completed' });
    const pendingSwaps = await SwapRequest.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true, isBanned: false });

    // Swap status breakdown
    const swapStatusStats = await SwapRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly swap trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await SwapRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Top skills
    const topSkillsRequested = await SwapRequest.aggregate([
      {
        $group: {
          _id: '$skillRequested',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topSkillsOffered = await SwapRequest.aggregate([
      {
        $group: {
          _id: '$skillOffered',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Average rating
    const avgRatingStats = await Rating.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);

    const averageRating = avgRatingStats[0]?.averageRating || 0;
    const totalRatings = avgRatingStats[0]?.totalRatings || 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalSwaps,
          completedSwaps,
          pendingSwaps,
          totalUsers,
          activeUsers,
          completionRate: totalSwaps > 0 ? (completedSwaps / totalSwaps * 100).toFixed(2) : 0,
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings
        },
        swapStatusBreakdown: swapStatusStats,
        monthlyTrends: monthlyStats,
        topSkills: {
          requested: topSkillsRequested,
          offered: topSkillsOffered
        }
      }
    });
  } catch (err) {
    console.error('Get swap statistics error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get all swap requests for monitoring
export const getAllSwapRequests = async (req: AuthedRequest, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const query: any = {};
    if (status !== 'all') query.status = status;

    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const swapRequests = await SwapRequest.find(query)
      .populate('requester', 'name email profilePhoto')
      .populate('provider', 'name email profilePhoto')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await SwapRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        swapRequests,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total
        }
      }
    });
  } catch (err) {
    console.error('Get all swap requests error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete inappropriate content (swap request)
export const deleteSwapRequest = async (req: AuthedRequest, res: Response) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID'
      });
    }

    const swapRequest = await SwapRequest.findById(requestId);
    
    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
    }

    await SwapRequest.findByIdAndDelete(requestId);

    res.status(200).json({
      success: true,
      message: 'Swap request deleted successfully',
      data: { requestId, reason }
    });
  } catch (err) {
    console.error('Delete swap request error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Generate and download reports
export const generateReport = async (req: AuthedRequest, res: Response) => {
  try {
    const { type, startDate, endDate } = req.query;

    if (!type || !['users', 'swaps', 'ratings'].includes(type as string)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid report type. Must be one of: users, swaps, ratings'
      });
    }

    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
    const end = endDate ? new Date(endDate as string) : new Date();

    let reportData: any = {};

    switch (type) {
      case 'users':
        reportData = await User.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
              },
              newUsers: { $sum: 1 },
              activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
              bannedUsers: { $sum: { $cond: ['$isBanned', 1, 0] } }
            }
          },
          { $sort: { '_id.date': 1 } }
        ]);
        break;

      case 'swaps':
        reportData = await SwapRequest.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                status: '$status'
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.date': 1 } }
        ]);
        break;

      case 'ratings':
        reportData = await Rating.aggregate([
          {
            $match: {
              createdAt: { $gte: start, $lte: end }
            }
          },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
              },
              totalRatings: { $sum: 1 },
              averageRating: { $avg: '$rating' },
              ratingBreakdown: { $push: '$rating' }
            }
          },
          { $sort: { '_id.date': 1 } }
        ]);
        break;
    }

    res.status(200).json({
      success: true,
      data: {
        reportType: type,
        dateRange: { start, end },
        data: reportData
      }
    });
  } catch (err) {
    console.error('Generate report error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
