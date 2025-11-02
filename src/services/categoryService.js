import apiClient from "./apiClient";

export const categoryService = {
  getAllCategories: async () => {
    return await apiClient.get("/categories");
  },

  getCategoryById: async (id) => {
    return await apiClient.get(`/categories/${id}`);
  },

  createCategory: async (categoryData) => {
    return await apiClient.post("/categories", categoryData);
  },

  updateCategory: async (id, categoryData) => {
    return await apiClient.put(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id) => {
    return await apiClient.delete(`/categories/${id}`);
  },
};
