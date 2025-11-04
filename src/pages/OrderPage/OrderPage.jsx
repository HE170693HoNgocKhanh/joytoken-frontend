import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { message } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  CreditCardOutlined,
  WalletOutlined,
  BankOutlined,
  MobileOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  Container,
  CheckoutWrapper,
  LeftSection,
  RightSection,
  SectionTitle,
  FormGroup,
  Input,
  Select,
  TextArea,
  PaymentMethodGroup,
  PaymentOption,
  OrderSummary,
  OrderItem,
  SummaryRow,
  TotalRow,
  SubmitButton,
  EmptyCartMessage,
  SectionCard,
  FormGrid,
  IconWrapper,
  BackButton,
  ButtonGroup,
  LoadingSpinner,
  EmptyStateContainer,
} from "./style";

const OrderPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer"); // cod, bank_transfer, momo

  // Tính toán prices
  const selectedItems = cart.filter((item) => item.selected);
  const itemsPrice = selectedItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const taxPrice = itemsPrice * 0.1; // 10% VAT
  const shippingPrice = 30000; // Phí vận chuyển cố định
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Load cart từ localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);

    // Nếu không có item nào được chọn, redirect về cart
    const selected = saved.filter((item) => item.selected);
    if (selected.length === 0) {
      message.warning("Vui lòng chọn sản phẩm để thanh toán");
      navigate("/cart");
    }
  }, [navigate]);

  // Load thông tin user nếu có
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setShippingAddress((prev) => ({
        ...prev,
        fullName: user.name || user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Cập nhật số lượng sản phẩm trong cart
  const updateQuantity = (itemId, variantId, newQuantity) => {
    const maxStock =
      cart.find(
        (item) => item.id === itemId && item.selectedVariant?._id === variantId
      )?.selectedVariant?.countInStock || 999;

    const quantity = Math.max(1, Math.min(newQuantity, maxStock));

    const updatedCart = cart.map((item) =>
      item.id === itemId && item.selectedVariant?._id === variantId
        ? { ...item, quantity }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      message.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    if (selectedItems.length === 0) {
      message.error("Giỏ hàng trống");
      navigate("/cart");
      return;
    }

    try {
      setLoading(true);

      // Format items theo API
      const items = selectedItems.map((item) => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        variant: item.selectedVariant
          ? {
              size: item.selectedVariant.size,
              color: item.selectedVariant.color,
              _id: item.selectedVariant._id,
            }
          : null,
      }));

      // Gọi API tạo order (giữ nguyên format API hiện tại)
      const result = await orderService.createOrder({
        items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      if (result.success) {
        message.success(
          result.discountApplied
            ? result.message ||
                "Đặt hàng thành công — Voucher 10% đã được áp dụng!"
            : "Đặt hàng thành công!"
        );

        // Xóa các items đã đặt hàng khỏi cart
        const remainingCart = cart.filter((item) => !item.selected);
        localStorage.setItem("cart", JSON.stringify(remainingCart));
        window.dispatchEvent(new Event("cartUpdated"));

        // Redirect đến trang order detail hoặc order list
        const orderId = result.data?._id;
        if (orderId) {
          navigate(`/order/${orderId}`);
        } else {
          navigate("/order");
        }
      } else {
        message.error(result.message || "Đặt hàng thất bại");
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      message.error(
        error.message ||
          (typeof error === "string" ? error : "Có lỗi xảy ra khi đặt hàng")
      );
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <EmptyStateContainer>
        <EmptyCartMessage>
          <h2>Giỏ hàng của bạn đang trống</h2>
          <p>Vui lòng thêm sản phẩm trước khi thanh toán.</p>
          <button onClick={() => navigate("/cart")}>Tiếp tục mua sắm</button>
        </EmptyCartMessage>
      </EmptyStateContainer>
    );
  }

  return (
    <Container>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: 700,
            color: "#111827",
            marginLeft: "12rem",
          }}
        >
          Thanh toán
        </h1>
      </div>
      <CheckoutWrapper>
        <LeftSection>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Contact Information */}
            <SectionCard>
              <SectionTitle>
                <IconWrapper>
                  <UserOutlined />
                </IconWrapper>
                Thông tin liên hệ
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <label>Họ và tên *</label>
                  <Input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    required
                    placeholder="Nhập họ và tên của bạn"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Số điện thoại *</label>
                  <Input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                    placeholder="Nhập số điện thoại của bạn"
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: "1 / -1" }}>
                  <label>Địa chỉ email</label>
                  <Input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                </FormGroup>
              </FormGrid>
            </SectionCard>

            {/* Shipping Address */}
            <SectionCard>
              <SectionTitle>
                <IconWrapper>
                  <HomeOutlined />
                </IconWrapper>
                Địa chỉ giao hàng
              </SectionTitle>
              <FormGroup>
                <label>Địa chỉ *</label>
                <TextArea
                  value={shippingAddress.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                  placeholder="Nhập địa chỉ đầy đủ của bạn"
                  rows={3}
                />
              </FormGroup>
              <FormGrid>
                <FormGroup>
                  <label>Tỉnh/Thành phố *</label>
                  <Input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                    placeholder="Ví dụ: Hồ Chí Minh"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Quận/Huyện *</label>
                  <Input
                    type="text"
                    value={shippingAddress.district}
                    onChange={(e) =>
                      handleInputChange("district", e.target.value)
                    }
                    required
                    placeholder="Ví dụ: Quận 1"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Phường/Xã *</label>
                  <Input
                    type="text"
                    value={shippingAddress.ward}
                    onChange={(e) => handleInputChange("ward", e.target.value)}
                    required
                    placeholder="Ví dụ: Phường Bến Nghé"
                  />
                </FormGroup>
              </FormGrid>
            </SectionCard>

            {/* Payment Method */}
            <SectionCard>
              <SectionTitle>
                <IconWrapper>
                  <CreditCardOutlined />
                </IconWrapper>
                Phương thức thanh toán
              </SectionTitle>
              <PaymentMethodGroup>
                <PaymentOption
                  active={paymentMethod === "bank_transfer"}
                  onClick={() => setPaymentMethod("bank_transfer")}
                >
                  <input
                    type="radio"
                    id="bank_transfer"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <label htmlFor="bank_transfer">
                      <span className="payment-icon">
                        <BankOutlined />
                      </span>
                      <span className="payment-label">Thanh toán PayOS</span>
                      <span className="payment-badge">Khả dụng</span>
                    </label>
                    <p>Chuyển khoản trực tiếp vào tài khoản ngân hàng</p>
                  </div>
                </PaymentOption>
                <PaymentOption
                  active={paymentMethod === "cod"}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <label htmlFor="cod">
                      <span className="payment-icon">
                        <WalletOutlined />
                      </span>
                      <span className="payment-label">
                        Thanh toán khi nhận hàng
                      </span>
                      <span className="payment-badge">Khả dụng</span>
                    </label>
                    <p>Thanh toán khi bạn nhận được sản phẩm</p>
                  </div>
                </PaymentOption>
              </PaymentMethodGroup>
            </SectionCard>

            {/* Submit Button */}
            <SectionCard style={{ marginTop: 0, padding: "1.5rem" }}>
              <ButtonGroup>
                <BackButton type="button" onClick={() => navigate("/cart")}>
                  <ArrowLeftOutlined />
                  Quay lại giỏ hàng
                </BackButton>
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner />
                      Đang xử lý đơn hàng...
                    </>
                  ) : (
                    <>
                      <CreditCardOutlined />
                      Đặt hàng
                    </>
                  )}
                </SubmitButton>
              </ButtonGroup>
            </SectionCard>
          </form>
        </LeftSection>

        <RightSection>
          <SectionTitle>Tóm tắt đơn hàng</SectionTitle>
          <OrderSummary>
            {/* Order Items */}
            <div className="order-items">
              {selectedItems.map((item) => (
                <OrderItem key={`${item.id}-${item.selectedVariant?._id}`}>
                  <div className="item-image">
                    <img
                      src={item.selectedVariant?.image || item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "/images/product-test.jpg";
                      }}
                    />
                  </div>
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    {item.selectedVariant && (
                      <div className="item-variant">
                        {item.selectedVariant.size} -{" "}
                        {item.selectedVariant.color}
                      </div>
                    )}
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          type="button"
                          className="qty-btn minus"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedVariant?._id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn plus"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.selectedVariant?._id,
                              item.quantity + 1
                            )
                          }
                          disabled={
                            item.quantity >=
                            (item.selectedVariant?.countInStock ||
                              item.countInStock ||
                              999)
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="item-price">
                        ₫
                        {(
                          (item.price || 0) * (item.quantity || 1)
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </OrderItem>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="pricing-breakdown">
              <SummaryRow>
                <span>Tạm tính ({selectedItems.length} sản phẩm):</span>
                <span>₫{itemsPrice.toLocaleString()}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Thuế VAT (10%):</span>
                <span>₫{taxPrice.toLocaleString()}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Phí vận chuyển:</span>
                <span>₫{shippingPrice.toLocaleString()}</span>
              </SummaryRow>
              <TotalRow>
                <span>Tổng cộng:</span>
                <span>₫{totalPrice.toLocaleString()}</span>
              </TotalRow>
            </div>
          </OrderSummary>
        </RightSection>
      </CheckoutWrapper>
    </Container>
  );
};

export default OrderPage;
