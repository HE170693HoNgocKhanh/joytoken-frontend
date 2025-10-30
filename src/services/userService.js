import apiClient from "./apiClient";

export const userService = {
  // Lấy thông tin profile user
  getProfile: async () => {
    try {
      const response = await apiClient.get("/user/profile");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật thông tin profile
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put("/user/profile", userData);

      // Cập nhật localStorage
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload avatar
  uploadAvatar: async (formData) => {
    try {
      const response = await apiClient.post("/user/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Cập nhật localStorage
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách địa chỉ
  getAddresses: async () => {
    try {
      const response = await apiClient.get("/user/addresses");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Thêm địa chỉ mới
  addAddress: async (addressData) => {
    try {
      const response = await apiClient.post("/user/addresses", addressData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (addressId, addressData) => {
    try {
      const response = await apiClient.put(
        `/user/addresses/${addressId}`,
        addressData
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (addressId) => {
    try {
      const response = await apiClient.delete(`/user/addresses/${addressId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đặt địa chỉ mặc định
  setDefaultAddress: async (addressId) => {
    try {
      const response = await apiClient.patch(
        `/user/addresses/${addressId}/default`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lịch sử hoạt động
  getActivityHistory: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/user/activity?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy thông báo
  getNotifications: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(
        `/user/notifications?${queryString}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu thông báo đã đọc
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await apiClient.patch(
        `/user/notifications/${notificationId}/read`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu tất cả thông báo đã đọc
  markAllNotificationsAsRead: async () => {
    try {
      const response = await apiClient.patch(
        "/user/notifications/mark-all-read"
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Lấy danh sách tất cả users
  getAllUsers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/users?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Lấy thông tin user theo ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Cập nhật thông tin user
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Xóa user
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Khóa/mở khóa tài khoản
  toggleUserStatus: async (userId, status) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/status`, {
        status,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Thống kê users
  getUserStats: async (period = "month") => {
    try {
      const response = await apiClient.get(`/users/stats?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Tạo user mới
  createUser: async (userData) => {
    try {
      const response = await apiClient.post(`/users`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};
