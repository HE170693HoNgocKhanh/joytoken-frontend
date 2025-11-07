import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Không set Content-Type cho FormData, để browser tự set với boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý response và error
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Xử lý lỗi 401 - Token hết hạn hoặc chưa đăng nhập
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || '';
      // Chỉ logout nếu là lỗi authentication thực sự, không phải validation error
      if (errorMessage.includes('Chưa đăng nhập') || 
          errorMessage.includes('Token') || 
          errorMessage.includes('token')) {
        console.warn('🔒 401 Unauthorized - Token expired or invalid');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Chỉ redirect nếu không phải đang ở trang login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    
    // Xử lý lỗi 403 - Token không hợp lệ hoặc không có quyền
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || 'Token không hợp lệ hoặc hết hạn';
      if (errorMessage.includes('Token không hợp lệ') || errorMessage.includes('hết hạn')) {
        console.warn('🔒 403 Forbidden - Token invalid or expired');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        // Chỉ redirect nếu không phải đang ở trang login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else {
        console.error('❌ Không có quyền truy cập');
      }
    }
    
    // Xử lý lỗi 500 - Server error
    if (error.response?.status === 500) {
      console.error('❌ Lỗi server');
    }
    
    // Trả về error object đầy đủ để có thể truy cập error.response
    return Promise.reject(error);
  }
);

export default apiClient;