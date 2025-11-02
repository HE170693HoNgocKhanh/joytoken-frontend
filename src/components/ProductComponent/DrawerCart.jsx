import React, { useState, useEffect } from "react";
import { Drawer, Button, InputNumber, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const DrawerCart = ({ open, onClose, title = "Giỏ hàng của bạn" }) => {
  const [cart, setCart] = useState([]);

  // ✅ Lấy cart từ localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, [open]);

  // ✅ Lưu lại cart
  const persist = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  // ✅ Thay đổi số lượng
  const handleQuantityChange = (id, variantId, value) => {
    const next = cart.map((item) =>
      item.id === id && item.selectedVariant?._id === variantId
        ? { ...item, quantity: value }
        : item
    );
    persist(next);
  };

  // ✅ Xoá sản phẩm khỏi cart
  const handleRemove = (id, variantId) => {
    const next = cart.filter(
      (item) => !(item.id === id && item.selectedVariant?._id === variantId)
    );
    persist(next);
    message.success("Đã xoá sản phẩm khỏi giỏ hàng!");
  };

  // ✅ Tổng tiền
  const total = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={open}
      width={420}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 16px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <strong>Tổng cộng: ₫{total.toLocaleString()}</strong>
          <Button
            type="primary"
            onClick={() => message.info("Đi đến thanh toán...")}
          >
            Thanh toán
          </Button>
        </div>
      }
    >
      {cart.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        cart.map((item) => (
          <div
            key={`${item.id}-${item.selectedVariant?._id}`}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
              borderBottom: "1px solid #f5f5f5",
              paddingBottom: 10,
            }}
          >
            {/* Ảnh */}
            <img
              src={item.selectedVariant?.image || item.image}
              alt={item.name}
              style={{
                width: 70,
                height: 70,
                borderRadius: 8,
                objectFit: "cover",
                marginRight: 12,
              }}
            />

            {/* Thông tin */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: "#666", fontSize: 13 }}>
                Biến thể: {item.selectedVariant?.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.selectedVariant?._id,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>

                <div style={{ width: 32, textAlign: "center" }}>
                  {item.quantity}
                </div>

                <Button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      item.selectedVariant?._id,
                      item.quantity + 1
                    )
                  }
                >
                  +
                </Button>
              </div>
            </div>

            {/* Giá và nút xoá */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>
                ₫{(item.price * item.quantity).toLocaleString()}
              </div>
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemove(item.id, item.selectedVariant?._id)}
              />
            </div>
          </div>
        ))
      )}
    </Drawer>
  );
};

export default DrawerCart;
