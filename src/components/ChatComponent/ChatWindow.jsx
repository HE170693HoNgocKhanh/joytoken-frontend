import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

const ChatWindow = ({ conversation, messages, onSend, onSendImage }) => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!conversation)
    return (
      <EmptyChat>
        <p>Chọn một đoạn chat để bắt đầu trò chuyện</p>
      </EmptyChat>
    );

  return (
    <Window>
      <Header>
        <strong>
          {
            conversation.participants?.find((p) => p._id !== currentUserId)
              ?.name
          }
        </strong>
      </Header>

      <MessageArea>
        <div className="messages-wrapper">
          {messages.length === 0 ? (
            <EmptyText>Chưa có tin nhắn nào</EmptyText>
          ) : (
            messages.map((m) => (
              <ChatMessage
                key={m._id}
                message={{
                  type: m.type,
                  content: m.content,
                  sender: m.sender,
                  time: m.createdAt,
                }}
                isOwn={m.sender?._id === currentUserId}
              />
            ))
          )}
          <div ref={messageEndRef} />
        </div>
      </MessageArea>

      <ChatInput onSend={onSend} onSendImage={onSendImage} />
    </Window>
  );
};

export default ChatWindow;

// 🎨 Styled
const Window = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #e5ddd5;
`;

const Header = styled.div`
  padding: 15px;
  background: #fff;
  border-bottom: 1px solid #ddd;
`;

const MessageArea = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  background: #f9f9f9;

  .messages-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
`;

const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  background: #f5f5f5;
`;

const EmptyText = styled.div`
  text-align: center;
  color: #777;
  margin-top: 40px;
  font-size: 14px;
`;
