import React from "react";
import {
  Row,
  ProductCol,
  ImageBox,
  InfoBox,
  PriceCol,
  QtyCol,
  ActionCol,
  SmallSelect,
  ActionButtons,
} from "./style.js";
import { Button } from "antd";

const CartItem = ({
  item,
  cart, // ✅ nhận thêm cart
  onToggle,
  onQtyChange,
  onVariantChange,
  onRemove,
}) => {
  const { name, image, price, quantity, selected, variants, selectedVariant } =
    item;

  return (
    <Row>
      {/* Checkbox */}
      <ProductCol>
        <input
          type="checkbox"
          checked={!!selected}
          onChange={onToggle}
          style={{ marginRight: "8px" }}
        />

        {/* Ảnh */}
        <ImageBox>
          <img
            src={selectedVariant?.image || image}
            alt={name}
          />
        </ImageBox>

        {/* Tên và variant */}
        <InfoBox>
          <div className="title" style={{ fontWeight: 600, fontSize: "16px", marginBottom: "8px" }}>
            {name}
          </div>

          <div className="variantRow" style={{ marginTop: "8px" }}>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
              Phân Loại Hàng:
            </div>
            <SmallSelect
              value={
                selectedVariant
                  ? `${selectedVariant.size} - ${selectedVariant.color}`
                  : ""
              }
              onChange={(e) => onVariantChange(e.target.value)}
            >
              {variants?.map((v, i) => {
                const variantName = `${v.size} - ${v.color}`;
                const isTaken = cart.some(
                  (c) =>
                    c.id === item.id &&
                    c.selectedVariant?._id === v._id &&
                    c.selectedVariant?._id !== item.selectedVariant?._id
                );

                return (
                  <option
                    key={i}
                    value={variantName}
                    disabled={v.countInStock === 0 || isTaken}
                    style={
                      v.countInStock === 0 || isTaken ? { color: "#999" } : {}
                    }
                  >
                    {variantName}
                    {v.countInStock === 0
                      ? " (Hết hàng)"
                      : isTaken
                      ? " (Đã có trong giỏ)"
                      : ""}
                  </option>
                );
              })}
            </SmallSelect>
          </div>
        </InfoBox>
      </ProductCol>

      {/* Giá */}
      <PriceCol>
        {selectedVariant?.originalPrice && selectedVariant.originalPrice > price ? (
          <div>
            <div style={{ textDecoration: "line-through", color: "#999", fontSize: "14px" }}>
              ₫{selectedVariant.originalPrice.toLocaleString()}
            </div>
            <div style={{ color: "#333", fontWeight: 600, fontSize: "16px" }}>
              ₫{(price || 0).toLocaleString()}
            </div>
          </div>
        ) : (
          <div style={{ color: "#333", fontWeight: 600, fontSize: "16px" }}>
            ₫{(price || 0).toLocaleString()}
          </div>
        )}
      </PriceCol>

      {/* Số lượng */}
      <QtyCol>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => onQtyChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => onQtyChange(quantity + 1)}>+</button>
          </div>
          {(selectedVariant?.countInStock ?? item.countInStock) > 0 && (
            <div style={{ color: "#ff9800", fontSize: "12px", marginTop: "4px" }}>
              Còn {(selectedVariant?.countInStock ?? item.countInStock)} sản phẩm
            </div>
          )}
        </div>
      </QtyCol>

      {/* Tổng giá */}
      <PriceCol>
        <div style={{ color: "#ff9800", fontWeight: 700, fontSize: "18px" }}>
          ₫{((price || 0) * quantity).toLocaleString()}
        </div>
      </PriceCol>

      {/* Hành động */}
      <ActionCol>
        <ActionButtons>
          <Button onClick={onRemove} style={{ marginBottom: "8px" }}>Xóa</Button>
          <Button type="link" style={{ color: "#333", fontSize: "12px", padding: 0 }}>
            Tìm sản phẩm tương tự
            <span style={{ color: "#e74c3c", marginLeft: "4px" }}>▼</span>
          </Button>
        </ActionButtons>
      </ActionCol>
    </Row>
  );
};

export default CartItem;
