import React, { useState, useEffect, useRef } from "react";
import { Drawer, List, Button, message, Empty, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useWishlist } from "../../hooks/useWishlist";
import { isLoggedIn } from "../../services";
import { userService } from "../../services/userService";
import { productService } from "../../services/productService";

const { Text } = Typography;

const DrawerFavorite = ({ open, onClose, title = "Yêu thích" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { wishlistIds, remove, isLoading: wishlistLoading } = useWishlist();
  const navigate = useNavigate();
  const loadedRef = useRef(false);

  // Load wishlist product details when drawer opens
  useEffect(() => {
    const load = async () => {
      if (!open) {
        loadedRef.current = false;
        return;
      }
      
      // Chỉ load 1 lần khi mở drawer
      if (loadedRef.current) return;
      
      if (!wishlistIds?.length) {
        setProducts([]);
        loadedRef.current = true;
        return;
      }
      
      try {
        setLoading(true);
        
        // Load từ backend nếu đã login
        if (isLoggedIn()) {
          const remote = await userService.getWishlist();
          const list = remote?.data || remote || [];
          setProducts(list);
        } else {
          // Load từ localStorage
          const details = await Promise.all(
            wishlistIds.map((id) => productService.getProductById(id).catch(() => null))
          );
          const normalized = details.filter(Boolean).map((d) => (d?.data ? d.data : d));
          setProducts(normalized);
        }
        
        loadedRef.current = true;
      } catch (error) {
        console.error("Load wishlist error:", error);
        message.error("Không thể tải danh sách yêu thích");
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [open, wishlistIds.length]); // Load khi mở drawer hoặc số lượng thay đổi

  // Update products khi wishlistIds thay đổi (sau khi remove)
  useEffect(() => {
    if (!open || !loadedRef.current) return;
    
    // Nếu đã login, reload từ backend
    if (isLoggedIn()) {
      const load = async () => {
        try {
          const remote = await userService.getWishlist();
          const list = remote?.data || remote || [];
          setProducts(list);
        } catch (error) {
          console.error("Reload wishlist error:", error);
        }
      };
      load();
    } else {
      // Nếu chưa login, filter products theo wishlistIds
      setProducts((prev) => 
        prev.filter((p) => wishlistIds.includes(String(p._id || p.id)))
      );
    }
  }, [wishlistIds, open]);

  // Xóa sản phẩm khỏi wishlist
  const handleRemove = async (productId) => {
    try {
      await remove(productId);
      message.success("Đã xóa khỏi danh sách yêu thích!");
    } catch (error) {
      message.error("Không thể xóa sản phẩm");
    }
  };

  // Xem chi tiết sản phẩm
  const handleViewDetail = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>❤️</span>
          <span>{title}</span>
          {wishlistIds.length > 0 && (
            <span style={{ fontSize: "14px", color: "#999", fontWeight: "normal" }}>
              ({wishlistIds.length})
            </span>
          )}
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={420}
      styles={{
        body: { padding: "16px" },
      }}
    >
      {(loading || wishlistLoading) ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Spin size="large" tip="Đang tải..." />
        </div>
      ) : products.length === 0 ? (
        <Empty 
          description="Chưa có sản phẩm yêu thích nào." 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={products}
          renderItem={(item) => (
            <ListItemWrapper>
              <List.Item
                actions={[
                  <Button
                    key="view"
                    size="small"
                    type="link"
                    onClick={() => handleViewDetail(item._id || item.id)}
                    style={{ padding: "4px 8px" }}
                  >
                    Xem
                  </Button>,
                  <Button
                    key="remove"
                    size="small"
                    type="text"
                    danger
                    onClick={() => handleRemove(item._id || item.id)}
                    style={{ padding: "4px 8px" }}
                  >
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <ProductImage 
                      src={item.image} 
                      alt={item.name}
                      onClick={() => handleViewDetail(item._id || item.id)}
                    />
                  }
                  title={
                    <ProductTitle onClick={() => handleViewDetail(item._id || item.id)}>
                      {item.name}
                    </ProductTitle>
                  }
                  description={
                    <PriceText>
                      <span style={{ color: "#666", fontSize: "13px" }}>Giá: </span>
                      <span style={{ color: "#ff6b6b", fontWeight: 600, fontSize: "15px" }}>
                        {(item.price || 0).toLocaleString("vi-VN")} ₫
                      </span>
                    </PriceText>
                  }
                />
              </List.Item>
            </ListItemWrapper>
          )}
        />
      )}
    </Drawer>
  );
};

export default DrawerFavorite;

// 💅 Styled
const ListItemWrapper = styled.div`
  margin-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 8px;
  
  &:last-child {
    border-bottom: none;
  }
  
  .ant-list-item {
    padding: 12px 0;
  }
  
  .ant-list-item-action {
    margin-left: 16px;
  }
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProductTitle = styled(Text)`
  cursor: pointer;
  transition: color 0.2s ease;
  display: block;
  margin-bottom: 4px;
  
  &:hover {
    color: #ff6b6b !important;
  }
`;

const PriceText = styled.div`
  margin-top: 4px;
`;
