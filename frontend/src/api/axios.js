import axios from "axios";

// tạo axios instance để tái sử dụng cấu hình
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000, 
    headers: {
        'Content-Type': 'application/json',
    },
});


// interceptor như 1 middware can thiệp để thêm token vào header 
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Interceptor: Xử lý lỗi response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu token hết hạn ra lõi (401), tự động logout
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;