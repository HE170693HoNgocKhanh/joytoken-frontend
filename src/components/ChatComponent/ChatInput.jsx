import React, { useState } from "react";
import styled from "styled-components";
import {
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
  };

  return (
    <Container>
      <div className="icons">
        <PaperClipOutlined />
        {/* <SmileOutlined /> */}
      </div>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Aa"
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <SendButton onClick={handleSend}>
        <SendOutlined />
      </SendButton>
    </Container>
  );
};

export default ChatInput;

// 🎨 Styled
const Container = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 8px 12px;
  border-top: 1px solid #ddd;

  .icons {
    display: flex;
    gap: 10px;
    color: #888;
    font-size: 18px;
    margin-right: 8px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 20px;
  border: none;
  background: #f0f2f5;
  outline: none;
`;

const SendButton = styled.button`
  background: transparent;
  border: none;
  color: #0078ff;
  font-size: 18px;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    color: #005ecc;
  }
`;
