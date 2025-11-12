import React, { useState } from "react";
import styled from "styled-components";
import {
  SendOutlined,
  SmileOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Upload, Button } from "antd";
import axios from "axios";
import { conversationService } from "../../services/conversationService";

const ChatInput = ({ onSend, onSendImage }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await conversationService.uploadImage(formData);

      if (res.imageUrl) {
        onSendImage(res.imageUrl); // Gửi về ChatPage để emit socket
      }
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  return (
    <Container>
      <IconsContainer>
        <Upload
          showUploadList={false}
          customRequest={handleUpload}
          accept="image/*"
          maxCount={1}
        >
          <IconButton title="Đính kèm ảnh">
            <PaperClipOutlined />
          </IconButton>
        </Upload>
        <IconButton title="Emoji">
          <SmileOutlined />
        </IconButton>
      </IconsContainer>
      <InputContainer>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Aa"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
      </InputContainer>
      {text.trim() && (
        <SendButton onClick={handleSend} title="Gửi">
          <SendOutlined />
        </SendButton>
      )}
    </Container>
  );
};

export default ChatInput;

// 🎨 Styled Components - Facebook Messenger Style
const Container = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 8px 16px;
  border-top: 1px solid #e4e6eb;
  gap: 8px;
  min-height: 60px;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #65676b;
  font-size: 20px;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #f0f2f5;
    color: #050505;
  }

  &:active {
    background: #e4e6eb;
  }
`;

const InputContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const Input = styled.textarea`
  width: 100%;
  min-height: 36px;
  max-height: 120px;
  padding: 8px 12px;
  border-radius: 20px;
  border: none;
  background: #f0f2f5;
  outline: none;
  font-size: 15px;
  color: #050505;
  font-family: inherit;
  resize: none;
  line-height: 1.4;
  overflow-y: auto;

  &::placeholder {
    color: #8a8d91;
  }

  &:focus {
    background: #e4e6eb;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a8a8a8;
    }
  }
`;

const SendButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #0084ff;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #0066cc;
    transform: scale(1.05);
  }

  &:active {
    background: #0052a3;
    transform: scale(0.95);
  }
`;
