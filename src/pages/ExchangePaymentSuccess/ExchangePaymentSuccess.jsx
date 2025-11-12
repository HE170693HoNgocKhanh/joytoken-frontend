import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
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
} from "@ant-design/icons";
import { exchangeService } from "../../services";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ExchangePaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const searchParams = new URLSearchParams(location.search);
  const exchangeIdFromQuery = searchParams.get("exchangeId");

  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy exchangeId
  const exchangeId =
    localStorage.getItem("pendingExchangeId") ||
    exchangeIdFromQuery;

  // Xử lý PayOS: Tạo Order từ PendingOrder khi thanh toán thành công
  useEffect(() => {
    const handlePayOSPayment = async () => {
      if (!exchangeId) {
        setError("Không tìm thấy thông tin yêu cầu đổi hàng");
        return;
      }

      try {
        setLoading(true);
        // Với PayOS: Gọi processExchangePayment để tạo Order từ PendingOrder
        const data = {
          status: "COMPLETED",
          update_time: dayjs().toISOString(),
          email_address: user?.email,
        };
        const res = await exchangeService.processExchangePayment(exchangeId, data);
        
        if (res.success && res.data) {
          console.log("✅ Thanh toán đổi hàng hoàn tất, đơn hàng đã được tạo:", res);
          setExchange(res.data);
          
          window.dispatchEvent(new Event("notificationsUpdated"));
          
          localStorage.removeItem("pendingExchangeId");
        } else {
          setError(res.message || "Không thể tạo đơn hàng sau thanh toán");
        }
      } catch (err) {
        console.error("❌ Lỗi khi xử lý thanh toán PayOS cho đổi hàng:", err);
        setError(err.response?.data?.message || "Có lỗi xảy ra khi xử lý thanh toán");
      } finally {
        setLoading(false);
      }
    };

    // Xử lý PayOS payment
    if (exchangeId) {
      handlePayOSPayment();
    }
  }, [exchangeId, user?.email]);

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
        <Spin size="large" tip="Đang xác nhận thanh toán đổi hàng..." />
      </div>
    );
  }

  if (error || !exchange) {
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
          description={error || "Không thể xác nhận thanh toán đổi hàng"}
          type="error"
          showIcon
          action={
            <Button onClick={() => navigate("/order-history")} type="primary">
              Về lịch sử đơn hàng
            </Button>
          }
        />
      </div>
    );
  }

  const newOrderId = exchange.newOrderId?._id || exchange.newOrderId;

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
                  Thanh toán đổi hàng thành công!
                </Title>
                <Text type="secondary">
                  Đơn hàng đổi đã được tạo và thanh toán hoàn tất.
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
              <Text strong>Mã yêu cầu đổi hàng: </Text>
              <Text style={{ fontWeight: "bold", color: "#1890ff" }}>
                #{exchange._id.toString().slice(-6)}
              </Text>
              <br />
              {newOrderId && (
                <>
                  <Text strong>Mã đơn hàng mới: </Text>
                  <Text style={{ fontWeight: "bold", color: "#52c41a" }}>
                    #{newOrderId.toString().slice(-6)}
                  </Text>
                  <br />
                </>
              )}
              <Text strong>Ngày tạo: </Text>
              <Text>
                {new Date(exchange.createdAt).toLocaleDateString("vi-VN")}
              </Text>
              <br />
              <Alert
                message="Thanh toán thành công"
                description={`Số tiền chênh lệch: ${exchange.newOrderId?.totalPrice?.toLocaleString(
                  "vi-VN"
                ) || "N/A"} VNĐ`}
                type="success"
                showIcon
                style={{ marginTop: 8 }}
              />
            </div>

            {/* Buttons */}
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Button
                type="primary"
                onClick={() => navigate("/order-history")}
                style={{ marginRight: 8 }}
              >
                Xem đơn hàng
              </Button>
              <Button onClick={() => navigate("/")} ghost>
                Tiếp tục mua sắm
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExchangePaymentSuccess;
