import express from 'express';
import { searchUsers, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Search users
router.get('/search', searchUsers);

// Get user profile
router.get('/:userId', getUserProfile);

export default router;
