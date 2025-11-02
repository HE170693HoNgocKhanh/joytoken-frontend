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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  useEffect(() => {
    if (cart.length === 0) setSelectAll(false);
    else setSelectAll(cart.every((i) => i.selected));
  }, [cart]);

  const persist = (next) => {
    setCart(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const toggleSelectAll = () => {
    const next = cart.map((i) => ({ ...i, selected: !selectAll }));
    persist(next);
    setSelectAll(!selectAll);
  };

  const toggleSelectItem = (productId, variantId) => {
    const next = cart.map((i) =>
      i.id === productId && i.selectedVariant?._id === variantId
        ? { ...i, selected: !i.selected }
        : i
    );
    persist(next);
  };

  const updateQty = (id, qty) => {
    const next = cart.map((i) =>
      i.id === id ? { ...i, quantity: Math.max(1, qty) } : i
    );
    persist(next);
  };

  // ✅ Đã fix chuẩn theo logic bạn yêu cầu
  const updateVariant = (productId, currentVariantId, newVariantName) => {
    const nextCart = cart.map((item) => ({
      ...item,
      variants: [...item.variants],
      selectedVariant: item.selectedVariant
        ? { ...item.selectedVariant }
        : null,
    }));

    const currentIndex = nextCart.findIndex(
      (item) =>
        item.id === productId && item.selectedVariant?._id === currentVariantId
    );

    if (currentIndex === -1) return;

    const currentItem = nextCart[currentIndex];

    const newVariant = currentItem.variants.find(
      (v) => v.name === newVariantName
    );
    if (!newVariant) return;

    const duplicateIndex = nextCart.findIndex(
      (item, idx) =>
        idx !== currentIndex &&
        item.id === productId &&
        item.selectedVariant?._id === newVariant._id
    );

    if (duplicateIndex !== -1) {
      const duplicateItem = nextCart[duplicateIndex];
      const mergedQty =
        (duplicateItem.quantity || 1) + (currentItem.quantity || 1);

      const mergedItem = {
        ...duplicateItem,
        quantity: mergedQty,
        selectedVariant: { ...newVariant },
        image: newVariant.image || duplicateItem.image,
      };

      const updatedCart = nextCart.filter(
        (_, idx) => idx !== currentIndex && idx !== duplicateIndex
      );
      updatedCart.push(mergedItem);

      persist(updatedCart);
    } else {
      nextCart[currentIndex] = {
        ...currentItem,
        selectedVariant: { ...newVariant },
        image: newVariant.image || currentItem.image,
      };
      persist(nextCart);
    }
  };

  const removeItem = (productId, variantId) => {
    const next = cart.filter(
      (item) =>
        !(item.id === productId && item.selectedVariant?._id === variantId)
    );
    persist(next);
  };

  const deleteSelected = () => {
    const next = cart.filter((i) => !i.selected);
    persist(next);
  };

  const total = cart
    .filter((i) => i.selected)
    .reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

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
            key={item.id + (item.selectedVariant?._id || "")}
            item={item}
            cart={cart} // ✅ truyền thêm cart xuống
            onToggle={() =>
              toggleSelectItem(item.id, item.selectedVariant?._id)
            }
            onQtyChange={(q) => updateQty(item.id, q)}
            onVariantChange={(v) =>
              updateVariant(item.id, item.selectedVariant?._id, v)
            }
            onRemove={() => removeItem(item.id, item.selectedVariant?._id)}
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
