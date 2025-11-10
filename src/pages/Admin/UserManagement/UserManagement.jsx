import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Avatar,
  Typography,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Spin,
  DatePicker,
} from "antd";
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  WechatWorkOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import styled from "styled-components";
import { userService } from "../../../services/userService";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { conversationService } from "../../../services/conversationService";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Title } = Typography;
const { Option } = Select;

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 24px;
  }
`;

const StatCard = styled(Card)`
  text-align: center;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
  }
`;

const UserManagement = () => {
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage(); // ✅ Ant Design v5 message hook
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  // 📦 Lấy danh sách users từ API
  const fetchUsers = async () => {
    () => handleContact(record._id);
    try {
      setLoading(true);
      const res = await userService.getAllUser();
      setUsers(res?.data || res || []);
    } catch (err) {
      messageApi.error("Không thể tải danh sách người dùng");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase());

    const [start, end] = dateRange || [];
    const matchesDate =
      !start || !end
        ? true // nếu chưa chọn ngày thì hiển thị tất cả
        : dayjs(user.createdAt).isSameOrAfter(start, "day") &&
          dayjs(user.createdAt).isSameOrBefore(end, "day");

    return matchesSearch && matchesDate;
  });

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.emailVerified === true).length,
    inactive: users.filter((u) => u.emailVerified === false).length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  const showModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    if (user) {
      form.setFieldsValue({
        role: user.role,
        emailVerified: user.emailVerified === true,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // 🟢 Tạo hoặc cập nhật user
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        role: values.role,
        emailVerified: values.emailVerified === true,
      };

      if (editingUser) {
        await userService.updateByAdmin(editingUser._id, payload); // ✅ Gọi đúng API
        messageApi.success("Cập nhật người dùng thành công");
      } else {
        await userService.createUser(payload);
        messageApi.success("Thêm người dùng mới thành công");
      }

      handleCancel();
      fetchUsers();
    } catch (err) {
      console.error(err);
      messageApi.error("Thao tác thất bại");
    }
  };

  // 🔴 Xóa user
  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId);
      messageApi.success("Xóa người dùng thành công");
      fetchUsers();
    } catch (err) {
      console.error(err);
      messageApi.error("Không thể xóa người dùng");
    }
  };

  const handleContact = async (id) => {
    try {
      const res = await conversationService.createConversation(id);
      const conversation = res?.data;
      if (conversation?._id) navigate(`/chat/${conversation._id}`);
    } catch (error) {
      console.error("Lỗi tạo hoặc lấy conversation:", error);
    }
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar, record) => (
        <Avatar
          size="large"
          icon={<UserOutlined />}
          src={avatar}
          style={{ backgroundColor: "#1890ff" }}
        >
          {record.name?.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name || ""),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Khách hàng", value: "customer" },
        { text: "Nhân viên vận hành", value: "staff" },
        { text: "Nhân viên bán hàng", value: "seller" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => {
        let color = "default";
        let label = "";

        switch (role) {
          case "admin":
            color = "red";
            label = "Admin";
            break;
          case "customer":
            color = "blue";
            label = "Khách hàng";
            break;
          case "staff":
            color = "purple";
            label = "Nhân viên vận hành";
            break;
          case "seller":
            color = "green";
            label = "Nhân viên bán hàng";
            break;
          default:
            label = role;
        }

        return <Tag color={color}>{label}</Tag>;
      },
    },

    {
      title: "Trạng thái",
      dataIndex: "emailVerified",
      key: "emailVerified",
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Không hoạt động", value: false },
      ],
      onFilter: (value, record) => record.emailVerified === value,
      render: (verified) => (
        <Tag color={verified ? "green" : "red"}>
          {verified ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
      defaultSortOrder: "descend",
      render: (v) =>
        v
          ? dayjs(v).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm")
          : "Chưa có dữ liệu",
    },
    {
      title: "Đăng nhập cuối",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin) => lastLogin || "Chưa có",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<WechatWorkOutlined />}
            onClick={() => handleContact(record._id)}
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa user này?"
            onConfirm={() => handleDelete(record._id)} // ✅ _id
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>Quản lý User</Title>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Tổng Users"
              value={userStats.total}
              valueStyle={{ color: "#1890ff" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Đang hoạt động"
              value={userStats.active}
              valueStyle={{ color: "#3f8600" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Không hoạt động"
              value={userStats.inactive}
              valueStyle={{ color: "#cf1322" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Admins"
              value={userStats.admins}
              valueStyle={{ color: "#722ed1" }}
            />
          </StatCard>
        </Col>
      </Row>

      <StyledCard>
        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Space>
            <Input.Search
              placeholder="Tìm kiếm theo tên hoặc email"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <DatePicker.RangePicker
              format="DD/MM/YYYY"
              onChange={(dates) => setDateRange(dates)}
            />
          </Space>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="_id" // ✅ dùng _id để đồng bộ với MongoDB
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} user`,
            }}
          />
        </Spin>
      </StyledCard>

      <Modal
        title={editingUser ? "Chỉnh sửa User" : "Thêm User mới"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
        okText={editingUser ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="userForm">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
              >
                <Select>
                  <Option value="customer">Khách hàng</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="seller">Nhân viên bán hàng</Option>
                  <Option value="staff">Nhân viên vận hành</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emailVerified"
                label="Trạng thái"
                rules={[
                  { required: true, message: "Vui lòng chọn trạng thái!" },
                ]}
              >
                <Select>
                  <Option value={true}>Hoạt động</Option>
                  <Option value={false}>Không hoạt động</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
