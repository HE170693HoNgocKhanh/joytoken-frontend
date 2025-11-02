import React, { useEffect, useState } from "react";
import { Input, Badge, Menu, Dropdown, Space } from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HeartOutlined,
  SmileOutlined,
  DownOutlined,
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
const { Search } = Input;

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [openDrawerCart, setOpenDrawerCart] = useState(false);
  const [openDrawerFavorite, setOpenDrawerFavorite] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/categories");
        if (res.data.success) {
          setCategories(res.data.data); // ✅ gán dữ liệu vào state
        } else {
          console.error("Không lấy được categories:", res.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  const onSearch = (value) => {
    console.log("Search:", value);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const items = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            navigate("/profile");
          }}
        >
          Profile
        </a>
      ),
    },

    {
      key: "2",
      danger: true,
      label: (
        <a
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </a>
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
          {token && user ? (
            <Dropdown menu={{ items }}>
              <UserOutlined style={{ fontSize: "20px" }} />
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

          <HeartOutlined
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => setOpenDrawerFavorite(true)}
          />
          <Badge count={2} size="small" onClick={() => setOpenDrawerCart(true)}>
            <ShoppingCartOutlined
              style={{ fontSize: "22px", cursor: "pointer" }}
            />
          </Badge>
        </div>
      </WrapperTop>

      {/* Menu dưới */}
      <WrapperMenu mode="horizontal">
        <Menu.Item>
          <Link to="/products">EXPLORE ALL</Link>
        </Menu.Item>
        {categories.map((cate) => (
          <Menu.Item>
            <Link to={`/products?category=${cate._id}`}>{cate.name}</Link>
          </Menu.Item>
        ))}
      </WrapperMenu>
      <DrawerCart
        open={openDrawerCart}
        onClose={() => setOpenDrawerCart(false)}
        title="Cart"
      />
      <DrawerFavorite
        open={openDrawerFavorite}
        onClose={() => setOpenDrawerFavorite(false)}
        title="Favorite"
      />
    </WrapperHeader>
  );
};

export default Header;
