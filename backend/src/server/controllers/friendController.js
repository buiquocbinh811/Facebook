import Friend from '../models/Friend.js';
import User from '../models/User.js';

// Gửi lời mời kết bạn
export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.user.id || req.user._id;

    // Không thể kết bạn với chính mình
    if (requesterId.toString() === recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Không thể gửi lời mời kết bạn cho chính mình'
      });
    }

    // Kiểm tra user tồn tại
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Người dùng không tồn tại'
      });
    }

    // Kiểm tra đã có request chưa
    const existingRequest = await Friend.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (existingRequest) {
      if (existingRequest.status === 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'Đã là bạn bè rồi'
        });
      } else if (existingRequest.status === 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Lời mời kết bạn đã được gửi'
        });
      }
    }

    // Tạo friend request
    const friendRequest = await Friend.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    const populatedRequest = await Friend.findById(friendRequest._id)
      .populate('requester', 'name avatar')
      .populate('recipient', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Đã gửi lời mời kết bạn',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Error sending friend request:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Chấp nhận lời mời kết bạn
export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id || req.user._id;

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Lời mời không tồn tại'
      });
    }

    // Chỉ recipient mới chấp nhận được
    if (friendRequest.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền thực hiện'
      });
    }

    if (friendRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Lời mời đã được xử lý'
      });
    }

    friendRequest.status = 'accepted';
    await friendRequest.save();

    const populatedRequest = await Friend.findById(friendRequest._id)
      .populate('requester', 'name avatar')
      .populate('recipient', 'name avatar');

    res.json({
      success: true,
      message: 'Đã chấp nhận lời mời kết bạn',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Từ chối lời mời kết bạn
export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id || req.user._id;

    const friendRequest = await Friend.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Lời mời không tồn tại'
      });
    }

    if (friendRequest.recipient.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền thực hiện'
      });
    }

    await Friend.findByIdAndDelete(requestId);

    res.json({
      success: true,
      message: 'Đã từ chối lời mời kết bạn'
    });
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Hủy kết bạn
export const unfriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const userId = req.user.id || req.user._id;

    const friendship = await Friend.findOne({
      $or: [
        { requester: userId, recipient: friendId, status: 'accepted' },
        { requester: friendId, recipient: userId, status: 'accepted' }
      ]
    });

    if (!friendship) {
      return res.status(404).json({
        success: false,
        message: 'Không phải bạn bè'
      });
    }

    await Friend.findByIdAndDelete(friendship._id);

    res.json({
      success: true,
      message: 'Đã hủy kết bạn'
    });
  } catch (error) {
    console.error('Error unfriending:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy danh sách bạn bè
export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const friends = await Friend.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    })
      .populate('requester', 'name avatar')
      .populate('recipient', 'name avatar')
      .sort('-createdAt');

    // Format data: trả về thông tin friend (không phải user hiện tại)
    const friendList = friends.map(f => {
      const friend = f.requester._id.toString() === userId.toString() 
        ? f.recipient 
        : f.requester;
      return {
        _id: friend._id,
        name: friend.name,
        avatar: friend.avatar,
        friendshipId: f._id,
        since: f.createdAt
      };
    });

    res.json({
      success: true,
      count: friendList.length,
      data: friendList
    });
  } catch (error) {
    console.error('Error getting friends:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy danh sách lời mời kết bạn đang chờ
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const requests = await Friend.find({
      recipient: userId,
      status: 'pending'
    })
      .populate('requester', 'name avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error getting pending requests:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Kiểm tra trạng thái bạn bè với 1 user
export const checkFriendshipStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id || req.user._id;

    const friendship = await Friend.findOne({
      $or: [
        { requester: currentUserId, recipient: userId },
        { requester: userId, recipient: currentUserId }
      ]
    });

    if (!friendship) {
      return res.json({
        success: true,
        data: { status: 'none' } // Chưa có quan hệ
      });
    }

    res.json({
      success: true,
      data: {
        status: friendship.status,
        friendshipId: friendship._id,
        isSentByMe: friendship.requester.toString() === currentUserId.toString()
      }
    });
  } catch (error) {
    console.error('Error checking friendship status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
