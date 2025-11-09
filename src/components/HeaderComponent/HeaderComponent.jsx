import React, { useEffect, useState } from "react";
import { Input, Badge, Menu, Dropdown, Button } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  PhoneOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import DrawerCart from "../ProductComponent/DrawerCart";
import DrawerFavorite from "../ProductComponent/DrawerFavorite";
import ExchangeModal from "../ExchangeComponent/ExchangeModal";
import NotificationBell from "../NotificationComponent/NotificationBell";
import { useWishlist } from "../../hooks/useWishlist";
import {
  WrapperHeader,
  WrapperTop,
  WrapperLogo,
  WrapperSearch,
  WrapperMenu,
} from "./style";
import { conversationService } from "../../services/conversationService";

const { Search } = Input;
const ADMIN_PANEL_ROLES = ["admin", "seller", "staff"];

const Header = () => {
  const navigate = useNavigate();
  const { wishlistIds } = useWishlist();

  // --- State ---
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(wishlistIds?.length || 0);
  const [openDrawerCart, setOpenDrawerCart] = useState(false);
  const [openDrawerFavorite, setOpenDrawerFavorite] = useState(false);
  const [openExchangeModal, setOpenExchangeModal] = useState(false);

  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { token, user };
  });

  const { token, user } = authState;

  // --- Fetch categories ---
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

  // --- Update cart count ---
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

  // --- Update wishlist count ---
  useEffect(() => setWishlistCount(wishlistIds?.length || 0), [wishlistIds]);

  useEffect(() => {
    const handleWishlistUpdate = (e) => {
      setWishlistCount(e.detail?.count || wishlistIds?.length || 0);
    };
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [wishlistIds]);

  // --- Listen for auth changes ---
  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user") || "null");
      setAuthState({ token, user });
    };

    window.addEventListener("storage", updateAuth);
    window.addEventListener("userLoggedIn", updateAuth);
    window.addEventListener("userLoggedOut", updateAuth);

    return () => {
      window.removeEventListener("storage", updateAuth);
      window.removeEventListener("userLoggedIn", updateAuth);
      window.removeEventListener("userLoggedOut", updateAuth);
    };
  }, []);

  // --- Handlers ---
  const onSearch = (value) => navigate(`/products?search=${value}`);
  const handleLoginClick = () => navigate("/login");
  const handleProfileClick = () => navigate("/profile");
  const handleHistoryClick = () => navigate("/order-history");
  const handleAdminPanelClick = () => navigate("/admin/dashboard");

  const handleLogoutClick = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("wishlistIds");

    window.dispatchEvent(new Event("userLoggedOut"));
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));

    navigate("/");
  };

  const handleContactStaff = async () => {
    try {
      const res = await conversationService.createConversation(
        "68fd15a8288145826a47901e"
      );
      const conversation = res?.data;
      if (conversation?._id) navigate(`/chat/${conversation._id}`);
    } catch (error) {
      console.error("Lỗi tạo hoặc lấy conversation:", error);
    }
  };

  // --- User Dropdown Menu ---
  const items = [
    {
      key: "1",
      label: (
        <span
          onClick={handleProfileClick}
          style={{ cursor: "pointer", display: "block", padding: "4px 0" }}
        >
          Profile
        </span>
      ),
    },
    // Chỉ hiển thị Admin Panel nếu role hợp lệ
    ...(ADMIN_PANEL_ROLES.includes(user?.role?.toLowerCase())
      ? [
          {
            key: "2",
            label: (
              <span
                onClick={handleAdminPanelClick}
                style={{
                  cursor: "pointer",
                  display: "block",
                  padding: "4px 0",
                }}
              >
                {user.role === "admin"
                  ? "Admin"
                  : user.role === "staff"
                  ? "Staff"
                  : "Seller"}{" "}
                Panel
              </span>
            ),
          },
        ]
      : []),

    {
      key: "3",
      label: (
        <span
          onClick={handleHistoryClick}
          style={{ cursor: "pointer", display: "block", padding: "4px 0" }}
        >
          History
        </span>
      ),
    },
    {
      key: "4",
      danger: true,
      label: (
        <span
          onClick={handleLogoutClick}
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
            >
              Đổi hàng
            </Button>
          )}

          {token && user ? (
            <>
              <PhoneOutlined
                style={{ fontSize: "20px" }}
                onClick={handleContactStaff}
              />
              <Dropdown menu={{ items }}>
                <UserOutlined style={{ fontSize: "20px" }} />
              </Dropdown>
            </>
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
      />
    </WrapperHeader>
  );
};

export default Header;
