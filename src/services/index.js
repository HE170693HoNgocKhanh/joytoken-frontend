// Export tất cả services
export { authService } from './authService';
export { productService } from './productService';
export { categoryService } from './categoryService';
export { orderService } from './orderService';
export { userService } from './userService';

// Export apiClient để sử dụng trực tiếp nếu cần
export { default as apiClient } from './apiClient';

// Utility functions
export const isLoggedIn = () => {
  return !!localStorage.getItem('accessToken');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};