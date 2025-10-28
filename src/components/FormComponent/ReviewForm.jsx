import React, { useState } from "react";
import { Form, Input, Rate, Button, message } from "antd";
import axios from "axios";

const ReviewForm = ({ productId, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const newReview = {
        productId, // lấy từ props hoặc state
        rating: values.rating,
        comment: values.comment,
      };

      // Gửi request POST tới backend
      const res = await axios.post(
        "http://localhost:8080/api/reviews",
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`, // gửi token về BE
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201 || res.status === 200) {
        message.success("Cảm ơn bạn đã gửi đánh giá!");
        onSubmit?.(res.data); // gọi callback để cập nhật danh sách review
      } else {
        message.warning("Không thể gửi đánh giá, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gửi đánh giá:", error);
      setMessage(error.response?.data?.message || "Không thể gửi đánh giá.");
      message.error(error.response?.data?.message || "Không thể gửi đánh giá.");
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
      {message && <p style={{ color: "red" }}>{message}</p>}
      <Button type="primary" htmlType="submit" loading={loading} block>
        Gửi đánh giá
      </Button>
    </Form>
  );
};

export default ReviewForm;
