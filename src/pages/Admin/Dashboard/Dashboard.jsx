import React from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Progress, List, Avatar } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';
import { mockDashboardStats } from '../../../data/mockData';

const { Title, Text } = Typography;

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 24px;
  }
`;

const StatCard = styled(Card)`
  .ant-statistic-title {
    color: #666;
    font-weight: 500;
  }
  .ant-statistic-content {
    color: #1890ff;
  }
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;
  }
`;

const AlertCard = styled(Card)`
  border-left: 4px solid #ff4d4f;
`;

const Dashboard = () => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const orderColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id.toString().padStart(6, '0')}`,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total) => formatCurrency(total),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          completed: 'green',
          processing: 'blue',
          shipped: 'orange',
          cancelled: 'red',
        };
        const labels = {
          completed: 'Hoàn thành',
          processing: 'Đang xử lý',
          shipped: 'Đã gửi',
          cancelled: 'Đã hủy',
        };
        return <Tag color={colors[status]}>{labels[status]}</Tag>;
      },
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Tổng Users"
              value={mockDashboardStats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={<ArrowUpOutlined />}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Tổng Sản phẩm"
              value={mockDashboardStats.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Danh mục"
              value={mockDashboardStats.totalCategories}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Doanh thu"
              value={mockDashboardStats.totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: '#cf1322' }}
              suffix={<ArrowUpOutlined />}
            />
          </StatCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Top Products */}
        <Col xs={24} lg={12}>
          <StyledCard title="Sản phẩm bán chạy" size="small">
            <List
              itemLayout="horizontal"
              dataSource={mockDashboardStats.topProducts}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {index + 1}
                      </Avatar>
                    }
                    title={item.name}
                    description={
                      <div>
                        <Text>Đã bán: {item.sales} sản phẩm</Text>
                        <br />
                        <Text strong>{formatCurrency(item.revenue)}</Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </StyledCard>
        </Col>

        {/* Low Stock Alerts */}
        <Col xs={24} lg={12}>
          <AlertCard 
            title={
              <span>
                <WarningOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
                Cảnh báo tồn kho thấp
              </span>
            } 
            size="small"
          >
            <List
              itemLayout="horizontal"
              dataSource={mockDashboardStats.lowStockAlerts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.productName}
                    description={
                      <div>
                        <Progress
                          percent={(item.currentStock / item.minStock) * 100}
                          size="small"
                          status={item.currentStock <= item.minStock ? 'exception' : 'normal'}
                        />
                        <Text>
                          Còn lại: {item.currentStock} / Tối thiểu: {item.minStock}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </AlertCard>
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <StyledCard title="Đơn hàng gần đây" size="small">
            <Table
              columns={orderColumns}
              dataSource={mockDashboardStats.recentOrders}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </StyledCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;