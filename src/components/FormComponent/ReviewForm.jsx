import React, { useState } from "react";
import { Form, Input, Rate, Button, message as antdMessage } from "antd";
import apiClient from "../../services/apiClient";

const ReviewForm = ({ productId, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const newReview = {
        productId, // lấy từ props hoặc state
        rating: values.rating,
        comment: values.comment,
      };

      // Gửi request POST tới backend (dùng apiClient để tự động gắn token)
      const res = await apiClient.post("/reviews", newReview);

      // apiClient trả về res.data trực tiếp
      antdMessage.success("Cảm ơn bạn đã gửi đánh giá!");
      onSubmit?.(res.data);
    } catch (error) {
      const msg = error?.message || error?.data?.message || "Không thể gửi đánh giá.";
      setErrorMessage(msg);
      antdMessage.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Tên của bạn"
        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
      >
        <Input placeholder="Nhập tên..." />
      </Form.Item>
      <Form.Item
        name="rating"
        label="Đánh giá"
        rules={[{ required: true, message: "Vui lòng chọn số sao" }]}
      >
        <Rate />
      </Form.Item>
      <Form.Item
        name="comment"
        label="Nội dung"
        rules={[{ required: true, message: "Vui lòng nhập nội dung đánh giá" }]}
      >
        <Input.TextArea rows={4} placeholder="Chia sẻ cảm nhận của bạn..." />
      </Form.Item>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <Button type="primary" htmlType="submit" loading={loading} block>
        Gửi đánh giá
      </Button>
    </Form>
  );
};

export default ReviewForm;
