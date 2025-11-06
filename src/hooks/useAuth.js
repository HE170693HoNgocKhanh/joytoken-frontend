import { useState, useEffect } from "react";
import { authService, getCurrentUser, isLoggedIn } from "../services";

export const useAuth = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(isLoggedIn());

  // Define logout function first
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // ✅ Xoá tất cả dữ liệu localStorage khi logout
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // ✅ Clear cart và wishlist
      localStorage.removeItem("cart");
      localStorage.removeItem("wishlist");
      localStorage.removeItem("wishlistIds");
      
      // Dispatch event để các component khác biết đã logout
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("storage"));
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Kiểm tra authentication khi component mount
    const checkAuth = async () => {
      const hasToken = isLoggedIn();
      const currentUser = getCurrentUser();
      
      if (hasToken) {
        // Nếu có token, giữ nguyên user từ localStorage cho đến khi verify xong
        // Điều này tránh "nhảy" UI khi reload
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
        
        try {
          setLoading(true);
          // Verify token với backend
          const userData = await authService.getCurrentUser();
          // Update với data mới nhất từ backend
          setUser(userData);
          setIsAuthenticated(true);
          // Update localStorage với user data mới nhất
          if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch (error) {
          console.error("Auth check error:", error);
          // Token không hợp lệ, đăng xuất
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        // Không có token, đảm bảo state là null
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      // Lấy token và user từ response (backend trả về 'token' không phải 'accessToken')
      const accessToken = response.token || response.accessToken;
      const userData = response.user;

      if (!accessToken || !userData) {
        throw new Error("Đăng nhập thất bại: Thiếu thông tin từ server");
      }

      // ✅ Lưu token và thông tin user vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      if (response.refreshToken) {
        localStorage.setItem("refreshToken", response.refreshToken);
      }

      // ✅ Cập nhật state ngay lập tức - QUAN TRỌNG: Phải set state trước khi return
      setUser(userData);
      setIsAuthenticated(true);

      // Dispatch event để wishlist tự động load
      window.dispatchEvent(new Event('userLoggedIn'));

      // Force re-render bằng cách dispatch storage event
      window.dispatchEvent(new Event('storage'));

      return response;
    } catch (error) {
      // Đảm bảo state được clear nếu login thất bại
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authService.updateProfile(userData);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    updateUser,
  };
};
