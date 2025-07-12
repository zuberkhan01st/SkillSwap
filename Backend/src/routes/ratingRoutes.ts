import express from 'express';
const router = express.Router();
import auth from '../middleware/auth';
import {
  rateUser,
  getUserRatings,
  getMyGivenRatings,
  getMyReceivedRatings,
  updateRating
} from '../controllers/ratingController';

// Submit a rating for completed swap
router.post('/rate', auth as express.RequestHandler, (req, res, next) => {
  Promise.resolve(rateUser(req, res)).catch(next);
});

// Get my given ratings
router.get('/my-given', auth as express.RequestHandler, (req, res, next) => {
  Promise.resolve(getMyGivenRatings(req, res)).catch(next);
});

// Get my received ratings
router.get('/my-received', auth as express.RequestHandler, (req, res, next) => {
  Promise.resolve(getMyReceivedRatings(req, res)).catch(next);
});

// Update a rating (only by the rater)
router.put('/:ratingId', auth as express.RequestHandler, (req, res, next) => {
  Promise.resolve(updateRating(req, res)).catch(next);
});

// Get ratings for a specific user (public)
router.get('/user/:userId', (req, res, next) => {
  Promise.resolve(getUserRatings(req, res)).catch(next);
});

export default router;
