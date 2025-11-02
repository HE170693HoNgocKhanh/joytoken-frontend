import React from "react";
import styled from "styled-components";
import { Image } from "antd";

const ChatMessage = ({ message, isOwn }) => {
  const isImage = message.type === "image";
  return (
    <MessageRow $isOwn={isOwn}>
      <Bubble $isOwn={isOwn} $isImage={isImage}>
        {isImage ? (
          <Image
            src={message.content}
            width={300}
            height={300}
            alt="image-message"
          />
        ) : (
          <div className="text">{message.content}</div>
        )}

        <div className="time">
          {new Date(message.createdAt || message.time).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </Bubble>
    </MessageRow>
  );
};

export default ChatMessage;

// 🎨 Styled Components
const MessageRow = styled.div`
  display: flex;
  justify-content: ${({ $isOwn }) => ($isOwn ? "flex-end" : "flex-start")};
  margin: 6px 0;
`;

const Bubble = styled.div`
  background: ${({ $isOwn, $isImage }) =>
    $isImage ? "transparent" : $isOwn ? "#0084ff" : "#e4e6eb"};
  color: ${({ $isOwn, $isImage }) =>
    $isImage ? "inherit" : $isOwn ? "white" : "black"};
  padding: ${({ $isImage }) => ($isImage ? "4px" : "10px 14px")};
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: ${({ $isImage }) =>
    $isImage ? "none" : "0 1px 2px rgba(0, 0, 0, 0.15)"};

  border-top-left-radius: ${({ $isOwn }) => ($isOwn ? "18px" : "4px")};
  border-top-right-radius: ${({ $isOwn }) => ($isOwn ? "4px" : "18px")};

  .time {
    font-size: 10px;
    opacity: 0.75;
    text-align: right;
    margin-top: 4px;
  }
`;
