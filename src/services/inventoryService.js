import apiClient from "./apiClient"; // axios instance có baseURL + token header nếu cần

export const inventoryService = {
  // Nhập kho
  importStock: async (data) => {
    return apiClient.post("/inventories/import", data);
  },

  // Xuất kho
  exportStock: async (data) => {
    return apiClient.post("/inventories/export", data);
  },

  // Lấy lịch sử nhập/xuất kho
  productHistory: async (id) => {
    return apiClient.get(`/inventories/product-history/${id}`);
  },

  // Lấy tồn kho hiện tại
  getStockList: async () => {
    return apiClient.get("/inventories/stock");
  },

  // Lấy danh sách sản phẩm tồn kho thấp
  getLowStockAlert: async () => {
    return apiClient.get("/inventories/low-stock");
  },
};
