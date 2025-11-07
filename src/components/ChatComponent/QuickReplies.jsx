import React from "react";
import styled from "styled-components";

const SUGGESTED_MESSAGES = [
  "Xin chào! Tôi cần hỗ trợ.",
  "Bạn có thể giúp tôi tư vấn sản phẩm được không?",
  "Cảm ơn bạn đã hỗ trợ!",
  "Tôi gặp vấn đề với đơn hàng của mình.",
];

const QuickReplies = ({ onSend }) => {
  return (
    <Container>
      {SUGGESTED_MESSAGES.map((msg, index) => (
        <ReplyButton key={index} onClick={() => onSend(msg)}>
          {msg}
        </ReplyButton>
      ))}
    </Container>
  );
};

export default QuickReplies;

// 🎨 Styled
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 15px;
  background: #fff;
  border-top: 1px solid #e0e0e0;
`;

const ReplyButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  background: #f1f1f1;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  color: #333;
  transition: 0.2s;

  &:hover {
    background: #ddd;
  }
`;
