import apiClient from "./apiClient";

export const exchangeService = {
  // Tạo yêu cầu đổi hàng
  createExchange: async (exchangeData) => {
    try {
      const response = await apiClient.post("/exchanges", exchangeData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách đổi hàng của user
  getMyExchanges: async () => {
    try {
      const response = await apiClient.get("/exchanges/my-exchanges");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết yêu cầu đổi hàng theo ID
  getExchangeById: async (exchangeId) => {
    try {
      const response = await apiClient.get(`/exchanges/${exchangeId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Hủy yêu cầu đổi hàng
  cancelExchange: async (exchangeId) => {
    try {
      const response = await apiClient.put(`/exchanges/${exchangeId}/cancel`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin/Seller: Lấy tất cả yêu cầu đổi hàng
  getAllExchanges: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/exchanges?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin/Seller: Cập nhật trạng thái yêu cầu đổi hàng
  updateExchangeStatus: async (exchangeId, status, adminNotes) => {
    try {
      const response = await apiClient.put(`/exchanges/${exchangeId}/status`, {
        status,
        adminNotes,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

