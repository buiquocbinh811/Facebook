import axiosInstance from './axios';

const userApi = {
  // Lấy danh sách bạn bè
  getFriends: async () => {
    const response = await axiosInstance.get('/users/friends');
    return response.data;
  },

  // Lấy danh sách lời mời kết bạn
  getFriendRequests: async () => {
    const response = await axiosInstance.get('/users/friend-requests');
    return response.data;
  },

  // Gửi lời mời kết bạn
  sendFriendRequest: async (userId) => {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
  },

  // Chấp nhận lời mời
  acceptFriendRequest: async (requestId) => {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data;
  },

  // Từ chối lời mời
  rejectFriendRequest: async (requestId) => {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/reject`);
    return response.data;
  },

  // Hủy kết bạn
  unfriend: async (userId) => {
    const response = await axiosInstance.delete(`/users/friend/${userId}`);
    return response.data;
  },

  // Tìm kiếm user
  searchUsers: async (query) => {
    const response = await axiosInstance.get(`/users/search?q=${query}`);
    return response.data;
  },
};

export default userApi;