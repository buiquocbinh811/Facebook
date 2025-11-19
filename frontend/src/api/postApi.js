import axiosInstance from './axios';
// láy các API liên quan đến bài đăng ỏ bên backend 
const postApi = {
  // Lấy tất cả bài đăng
  getPosts: async () => {
    const response = await axiosInstance.get('/posts');
    return response.data;
  },

  // Lấy 1 bài đăng theo ID
  getPostById: async (postId) => {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data;
  },

  // Tạo bài mới (có thể có ảnh)
  createPost: async (postData) => {
    const response = await axiosInstance.post('/posts', postData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Nếu có upload ảnh
      },
    });
    return response.data;
  },

  // Sửa bài đăng
  updatePost: async (postId, postData) => {
    const response = await axiosInstance.put(`/posts/${postId}`, postData);
    return response.data;
  },

  // Xóa bài đăng
  deletePost: async (postId) => {
    const response = await axiosInstance.delete(`/posts/${postId}`);
    return response.data;
  },

  // Like/Unlike bài đăng
  likePost: async (postId) => {
    const response = await axiosInstance.put(`/posts/${postId}/like`);
    return response.data;
  },

  // Bình luận
  commentPost: async (postId, commentData) => {
    const response = await axiosInstance.post(`/posts/${postId}/comment`, commentData);
    return response.data;
  },

 // Xóa bình luận
    deleteComment: async(postID, commentId) => {
        const response = await axiosInstance.delete(`/posts/${postID}/comment/${commentId}`);
        return response.data;
    }
};

export default postApi;