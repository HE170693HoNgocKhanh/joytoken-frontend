import React, { useState, useEffect } from "react";
import {
  Row,
  ProductCol,
  ImageBox,
  InfoBox,
  PriceCol,
  QtyCol,
  ActionCol,
  SmallSelect,
  InlineEditBox,
  PreviewImg,
  CustomInfoBox,
  CustomWrapper,
  CustomText,
  CustomFont,
  ActionButtons,
  EditButtons,
} from "./style.js";

const CartItem = ({
  item,
  onToggle,
  onQtyChange,
  onVariantChange,
  onRemove,
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await fetch("/data/database.json");
        const data = await res.json();
        const found = data.products.find((p) => p.id === item.id);
        if (found?.variants) setVariants(found.variants);
      } catch (err) {
        console.error("Lỗi tải variants:", err);
      }
    };
    fetchVariants();
  }, [item.id]);

  return (
    <Row>
      <ProductCol>
        <input type="checkbox" checked={!!item.selected} onChange={onToggle} />

        <ImageBox>
          <img src={item.image} alt={item.name} />
        </ImageBox>

        <InfoBox>
          <div className="title">{item.name}</div>

          <div className="variantRow">
            <SmallSelect
              value={item.variant || ""}
              onChange={(e) => onVariantChange(e.target.value)}
            >
              <option value="">Choose Style</option>
              {variants.map((v, i) => (
                <option
                  key={i}
                  value={v.name}
                  disabled={!v.stock}
                  style={!v.stock ? { color: "#999" } : {}}
                >
                  {v.name}
                </option>
              ))}
            </SmallSelect>
          </div>
        </InfoBox>
      </ProductCol>

      <PriceCol>₫{(item.price || 0).toLocaleString()}</PriceCol>

      <QtyCol>
        <button onClick={() => onQtyChange(Math.max(1, item.qty - 1))}>
          -
        </button>
        <span>{item.qty}</span>
        <button onClick={() => onQtyChange(item.qty + 1)}>+</button>
      </QtyCol>
      <PriceCol>
        ₫{((item.price || 0) * (item.qty || 1)).toLocaleString()}
      </PriceCol>
      <ActionCol>
        <ActionButtons>
          <button onClick={onRemove}>Xóa</button>
        </ActionButtons>
      </ActionCol>
    </Row>
  );
};

export default CartItem;
