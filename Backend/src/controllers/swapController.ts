import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import SwapRequest, { ISwapRequest } from '../models/SwapRequest';
import Meeting from '../models/Meeting';
import User from '../models/User';
import mongoose from 'mongoose';
import { generateMeeting } from '../services/meetingService';

interface AuthedRequest extends Request {
  user?: string | JwtPayload;
}

// Create a new swap request
export const createSwapRequest = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const requesterId = (req.user as JwtPayload).id;
    const { providerId, skillRequested, skillOffered, message, scheduledDate } = req.body;

    // Validation
    if (!providerId || !skillRequested || !skillOffered) {
      return res.status(400).json({
        success: false,
        error: 'Provider ID, skill requested, and skill offered are required'
      });
    }

    if (requesterId === providerId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot create swap request with yourself'
      });
    }

    // Check if provider exists and is active
    const provider = await User.findOne({
      _id: providerId,
      isActive: true,
      isBanned: false
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        error: 'Provider not found or inactive'
      });
    }

    // Check if provider offers the requested skill
    const hasSkill = provider.skillsOffered.some(skill => 
      skill.toLowerCase().includes(skillRequested.toLowerCase())
    );

    if (!hasSkill) {
      return res.status(400).json({
        success: false,
        error: 'Provider does not offer the requested skill'
      });
    }

    // Check for existing pending request
    const existingRequest = await SwapRequest.findOne({
      requester: requesterId,
      provider: providerId,
      skillRequested: skillRequested.toLowerCase(),
      skillOffered: skillOffered.toLowerCase(),
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        error: 'You already have a pending request for this skill exchange'
      });
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      requester: requesterId,
      provider: providerId,
      skillRequested: skillRequested.toLowerCase(),
      skillOffered: skillOffered.toLowerCase(),
      message,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined
    });

    await swapRequest.save();

    // Populate the response
    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requester', 'name profilePhoto')
      .populate('provider', 'name profilePhoto');

    res.status(201).json({
      success: true,
      message: 'Swap request created successfully',
      data: populatedRequest
    });
  } catch (err: any) {
    console.error('Create swap request error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  }
};

// Get user's swap requests (both sent and received)
export const getMySwapRequests = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { type = 'all', status, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};

    // Filter by type (sent, received, or all)
    if (type === 'sent') {
      query.requester = userId;
    } else if (type === 'received') {
      query.provider = userId;
    } else {
      query.$or = [
        { requester: userId },
        { provider: userId }
      ];
    }

    // Filter by status if provided
    if (status && ['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status as string)) {
      query.status = status;
    }

    const swapRequests = await SwapRequest.find(query)
      .populate('requester', 'name profilePhoto averageRating')
      .populate('provider', 'name profilePhoto averageRating')
      .sort({ createdAt: -1 })
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
    console.error('Get swap requests error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Accept a swap request
export const acceptSwapRequest = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { requestId } = req.params;
    const { scheduledDate, duration = 60 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID'
      });
    }

    if (!scheduledDate) {
      return res.status(400).json({
        success: false,
        error: 'Scheduled date is required when accepting a swap request'
      });
    }

    const swapRequest = await SwapRequest.findOne({
      _id: requestId,
      provider: userId,
      status: 'pending'
    }).populate('requester', 'name email').populate('provider', 'name email');

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found or already processed'
      });
    }

    // Generate meeting link
    const meetingTitle = `Skill Swap: ${swapRequest.skillOffered} ↔ ${swapRequest.skillRequested}`;
    const meetingDetails = await generateMeeting(
      meetingTitle,
      new Date(scheduledDate),
      duration
    );

    // Create meeting record
    const meeting = new Meeting({
      swapRequest: swapRequest._id,
      requester: swapRequest.requester._id,
      provider: swapRequest.provider._id,
      meetingLink: meetingDetails.meetingLink,
      meetingId: meetingDetails.meetingId,
      scheduledDate: new Date(scheduledDate),
      duration: duration,
      skillRequested: swapRequest.skillRequested,
      skillOffered: swapRequest.skillOffered
    });

    await meeting.save();

    // Update swap request status and add meeting reference
    swapRequest.status = 'accepted';
    swapRequest.scheduledDate = new Date(scheduledDate);
    swapRequest.meeting = meeting._id as mongoose.Types.ObjectId;

    await swapRequest.save();

    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requester', 'name profilePhoto email')
      .populate('provider', 'name profilePhoto email')
      .populate('meeting');

    res.status(200).json({
      success: true,
      message: 'Swap request accepted successfully and meeting scheduled',
      data: {
        swapRequest: populatedRequest,
        meeting: {
          meetingId: meetingDetails.meetingId,
          meetingLink: meetingDetails.meetingLink,
          joinLink: meetingDetails.joinLink,
          scheduledDate: new Date(scheduledDate),
          duration: duration,
          password: meetingDetails.password
        }
      }
    });
  } catch (err) {
    console.error('Accept swap request error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Reject a swap request
export const rejectSwapRequest = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID'
      });
    }

    const swapRequest = await SwapRequest.findOne({
      _id: requestId,
      provider: userId,
      status: 'pending'
    });

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found or already processed'
      });
    }

    swapRequest.status = 'rejected';
    await swapRequest.save();

    res.status(200).json({
      success: true,
      message: 'Swap request rejected'
    });
  } catch (err) {
    console.error('Reject swap request error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete/Cancel a swap request (only by requester and only if pending)
export const deleteSwapRequest = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID'
      });
    }

    const swapRequest = await SwapRequest.findOne({
      _id: requestId,
      requester: userId,
      status: 'pending'
    });

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found or cannot be deleted'
      });
    }

    swapRequest.status = 'cancelled';
    await swapRequest.save();

    res.status(200).json({
      success: true,
      message: 'Swap request cancelled successfully'
    });
  } catch (err) {
    console.error('Delete swap request error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Mark swap as completed
export const completeSwap = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID'
      });
    }

    const swapRequest = await SwapRequest.findOne({
      _id: requestId,
      $or: [{ requester: userId }, { provider: userId }],
      status: 'accepted'
    });

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found or not in accepted status'
      });
    }

    // Update swap status and completion date
    swapRequest.status = 'completed';
    swapRequest.completedDate = new Date();
    await swapRequest.save();

    // Update user swap counts
    await User.findByIdAndUpdate(swapRequest.requester, { $inc: { totalSwaps: 1 } });
    await User.findByIdAndUpdate(swapRequest.provider, { $inc: { totalSwaps: 1 } });

    res.status(200).json({
      success: true,
      message: 'Swap marked as completed successfully',
      data: swapRequest
    });
  } catch (err) {
    console.error('Complete swap error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get swap request details
export const getSwapRequestDetails = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request ID'
      });
    }

    const swapRequest = await SwapRequest.findOne({
      _id: requestId,
      $or: [{ requester: userId }, { provider: userId }]
    })
    .populate('requester', 'name profilePhoto averageRating totalSwaps')
    .populate('provider', 'name profilePhoto averageRating totalSwaps');

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        error: 'Swap request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: swapRequest
    });
  } catch (err) {
    console.error('Get swap request details error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get upcoming meetings for the authenticated user
export const getUpcomingMeetings = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const now = new Date();

    const upcomingMeetings = await Meeting.find({
      $or: [
        { requester: userId },
        { provider: userId }
      ],
      scheduledDate: { $gte: now },
      status: { $in: ['scheduled', 'in_progress'] }
    })
    .populate('swapRequest')
    .populate('requester', 'name email profilePhoto')
    .populate('provider', 'name email profilePhoto')
    .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      data: upcomingMeetings
    });
  } catch (err) {
    console.error('Get upcoming meetings error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get meeting details by ID
export const getMeetingDetails = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { meetingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid meeting ID'
      });
    }

    const meeting = await Meeting.findOne({
      _id: meetingId,
      $or: [
        { requester: userId },
        { provider: userId }
      ]
    })
    .populate('swapRequest')
    .populate('requester', 'name email profilePhoto')
    .populate('provider', 'name email profilePhoto');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meeting
    });
  } catch (err) {
    console.error('Get meeting details error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update meeting status (join, complete, cancel)
export const updateMeetingStatus = async (req: AuthedRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === 'string' || !(req.user as JwtPayload).id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const userId = (req.user as JwtPayload).id;
    const { meetingId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid meeting ID'
      });
    }

    if (!['in_progress', 'completed', 'cancelled', 'no_show'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: in_progress, completed, cancelled, no_show'
      });
    }

    const meeting = await Meeting.findOne({
      _id: meetingId,
      $or: [
        { requester: userId },
        { provider: userId }
      ]
    });

    if (!meeting) {
      return res.status(404).json({
        success: false,
        error: 'Meeting not found'
      });
    }

    meeting.status = status;
    if (status === 'in_progress') {
      meeting.actualStartTime = new Date();
    } else if (status === 'completed') {
      meeting.actualEndTime = new Date();
    }

    await meeting.save();

    const updatedMeeting = await Meeting.findById(meeting._id)
      .populate('swapRequest')
      .populate('requester', 'name email profilePhoto')
      .populate('provider', 'name email profilePhoto');

    res.status(200).json({
      success: true,
      message: `Meeting status updated to ${status}`,
      data: updatedMeeting
    });
  } catch (err) {
    console.error('Update meeting status error:', err);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
