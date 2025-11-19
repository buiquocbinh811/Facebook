// manage state and token for authentication
import { createContext, useState, useEffect, useContext } from 'react';
import authApi from '../api/authApi';

// Tạo Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token khi app load
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('token');
      
      if (savedToken) {
        try {
          // Verify token với backend
          const data = await authApi.getMe();
          setUser(data);
          setIsAuthenticated(true);
          setToken(savedToken);
        } catch (error) {
          // Token không hợp lệ th xoas
          console.error('Token không hợp lệ:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Function ĐĂNG KÝ
  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);
      
      // Lưu token và user
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Function ĐĂNG NHẬP
  const login = async (credentials) => {
    try {
      const data = await authApi.login(credentials);
      
      // Lưu token và user
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setIsAuthenticated(true);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Function ĐĂNG XUẤT
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Function CẬP NHẬT USER
  const updateUser = (userData) => {
    setUser({ ...user, ...userData });
  };

  // Value cung cấp cho toàn bộ app
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth cầnd dược dùng (.) AuthProvider');
  }
  
  return context;
};

export default AuthContext;