import Post from '../models/Post.js';
import User from '../models/User.js';

// Tạo bài đăng mới
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập nội dung bài đăng'
      });
    }

    // Lấy đường dẫn ảnh nếu có upload
    const images = req.file ? [`/images/${req.file.filename}`] : [];

    const post = await Post.create({
      user: req.user.id || req.user._id,
      content,
      images
    });

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Tạo bài đăng thành công',
      data: populatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy tất cả bài đăng (News Feed)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy bài đăng theo ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài đăng'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Sửa bài đăng
export const updatePost = async (req, res) => {
  try {
    const { content, images } = req.body;

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài đăng'
      });
    }

    // Kiểm tra xem user có phải là chủ bài đăng không
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền sửa bài đăng này'
      });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { content, images },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Cập nhật bài đăng thành công',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Xóa bài đăng
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài đăng'
      });
    }

    // Kiểm tra xem user có phải là chủ bài đăng không
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bài đăng này'
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Xóa bài đăng thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Like/Unlike bài đăng
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài đăng'
      });
    }

    // Kiểm tra xem user đã like chưa
    const likedIndex = post.likes.indexOf(req.user._id);

    if (likedIndex === -1) {
      // Chưa like -> Thêm like
      post.likes.push(req.user._id);
      await post.save();

      res.status(200).json({
        success: true,
        message: 'Đã like bài đăng',
        data: post
      });
    } else {
      // Đã like -> Unlike
      post.likes.splice(likedIndex, 1);
      await post.save();

      res.status(200).json({
        success: true,
        message: 'Đã bỏ like bài đăng',
        data: post
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Thêm comment vào bài đăng
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập nội dung bình luận'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài đăng'
      });
    }

    const comment = {
      user: req.user._id,
      content,
      createdAt: Date.now()
    };

    post.comments.push(comment);
    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Đã thêm bình luận',
      data: updatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
