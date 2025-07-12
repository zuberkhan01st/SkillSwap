import express from 'express';
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Test endpoint for checking if server is running
router.get('/test', (req: express.Request, res: express.Response) => {
  res.json({ 
    success: true, 
    message: 'SkillSwap API is running!', 
    timestamp: new Date().toISOString() 
  });
});

// Public routes
router.post('/signup', register);
router.post('/login', login);


export default router;