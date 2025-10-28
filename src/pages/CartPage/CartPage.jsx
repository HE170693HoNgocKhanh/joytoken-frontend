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
  const [cart, setCart] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulk, setBulk] = useState({
    name: "",
    color: "#000000",
    font: "Arial",
    image: null,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    const normalized = saved.map((p) => ({
      ...p,
      selected: false,
      qty: p.qty && p.qty > 0 ? p.qty : 1,
    }));
    setCart(normalized);
  }, []);
  console.log("cart", cart);

  useEffect(() => {
    if (cart.length === 0) setSelectAll(false);
    else setSelectAll(cart.every((i) => i.selected));
  }, [cart]);

  const persist = (next) => {
    setCart(next);
    const toStore = next.map(({ selected, ...rest }) => rest);
    localStorage.setItem("cart", JSON.stringify(toStore));
  };

  const toggleSelectAll = () => {
    const next = cart.map((i) => ({ ...i, selected: !selectAll }));
    persist(next);
    setSelectAll(!selectAll);
  };

  const toggleSelectItem = (id) => {
    const next = cart.map((i) =>
      i.id === id ? { ...i, selected: !i.selected } : i
    );
    persist(next);
  };

  const updateQty = (id, qty) => {
    const next = cart.map((i) =>
      i.id === id ? { ...i, qty: Math.max(1, qty) } : i
    );
    persist(next);
  };

  const updateVariant = (id, variant) => {
    const next = cart.map((i) => (i.id === id ? { ...i, variant } : i));
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

  const total = cart
    .filter((i) => i.selected)
    .reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);

  if (!cart || cart.length === 0)
    return (
      <EmptyBox>
        <h3>🛒 Giỏ hàng trống</h3>
        <p>Hãy thêm sản phẩm vào giỏ để tiếp tục mua sắm.</p>
        <button onClick={() => navigate("/")}>Tiếp tục mua sắm</button>
      </EmptyBox>
    );

  return (
    <CartContainer>
      <CartHeader>
        <div>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
          />{" "}
          Chọn tất cả ({cart.length})
        </div>
      </CartHeader>

      <ControlsRow>
        <LeftControls>
          <button
            onClick={() => {
              const next = cart.map((i) => ({ ...i, selected: true }));
              persist(next);
              setSelectAll(true);
            }}
          >
            Chọn tất cả
          </button>
          <DeleteButton onClick={deleteSelected}>Xóa</DeleteButton>
        </LeftControls>

        <RightControls>
          <div>🎟️ Shop Voucher</div>
        </RightControls>
      </ControlsRow>

      <CartTable>
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onToggle={() => toggleSelectItem(item.id)}
            onQtyChange={(q) => updateQty(item.id, q)}
            onVariantChange={(v) => updateVariant(item.id, v)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </CartTable>

      <FooterBar>
        <FooterLeft>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
          />{" "}
          <span>Chọn Tất Cả ({cart.length})</span>
          <DeleteButton onClick={deleteSelected}>Xóa</DeleteButton>
        </FooterLeft>

        <FooterRight>
          <div>
            Tổng cộng ({cart.filter((i) => i.selected).length} sp):{" "}
            <strong>₫{total.toLocaleString()}</strong>
          </div>
          <BuyButton
            disabled={total === 0}
            onClick={() => navigate("/checkout")}
          >
            Mua hàng
          </BuyButton>
        </FooterRight>
      </FooterBar>
    </CartContainer>
  );
};

export default CartPage;
