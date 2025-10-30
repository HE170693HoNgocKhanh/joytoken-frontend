import apiClient from './apiClient';

export const productService = {
  // Lấy danh sách tất cả sản phẩm
  getAllProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/products?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm theo ID
  getProductById: async (id) => {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm theo danh mục
  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/products/category/${categoryId}?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tìm kiếm sản phẩm
  searchProducts: async (keyword, params = {}) => {
    try {
      const queryString = new URLSearchParams({
        search: keyword,
        ...params
      }).toString();
      const response = await apiClient.get(`/products/search?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm nổi bật
  getFeaturedProducts: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/products/featured?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm mới nhất
  getLatestProducts: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/products/latest?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy sản phẩm liên quan
  getRelatedProducts: async (productId, limit = 6) => {
    try {
      const response = await apiClient.get(`/products/${productId}/related?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Tạo sản phẩm mới
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/admin/products', productData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Cập nhật sản phẩm
  updateProduct: async (id, productData) => {
    try {
      const response = await apiClient.put(`/admin/products/${id}`, productData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Xóa sản phẩm
  deleteProduct: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/products/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Upload hình ảnh sản phẩm
  uploadProductImages: async (productId, formData) => {
    try {
      const response = await apiClient.post(`/admin/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Xóa hình ảnh sản phẩm
  deleteProductImage: async (productId, imageId) => {
    try {
      const response = await apiClient.delete(`/admin/products/${productId}/images/${imageId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Thêm/xóa sản phẩm yêu thích
  toggleWishlist: async (productId) => {
    try {
      const response = await apiClient.post(`/products/${productId}/wishlist`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách sản phẩm yêu thích
  getWishlist: async () => {
    try {
      const response = await apiClient.get('/user/wishlist');
      return response;
    } catch (error) {
      throw error;
    }
  }
};