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
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
        </ImageBox>

        {/* Tên và variant */}
        <InfoBox>
          <div className="title" style={{ fontWeight: 600 }}>
            {name}
          </div>

          <div className="variantRow" style={{ marginTop: "4px" }}>
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
      <PriceCol>₫{(price || 0).toLocaleString()}</PriceCol>

      {/* Số lượng */}
      <QtyCol>
        <button
          onClick={() => onQtyChange(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => onQtyChange(quantity + 1)}>+</button>
      </QtyCol>

      {/* Tổng giá */}
      <PriceCol>₫{((price || 0) * quantity).toLocaleString()}</PriceCol>

      {/* Hành động */}
      <ActionCol>
        <ActionButtons>
          <Button onClick={onRemove}>Xoá</Button>
        </ActionButtons>
      </ActionCol>
    </Row>
  );
};

export default CartItem;
