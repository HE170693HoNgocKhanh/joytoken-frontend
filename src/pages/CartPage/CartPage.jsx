import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import {
  CartContainer,
  CartHeader,
  CartTable,
  TableHeader,
  HeaderCol,
  DeleteButton,
  FooterBar,
  FooterLeft,
  FooterRight,
  BuyButton,
  EmptyBox,
  VoucherSection,
  VoucherItem,
  VoucherLink,
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
    // Dispatch event để HeaderComponent cập nhật số lượng
    window.dispatchEvent(new Event("cartUpdated"));
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

  const updateQty = (id, variantId, qty) => {
    const next = cart.map((i) =>
      i.id === id && i.selectedVariant?._id === variantId
        ? { ...i, quantity: Math.max(1, qty) }
        : i
    );
    persist(next);
  };

  // ✅ Đã fix chuẩn theo logic bạn yêu cầu
  const updateVariant = (
    productId,
    currentVariantId,
    newVariantDisplayName
  ) => {
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

    // Tìm variant theo format "size - color"
    const newVariant = currentItem.variants.find(
      (v) => `${v.size} - ${v.color}` === newVariantDisplayName
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

  // Tính tổng số lượng sản phẩm đã chọn
  const selectedItems = cart.filter((i) => i.selected);
  const totalQuantity = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  // Tính tổng tiền trước giảm giá
  const subtotal = selectedItems.reduce(
    (s, i) => s + (i.price || 0) * (i.quantity || 1),
    0
  );

  // Tự động áp dụng voucher 5% nếu mua 3 sản phẩm trở lên (tối đa 10,000₫)
  const hasVoucher = totalQuantity >= 3;
  const discountAmount = hasVoucher ? Math.min(Math.round(subtotal * 0.05), 10000) : 0;
  const total = subtotal - discountAmount;

  // Hàm xử lý khi nhấn "Mua hàng"
  const handleBuy = () => {
    // Lưu thông tin voucher vào localStorage để trang Order sử dụng
    const finalDiscountAmount = Math.min(discountAmount, 10000);
    const orderData = {
      selectedItems,
      subtotal,
      discountAmount: finalDiscountAmount,
      total: subtotal - finalDiscountAmount,
      hasVoucher,
      voucherInfo: hasVoucher ? {
        type: 'percentage',
        value: 5,
        maxDiscount: 10000,
        applied: finalDiscountAmount
      } : null
    };
    localStorage.setItem('orderData', JSON.stringify(orderData));
    navigate("/order");
  };

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

      <TableHeader>
        <HeaderCol style={{ gridColumn: "1 / 3" }}>Sản Phẩm</HeaderCol>
        <HeaderCol>Đơn Giá</HeaderCol>
        <HeaderCol>Số Lượng</HeaderCol>
        <HeaderCol>Số Tiền</HeaderCol>
        <HeaderCol>Thao Tác</HeaderCol>
      </TableHeader>

      <CartTable>
        {cart.map((item) => (
          <CartItem
            key={item.id + (item.selectedVariant?._id || "")}
            item={item}
            cart={cart}
            onToggle={() =>
              toggleSelectItem(item.id, item.selectedVariant?._id)
            }
            onQtyChange={(q) =>
              updateQty(item.id, item.selectedVariant?._id, q)
            }
            onVariantChange={(v) =>
              updateVariant(item.id, item.selectedVariant?._id, v)
            }
            onRemove={() => removeItem(item.id, item.selectedVariant?._id)}
          />
        ))}
      </CartTable>

      {hasVoucher && (
        <VoucherSection>
          <VoucherItem>
            <span style={{ color: "#e74c3c", marginRight: "8px" }}>🎟️</span>
            <span>Voucher 5% đã được áp dụng (Mua 3 sản phẩm trở lên, tối đa 10,000₫)</span>
            <span style={{ color: "#28a745", fontWeight: 600 }}>
              -₫{Math.min(discountAmount, 10000).toLocaleString()}
            </span>
          </VoucherItem>
        </VoucherSection>
      )}

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
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
            {hasVoucher && (
              <>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  Tạm tính: <span>₫{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ fontSize: "14px", color: "#28a745" }}>
                  Giảm giá (5%, tối đa 10,000₫): <span>-₫{Math.min(discountAmount, 10000).toLocaleString()}</span>
                </div>
              </>
            )}
            <div style={{ fontSize: "16px", fontWeight: 600 }}>
              Tổng cộng ({totalQuantity} sp):{" "}
              <strong style={{ color: "#ff6b6b", fontSize: "20px" }}>
                ₫{(subtotal - Math.min(discountAmount, 10000)).toLocaleString()}
              </strong>
            </div>
          </div>
          <BuyButton disabled={total === 0} onClick={handleBuy}>
            Mua hàng
          </BuyButton>
        </FooterRight>
      </FooterBar>
    </CartContainer>
  );
};

export default CartPage;
