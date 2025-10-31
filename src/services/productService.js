import apiClient from "./apiClient";

export const productService = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/products?${queryString}`);
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    return apiClient.get(`/products/${id}`);
  },

  // Người bán hoặc admin: Tạo sản phẩm mới
  createProduct: async (productData) => {
    return apiClient.post(`/products`, productData);
  },

  // Người bán hoặc admin: Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    return apiClient.put(`/products/${id}`, productData);
  },

  // Người bán hoặc admin: Xóa sản phẩm
  deleteProduct: async (id) => {
    return apiClient.delete(`/products/${id}`);
  },

  // Người bán: Lấy sản phẩm của chính mình
  getMyProducts: async () => {
    return apiClient.get(`/products/seller/my-products`);
  },

  // Người bán khác (public): Lấy sản phẩm theo sellerId
  getProductsBySeller: async (sellerId) => {
    return apiClient.get(`/products/seller/${sellerId}`);
  },
};
