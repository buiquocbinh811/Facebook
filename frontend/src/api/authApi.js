import axiosInstance from './axios';

const authApi = {
  // Đăng ký tài khoản
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Đăng nhập
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Lấy thông tin user hiện tại (dùng token)
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Đăng xuất (optional - xóa token ở client)
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authApi;