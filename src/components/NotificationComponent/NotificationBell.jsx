import React, { useState, useEffect } from "react";
import { Badge, Popover, List, Button, Space, Typography, Empty, Divider } from "antd";
import { BellOutlined, CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { notificationService } from "../../services";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text } = Typography;

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Polling mỗi 30 giây để cập nhật thông báo mới
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchNotifications({ limit: 10, unreadOnly: false });
    }, 30000);

    // Lắng nghe sự kiện thủ công để refresh ngay (sau khi đặt hàng/đổi hàng)
    const refresh = () => {
      fetchUnreadCount();
      fetchNotifications({ limit: 10, unreadOnly: false });
    };
    window.addEventListener("notificationsUpdated", refresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notificationsUpdated", refresh);
    };
  }, []);

  const fetchNotifications = async (params = { limit: 10, unreadOnly: false }) => {
    try {
      setLoading(true);
      const response = await notificationService.getUserNotifications(params);
      if (response && response.success) {
        setNotifications(response.data || []);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response && response.success) {
        setUnreadCount(response.count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleMarkAsRead = async (notificationId, e) => {
    e?.stopPropagation();
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(
        notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async (e) => {
    e?.stopPropagation();
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (notificationId, e) => {
    e?.stopPropagation();
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter((notif) => notif._id !== notificationId));
      // Nếu là unread thì giảm count
      const deletedNotif = notifications.find((notif) => notif._id === notificationId);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Navigate đến link nếu có
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const notificationContent = (
    <div style={{ width: 350, maxHeight: 500, overflowY: "auto" }}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>Thông báo</Text>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Empty
          description="Không có thông báo"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ padding: "40px 20px" }}
        />
      ) : (
        <>
          <List
            dataSource={notifications}
            loading={loading}
            renderItem={(notification) => (
              <List.Item
                style={{
                  padding: "12px 16px",
                  cursor: "pointer",
                  backgroundColor: notification.isRead ? "#fff" : "#e6f7ff",
                  borderLeft: notification.isRead ? "none" : "3px solid #1890ff",
                }}
                onClick={() => handleNotificationClick(notification)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = notification.isRead ? "#f5f5f5" : "#bae7ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = notification.isRead ? "#fff" : "#e6f7ff";
                }}
              >
                <List.Item.Meta
                  title={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <Text strong={!notification.isRead} style={{ fontSize: 14 }}>
                        {notification.title}
                      </Text>
                      <Space>
                        {!notification.isRead && (
                          <Button
                            type="text"
                            size="small"
                            icon={<CheckOutlined />}
                            onClick={(e) => handleMarkAsRead(notification._id, e)}
                            title="Đánh dấu đã đọc"
                          />
                        )}
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={(e) => handleDelete(notification._id, e)}
                          title="Xóa"
                        />
                      </Space>
                    </div>
                  }
                  description={
                    <div>
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, display: "block", marginBottom: 4 }}
                      >
                        {notification.message}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {dayjs(notification.createdAt).fromNow()}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
          <Divider style={{ margin: 0 }}>
            <Button
              type="link"
              onClick={() => {
                navigate("/notifications");
              }}
            >
              Xem tất cả
            </Button>
          </Divider>
        </>
      )}
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      trigger="click"
      placement="bottomRight"
      onOpenChange={(open) => {
        if (open) {
          fetchNotifications({ limit: 20, unreadOnly: false });
        }
      }}
    >
      <Badge count={unreadCount} size="small" offset={[-5, 5]}>
        <BellOutlined
          style={{
            fontSize: "22px",
            cursor: "pointer",
            color: unreadCount > 0 ? "#1890ff" : undefined,
          }}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationBell;

