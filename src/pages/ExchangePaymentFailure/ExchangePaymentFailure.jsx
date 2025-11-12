import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Typography,
  Row,
  Col,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const ExchangePaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const exchangeId = searchParams.get("exchangeId");

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <Row justify="center" align="top">
        <Col xs={24} md={16} lg={12}>
          <Card
            title={
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <CloseCircleOutlined
                  style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 8 }}
                />
                <Title level={2} style={{ margin: 0, color: "#ff4d4f" }}>
                  Thanh toán thất bại
                </Title>
                <Text type="secondary">
                  Thanh toán đổi hàng không thành công.
                </Text>
              </div>
            }
            bordered={false}
            style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: 8 }}
          >
            <Alert
              message="Thanh toán không thành công"
              description="Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục."
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
            />

            {exchangeId && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Mã yêu cầu đổi hàng: </Text>
                <Text style={{ fontWeight: "bold", color: "#1890ff" }}>
                  #{exchangeId.slice(-6)}
                </Text>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Button
                type="primary"
                onClick={() => navigate("/order-history")}
                style={{ marginRight: 8 }}
              >
                Về lịch sử đơn hàng
              </Button>
              <Button onClick={() => navigate("/")} ghost>
                Về trang chủ
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExchangePaymentFailure;
