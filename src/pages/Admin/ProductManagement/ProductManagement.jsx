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
  InputNumber,
  Typography,
  Popconfirm,
  message,
  Row,
  Col,
  Statistic,
  Image,
  Upload,
} from 'antd';
import {
  ShoppingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { mockProducts, mockCategories } from '../../data/mockData';

const { Title, Text } = Typography;
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

const ProductManagement = () => {
  const [products, setProducts] = useState(mockProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const productStats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock <= p.minStock).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  const showModal = (product = null) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProduct) {
        // Update product
        setProducts(products.map(product => 
          product.id === editingProduct.id 
            ? { 
                ...product, 
                ...values, 
                category: mockCategories.find(c => c.id === values.categoryId)?.name,
                updatedAt: new Date().toISOString().split('T')[0] 
              }
            : product
        ));
        message.success('Cập nhật sản phẩm thành công');
      } else {
        // Add new product
        const newProduct = {
          id: Math.max(...products.map(p => p.id)) + 1,
          ...values,
          category: mockCategories.find(c => c.id === values.categoryId)?.name,
          images: ['https://via.placeholder.com/300x300?text=New+Product'],
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
        };
        setProducts([...products, newProduct]);
        message.success('Thêm sản phẩm mới thành công');
      }
      
      setIsModalVisible(false);
      setEditingProduct(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
    message.success('Xóa sản phẩm thành công');
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      width: 80,
      render: (images) => (
        <Image
          width={50}
          height={50}
          src={images?.[0]}
          placeholder={
            <div style={{ 
              width: 50, 
              height: 50, 
              background: '#f0f0f0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ShoppingOutlined />
            </div>
          }
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            SKU: {record.sku}
          </Text>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      filters: mockCategories.map(cat => ({
        text: cat.name,
        value: cat.name,
      })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => formatCurrency(price),
    },
    {
      title: 'Giá vốn',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (costPrice) => formatCurrency(costPrice),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock, record) => (
        <div>
          <Text strong={stock <= record.minStock} 
                type={stock <= record.minStock ? 'danger' : 'default'}>
            {stock}
          </Text>
          {stock <= record.minStock && (
            <Tag color="red" size="small" style={{ marginLeft: 8 }}>
              Sắp hết
            </Tag>
          )}
        </div>
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
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            title="Xem chi tiết"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            size="small"
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              title="Xóa"
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
          <Title level={2}>Quản lý Sản phẩm</Title>
        </Col>
      </Row>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Tổng sản phẩm"
              value={productStats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Đang hoạt động"
              value={productStats.active}
              valueStyle={{ color: '#3f8600' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Sắp hết hàng"
              value={productStats.lowStock}
              valueStyle={{ color: '#cf1322' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Giá trị tồn kho"
              value={productStats.totalValue}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#722ed1' }}
            />
          </StatCard>
        </Col>
      </Row>

      <StyledCard>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Input.Search
              placeholder="Tìm kiếm theo tên hoặc SKU"
              allowClear
              style={{ width: 300 }}
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Space>
          <Space>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
              Thêm Sản phẩm
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
          }}
        />
      </StyledCard>

      <Modal
        title={editingProduct ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
        okText={editingProduct ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          name="productForm"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="SKU"
                rules={[{ required: true, message: 'Vui lòng nhập SKU!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
              >
                <Select placeholder="Chọn danh mục">
                  {mockCategories.map(category => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá bán"
                rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="VNĐ"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="costPrice"
                label="Giá vốn"
                rules={[{ required: true, message: 'Vui lòng nhập giá vốn!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="VNĐ"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="stock"
                label="Số lượng tồn kho"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="minStock"
            label="Số lượng tối thiểu"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng tối thiểu!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="images"
            label="Hình ảnh"
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={5}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;