import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import {
  CartContainer,
  CartHeader,
  CartTable,
  ControlsRow,
  LeftControls,
  RightControls,
  BulkApplyBox,
  SmallInput,
  ApplyButton,
  DeleteButton,
  FooterBar,
  FooterLeft,
  FooterRight,
  BuyButton,
  EmptyBox,
} from "./style.js";

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]); // each item: { id, name, image, price, qty, variant, custom: {...}, selected }
  const [selectAll, setSelectAll] = useState(false);
  const [bulk, setBulk] = useState({ name: "", color: "#000000", font: "Arial", image: null });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    // normalize shape and ensure selected flag
    const normalized = saved.map((p) => ({ selected: false, qty: p.qty || p.qty === 0 ? p.qty : p.qty || 1, ...p }));
    setCart(normalized);
  }, []);

  useEffect(() => {
    // update selectAll when cart changes
    if (cart.length === 0) setSelectAll(false);
    else setSelectAll(cart.every((i) => i.selected));
  }, [cart]);

  const persist = (next) => {
    setCart(next);
    // store without `selected` property
    const toStore = next.map(({ selected, ...rest }) => rest);
    localStorage.setItem("cart", JSON.stringify(toStore));
  };

  const toggleSelectAll = () => {
    const next = cart.map((i) => ({ ...i, selected: !selectAll }));
    persist(next);
    setSelectAll(!selectAll);
  };

  const toggleSelectItem = (id) => {
    const next = cart.map((i) => (i.id === id ? { ...i, selected: !i.selected } : i));
    persist(next);
  };

  const updateQty = (id, qty) => {
    const next = cart.map((i) => (i.id === id ? { ...i, qty } : i));
    persist(next);
  };

  const updateVariant = (id, variant) => {
    const next = cart.map((i) => (i.id === id ? { ...i, variant } : i));
    persist(next);
  };

  const updateCustom = (id, custom) => {
    const next = cart.map((i) => (i.id === id ? { ...i, custom: { ...(i.custom || {}), ...custom } } : i));
    persist(next);
  };

  const removeItem = (id) => {
    const next = cart.filter((i) => i.id !== id);
    persist(next);
  };

  const deleteSelected = () => {
    const next = cart.filter((i) => !i.selected);
    persist(next);
  };

  const applyBulkToSelected = () => {
    const next = cart.map((i) => (i.selected ? { ...i, custom: { ...(i.custom || {}), name: bulk.name, color: bulk.color, font: bulk.font, image: bulk.image || (i.custom && i.custom.image) } } : i));
    persist(next);
  };

  const saveSelectedToWishlist = () => {
    const selected = cart.filter((i) => i.selected).map(({ selected: sel, ...rest }) => rest);
    if (selected.length === 0) {
      alert("Vui lòng chọn sản phẩm để lưu vào wishlist.");
      return;
    }
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const merged = [...wishlist, ...selected];
    localStorage.setItem("wishlist", JSON.stringify(merged));
    // navigate to wishlist page
    navigate("/wishlist");
  };

  const total = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);

  if (!cart || cart.length === 0)
    return (
      <EmptyBox>
        <h3>Giỏ hàng trống</h3>
        <p>Hãy thêm sản phẩm vào giỏ để tiếp tục</p>
        <button onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
      </EmptyBox>
    );

  return (
    <CartContainer>
      <CartHeader>
        <div>
          <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /> Chọn tất cả ({cart.length})
        </div>
      </CartHeader>

      <ControlsRow>
        <LeftControls>
          <button onClick={() => { setCart(cart.map(i => ({ ...i, selected: true }))); setSelectAll(true); }}>Chọn tất cả</button>
          <DeleteButton onClick={deleteSelected}>Xóa</DeleteButton>
          <button onClick={saveSelectedToWishlist}>Lưu vào mục Đã thích</button>
        </LeftControls>

        <RightControls>
          <div>Shop Voucher</div>
        </RightControls>
      </ControlsRow>

      <BulkApplyBox>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Áp dụng cho sản phẩm đã chọn</div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <SmallInput placeholder="Tên thêu" value={bulk.name} onChange={(e) => setBulk({ ...bulk, name: e.target.value })} />
          <input type="color" value={bulk.color} onChange={(e) => setBulk({ ...bulk, color: e.target.value })} style={{ width: 44, height: 34, border: "none", padding: 0 }} />
          <select value={bulk.font} onChange={(e) => setBulk({ ...bulk, font: e.target.value })}>
            <option>Arial</option>
            <option>Verdana</option>
            <option>Cursive</option>
            <option>Times New Roman</option>
          </select>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) setBulk({ ...bulk, image: URL.createObjectURL(f) });
              }}
            />
          </label>

          <ApplyButton onClick={applyBulkToSelected}>Áp dụng</ApplyButton>
        </div>
      </BulkApplyBox>

      <CartTable>
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onToggle={() => toggleSelectItem(item.id)}
            onQtyChange={(newQty) => updateQty(item.id, newQty)}
            onVariantChange={(v) => updateVariant(item.id, v)}
            onCustomChange={(c) => updateCustom(item.id, c)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </CartTable>

      <FooterBar>
        <FooterLeft>
          <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} /> <span>Chọn Tất Cả ({cart.length})</span>
          <DeleteButton onClick={deleteSelected}>Xóa</DeleteButton>
        </FooterLeft>

        <FooterRight>
          <div>
            Tổng cộng ({cart.length} sản phẩm): <strong style={{ color: "#e64545" }}>₫{total.toLocaleString()}</strong>
          </div>
          <BuyButton onClick={() => navigate("/checkout")}>Mua Hàng</BuyButton>
        </FooterRight>
      </FooterBar>
    </CartContainer>
  );
};

export default CartPage;
