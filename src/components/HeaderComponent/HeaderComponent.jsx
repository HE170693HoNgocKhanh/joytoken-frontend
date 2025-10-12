import React from "react";
import { Input, Badge, Menu, Dropdown } from "antd";
import { ShoppingCartOutlined, UserOutlined, HeartOutlined } from "@ant-design/icons";
import {
  WrapperHeader,
  WrapperTop,
  WrapperLogo,
  WrapperSearch,
  WrapperMenu,
} from "./style";
import { Link, useNavigate } from "react-router-dom";

const { Search } = Input;

const Header = () => {
  const navigate = useNavigate();

  const onSearch = (value) => {
    console.log("Search:", value);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  // Submenu ANIMALS
  const animalMenu = (
    <Menu>
      <Menu.Item>Amphibians & Reptiles</Menu.Item>
      <Menu.Item>Arctic & Antarctic</Menu.Item>
      <Menu.Item>Bears</Menu.Item>
      <Menu.Item>Birds</Menu.Item>
      <Menu.Item>Bunnies</Menu.Item>
      <Menu.Item>Cats & Kittens</Menu.Item>
      <Menu.Item>Dogs & Puppies</Menu.Item>
      <Menu.Item>Dragons & Dinosaurs</Menu.Item>
      <Menu.Item>Farmyard</Menu.Item>
      <Menu.Item>Jungle & Safari</Menu.Item>
      <Menu.Item>Mythical Creatures</Menu.Item>
      <Menu.Item>Ocean</Menu.Item>
      <Menu.Item>Pets</Menu.Item>
      <Menu.Item>Woodland Animals</Menu.Item>
    </Menu>
  );

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
            <img
              src="/images/logo.jpg"
              alt="logo"
              style={{ height: "50px" }}
            />
          </Link>
        </WrapperLogo>

        {/* Icons */}
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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

          <HeartOutlined style={{ fontSize: "22px", cursor: "pointer" }} />
          <Badge count={2} size="small">
            <ShoppingCartOutlined style={{ fontSize: "22px", cursor: "pointer" }} />
          </Badge>
        </div>
      </WrapperTop>

      {/* Menu dưới */}
      <WrapperMenu mode="horizontal">
        <Menu.Item>NEW</Menu.Item>
        <Menu.Item>
          <Link to="/products">EXPLORE ALL</Link>
        </Menu.Item>
        <Menu.Item>DISCOVER</Menu.Item>
        <Dropdown overlay={animalMenu} trigger={["hover"]}>
          <Menu.Item>ANIMALS</Menu.Item>
        </Dropdown>
        <Menu.Item>AMUSEABLES</Menu.Item>
        <Menu.Item>BAGS & CHARMS</Menu.Item>
        <Menu.Item>BABY</Menu.Item>
        <Menu.Item>BOOKS</Menu.Item>
        <Menu.Item>PERSONALISED</Menu.Item>
        <Menu.Item>GIFTS</Menu.Item>
        <Menu.Item>JELLY JOURNAL</Menu.Item>
      </WrapperMenu>
    </WrapperHeader>
  );
};

export default Header;
