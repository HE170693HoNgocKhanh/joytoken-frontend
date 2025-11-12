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
    // Không set Content-Type, apiClient interceptor sẽ tự động xử lý FormData
    const response = await apiClient.post("/users/profile/avatar", formData);
    return response;
  },

  // Thay đổi email
  changeEmail: async (newEmail) => {
    const response = await apiClient.post("/users/change-email", { newEmail });
    return response;
  },

  // Xác minh email mới
  verifyEmailOtp: async (otp) => {
    const response = await apiClient.post("/users/verify-email", { otp });
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

  getMonthlyRevenue: async (month) => {
    const response = await apiClient.get(
      `/users/revenue/monthly?month=${month}`
    );
    return response;
  },

  getRevenueChartData: async (type, year, month) => {
    let url = `/users/revenue/chart?type=${type}`;
    if (year) url += `&year=${year}`;
    if (month) url += `&month=${month}`;
    const response = await apiClient.get(url);
    return response;
  },

  getInventoryChartData: async (year, month) => {
    let url = `/users/inventory/chart?year=${year}`;
    if (month !== null && month !== undefined) {
      url += `&month=${month}`;
    }
    const response = await apiClient.get(url);
    return response;
  },

  getUserChartData: async (type = "monthly", year, month) => {
    let url = `/users/chart/users?type=${type}`;
    if (year) url += `&year=${year}`;
    if (month) url += `&month=${month}`;
    const response = await apiClient.get(url);
    return response;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response;
  },

  // Wishlist
  getWishlist: async () => {
    return apiClient.get("/users/wishlist");
  },
  addToWishlist: async (productId) => {
    return apiClient.post(`/users/wishlist/${productId}`);
  },
  removeFromWishlist: async (productId) => {
    return apiClient.delete(`/users/wishlist/${productId}`);
  },
  getStaffSellerAdmin: async () => {
    return apiClient.get("/users/get-staff-seller-admin");
  },
  getChatableUsers: async () => {
    return apiClient.get("/users/get-chatable-users");
  },
};
