import React from "react";
import { Result, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const OrderFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMessage = location.state?.error || "Đặt hàng thất bại. Vui lòng thử lại.";

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <Result
        status="error"
        title="Đặt hàng thất bại!"
        subTitle={errorMessage}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate("/")}>
            Quay về trang chủ
          </Button>,
          <Button key="retry" onClick={() => navigate(-1)}>
            Thử lại
          </Button>,
        ]}
      />
    </div>
  );
};

export default OrderFailure;
