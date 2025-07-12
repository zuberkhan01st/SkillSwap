import express from 'express';
const router = express.Router();
import auth from '../middleware/auth';
import {
  createSwapRequest,
  getMySwapRequests,
  acceptSwapRequest,
  rejectSwapRequest,
  deleteSwapRequest,
  completeSwap,
  getSwapRequestDetails
} from '../controllers/swapController';

// All swap routes require authentication
router.use(auth as express.RequestHandler);

// Create a new swap request
router.post('/request', (req, res, next) => {
  Promise.resolve(createSwapRequest(req, res)).catch(next);
});

// Get user's swap requests (sent and received)
router.get('/my-requests', (req, res, next) => {
  Promise.resolve(getMySwapRequests(req, res)).catch(next);
});

// Get specific swap request details
router.get('/:requestId', (req, res, next) => {
  Promise.resolve(getSwapRequestDetails(req, res)).catch(next);
});

// Accept a swap request (only provider can accept)
router.put('/:requestId/accept', (req, res, next) => {
  Promise.resolve(acceptSwapRequest(req, res)).catch(next);
});

// Reject a swap request (only provider can reject)
router.put('/:requestId/reject', (req, res, next) => {
  Promise.resolve(rejectSwapRequest(req, res)).catch(next);
});

// Cancel/Delete a swap request (only requester can delete pending requests)
router.delete('/:requestId', (req, res, next) => {
  Promise.resolve(deleteSwapRequest(req, res)).catch(next);
});

// Mark swap as completed (both parties can complete)
router.put('/:requestId/complete', (req, res, next) => {
  Promise.resolve(completeSwap(req, res)).catch(next);
});

export default router;
