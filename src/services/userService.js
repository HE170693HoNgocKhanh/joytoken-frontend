import apiClient from "./apiClient";

export const userService = {
  // Lấy thông tin user hiện tại
  getProfile: async () => {
    const response = await apiClient.get("/users/profile");
    return response;
  },

  // Cập nhật thông tin user hiện tại
  updateProfile: async (data) => {
    const response = await apiClient.put("/users/profile", data);
    return response;
  },

  updateByAdmin: async (id, data) => {
    const response = await apiClient.put(`/users/update-by-admin/${id}`, data);
    return response;
  },

  // Upload avatar mới
  uploadAvatar: async (formData) => {
    const response = await apiClient.post("/users/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  },

  // Thay đổi email
  changeEmail: async (newEmail) => {
    const response = await apiClient.post("/users/change-email", { newEmail });
    return response;
  },

  // Xác minh email mới
  verifyEmail: async (token) => {
    const response = await apiClient.post("/users/verify-email", { token });
    return response;
  },

  getAllUser: async () => {
    const response = await apiClient.get("/users/get-all");
    return response;
  },

  getDashboardStatistics: async () => {
    const response = await apiClient.get("/users/statistics");
    return response;
  },
  getDailyRevenue: async (date) => {
    const response = await apiClient.get(`/users/revenue/daily?date=${date}`);
    return response;
  },
};
