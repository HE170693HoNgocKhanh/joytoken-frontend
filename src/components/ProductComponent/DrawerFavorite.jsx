import React, { useState, useEffect } from "react";
import { Drawer, List, Button, message, Empty, Typography } from "antd";
import styled from "styled-components";

const { Text } = Typography;

const DrawerFavorite = ({ open, onClose, title = "Yêu thích" }) => {
  const [wishlist, setWishlist] = useState([]);

  // 🧠 Load wishlist từ localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(saved);
  }, [open]); // Mỗi khi mở lại drawer thì reload

  // 🗑 Xóa sản phẩm khỏi wishlist
  const handleRemove = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
    message.success("Đã xóa khỏi danh sách yêu thích!");
  };

  // 👉 Xem chi tiết (nếu bạn có router, bạn có thể điều hướng sang trang chi tiết)
  const handleViewDetail = (id) => {
    message.info(`Xem chi tiết sản phẩm ID: ${id}`);
    // Ví dụ nếu dùng React Router:
    // navigate(`/product/${id}`);
  };

  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      styles={{
        body: { padding: "0 1rem" },
      }}
    >
      {wishlist.length === 0 ? (
        <Empty description="Chưa có sản phẩm yêu thích nào." />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={wishlist}
          renderItem={(item) => (
            <List.Item
              actions={[
                // <Button
                //   size="small"
                //   type="link"
                //   onClick={() => handleViewDetail(item.id)}
                // >
                //   Xem chi tiết
                // </Button>,
                <Button
                  size="small"
                  type="text"
                  danger
                  onClick={() => handleRemove(item.id)}
                >
                  Xóa
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<ProductImage src={item.image} alt={item.name} />}
                title={<Text strong>{item.name}</Text>}
                description={
                  <>
                    <Text type="secondary">
                      Giá:{" "}
                      <span style={{ color: "#ff9f1c" }}>
                        ${item.price.toFixed(2)}
                      </span>
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default DrawerFavorite;

// 💅 Styled
const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;
