import React, { useState } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button,
} from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SwapOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { Modal } from "antd";
import ModalContact from "../ModalComponent/ModalContact";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledHeader = styled(Header)`
  background: #fff;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const StyledSider = styled(Sider)`
  .ant-layout-sider-trigger {
    background: #001529;
  }
`;

const StyledContent = styled(Content)`
  margin: 24px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #002140;
  margin-bottom: 1px;
`;

const LogoText = styled(Title)`
  color: #fff !important;
  margin: 0 !important;
  font-size: 18px !important;
`;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    user && user.role === "admin"
      ? {
          key: "/admin/users",
          icon: <UserOutlined />,
          label: "Quản lý User",
        }
      : null,
    {
      key: "/admin/products",
      icon: <ShoppingOutlined />,
      label: "Quản lý Sản phẩm",
    },
    {
      key: "/admin/categories",
      icon: <AppstoreOutlined />,
      label: "Quản lý Danh mục",
    },
    user && user.role !== "seller"
      ? {
          key: "/admin/inventory",
          icon: <BarChartOutlined />,
          label: "Quản lý Kho",
        }
      : null,
    {
      key: "/admin/orders",
      icon: <ShoppingOutlined />,
      label: "Quản lý Đơn hàng",
    },
    user && user.role !== "staff"
      ? {
          key: "/admin/exchanges",
          icon: <SwapOutlined />,
          label: "Quản lý Đổi hàng",
        }
      : null,
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = async () => {
    // Clear tất cả localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Clear cart và wishlist
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    localStorage.removeItem("wishlistIds");

    // Dispatch events
    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("storage"));

    navigate("/login");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <StyledLayout>
      <StyledSider trigger={null} collapsible collapsed={collapsed}>
        <LogoContainer>
          <img
            src="../../../images/logo.jpg"
            alt="Logo"
            style={{ width: 20, height: 20, objectFit: "contain" }}
          />
          <LogoText level={4}>{collapsed ? "JT" : "JoyToken Admin"}</LogoText>
        </LogoContainer>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </StyledSider>

      <Layout>
        <StyledHeader>
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
            {user &&
              ["admin", "staff", "seller"].includes(
                user.role.toLowerCase()
              ) && (
                <Title level={4} style={{ margin: 0 }}>
                  {user.role === "admin"
                    ? "Admin"
                    : user.role === "staff"
                    ? "Staff"
                    : "Seller"}{" "}
                  Panel
                </Title>
              )}
          </Space>

          <Space size="middle">
            <Button
              type="text"
              icon={<WhatsAppOutlined />}
              onClick={showModal}
              style={{ fontSize: "16px" }}
            >
              Liên hệ
            </Button>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} />
                {user &&
                  ["admin", "staff", "seller"].includes(
                    user.role.toLowerCase()
                  ) && (
                    <span>
                      {user.role === "admin"
                        ? "Admin"
                        : user.role === "staff"
                        ? "Staff"
                        : "Seller"}{" "}
                      User
                    </span>
                  )}
              </Space>
            </Dropdown>
          </Space>
        </StyledHeader>

        <StyledContent>{children}</StyledContent>
      </Layout>
      <ModalContact open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </StyledLayout>
  );
};

export default AdminLayout;
