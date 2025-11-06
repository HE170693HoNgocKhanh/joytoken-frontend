import React, { useState } from "react";
import {
  Collapse,
  Rate,
  Modal,
  List,
  Avatar,
  Typography,
  Button,
  Card,
} from "antd";
import { StarFilled } from "@ant-design/icons";
import styled from "styled-components";
import ReviewForm from "../FormComponent/ReviewForm";

const { Panel } = Collapse;
const { Title, Text } = Typography;

const ReviewSection = ({ productId, initialReviews = [] }) => {
  const [reviews, setReviews] = useState(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Trung bình sao
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : 0;

  const handleAddReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <Container>
      <HeaderRow>
        <Title level={3}>Đánh giá</Title>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StarFilled style={{ color: "#ff6b00", fontSize: 20 }} />
          <Text strong>
            {averageRating} ({reviews.length} đánh giá)
          </Text>
          <Button type="link" onClick={() => setIsModalOpen(true)}>
            Viết đánh giá
          </Button>
        </div>
      </HeaderRow>

      {/* Collapse để mở danh sách review */}
      <Collapse
        accordion
        bordered={false}
        style={{
          background: "white",
          borderRadius: 8,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <Panel header="Xem tất cả đánh giá" key="1">
          {reviews.length === 0 ? (
            <EmptyText>Chưa có đánh giá nào cho sản phẩm này.</EmptyText>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={reviews}
              renderItem={(r) => (
                <Card
                  key={r._id}
                  style={{
                    borderRadius: 10,
                    marginBottom: 20,
                    border: "1px solid #f0f0f0",
                  }}
                  bodyStyle={{ padding: "16px 20px" }}
                >
                  <ReviewTitle>{r.userName || "No Name"}</ReviewTitle>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <Rate
                      disabled
                      value={r.rating}
                      style={{ color: "#ff6b00" }}
                    />
                    <Text type="secondary">
                      {new Date(r.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </Text>
                  </div>
                  <ReviewContent>{r.comment}</ReviewContent>
                </Card>
              )}
            />
          )}
        </Panel>
      </Collapse>

      {/* Modal chứa form thêm review */}
      <Modal
        title="Viết đánh giá"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <ReviewForm productId={productId} onSubmit={handleAddReview} />
      </Modal>
    </Container>
  );
};

export default ReviewSection;

const Container = styled.div`
  margin-top: 4rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const EmptyText = styled.p`
  text-align: center;
  color: #999;
  margin: 1rem 0;
`;

const ReviewTitle = styled.h4`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ReviewContent = styled.p`
  margin-top: 0.5rem;
  font-size: 15px;
  color: #444;
  line-height: 1.6;
`;
