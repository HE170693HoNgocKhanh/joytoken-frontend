import React, { useState } from 'react';
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
} from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { mockUsers } from '../../../data/mockData';

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
  const [users, setUsers] = useState(mockUsers);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const showModal = (user = null) => {
    setEditingUser(user);
    setIsModalVisible(true);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingUser) {
        // Update user
        setUsers(users.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...values, updatedAt: new Date().toISOString().split('T')[0] }
            : user
        ));
        message.success('Cập nhật thông tin user thành công');
      } else {
        // Add new user
        const newUser = {
          id: Math.max(...users.map(u => u.id)) + 1,
          ...values,
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: null,
          avatar: null,
        };
        setUsers([...users, newUser]);
        message.success('Thêm user mới thành công');
      }
      
      setIsModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    message.success('Xóa user thành công');
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (avatar, record) => (
        <Avatar 
          size="large" 
          icon={<UserOutlined />} 
          src={avatar}
          style={{ backgroundColor: '#1890ff' }}
        >
          {record.name.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Customer', value: 'customer' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Admin' : 'Khách hàng'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Hoạt động', value: 'active' },
        { text: 'Không hoạt động', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Đăng nhập cuối',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin) => lastLogin || 'Chưa có',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa user này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
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
              valueStyle={{ color: '#1890ff' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Đang hoạt động"
              value={userStats.active}
              valueStyle={{ color: '#3f8600' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Không hoạt động"
              value={userStats.inactive}
              valueStyle={{ color: '#cf1322' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Admins"
              value={userStats.admins}
              valueStyle={{ color: '#722ed1' }}
            />
          </StatCard>
        </Col>
      </Row>

      <StyledCard>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input.Search
              placeholder="Tìm kiếm theo tên hoặc email"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Space>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Thêm User
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} user`,
          }}
        />
      </StyledCard>

      <Modal
        title={editingUser ? 'Chỉnh sửa User' : 'Thêm User mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
        okText={editingUser ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="userForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
              >
                <Select>
                  <Option value="customer">Khách hàng</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;