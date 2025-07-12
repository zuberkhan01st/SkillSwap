import express from 'express';
const router = express.Router();
import auth from '../middleware/auth';
import { uploadProfilePhoto } from '../middleware/upload';
import { 
  getMe, 
  updateProfile, 
  toggleProfileVisibility, 
  searchUsers, 
  getUsersBySkill, 
  getUserProfile,
  uploadProfilePhoto as uploadPhoto
} from '../controllers/userController';

// Protected routes (requires JWT)
router.get('/profile', auth as express.RequestHandler, (req, res, next) => {
  Promise.resolve(getMe(req, res)).catch(next);
});

router.put('/profile', auth as express.RequestHandler, (req, res, next) => {
  Promise.resolve(updateProfile(req, res)).catch(next);
});

router.put('/profile/visibility', auth as express.RequestHandler, (req, res, next) => {
  Promise.resolve(toggleProfileVisibility(req, res)).catch(next);
});

router.post('/profile/photo', 
  auth as express.RequestHandler,
  uploadProfilePhoto.single('profilePhoto'),
  (req, res, next) => {
    Promise.resolve(uploadPhoto(req, res)).catch(next);
  }
);

// Public routes
router.get('/search', (req, res, next) => {
  Promise.resolve(searchUsers(req, res)).catch(next);
});

router.get('/skill/:skill', (req, res, next) => {
  Promise.resolve(getUsersBySkill(req, res)).catch(next);
});

router.get('/:userId', (req, res, next) => {
  Promise.resolve(getUserProfile(req, res)).catch(next);
});

export default router;