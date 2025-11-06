import { useState, useEffect } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(0);

  // Lấy giỏ hàng từ API
  const fetchCart = async () => {
    // Placeholder local cart; replace with API integration when available
    setItemCount(cart.items?.length || 0);
    return cart;
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = async (productId, quantity = 1, options = {}) => {
    try {
      setLoading(true);
      const newItems = [...(cart.items || [])];
      const existingIndex = newItems.findIndex((i) => i.productId === productId);
      if (existingIndex >= 0) {
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: newItems[existingIndex].quantity + quantity };
      } else {
        newItems.push({ productId, quantity, options });
      }
      const newCart = { items: newItems, total: cart.total };
      setCart(newCart);
      await fetchCart();
      return newCart;
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
      const newItems = (cart.items || []).map((i, idx) => idx === itemId ? { ...i, quantity } : i);
      const newCart = { items: newItems, total: cart.total };
      setCart(newCart);
      await fetchCart();
      return newCart;
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
      const newItems = (cart.items || []).filter((_, idx) => idx !== itemId);
      const newCart = { items: newItems, total: cart.total };
      setCart(newCart);
      await fetchCart();
      return newCart;
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
      setCart({ items: [], total: 0 });
      setItemCount(0);
      return { success: true };
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
      // No-op placeholder
      await fetchCart();
      return { success: true };
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
      // No-op placeholder
      await fetchCart();
      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Lấy số lượng items trong giỏ hàng
  const getCartItemCount = async () => {
    try {
      const count = cart.items?.length || 0;
      setItemCount(count);
      return { count };
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