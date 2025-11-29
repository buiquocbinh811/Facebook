import User from '../models/User.js';

// Search users by name or email
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query; // search query
    const currentUserId = req.user.id || req.user._id;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Search by name or email (case-insensitive)
    const users = await User.find({
      _id: { $ne: currentUserId }, // Exclude current user
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
      .select('name email avatar')
      .limit(20);

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

export default {
  searchUsers,
  getUserProfile
};
