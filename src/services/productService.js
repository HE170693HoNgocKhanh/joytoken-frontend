import apiClient from "./apiClient";

export const productService = {
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiClient.get(`/products?${queryString}`);
  },

  getProductById: async (id) => {
    return apiClient.get(`/products/${id}`);
  },

createProduct: async (formData) => {
  return apiClient.post(`/products`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
},
  updateProduct: async (id, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (Array.isArray(productData[key])) {
        productData[key].forEach((item) => formData.append(key, item));
      } else {
        formData.append(key, productData[key]);
      }
    });

    return apiClient.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteProduct: async (id) => {
    return apiClient.delete(`/products/${id}`);
  },

  getMyProducts: async () => {
    return apiClient.get(`/products/seller/my-products`);
  },

  getProductsBySeller: async (sellerId) => {
    return apiClient.get(`/products/seller/${sellerId}`);
  },
};
