import express from 'express';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
  getFriends,
  getPendingRequests,
  checkFriendshipStatus
} from '../controllers/friendController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tất cả routes đều cần authentication
router.use(protect);

// Send friend request
router.post('/request', sendFriendRequest);

// Accept friend request
router.put('/accept/:requestId', acceptFriendRequest);

// Reject friend request
router.delete('/reject/:requestId', rejectFriendRequest);

// Unfriend
router.delete('/unfriend/:friendId', unfriend);

// Get friends list
router.get('/', getFriends);

// Get pending requests
router.get('/requests', getPendingRequests);

// Check friendship status with a user
router.get('/status/:userId', checkFriendshipStatus);

export default router;
