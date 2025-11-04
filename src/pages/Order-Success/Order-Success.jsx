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

  // Lấy orderId fallback
  const pendingOrderId =
    localStorage.getItem("pendingOrderId") ||
    localStorage.getItem("lastOrderId") ||
    orderIdFromQuery;

  // Fetch order nếu chưa có
  useEffect(() => {
    const fetchOrder = async () => {
      if (!order && pendingOrderId) {
        try {
          setLoading(true);
          const res = await orderService.getOrderById(pendingOrderId);
          if (res.success) {
            setOrder(res.data);
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
  }, [pendingOrderId, order]);

  // Nếu là PayOS: markPaid tự động
  useEffect(() => {
    const markPaid = async () => {
      if (!order || !pendingOrderId) return;
      if (order.paymentMethod !== "PayOS") return;

      try {
        const data = {
          id: pendingOrderId,
          status: "COMPLETED",
          update_time: dayjs().toISOString(),
          email_address: user?.email,
        };
        const res = await orderService.updateOrderToPaid(pendingOrderId, data);
        console.log("✅ Thanh toán hoàn tất:", res);
        localStorage.removeItem("pendingOrderId");
      } catch (err) {
        console.error("❌ Lỗi khi cập nhật thanh toán:", err);
      }
    };
    markPaid();
  }, [order, pendingOrderId, user?.email]);

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
            <Button onClick={() => navigate("/cart")} type="primary">
              Về giỏ hàng
            </Button>
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
