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
  InputNumber,
  Select,
  Typography,
  message,
  Row,
  Col,
  Statistic,
  Progress,
  Alert,
  Tabs,
} from 'antd';
import {
  BarChartOutlined,
  PlusOutlined,
  MinusOutlined,
  ExportOutlined,
  WarningOutlined,
  SyncOutlined,
  InboxOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { mockInventory, mockProducts } from '../../../data/mockData';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

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

const AlertCard = styled(Card)`
  border-left: 4px solid #ff4d4f;
`;

const InventoryManagement = () => {
  const [inventory, setInventory] = useState(mockInventory);
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [stockAction, setStockAction] = useState('in'); // 'in' or 'out'
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const filteredInventory = inventory.filter(item =>
    item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchText.toLowerCase())
  );

  const inventoryStats = {
    totalItems: inventory.length,
    inStock: inventory.filter(i => i.status === 'in_stock').length,
    lowStock: inventory.filter(i => i.status === 'low_stock').length,
    outOfStock: inventory.filter(i => i.status === 'out_of_stock').length,
    totalValue: inventory.reduce((sum, item) => {
      const product = mockProducts.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.currentStock : 0);
    }, 0),
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const showStockModal = (item, action) => {
    setSelectedItem(item);
    setStockAction(action);
    setIsStockModalVisible(true);
    form.resetFields();
  };

  const handleStockCancel = () => {
    setIsStockModalVisible(false);
    setSelectedItem(null);
    form.resetFields();
  };

  const handleStockSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { quantity, reason } = values;
      
      setInventory(inventory.map(item => {
        if (item.id === selectedItem.id) {
          const newStock = stockAction === 'in' 
            ? item.currentStock + quantity 
            : Math.max(0, item.currentStock - quantity);
          
          const newAvailableStock = newStock - item.reservedStock;
          
          let newStatus = 'in_stock';
          if (newStock === 0) {
            newStatus = 'out_of_stock';
          } else if (newStock <= item.minStock) {
            newStatus = 'low_stock';
          }
          
          return {
            ...item,
            currentStock: newStock,
            availableStock: newAvailableStock,
            status: newStatus,
            lastRestocked: stockAction === 'in' ? new Date().toISOString().split('T')[0] : item.lastRestocked,
          };
        }
        return item;
      }));
      
      message.success(
        stockAction === 'in' 
          ? `Đã nhập kho ${quantity} sản phẩm` 
          : `Đã xuất kho ${quantity} sản phẩm`
      );
      
      setIsStockModalVisible(false);
      setSelectedItem(null);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return 'green';
      case 'low_stock': return 'orange';
      case 'out_of_stock': return 'red';
      default: return 'default';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'in_stock': return 'Còn hàng';
      case 'low_stock': return 'Sắp hết';
      case 'out_of_stock': return 'Hết hàng';
      default: return 'Không xác định';
    }
  };

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
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
      title: 'Tồn kho hiện tại',
      dataIndex: 'currentStock',
      key: 'currentStock',
      sorter: (a, b) => a.currentStock - b.currentStock,
      render: (stock, record) => (
        <div>
          <Text strong style={{ fontSize: 16 }}>{stock}</Text>
          <Progress
            percent={(stock / record.maxStock) * 100}
            size="small"
            status={stock <= record.minStock ? 'exception' : 'normal'}
            showInfo={false}
            style={{ marginTop: 4 }}
          />
        </div>
      ),
    },
    {
      title: 'Có thể bán',
      dataIndex: 'availableStock',
      key: 'availableStock',
      render: (available, record) => (
        <div>
          <div>{available}</div>
          {record.reservedStock > 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Đã đặt: {record.reservedStock}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Tối thiểu',
      dataIndex: 'minStock',
      key: 'minStock',
    },
    {
      title: 'Tối đa',
      dataIndex: 'maxStock',
      key: 'maxStock',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Còn hàng', value: 'in_stock' },
        { text: 'Sắp hết', value: 'low_stock' },
        { text: 'Hết hàng', value: 'out_of_stock' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStockStatusColor(status)}>
          {getStockStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Nhập kho cuối',
      dataIndex: 'lastRestocked',
      key: 'lastRestocked',
      sorter: (a, b) => new Date(a.lastRestocked) - new Date(b.lastRestocked),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => showStockModal(record, 'in')}
            title="Nhập kho"
          />
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => showStockModal(record, 'out')}
            title="Xuất kho"
            disabled={record.availableStock === 0}
          />
        </Space>
      ),
    },
  ];

  const lowStockItems = inventory.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock');

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>Quản lý Kho</Title>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Alert
              message={`Cảnh báo: Có ${lowStockItems.length} sản phẩm sắp hết hoặc đã hết hàng`}
              description={
                <div>
                  {lowStockItems.slice(0, 3).map(item => (
                    <div key={item.id}>
                      {item.productName}: {item.currentStock}/{item.minStock}
                    </div>
                  ))}
                  {lowStockItems.length > 3 && <div>...</div>}
                </div>
              }
              type="warning"
              showIcon
              icon={<WarningOutlined />}
            />
          </Col>
        </Row>
      )}

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Tổng mặt hàng"
              value={inventoryStats.totalItems}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Còn hàng"
              value={inventoryStats.inStock}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Sắp hết"
              value={inventoryStats.lowStock}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Giá trị kho"
              value={inventoryStats.totalValue}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#722ed1' }}
            />
          </StatCard>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Danh sách tồn kho" key="1">
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
                <Button icon={<SyncOutlined />}>Đồng bộ</Button>
                <Button icon={<ExportOutlined />}>Xuất Excel</Button>
              </Space>
            </div>

            <Table
              columns={columns}
              dataSource={filteredInventory}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} mặt hàng`,
              }}
              rowClassName={(record) => {
                if (record.status === 'out_of_stock') return 'row-out-of-stock';
                if (record.status === 'low_stock') return 'row-low-stock';
                return '';
              }}
            />
          </StyledCard>
        </TabPane>

        <TabPane tab="Cảnh báo tồn kho" key="2">
          <AlertCard title="Sản phẩm cần bổ sung">
            <Table
              columns={columns.filter(col => 
                ['productName', 'currentStock', 'minStock', 'supplier', 'status', 'action'].includes(col.key)
              )}
              dataSource={lowStockItems}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </AlertCard>
        </TabPane>
      </Tabs>

      {/* Stock Modal */}
      <Modal
        title={
          stockAction === 'in' 
            ? `Nhập kho - ${selectedItem?.productName}` 
            : `Xuất kho - ${selectedItem?.productName}`
        }
        open={isStockModalVisible}
        onOk={handleStockSubmit}
        onCancel={handleStockCancel}
        okText={stockAction === 'in' ? 'Nhập kho' : 'Xuất kho'}
        cancelText="Hủy"
      >
        {selectedItem && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>Tồn kho hiện tại: </Text>
            <Text>{selectedItem.currentStock}</Text>
          </div>
        )}
        
        <Form
          form={form}
          layout="vertical"
          name="stockForm"
        >
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng!' },
              { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' },
              stockAction === 'out' && {
                validator: (_, value) => {
                  if (value > selectedItem?.availableStock) {
                    return Promise.reject(new Error(`Số lượng không được vượt quá ${selectedItem?.availableStock}`));
                  }
                  return Promise.resolve();
                }
              }
            ].filter(Boolean)}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={stockAction === 'out' ? selectedItem?.availableStock : undefined}
            />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <Select placeholder="Chọn lý do">
              {stockAction === 'in' ? (
                <>
                  <Option value="purchase">Nhập hàng từ nhà cung cấp</Option>
                  <Option value="return">Trả hàng từ khách hàng</Option>
                  <Option value="adjustment">Điều chỉnh tồn kho</Option>
                  <Option value="other">Khác</Option>
                </>
              ) : (
                <>
                  <Option value="sale">Bán hàng</Option>
                  <Option value="damage">Hàng hỏng</Option>
                  <Option value="loss">Mất hàng</Option>
                  <Option value="adjustment">Điều chỉnh tồn kho</Option>
                  <Option value="other">Khác</Option>
                </>
              )}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .row-out-of-stock {
          background-color: #fff2f0;
        }
        .row-low-stock {
          background-color: #fff7e6;
        }
      `}</style>
    </div>
  );
};

export default InventoryManagement;