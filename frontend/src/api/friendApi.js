import api from './axios';

// Gửi lời mời kết bạn
export const sendFriendRequest = async (recipientId) => {
  const response = await api.post('/friends/request', { recipientId });
  return response.data;
};

// Chấp nhận lời mời
export const acceptFriendRequest = async (requestId) => {
  const response = await api.put(`/friends/accept/${requestId}`);
  return response.data;
};

// Từ chối lời mời
export const rejectFriendRequest = async (requestId) => {
  const response = await api.delete(`/friends/reject/${requestId}`);
  return response.data;
};

// Hủy kết bạn
export const unfriend = async (friendId) => {
  const response = await api.delete(`/friends/unfriend/${friendId}`);
  return response.data;
};

// Lấy danh sách bạn bè
export const getFriends = async () => {
  const response = await api.get('/friends');
  return response.data;
};

// Lấy lời mời kết bạn đang chờ
export const getPendingRequests = async () => {
  const response = await api.get('/friends/requests');
  return response.data;
};

// Kiểm tra trạng thái bạn bè
export const checkFriendshipStatus = async (userId) => {
  const response = await api.get(`/friends/status/${userId}`);
  return response.data;
};

export default {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriend,
  getFriends,
  getPendingRequests,
  checkFriendshipStatus
};
