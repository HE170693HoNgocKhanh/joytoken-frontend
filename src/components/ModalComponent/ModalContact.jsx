import React, { useState, useEffect, useMemo } from "react";
import {
  Popover,
  Avatar,
  Badge,
  Button,
  Divider,
  Empty,
  List,
  Skeleton,
  Space,
  Typography,
  Segmented,
} from "antd";
import {
  MessageOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { conversationService } from "../../services/conversationService";

import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ModalContact = ({ open, onOpenChange, children }) => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const currentUser = useMemo(
    () => JSON.parse(localStorage.getItem("user")) || null,
    []
  );
  const currentUserId = currentUser?.id;

  const fetchRecentConversations = async () => {
    try {
      setLoading(true);
      const res = await conversationService.getConversations();
      const data = res.data || [];
      const formatted = data
        .map((conversation) => {
          const otherUser =
            conversation.otherUser ||
            conversation.participants?.find(
              (participant) => participant?._id !== currentUserId
            );
          return {
            ...conversation,
            otherUser,
          };
        })
        .filter((conversation) => conversation.otherUser)
        .sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        );

      setConversations(formatted.slice(0, 6));
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách hội thoại:", err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRecentConversations();
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) {
      setActiveFilter("all");
    }
  }, [open]);

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
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
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleOpenConversation = (conversationId) => {
    onOpenChange?.(false);
    navigate(`/chat/${conversationId}`);
  };

  const roleLabels = {
    admin: "Admin",
    staff: "Quản lý kho",
    seller: "Người bán",
    customer: "Khách hàng",
  };

  const filteredConversations = useMemo(() => {
    if (activeFilter === "unread") {
      return conversations.filter((conversation) => {
        const lastSender = conversation.lastMessage?.sender?._id;
        return lastSender && lastSender !== currentUserId;
      });
    }
    return conversations;
  }, [conversations, activeFilter, currentUserId]);

  const content = (
    <div className="contact-popover-content">
      <div className="contact-popover-header">
        <Space direction="vertical" size={4}>
          <Text className="contact-popover-title">Tin nhắn gần đây</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Xem và phản hồi nhanh các cuộc trò chuyện mới nhất của bạn
          </Text>
        </Space>
        <Button
          type="text"
          size="small"
          icon={<MessageOutlined />}
          onClick={() => {
            onOpenChange?.(false);
            navigate("/chat");
          }}
        >
          Xem hộp thư
        </Button>
      </div>

      <Segmented
        block
        size="middle"
        value={activeFilter}
        onChange={setActiveFilter}
        className="contact-popover-tabs"
        options={[
          { label: "Tất cả", value: "all" },
          { label: "Chưa đọc", value: "unread" },
        ]}
      />

      <div className="contact-popover-list">
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : filteredConversations.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={filteredConversations}
            split={false}
            renderItem={(conversation, index) => {
              const isOwnLastMessage =
                conversation.lastMessage?.sender?._id === currentUserId;
              const lastMessagePrefix = isOwnLastMessage ? "Bạn: " : "";
              const displayMessage =
                conversation.lastMessage?.content ||
                "Hãy bắt đầu cuộc trò chuyện";
              const isUnread =
                conversation.lastMessage &&
                conversation.lastMessage.sender?._id !== currentUserId;

              return (
                <React.Fragment key={conversation._id}>
                  <List.Item
                    className={`contact-conversation-row ${
                      isUnread ? "contact-conversation-row--unread" : ""
                    }`}
                    onClick={() => handleOpenConversation(conversation._id)}
                  >
                    <Badge dot={isUnread} offset={[-4, 28]}>
                      <Avatar
                        size={46}
                        src={
                          conversation.otherUser?.avatar ||
                          `https://api.dicebear.com/9.x/initials/svg?seed=${conversation.otherUser?.name || "User"}`
                        }
                        alt={conversation.otherUser?.name || "User"}
                      />
                    </Badge>
                    <div className="contact-conversation-content">
                      <div className="contact-conversation-row-header">
                        <span className="contact-conversation-name">
                          {conversation.otherUser?.name || "Người dùng ẩn danh"}
                        </span>
                        {conversation.otherUser?.role && (
                          <span className="contact-conversation-role">
                            {roleLabels[conversation.otherUser.role] ||
                              conversation.otherUser.role}
                          </span>
                        )}
                        <span className="contact-conversation-time">
                          {formatTime(
                            conversation.lastMessage?.createdAt ||
                              conversation.updatedAt
                          )}
                        </span>
                      </div>
                      <div className="contact-conversation-message">
                        {lastMessagePrefix}
                        {truncateText(displayMessage)}
                      </div>
                    </div>
                    <ArrowRightOutlined className="contact-conversation-arrow" />
                  </List.Item>
                  {index < filteredConversations.length - 1 && (
                    <div className="contact-conversation-divider" />
                  )}
                </React.Fragment>
              );
            }}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              activeFilter === "unread"
                ? "Không có tin nhắn mới chưa đọc"
                : "Bạn chưa có cuộc trò chuyện nào. Hãy bắt đầu ngay!"
            }
          >
            <Button
              type="primary"
              onClick={() => {
                onOpenChange?.(false);
                navigate("/chat");
              }}
            >
              Đi tới trang chat
            </Button>
          </Empty>
        )}
      </div>

      <Divider style={{ margin: "12px 0" }} />
      <Button
        block
        type="primary"
        onClick={() => {
          onOpenChange?.(false);
          navigate("/chat");
        }}
      >
        Xem tất cả tin nhắn
      </Button>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      open={open}
      onOpenChange={onOpenChange}
      trigger="click"
      content={content}
      overlayClassName="contact-popover"
    >
      {children}
    </Popover>
  );
};

export default ModalContact;
