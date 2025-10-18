import React, { useState } from "react";
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
} from "./style.js";

const CartItem = ({ item, onToggle, onQtyChange, onVariantChange, onCustomChange, onRemove }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [localCustom, setLocalCustom] = useState({
    name: item.custom?.name || "",
    color: item.custom?.color || "#000000",
    font: item.custom?.font || "Arial",
    image: item.custom?.image || null,
  });

  const handleApply = () => {
    onCustomChange(localCustom);
    setOpenEdit(false);
  };

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (f) setLocalCustom((s) => ({ ...s, image: URL.createObjectURL(f) }));
  };

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
            <SmallSelect value={item.variant || ""} onChange={(e) => onVariantChange(e.target.value)}>
              <option value="">Chọn phân loại</option>
              <option value="Den, Size S">Đen, Size S</option>
              <option value="Den, Size M">Đen, Size M</option>
              <option value="White, Size M">Trắng, Size M</option>
            </SmallSelect>
          </div>

          {item.custom && (item.custom.name || item.custom.image) && (
            <div style={{ marginTop: 6 }}>
              <small>Custom:</small>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 6 }}>
                {item.custom.image ? <PreviewImg src={item.custom.image} alt="custom" /> : <div style={{ color: item.custom.color || "#000" }}>{item.custom.name}</div>}
                <div style={{ fontSize: 12, color: "#777" }}>{item.custom.font}</div>
              </div>
            </div>
          )}
        </InfoBox>
      </ProductCol>

      <PriceCol>₫{(item.price || 0).toLocaleString()}</PriceCol>

      <QtyCol>
        <button onClick={() => onQtyChange(Math.max(1, item.qty - 1))}>-</button>
        <span>{item.qty}</span>
        <button onClick={() => onQtyChange(item.qty + 1)}>+</button>
      </QtyCol>

      <PriceCol>₫{((item.price || 0) * (item.qty || 1)).toLocaleString()}</PriceCol>

      <ActionCol>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => setOpenEdit((s) => !s)} style={{ cursor: "pointer" }}>
            {openEdit ? "Đóng" : "Chỉnh sửa"}
          </button>
          <button onClick={onRemove} style={{ color: "#e64545", cursor: "pointer" }}>
            Xóa
          </button>
        </div>

        {openEdit && (
          <InlineEditBox>
            <label>Tên thêu:</label>
            <input value={localCustom.name} onChange={(e) => setLocalCustom({ ...localCustom, name: e.target.value })} />

            <label>Màu chữ:</label>
            <input type="color" value={localCustom.color} onChange={(e) => setLocalCustom({ ...localCustom, color: e.target.value })} />

            <label>Font:</label>
            <SmallSelect value={localCustom.font} onChange={(e) => setLocalCustom({ ...localCustom, font: e.target.value })}>
              <option>Arial</option>
              <option>Verdana</option>
              <option>Cursive</option>
              <option>Times New Roman</option>
            </SmallSelect>

            <label>Upload ảnh:</label>
            <input type="file" accept="image/*" onChange={handleUpload} />

            <div style={{ marginTop: 8 }}>
              {localCustom.image && <PreviewImg src={localCustom.image} alt="preview" />}
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={handleApply}>Lưu</button>
              <button onClick={() => setOpenEdit(false)}>Hủy</button>
            </div>
          </InlineEditBox>
        )}
      </ActionCol>
    </Row>
  );
};

export default CartItem;
