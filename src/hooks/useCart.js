import { useState, useEffect } from 'react';
// import { cartService } from '../services';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  // Lấy giỏ hàng từ API
  // const fetchCart = async () => {
  //   try {
  //     setLoading(true);
  //     const cartData = await cartService.getCart();
  //     setCart(cartData);
  //     setItemCount(cartData.items?.length || 0);
  //   } catch (error) {
  //     console.error('Error fetching cart:', error);
  //     setCart({ items: [], total: 0 });
  //     setItemCount(0);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, quantity = 1, options = {}) => {
    try {
      setLoading(true);
      const response = await cartService.addToCart(productId, quantity, options);
      await fetchCart(); // Refresh cart
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật số lượng sản phẩm
  const updateCartItem = async (itemId, quantity) => {
    try {
      setLoading(true);
      const response = await cartService.updateCartItem(itemId, quantity);
      await fetchCart(); // Refresh cart
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      const response = await cartService.removeFromCart(itemId);
      await fetchCart(); // Refresh cart
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await cartService.clearCart();
      setCart({ items: [], total: 0 });
      setItemCount(0);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Áp dụng mã giảm giá
  const applyCoupon = async (couponCode) => {
    try {
      setLoading(true);
      const response = await cartService.applyCouponToCart(couponCode);
      await fetchCart(); // Refresh cart
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Xóa mã giảm giá
  const removeCoupon = async () => {
    try {
      setLoading(true);
      const response = await cartService.removeCouponFromCart();
      await fetchCart(); // Refresh cart
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Lấy số lượng items trong giỏ hàng
  const getCartItemCount = async () => {
    try {
      const response = await cartService.getCartItemCount();
      setItemCount(response.count || 0);
      return response;
    } catch (error) {
      console.error('Error getting cart item count:', error);
      return { count: 0 };
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    itemCount,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCartItemCount
  };
};