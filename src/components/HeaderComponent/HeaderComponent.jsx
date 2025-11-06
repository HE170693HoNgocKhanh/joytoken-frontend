import React, { useEffect, useState } from "react";
import { Input, Badge, Menu, Dropdown, Button } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  WrapperHeader,
  WrapperTop,
  WrapperLogo,
  WrapperSearch,
  WrapperMenu,
} from "./style";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DrawerCart from "../ProductComponent/DrawerCart";
import DrawerFavorite from "../ProductComponent/DrawerFavorite";
import ExchangeModal from "../ExchangeComponent/ExchangeModal";
import NotificationBell from "../NotificationComponent/NotificationBell";
import { useWishlist } from "../../hooks/useWishlist";

const { Search } = Input;

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [openDrawerCart, setOpenDrawerCart] = useState(false);
  const [openDrawerFavorite, setOpenDrawerFavorite] = useState(false);
  const [openExchangeModal, setOpenExchangeModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const { wishlistIds } = useWishlist();

  const navigate = useNavigate();
  
  // Update wishlist count when wishlistIds changes
  useEffect(() => {
    setWishlistCount(wishlistIds?.length || 0);
  }, [wishlistIds]);
  
  // Listen for wishlist update events
  useEffect(() => {
    const handleWishlistUpdate = (e) => {
      const count = e.detail?.count || wishlistIds?.length || 0;
      setWishlistCount(count);
    };
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    };
  }, [wishlistIds]);
  
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { token, user };
  });

  // Listen for storage changes to update auth state
  useEffect(() => {
    const updateAuthState = () => {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setAuthState({ token, user });
    };

    // Listen for storage events (from other tabs)
    window.addEventListener("storage", updateAuthState);
    
    // Listen for custom events (from same tab)
    window.addEventListener("userLoggedIn", updateAuthState);
    window.addEventListener("userLoggedOut", updateAuthState);

    return () => {
      window.removeEventListener("storage", updateAuthState);
      window.removeEventListener("userLoggedIn", updateAuthState);
      window.removeEventListener("userLoggedOut", updateAuthState);
    };
  }, []);

  const { token, user } = authState;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories");
        if (res.data.success && Array.isArray(res.data.data)) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy categories:", error.message);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      setCartCount(totalItems);
    };
    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const onSearch = (value) => navigate(`/products?search=${value}`);
  const handleLoginClick = () => navigate("/login");
  const handleProfileClick = (e) => {
    e?.preventDefault?.();
    navigate("/profile");
  };
  const handleHistoryClick = (e) => {
    e?.preventDefault?.();
    navigate("/order-history");
  };
  const handleLogoutClick = (e) => {
    e?.preventDefault?.();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Clear cart và wishlist
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("wishlistIds");
    
    // Dispatch events
    window.dispatchEvent(new Event("userLoggedOut"));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));
    
    navigate("/");
  };

  const items = [
    {
      key: "1",
      label: (
        <span 
          onClick={(e) => {
            e.preventDefault();
            handleProfileClick(e);
          }} 
          style={{ cursor: "pointer", display: "block", padding: "4px 0" }}
        >
          Profile
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span 
          onClick={(e) => {
            e.preventDefault();
            handleHistoryClick(e);
          }} 
          style={{ cursor: "pointer", display: "block", padding: "4px 0" }}
        >
          History
        </span>
      ),
    },
    {
      key: "3",
      danger: true,
      label: (
        <span 
          onClick={(e) => {
            e.preventDefault();
            handleLogoutClick(e);
          }} 
          style={{ cursor: "pointer", display: "block", padding: "4px 0" }}
        >
          Logout
        </span>
      ),
    },
  ];

  return (
    <WrapperHeader>
      <WrapperTop>
        {/* Search */}
        <WrapperSearch>
          <Search
            placeholder="Search our collection..."
            allowClear
            size="large"
            onSearch={onSearch}
          />
        </WrapperSearch>

        {/* Logo */}
        <WrapperLogo>
          <Link to="/">
            <img src="/images/logo.jpg" alt="logo" style={{ height: "50px" }} />
          </Link>
        </WrapperLogo>

        {/* Icons */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          {token && user && (
            <Button
              type="default"
              icon={<SwapOutlined />}
              onClick={() => setOpenExchangeModal(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Đổi hàng
            </Button>
          )}
          {token && user ? (
            <Dropdown menu={{ items }}>
              <UserOutlined style={{ fontSize: "20px", cursor: "pointer" }} />
            </Dropdown>
          ) : (
            <button
              onClick={handleLoginClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 10px",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <UserOutlined />
              Login
            </button>
          )}

          {token && user && <NotificationBell />}

          <Badge count={wishlistCount} size="small" offset={[-5, 5]}>
            <HeartOutlined
              style={{ fontSize: "22px", cursor: "pointer" }}
              onClick={() => setOpenDrawerFavorite(true)}
            />
          </Badge>

          <Badge count={cartCount} size="small">
            <ShoppingCartOutlined
              style={{ fontSize: "22px", cursor: "pointer" }}
              onClick={() => setOpenDrawerCart(true)}
            />
          </Badge>
        </div>
      </WrapperTop>

      {/* Menu dưới */}
      <WrapperMenu
        mode="horizontal"
        items={[
          { key: "all", label: <Link to="/products">EXPLORE ALL</Link> },
          ...(Array.isArray(categories)
            ? categories.map((cate) => ({
                key: cate._id,
                label: (
                  <Link to={`/products?category=${cate._id}`}>{cate.name}</Link>
                ),
              }))
            : []),
        ]}
      />

      {/* Drawer + Modal */}
      <DrawerCart
        open={openDrawerCart}
        onClose={() => setOpenDrawerCart(false)}
        title="Cart"
      />
      <DrawerFavorite
        open={openDrawerFavorite}
        onClose={() => setOpenDrawerFavorite(false)}
        title="Yêu thích"
      />
      <ExchangeModal
        visible={openExchangeModal}
        onCancel={() => setOpenExchangeModal(false)}
        onSuccess={() => {
          // Có thể refresh data nếu cần
        }}
      />
    </WrapperHeader>
  );
};

export default Header;
