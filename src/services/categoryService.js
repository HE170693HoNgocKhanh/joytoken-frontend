import apiClient from './apiClient';

export const categoryService = {
  // Lấy danh sách tất cả danh mục
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh mục theo ID
  getCategoryById: async (id) => {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh mục cha (không có parentId)
  getParentCategories: async () => {
    try {
      const response = await apiClient.get('/categories/parent');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh mục con theo danh mục cha
  getChildCategories: async (parentId) => {
    try {
      const response = await apiClient.get(`/categories/parent/${parentId}/children`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy cây danh mục (hierarchical)
  getCategoryTree: async () => {
    try {
      const response = await apiClient.get('/categories/tree');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Tạo danh mục mới
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/admin/categories', categoryData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Cập nhật danh mục
  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`/admin/categories/${id}`, categoryData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Xóa danh mục
  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/categories/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Upload hình ảnh danh mục
  uploadCategoryImage: async (categoryId, formData) => {
    try {
      const response = await apiClient.post(`/admin/categories/${categoryId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh mục phổ biến (có nhiều sản phẩm)
  getPopularCategories: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/categories/popular?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};