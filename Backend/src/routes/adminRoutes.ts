import express from 'express';
const router = express.Router();
import adminAuth from '../middleware/adminAuth';
import {
  toggleUserBan,
  getAllUsers,
  sendPlatformMessage,
  getPlatformMessages,
  getSwapStatistics,
  getAllSwapRequests,
  deleteSwapRequest,
  generateReport
} from '../controllers/adminController';

// All admin routes require admin authentication
router.use(adminAuth as express.RequestHandler);

// User management
router.get('/users', (req, res, next) => {
  Promise.resolve(getAllUsers(req, res)).catch(next);
});

router.put('/users/:userId/ban', (req, res, next) => {
  Promise.resolve(toggleUserBan(req, res)).catch(next);
});

// Platform messages
router.post('/messages', (req, res, next) => {
  Promise.resolve(sendPlatformMessage(req, res)).catch(next);
});

router.get('/messages', (req, res, next) => {
  Promise.resolve(getPlatformMessages(req, res)).catch(next);
});

// Swap monitoring
router.get('/swaps', (req, res, next) => {
  Promise.resolve(getAllSwapRequests(req, res)).catch(next);
});

router.delete('/swaps/:requestId', (req, res, next) => {
  Promise.resolve(deleteSwapRequest(req, res)).catch(next);
});

// Statistics and reports
router.get('/statistics', (req, res, next) => {
  Promise.resolve(getSwapStatistics(req, res)).catch(next);
});

router.get('/reports', (req, res, next) => {
  Promise.resolve(generateReport(req, res)).catch(next);
});

export default router;
