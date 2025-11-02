import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import ChatSidebar from "../../components/ChatComponent/ChatSidebar";
import ChatWindow from "../../components/ChatComponent/ChatWindow";
import { conversationService } from "../../services/conversationService";

const socket = io("http://localhost:8080", { transports: ["websocket"] });

const ChatPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

  // 🟢 Fetch danh sách hội thoại
  const fetchConversations = async () => {
    try {
      const res = await conversationService.getConversations();
      const data = res.data || [];
      const formatted = data.map((c) => {
        const otherUser =
          c.participants.find((p) => p._id !== currentUserId) || null;
        return { ...c, otherUser };
      });

      setConversations(formatted);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách hội thoại:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  // 🟢 Fetch chi tiết 1 conversation
  const fetchConversationData = async (conversationId) => {
    try {
      const res = await conversationService.getConversationDetails(
        conversationId
      );
      const { conversation, messages } = res.data;
      setSelectedConversation(conversation);
      setMessages(messages || []);

      // Join room tương ứng
      socket.emit("joinConversation", conversationId);
    } catch (error) {
      console.error("❌ Failed to fetch conversation data:", error);
    }
  };

  // 🟢 Khi mở trang → load danh sách hội thoại
  useEffect(() => {
    fetchConversations();
  }, []);

  // 🟢 Khi URL có id → fetch chi tiết hội thoại
  useEffect(() => {
    if (id) fetchConversationData(id);
  }, [id]);

  // 🟢 Khi chọn hội thoại
  const handleSelectConversation = async (conversation) => {
    if (selectedConversation?._id === conversation._id) {
      return;
    }

    setSelectedConversation(conversation);
    setMessages([]); // Chỉ clear khi chọn conversation mới
    navigate(`/chat/${conversation._id}`);
  };

  // 🟢 Lắng nghe tin nhắn real-time từ socket
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      // Nếu tin nhắn thuộc cuộc trò chuyện đang mở
      if (msg.conversationId === selectedConversation?._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }

      // Cập nhật danh sách hội thoại (sidebar)
      setConversations((prevConversations) => {
        return prevConversations.map((conv) => {
          if (conv._id === msg.conversationId) {
            return {
              ...conv,
              lastMessage: msg,
              updatedAt: new Date().toISOString(),
            };
          }
          return conv;
        });
      });
    });

    return () => socket.off("receiveMessage");
  }, [selectedConversation]);

  // 🟢 Hàm gửi tin nhắn (được truyền xuống ChatWindow)
  const handleSendMessage = (text) => {
    if (!text.trim() || !selectedConversation) return;

    const newMsg = {
      conversationId: selectedConversation._id,
      senderId: currentUserId,
      content: text,
      type: "text",
    };

    socket.emit("sendMessage", newMsg);
  };

  const handleSendImage = (imageUrl) => {
    if (!selectedConversation) return;

    socket.emit("sendImageMessage", {
      conversationId: selectedConversation._id,
      senderId: currentUserId,
      imageUrl,
    });
  };

  console.log(messages);

  return (
    <Container>
      <ChatSidebar
        conversations={conversations}
        loading={loadingConversations}
        selectedId={selectedConversation?._id}
        onSelectConversation={handleSelectConversation}
      />

      <ChatWindow
        conversation={selectedConversation}
        messages={messages}
        onSend={handleSendMessage}
        onSendImage={handleSendImage}
      />
    </Container>
  );
};

export default ChatPage;

const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f0f2f5;
  font-family: "Inter", sans-serif;
`;
