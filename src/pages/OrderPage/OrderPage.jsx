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

  // 🧾 Form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    country: "Vietnam",
    postalCode: "700000",
  });

  // ⚙️ Default payment method → PAYOS cho đúng enum backend
  const [paymentMethod, setPaymentMethod] = useState("PayOS");

  // 💰 Tính toán giá
  const selectedItems = cart.filter((item) => item.selected);
  const itemsPrice = selectedItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const taxPrice = itemsPrice * 0.1;
  const shippingPrice = 3000;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // 🛒 Load cart
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
    const selected = saved.filter((item) => item.selected);
    if (selected.length === 0) {
      message.warning("Vui lòng chọn sản phẩm để thanh toán");
      navigate("/cart");
    }
  }, [navigate]);

  // 👤 Load user info nếu có
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

  // 🔁 Update số lượng sản phẩm
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

  // 🧾 Gửi đơn hàng
  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
  
      // ✅ Thêm returnUrl/cancelUrl nếu cần customize (optional, backend dùng default)
      const currentDomain = window.location.origin;  // e.g., http://localhost:3000
      const returnUrl = `${currentDomain}/payment/success`;
      const cancelUrl = `${currentDomain}/payment/cancel`;
  
      const result = await orderService.createOrder({
        items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        returnUrl,  // Pass từ FE nếu muốn override backend default
        cancelUrl,
      });
  
      if (result.success) {
        message.success(result.message || "Đặt hàng thành công!");
  
        // 🔄 Xóa item đã đặt khỏi cart (giữ nguyên, nhưng với PayOS có thể delay đến webhook)
        const remainingCart = cart.filter((item) => !item.selected);
        localStorage.setItem("cart", JSON.stringify(remainingCart));
        window.dispatchEvent(new Event("cartUpdated"));
  
        const orderId = result.data?._id;
  
        // ✅ Conditional redirect dựa trên PayOS
        if (result.payOS && result.payOS.checkoutUrl) {
          // PayOS: Redirect external đến checkout (mở tab hiện tại hoặc mới)
          window.location.href = result.payOS.checkoutUrl;  // Hoặc window.open(result.payOS.checkoutUrl, '_blank');
          // Optional: Lưu orderId để sync sau (e.g., khi callback success)
          localStorage.setItem('pendingOrderId', orderId);
        } else {
          // COD/other: Navigate internal đến order detail
          navigate(orderId ? `/order/${orderId}` : "/order");
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
      // ✅ Với PayOS fail, backend rollback → Không clear cart ở đây (đã handle trong try)
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
            {/* 🧍‍♂️ Thông tin liên hệ */}
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
                  />
                </FormGroup>

                <FormGroup>
                  <label>Số điện thoại *</label>
                  <Input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: "1 / -1" }}>
                  <label>Email</label>
                  <Input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </FormGroup>
              </FormGrid>
            </SectionCard>

            {/* 🚚 Địa chỉ giao hàng */}
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
                  />
                </FormGroup>

                <FormGroup>
                  <label>Phường/Xã *</label>
                  <Input
                    type="text"
                    value={shippingAddress.ward}
                    onChange={(e) => handleInputChange("ward", e.target.value)}
                    required
                  />
                </FormGroup>
              </FormGrid>

              {/* ➕ Thêm country và postalCode */}
              <FormGrid>
                <FormGroup>
                  <label>Quốc gia *</label>
                  <Input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Mã bưu điện *</label>
                  <Input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      handleInputChange("postalCode", e.target.value)
                    }
                    required
                  />
                </FormGroup>
              </FormGrid>
            </SectionCard>

            {/* 💳 Phương thức thanh toán */}
            <SectionCard>
              <SectionTitle>
                <IconWrapper>
                  <CreditCardOutlined />
                </IconWrapper>
                Phương thức thanh toán
              </SectionTitle>
              <PaymentMethodGroup>
                <PaymentOption
                  active={paymentMethod === "PayOS"}
                  onClick={() => setPaymentMethod("PayOS")}
                >
                  <input
                    type="radio"
                    id="payos"
                    name="paymentMethod"
                    value="PAYOS"
                    checked={paymentMethod === "PayOS"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <label htmlFor="payos">
                      <span className="payment-icon">
                        <BankOutlined />
                      </span>
                      <span className="payment-label">Thanh toán PayOS</span>
                      <span className="payment-badge">Khả dụng</span>
                    </label>
                    <p>Chuyển khoản qua PayOS an toàn, tự động xác nhận</p>
                  </div>
                </PaymentOption>

                <PaymentOption
                  active={paymentMethod === "COD"}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === "COD"}
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
                    <p>Thanh toán trực tiếp khi nhận được hàng</p>
                  </div>
                </PaymentOption>
              </PaymentMethodGroup>
            </SectionCard>

            {/* 🟢 Submit */}
            <SectionCard style={{ marginTop: 0, padding: "1.5rem" }}>
              <ButtonGroup>
                <BackButton type="button" onClick={() => navigate("/cart")}>
                  <ArrowLeftOutlined /> Quay lại giỏ hàng
                </BackButton>
                <SubmitButton type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoadingSpinner /> Đang xử lý đơn hàng...
                    </>
                  ) : (
                    <>
                      <CreditCardOutlined /> Đặt hàng
                    </>
                  )}
                </SubmitButton>
              </ButtonGroup>
            </SectionCard>
          </form>
        </LeftSection>

        {/* 🧾 Tóm tắt đơn hàng */}
        <RightSection>
          <SectionTitle>Tóm tắt đơn hàng</SectionTitle>
          <OrderSummary>
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

            {/* Tổng giá */}
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
