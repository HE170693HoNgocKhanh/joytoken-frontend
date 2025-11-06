import apiClient from "./apiClient";

export const notificationService = {
  // Lấy danh sách thông báo của user
  getUserNotifications: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/notifications?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy số lượng thông báo chưa đọc
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get("/notifications/unread-count");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu đã đọc
  markAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put("/notifications/read-all");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xóa thông báo
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

