import apiClient from './apiClient';

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách đơn hàng của user
  getUserOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/orders?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId, reason) => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/cancel`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Xác nhận đã nhận hàng
  confirmReceived: async (orderId) => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}/confirm-received`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Theo dõi đơn hàng
  trackOrder: async (orderCode) => {
    try {
      const response = await apiClient.get(`/orders/track/${orderCode}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Lấy tất cả đơn hàng
  getAllOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/admin/orders?${queryString}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId, status, note = '') => {
    try {
      const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
        status,
        note
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Admin: Lấy thống kê đơn hàng
  getOrderStats: async (period = 'month') => {
    try {
      const response = await apiClient.get(`/admin/orders/stats?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tính phí vận chuyển
  calculateShipping: async (shippingAddress, items) => {
    try {
      const response = await apiClient.post('/orders/calculate-shipping', {
        shippingAddress,
        items
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Áp dụng mã giảm giá
  applyCoupon: async (couponCode, orderData) => {
    try {
      const response = await apiClient.post('/orders/apply-coupon', {
        couponCode,
        orderData
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Thanh toán đơn hàng
  processPayment: async (orderId, paymentData) => {
    try {
      const response = await apiClient.post(`/orders/${orderId}/payment`, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Lấy lịch sử thanh toán
  getPaymentHistory: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}/payments`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateOrderToPaid: async (orderId, paymentResult) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}/pay`, paymentResult);
      return response;
    } catch (error) {
      throw error;
    }
  },
};