import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiMessageSquare, FiSend, FiX } from "react-icons/fi";
import { chatService } from "../../services/chatService";

const LOCAL_KEY = "jellycat_chat_history";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Xin chào 👋! Mình là Jellycat Assistant 🧸. Bạn muốn tìm hiểu sản phẩm nào hôm nay?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef(null);

  // 🔹 Load chat history
  useEffect(() => {
    const savedChat = localStorage.getItem(LOCAL_KEY);
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Lỗi đọc chat history:", e);
      }
    }
  }, []);

  // 🔹 Save chat history
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(messages));
  }, [messages]);

  // 🔹 Scroll to bottom
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // 🔹 Send message
  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setIsTyping(true);

    try {
      const res = await chatService.sendMessageWithAi(input);

      const aiMessage = {
        role: "assistant",
        content:
          res.response || "Xin lỗi, hiện mình chưa hiểu rõ câu hỏi của bạn 😅",
      };

      // Hiển thị typing effect 1-2s cho mượt mà
      setTimeout(() => {
        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
        setIsSending(false);
      }, 1000);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Xin lỗi, mình đang gặp chút sự cố 💔" },
      ]);
      setIsTyping(false);
      setIsSending(false);
    }
  };

  // 🔹 Clear chat
  const handleClearChat = () => {
    localStorage.removeItem(LOCAL_KEY);
    setMessages([
      {
        role: "assistant",
        content:
          "Xin chào 👋! Mình là Jellycat Assistant 🧸. Bạn muốn tìm hiểu sản phẩm nào hôm nay?",
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <ChatButton onClick={() => setIsOpen(true)}>
          <FiMessageSquare size={24} />
        </ChatButton>
      )}

      {/* Chat Window */}
      {isOpen && (
        <ChatContainer>
          <ChatHeader>
            <span>💬 Chat with Jellycat AI</span>
            <HeaderActions>
              <button onClick={handleClearChat} title="Xoá lịch sử chat">
                🗑
              </button>
              <FiX size={18} onClick={() => setIsOpen(false)} />
            </HeaderActions>
          </ChatHeader>

          <ChatBody>
            {messages.map((msg, idx) => (
              <Message key={idx} $isUser={msg.role === "user"}>
                {msg.content}
              </Message>
            ))}

            {/* Hiển thị hiệu ứng Jellycat đang gõ */}
            {isTyping && (
              <Message $isUser={false}>
                <TypingDots>
                  <Dot delay="0s" />
                  <Dot delay="0.2s" />
                  <Dot delay="0.4s" />
                </TypingDots>
              </Message>
            )}

            <div ref={messageEndRef} />
          </ChatBody>

          <ChatInputBox>
            <input
              type="text"
              placeholder={
                isSending ? "Jellycat đang trả lời..." : "Nhập tin nhắn..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isSending}
            />
            <button onClick={handleSend} disabled={isSending}>
              <FiSend size={18} />
            </button>
          </ChatInputBox>
        </ChatContainer>
      )}
    </>
  );
};

export default ChatWidget;

/* ===================== STYLES ===================== */

const ChatButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #ff9f1c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: 0.3s;
  z-index: 1000;

  &:hover {
    background: #ffa933;
    transform: translateY(-2px);
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 90px;
  right: 24px;
  width: 340px;
  height: 460px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  z-index: 999;
`;

const ChatHeader = styled.div`
  background: #ff9f1c;
  color: #fff;
  padding: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    cursor: pointer;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    font-size: 16px;
    margin-right: 6px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fafafa;
`;

const Message = styled.div`
  max-width: 75%;
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  background: ${(props) => (props.$isUser ? "#ff9f1c" : "#e4e6eb")};
  color: ${(props) => (props.$isUser ? "#fff" : "#333")};
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.4;
`;

const ChatInputBox = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
  background: #fff;

  input {
    flex: 1;
    border: none;
    padding: 10px;
    font-size: 14px;
    border-radius: 8px;
    background: #f5f5f5;
    outline: none;
  }

  input:disabled {
    background: #f0f0f0;
    color: #999;
    cursor: not-allowed;
  }

  button {
    border: none;
    background: none;
    color: #ff9f1c;
    margin-left: 8px;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/* 💬 Hiệu ứng dấu ... nhấp nháy */
const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
`;

const TypingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: #555;
  border-radius: 50%;
  display: inline-block;
  animation: ${bounce} 1.4s infinite;
  animation-delay: ${(props) => props.delay};
`;
