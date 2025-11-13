import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  List,
  Typography,
  Spin,
  Button,
  Alert,
  Row,
  Col,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { orderService } from "../../services";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const searchParams = new URLSearchParams(location.search);
  const orderIdFromQuery = searchParams.get("orderId");

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // ✅ Flag để tránh gọi API nhiều lần

  // Lấy orderId fallback
  const pendingOrderId =
    localStorage.getItem("pendingOrderId") ||
    localStorage.getItem("lastOrderId") ||
    orderIdFromQuery;

  // Xử lý PayOS: Tạo Order từ PendingOrder khi thanh toán thành công
  useEffect(() => {
    const handlePayOSPayment = async () => {
      if (!pendingOrderId) return;
      if (order && order.paymentMethod === "COD") return; // Đã có order COD, không xử lý PayOS
      if (isProcessingPayment) return; // ✅ Đang xử lý, không gọi lại

      // ✅ Kiểm tra xem đã xử lý payment cho pendingOrderId này chưa
      const processedKey = `payos_processed_${pendingOrderId}`;
      if (localStorage.getItem(processedKey)) {
        console.log("⚠️ Payment đã được xử lý trước đó, bỏ qua");
        return;
      }

      // ✅ Kiểm tra token trước khi gọi API
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("⚠️ Không tìm thấy token, thử lấy từ sessionStorage");
        const sessionToken = sessionStorage.getItem("accessToken");
        if (sessionToken) {
          localStorage.setItem("accessToken", sessionToken);
          const sessionUser = sessionStorage.getItem("user");
          if (sessionUser) {
            localStorage.setItem("user", sessionUser);
          }
        } else {
          setError(
            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để xem đơn hàng."
          );
          return;
        }
      }

      try {
        setIsProcessingPayment(true);
        setLoading(true);

        // ✅ Đánh dấu đã bắt đầu xử lý
        localStorage.setItem(processedKey, "true");

        // Với PayOS: Gọi updateOrderToPaid để tạo Order từ PendingOrder
        const data = {
          id: pendingOrderId,
          status: "COMPLETED",
          update_time: dayjs().toISOString(),
          email_address: user?.email,
        };
        const res = await orderService.updateOrderToPaid(pendingOrderId, data);

        if (res.success && res.data) {
          console.log("✅ Thanh toán hoàn tất, đơn hàng đã được tạo:", res);
          setOrder(res.data);

          // Xóa cart sau khi thanh toán thành công
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const orderProductIds = res.data.items.map(
            (item) => item.productId?._id || item.productId
          );
          const remainingCart = cart.filter((item) => {
            return !res.data.items.some((orderItem) => {
              const orderVariantId = orderItem.variant?._id;
              const itemVariantId = item.selectedVariant?._id;
              const orderProductId =
                orderItem.productId?._id || orderItem.productId;
              const itemProductId = item.id || item.productId;

              if (orderVariantId) {
                // Nếu order có variant, chỉ xóa đúng variant đó
                return orderVariantId === itemVariantId;
              } else {
                // Nếu order không có variant, xóa theo productId
                return orderProductId === itemProductId;
              }
            });
          });

          localStorage.setItem("cart", JSON.stringify(remainingCart));
          window.dispatchEvent(new Event("cartUpdated"));
          window.dispatchEvent(new Event("notificationsUpdated"));

          localStorage.removeItem("pendingOrderId");
          // ✅ Xóa flag sau khi hoàn tất (giữ lại một lúc để tránh race condition)
          setTimeout(() => localStorage.removeItem(processedKey), 5000);
        } else {
          // ✅ Nếu lỗi, xóa flag để có thể thử lại
          localStorage.removeItem(processedKey);
          setError(res.message || "Không thể tạo đơn hàng sau thanh toán");
        }
      } catch (err) {
        console.error("❌ Lỗi khi xử lý thanh toán PayOS:", err);
        // ✅ Nếu lỗi, xóa flag để có thể thử lại
        const processedKey = `payos_processed_${pendingOrderId}`;
        localStorage.removeItem(processedKey);

        // ✅ Xử lý lỗi 401/403 một cách graceful - không redirect về login
        if (err.response?.status === 401 || err.response?.status === 403) {
          const errorMsg =
            err.response?.data?.message || "Phiên đăng nhập đã hết hạn";
          setError(`${errorMsg}. Vui lòng đăng nhập lại để xem đơn hàng.`);
          // Không redirect, chỉ hiển thị thông báo lỗi
        } else {
          setError(
            err.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán"
          );
        }
      } finally {
        setLoading(false);
        setIsProcessingPayment(false);
      }
    };

    // Chỉ xử lý PayOS nếu chưa có order (order sẽ được tạo từ PendingOrder)
    if (!order && pendingOrderId && !isProcessingPayment) {
      handlePayOSPayment();
    }
  }, [pendingOrderId, order, user?.email, isProcessingPayment]);

  // Fetch order nếu chưa có (cho COD hoặc các trường hợp khác)
  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && pendingOrderId) {
        // Bỏ qua nếu đang xử lý PayOS (đã có useEffect riêng)
        if (
          location.search.includes("orderId") ||
          localStorage.getItem("pendingOrderId")
        ) {
          return; // PayOS sẽ được xử lý bởi useEffect khác
        }

        try {
          setLoading(true);
          const res = await orderService.getOrderById(pendingOrderId);
          if (res.success) {
            setOrder(res.data);

            // Nếu là COD và chưa xóa cart, xóa cart ngay
            if (res.data.paymentMethod === "COD") {
              const cart = JSON.parse(localStorage.getItem("cart") || "[]");
              const orderProductIds = res.data.items.map(
                (item) => item.productId?._id || item.productId
              );
              const remainingCart = cart.filter((item) => {
                const itemProductId = item.id || item.productId;
                return !orderProductIds.some((orderId) => {
                  const orderIdStr =
                    typeof orderId === "object" ? orderId.toString() : orderId;
                  const itemIdStr = itemProductId?.toString();
                  return orderIdStr === itemIdStr;
                });
              });
              localStorage.setItem("cart", JSON.stringify(remainingCart));
              window.dispatchEvent(new Event("cartUpdated"));
            }
          } else {
            setError(res.message || "Không thể tải thông tin đơn hàng");
          }
        } catch (err) {
          console.error(err);
          setError("Không thể lấy thông tin đơn hàng");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrder();
  }, [pendingOrderId, order, location.search]);

  const handleContinueShopping = () => {
    navigate("/");
    localStorage.removeItem("pendingOrderId");
    localStorage.removeItem("lastOrderId");
  };

  const handleViewOrders = () => navigate("/order");

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Spin size="large" tip="Đang xác nhận đơn hàng..." />
      </div>
    );
  }

  if (error || !order) {
    const isAuthError =
      error?.includes("Phiên đăng nhập") || error?.includes("hết hạn");

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Alert
          message="Lỗi"
          description={error || "Đơn hàng không tồn tại"}
          type="error"
          showIcon
          action={
            <div style={{ display: "flex", gap: 8 }}>
              {isAuthError && (
                <Button onClick={() => navigate("/login")} type="primary">
                  Đăng nhập lại
                </Button>
              )}
              <Button
                onClick={() => navigate("/cart")}
                type={isAuthError ? "default" : "primary"}
              >
                Về giỏ hàng
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  // Xác định nếu là PayOS paid
  const isPaid =
    order.paymentMethod === "PayOS" && order.paymentResult?.status === "PAID";
  const paymentMethodText =
    order.paymentMethod === "PayOS" ? "PayOS (Online)" : "COD (Khi nhận hàng)";

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <Row justify="center" align="top">
        <Col xs={24} md={16} lg={12}>
          <Card
            title={
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <CheckCircleOutlined
                  style={{ fontSize: 48, color: "#52c41a", marginBottom: 8 }}
                />
                <Title level={2} style={{ margin: 0, color: "#52c41a" }}>
                  Đặt hàng thành công!
                </Title>
                <Text type="secondary">
                  {isPaid
                    ? "Thanh toán đã hoàn tất."
                    : "Vui lòng thanh toán khi nhận hàng."}
                </Text>
              </div>
            }
            bordered={false}
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }}
          >
            {/* Thông tin cơ bản */}
            <div
              style={{
                marginBottom: 24,
                padding: "16px",
                background: "#f9f9f9",
                borderRadius: 6,
              }}
            >
              <Text strong>Mã đơn hàng: </Text>
              <Text style={{ fontWeight: "bold", color: "#1890ff" }}>
                {order._id}
              </Text>
              <br />
              <Text strong>Ngày đặt: </Text>
              <Text>
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </Text>
              <br />
              <Text strong>Phương thức thanh toán: </Text>
              <Text>{paymentMethodText}</Text>
              {isPaid && (
                <Alert
                  message="Thanh toán thành công"
                  description={`Số tiền: ${order.totalPrice.toLocaleString(
                    "vi-VN"
                  )} VNĐ`}
                  type="success"
                  showIcon
                  style={{ marginTop: 8 }}
                />
              )}
            </div>

            {/* Danh sách sản phẩm */}
            <List
              header={
                <div style={{ fontWeight: "bold" }}>
                  <ShoppingCartOutlined /> Sản phẩm đã đặt
                </div>
              }
              bordered
              dataSource={order.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 4,
                        }}
                      />
                    }
                    title={item.name}
                    description={
                      <div>
                        <Text>Số lượng: {item.quantity}x</Text> <br />
                        <Text>
                          Đơn giá: {item.price.toLocaleString("vi-VN")} VNĐ
                        </Text>{" "}
                        <br />
                        {item.variant && (
                          <Text type="secondary">
                            Biến thể: {item.variant.size || ""} -{" "}
                            {item.variant.color || ""}
                          </Text>
                        )}
                      </div>
                    }
                  />
                  <div style={{ textAlign: "right" }}>
                    <Text strong>
                      {(item.price * item.quantity).toLocaleString("vi-VN")} VNĐ
                    </Text>
                  </div>
                </List.Item>
              )}
              footer={
                <div style={{ textAlign: "right", padding: "8px 0" }}>
                  <Text>
                    Tạm tính: {order.itemsPrice.toLocaleString("vi-VN")} VNĐ
                  </Text>{" "}
                  <br />
                  {order.discountAmount > 0 && (
                    <Text type="success">
                      Giảm giá: -{order.discountAmount.toLocaleString("vi-VN")}{" "}
                      VNĐ
                    </Text>
                  )}
                  <br />
                  <Text>
                    Thuế: {order.taxPrice.toLocaleString("vi-VN")} VNĐ
                  </Text>{" "}
                  <br />
                  <Text>
                    Phí ship: {order.shippingPrice.toLocaleString("vi-VN")} VNĐ
                  </Text>{" "}
                  <br />
                  <Title level={4} style={{ color: "#1890ff", margin: 0 }}>
                    Tổng cộng: {order.totalPrice.toLocaleString("vi-VN")} VNĐ
                  </Title>
                </div>
              }
            />

            {/* Địa chỉ giao hàng */}
            <div
              style={{
                marginTop: 24,
                padding: "16px",
                background: "#f9f9f9",
                borderRadius: 6,
              }}
            >
              <Title
                level={5}
                style={{
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EnvironmentOutlined style={{ marginRight: 8 }} /> Địa chỉ giao
                hàng
              </Title>
              <Text>
                <strong>{order.shippingAddress.fullName}</strong> <br />
                SĐT: {order.shippingAddress.phone} <br />
                {order.shippingAddress.address},{" "}
                {order.shippingAddress.ward || ""},{" "}
                {order.shippingAddress.district || ""},{" "}
                {order.shippingAddress.city} <br />
                {order.shippingAddress.country || "Vietnam"},{" "}
                {order.shippingAddress.postalCode || ""}
              </Text>
            </div>

            {/* Buttons */}
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Button
                type="primary"
                onClick={handleViewOrders}
                style={{ marginRight: 8 }}
              >
                Xem đơn hàng
              </Button>
              <Button onClick={handleContinueShopping} ghost>
                Tiếp tục mua sắm
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderSuccess;
