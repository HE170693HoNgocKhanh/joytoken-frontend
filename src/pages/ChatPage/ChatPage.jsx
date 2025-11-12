import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ChatSidebar from "../../components/ChatComponent/ChatSidebar";
import ChatWindow from "../../components/ChatComponent/ChatWindow";
import { conversationService } from "../../services/conversationService";

const socket = io("http://localhost:8080", { transports: ["websocket"] });

const ChatPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("user")) || null;
  const currentUserId = currentUser?.id;

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);

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
      console.error("Lỗi khi lấy danh sách hội thoại:", err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchConversationData = async (conversationId) => {
    try {
      const res = await conversationService.getConversationDetails(conversationId);
      const { conversation, messages } = res.data;
      setSelectedConversation(conversation);
      setMessages(messages || []);
      socket.emit("joinConversation", conversationId);
    } catch (error) {
      console.error("Failed to fetch conversation data:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (id) fetchConversationData(id);
  }, [id]);

  const handleSelectConversation = async (conversation) => {
    if (selectedConversation?._id === conversation._id) {
      return;
    }
    setSelectedConversation(conversation);
    setMessages([]);
    navigate(`/chat/${conversation._id}`);
  };

  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.conversationId === selectedConversation?._id) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id);
          return exists ? prev : [...prev, msg];
        });
      }
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

  return (
    <Container>
      <ChatSidebar
        conversations={conversations}
        loading={loadingConversations}
        selectedId={selectedConversation?._id}
        onSelectConversation={handleSelectConversation}
        currentUser={currentUser}
        onConversationCreated={fetchConversations}
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
`;

