import apiClient from './apiClient';

export const authService = {
  // Đăng ký
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xác thực OTP đăng ký email
  verifyRegisterEmail: async (email, otp) => {
    try {
      const response = await apiClient.post('/auth/verify-email', { email, otp });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đăng nhập
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      // Không lưu vào localStorage ở đây, để useAuth hook xử lý
      // Chỉ trả về response
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Vẫn tiếp tục clear local dù API lỗi
      console.warn('Logout API error:', error);
    } finally {
      // Xóa tất cả thông tin trong localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Clear cart và wishlist
      localStorage.removeItem('cart');
      localStorage.removeItem('wishlist');
      localStorage.removeItem('wishlistIds');
      
      // Dispatch events để các component cập nhật
      window.dispatchEvent(new Event('cartUpdated'));
      window.dispatchEvent(new Event('storage'));
    }
      
      return true;
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await apiClient.post('/auth/refresh-token', {
        refreshToken
      });
      
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      
      return response;
    } catch (error) {
      // Nếu refresh token thất bại, đăng xuất user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw error;
    }
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reset mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Thay đổi mật khẩu
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật profile
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put('/auth/profile', userData);
      
      // Cập nhật thông tin user trong localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
};