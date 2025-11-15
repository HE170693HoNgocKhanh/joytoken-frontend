import React from "react";
import styled from "styled-components";
import { Image } from "antd";

const ChatMessage = ({ message, isOwn, highlightText }) => {
  const isImage = message.type === "image";
  
  // Highlight search text in message content
  const highlightContent = (text, query) => {
    if (!query || !text) return text;
    try {
      // Escape special regex characters
      const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedQuery})`, "gi");
      const parts = text.split(regex);
      return parts.map((part, index) => 
        regex.test(part) ? (
          <HighlightedText key={index}>{part}</HighlightedText>
        ) : (
          part
        )
      );
    } catch (error) {
      // Fallback if regex fails
      return text;
    }
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;
    
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <MessageRow $isOwn={isOwn}>
      <Bubble $isOwn={isOwn} $isImage={isImage}>
        {isImage ? (
          <ImageContainer>
            <Image
              src={message.content}
              width={300}
              height={300}
              alt="image-message"
              style={{ borderRadius: "12px", objectFit: "cover" }}
            />
          </ImageContainer>
        ) : (
          <MessageText>
            {highlightText 
              ? highlightContent(message.content, highlightText)
              : message.content}
          </MessageText>
        )}
        <MessageTime>{formatTime(message.createdAt || message.time)}</MessageTime>
      </Bubble>
    </MessageRow>
  );
};

export default ChatMessage;

// 🎨 Styled Components - Facebook Messenger Style
const MessageRow = styled.div`
  display: flex;
  justify-content: ${({ $isOwn }) => ($isOwn ? "flex-end" : "flex-start")};
  margin: 2px 0;
  padding: 0 4px;
`;

const Bubble = styled.div`
  background: ${({ $isOwn, $isImage }) =>
    $isImage ? "transparent" : $isOwn ? "#0084ff" : "#ffffff"};
  color: ${({ $isOwn, $isImage }) =>
    $isImage ? "inherit" : $isOwn ? "#ffffff" : "#050505"};
  padding: ${({ $isImage }) => ($isImage ? "0" : "8px 12px")};
  border-radius: ${({ $isOwn }) => 
    $isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
  max-width: 65%;
  word-wrap: break-word;
  box-shadow: ${({ $isImage, $isOwn }) =>
    $isImage ? "none" : $isOwn 
      ? "0 1px 2px rgba(0, 132, 255, 0.3)" 
      : "0 1px 2px rgba(0, 0, 0, 0.1)"};
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;

  &:hover {
    box-shadow: ${({ $isImage, $isOwn }) =>
      $isImage ? "none" : $isOwn 
        ? "0 2px 4px rgba(0, 132, 255, 0.4)" 
        : "0 2px 4px rgba(0, 0, 0, 0.15)"};
  }
`;

const ImageContainer = styled.div`
  border-radius: 12px;
  overflow: hidden;
  max-width: 300px;
  max-height: 300px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MessageText = styled.div`
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
  white-space: pre-wrap;
`;

const MessageTime = styled.div`
  font-size: 11px;
  opacity: 0.7;
  margin-top: 2px;
  align-self: flex-end;
  color: inherit;
`;

const HighlightedText = styled.span`
  background: #fff3cd;
  color: #856404;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
`;
