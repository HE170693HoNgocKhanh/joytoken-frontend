import React, { useState, useEffect } from "react";
import { Button, Modal, Space, Typography } from "antd";
import { userService } from "../../services/userService";
import { conversationService } from "../../services/conversationService";

import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const ModalContact = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const currentUserRole = currentUser?.role;
      
      // Nếu user là admin/staff/seller → lấy danh sách admin/staff/seller (loại trừ chính họ)
      // Nếu user là customer → lấy danh sách staff/seller/admin
      if (["admin", "staff", "seller"].includes(currentUserRole)) {
        const res = await userService.getChatableUsers();
        setUsers(res?.data || res || []);
      } else {
        const res = await userService.getStaffSellerAdmin();
        setUsers(res?.data || res || []);
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleContact = async (id) => {
    try {
      const res = await conversationService.createConversation(id);
      const conversation = res?.data;
      if (conversation?._id) navigate(`/chat/${conversation._id}`);
    } catch (error) {
      console.error("Lỗi tạo hoặc lấy conversation:", error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Chọn người để chat"
    >
      {users.length > 0 ? (
        users.map((user) => (
          <div
            key={user._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div>
              <Text strong>{user.name}</Text>
              <Text type="secondary"> ({user.role})</Text>
            </div>
            <Button
              type="primary"
              size="small"
              onClick={() => handleContact(user._id)}
            >
              Liên hệ
            </Button>
          </div>
        ))
      ) : (
        <p>Không có người dùng nào để hiển thị.</p>
      )}
    </Modal>
  );
};

export default ModalContact;
