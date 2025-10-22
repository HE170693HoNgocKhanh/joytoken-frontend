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

const CartItem = ({ item, onToggle, onQtyChange, onVariantChange, onCustomChange, onRemove }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [variants, setVariants] = useState([]); 
  const [localCustom, setLocalCustom] = useState({
    name: item.custom?.name || "",
    color: item.custom?.color || "#000000",
    font: item.custom?.font || "Arial",
    image: item.custom?.image || null,
  });


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

          
          {item.custom && (item.custom.name || item.custom.image) && (
            <CustomInfoBox>
              <small>Custom:</small>
              <CustomWrapper>
                {item.custom.image ? (
                  <PreviewImg src={item.custom.image} alt="custom" />
                ) : (
                  <CustomText color={item.custom.color}>{item.custom.name}</CustomText>
                )}
                <CustomFont>{item.custom.font}</CustomFont>
              </CustomWrapper>
            </CustomInfoBox>
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
        <ActionButtons>
          <button onClick={() => setOpenEdit((s) => !s)}>
            {openEdit ? "Đóng" : "Chỉnh sửa"}
          </button>
          <button onClick={onRemove}>Xóa</button>
        </ActionButtons>
        {openEdit && (
          <InlineEditBox>
            <label>Tên thêu:</label>
            <input
              value={localCustom.name}
              onChange={(e) =>
                setLocalCustom({ ...localCustom, name: e.target.value })
              }
            />

            <label>Màu chữ:</label>
            <input
              type="color"
              value={localCustom.color}
              onChange={(e) =>
                setLocalCustom({ ...localCustom, color: e.target.value })
              }
            />

            <label>Font:</label>
            <SmallSelect
              value={localCustom.font}
              onChange={(e) =>
                setLocalCustom({ ...localCustom, font: e.target.value })
              }
            >
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Pacifico">Pacifico</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Dancing Script">Dancing Script</option>
            </SmallSelect>

            <label>Upload ảnh:</label>
            <input type="file" accept="image/*" onChange={handleUpload} />

            {localCustom.image && <PreviewImg src={localCustom.image} alt="preview" />}

            <EditButtons>
              <button onClick={handleApply}>Lưu</button>
              <button onClick={() => setOpenEdit(false)}>Hủy</button>
            </EditButtons>
          </InlineEditBox>
        )}
      </ActionCol>
    </Row>
  );
};

export default CartItem;
