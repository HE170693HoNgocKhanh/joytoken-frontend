import React from "react";
import styled from "styled-components";

const ChatMessage = ({ message, isOwn }) => {
  return (
    <MessageRow $isOwn={isOwn}>
      <Bubble $isOwn={isOwn}>
        <div className="text">{message.text}</div>
        <div className="time">
          {new Date(message.time).toLocaleString("vi-VN", {
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
  margin: 4px 0;
`;

const Bubble = styled.div`
  background: ${({ $isOwn }) => ($isOwn ? "#0084ff" : "#e4e6eb")};
  color: ${({ $isOwn }) => ($isOwn ? "white" : "black")};
  padding: 10px 14px;
  border-radius: 18px;
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);

  /* 👇 Bo góc theo hướng */
  border-top-left-radius: ${({ $isOwn }) => ($isOwn ? "18px" : "4px")};
  border-top-right-radius: ${({ $isOwn }) => ($isOwn ? "4px" : "18px")};

  .time {
    font-size: 10px;
    opacity: 0.75;
    text-align: right;
    margin-top: 4px;
  }
`;
