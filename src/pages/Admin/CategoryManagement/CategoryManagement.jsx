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
  Typography,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Tree,
} from 'antd';
import {
  AppstoreOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  FolderOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { mockCategories } from '../../data/mockData';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

const CategoryManagement = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchText.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  const categoryStats = {
    total: categories.length,
    active: categories.filter(c => c.status === 'active').length,
    parent: categories.filter(c => !c.parentId).length,
    child: categories.filter(c => c.parentId).length,
  };

  const showModal = (category = null) => {
    setEditingCategory(category);
    setIsModalVisible(true);
    if (category) {
      form.setFieldsValue(category);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Generate slug from name
      const slug = values.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
      
      if (editingCategory) {
        // Update category
        setCategories(categories.map(category => 
          category.id === editingCategory.id 
            ? { 
                ...category, 
                ...values, 
                slug,
                updatedAt: new Date().toISOString().split('T')[0] 
              }
            : category
        ));
        message.success('Cập nhật danh mục thành công');
      } else {
        // Add new category
        const newCategory = {
          id: Math.max(...categories.map(c => c.id)) + 1,
          ...values,
          slug,
          productCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setCategories([...categories, newCategory]);
        message.success('Thêm danh mục mới thành công');
      }
      
      setIsModalVisible(false);
      setEditingCategory(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (categoryId) => {
    // Check if category has children
    const hasChildren = categories.some(cat => cat.parentId === categoryId);
    if (hasChildren) {
      message.error('Không thể xóa danh mục có danh mục con');
      return;
    }
    
    setCategories(categories.filter(category => category.id !== categoryId));
    message.success('Xóa danh mục thành công');
  };

  const getParentCategoryName = (parentId) => {
    if (!parentId) return '-';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '-';
  };

  const buildTreeData = () => {
    const parentCategories = categories.filter(cat => !cat.parentId);
    
    return parentCategories.map(parent => ({
      title: (
        <span>
          <FolderOutlined style={{ marginRight: 8 }} />
          {parent.name}
          <Tag color="blue" style={{ marginLeft: 8 }}>
            {parent.productCount}
          </Tag>
        </span>
      ),
      key: parent.id,
      children: categories
        .filter(cat => cat.parentId === parent.id)
        .map(child => ({
          title: (
            <span>
              <FolderOpenOutlined style={{ marginRight: 8 }} />
              {child.name}
              <Tag color="green" style={{ marginLeft: 8 }}>
                {child.productCount}
              </Tag>
            </span>
          ),
          key: child.id,
        }))
    }));
  };

  const columns = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.parentId && '└─ '}
            {text}
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>
            Slug: {record.slug}
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục cha',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId) => getParentCategoryName(parentId),
    },
    {
      title: 'Số sản phẩm',
      dataIndex: 'productCount',
      key: 'productCount',
      sorter: (a, b) => a.productCount - b.productCount,
      render: (count) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>
          {count}
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
            title="Bạn có chắc chắn muốn xóa danh mục này?"
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
          <Title level={2}>Quản lý Danh mục</Title>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Tổng danh mục"
              value={categoryStats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Đang hoạt động"
              value={categoryStats.active}
              valueStyle={{ color: '#3f8600' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Danh mục chính"
              value={categoryStats.parent}
              valueStyle={{ color: '#722ed1' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Danh mục con"
              value={categoryStats.child}
              valueStyle={{ color: '#fa8c16' }}
            />
          </StatCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Tree View */}
        <Col xs={24} lg={8}>
          <StyledCard title="Cây danh mục" size="small">
            <Tree
              showLine
              defaultExpandAll
              treeData={buildTreeData()}
            />
          </StyledCard>
        </Col>

        {/* Table View */}
        <Col xs={24} lg={16}>
          <StyledCard>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Input.Search
                  placeholder="Tìm kiếm theo tên hoặc slug"
                  allowClear
                  style={{ width: 300 }}
                  onSearch={setSearchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Space>
              <Space>
                <Button icon={<ExportOutlined />}>Xuất Excel</Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                  Thêm Danh mục
                </Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={filteredCategories}
              rowKey="id"
              pagination={{
                pageSize: 8,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} danh mục`,
              }}
            />
          </StyledCard>
        </Col>
      </Row>

      <Modal
        title={editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
        okText={editingCategory ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="categoryForm"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Ví dụ: Điện thoại" />
          </Form.Item>
          
          <Form.Item
            name="parentId"
            label="Danh mục cha"
          >
            <Select placeholder="Chọn danh mục cha (để trống nếu là danh mục chính)" allowClear>
              {categories
                .filter(cat => !cat.parentId && (!editingCategory || cat.id !== editingCategory.id))
                .map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Mô tả về danh mục này" />
          </Form.Item>

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

export default CategoryManagement;