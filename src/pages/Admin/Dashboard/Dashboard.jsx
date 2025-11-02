import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Tag,
  Typography,
  DatePicker,
  Spin,
  message,
  Modal,
  Image,
  Descriptions,
  Divider,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  FileDoneOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { userService } from "../../../services/userService";
import { orderService } from "../../../services";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title } = Typography;

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

const ModalContent = styled.div`
  .ant-descriptions-item-label {
    background: #f0f2f5;
    padding: 8px 12px;
    border-radius: 4px;
  }
  .ant-table {
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
  }
  .ant-table-thead > tr > th {
    background: #f5f5f5;
    font-weight: 600;
  }
  .ant-table-tbody > tr:hover > td {
    background: #f0f8ff;
  }
  .summary-section {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
    border-left: 4px solid #1890ff;
  }
  .discount-tag {
    background: #fff2e8;
    color: #fa8c16;
    border: 1px solid #ffd591;
  }
`;

const ProductImage = styled(Image)`
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
`;

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await userService.getDashboardStatistics();
      setStats(response);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyRevenue = async (date) => {
    if (!date) return;
    try {
      setLoadingRevenue(true);
      const vnDate = dayjs(date).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD");
      const response = await userService.getDailyRevenue(vnDate);

      if (response.success) {
        setDailyRevenue(response.orders || []);
        setDailySummary({
          date: response.date,
          totalOrders: response.totalOrders,
          paidOrders: response.paidOrders,
          unpaidOrders: response.unpaidOrders,
          totalRevenue: response.totalRevenue,
        });
      } else {
        message.warning("Không có dữ liệu doanh thu cho ngày này.");
        setDailyRevenue([]);
        setDailySummary(null);
      }
    } catch (error) {
      console.error("Lỗi khi tải doanh thu:", error);
      message.error("Không thể tải dữ liệu doanh thu.");
      setDailyRevenue([]);
      setDailySummary(null);
    } finally {
      setLoadingRevenue(false);
    }
  };

  const fetchOrderDetail = async (id) => {
    try {
      const response = await orderService.getOrderById(id);
      return response;
    } catch (error) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchDailyRevenue(selectedDate);
  }, []);

  const handleDateChange = (date) => {
    if (!date) return;
    setSelectedDate(date);
    fetchDailyRevenue(date);
  };

  const handleViewDetails = async (order) => {
    const details = await fetchOrderDetail(order.id);
    if (details) {
      setSelectedOrder(details.data);
      setIsModalVisible(true);
    } else {
      message.error("Không thể tải chi tiết đơn hàng.");
    }
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalVisible(false);
  };

  const revenueColumns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      render: (id) => `#${id.toString().slice(-6)}`,
    },
    { title: "Khách hàng", dataIndex: "customerName", key: "customerName" },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "totalItems",
      key: "totalItems",
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => formatCurrency(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colors = {
          Pending: "orange",
          Processing: "blue",
          Shipped: "purple",
          Delivered: "green",
          Cancelled: "red",
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      key: "isPaid",
      render: (paid) =>
        paid ? (
          <Tag color="green">Đã thanh toán</Tag>
        ) : (
          <Tag color="red">Chưa thanh toán</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        dayjs(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <a onClick={() => handleViewDetails(record)}>Xem chi tiết</a>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        {" "}
        <Spin size="large" />{" "}
      </div>
    );
  }

  return (
    <div>
      {" "}
      <Title level={2}>Thống kê doanh thu</Title>
      {/* Tổng quan hệ thống */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Tổng Users"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Tổng Sản phẩm"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Danh mục"
              value={stats.totalCategories}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard>
            <Statistic
              title="Doanh thu hôm nay"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value)}
              valueStyle={{ color: "#cf1322" }}
              suffix={<ArrowUpOutlined />}
            />
          </StatCard>
        </Col>
      </Row>
      {/* Báo cáo doanh thu ngày */}
      <StyledCard
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                Báo cáo doanh thu ngày
              </Title>
            </Col>
            <Col>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                allowClear={false}
              />
            </Col>
          </Row>
        }
      >
        {/* Tổng kết doanh thu theo ngày */}
        {dailySummary && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <StatCard>
                <Statistic
                  title="Tổng đơn hàng"
                  value={dailySummary.totalOrders}
                  prefix={<FileDoneOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </StatCard>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard>
                <Statistic
                  title="Đơn đã thanh toán"
                  value={dailySummary.paidOrders}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </StatCard>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard>
                <Statistic
                  title="Đơn chưa thanh toán"
                  value={dailySummary.unpaidOrders}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </StatCard>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <StatCard>
                <Statistic
                  title="Tổng doanh thu"
                  value={dailySummary.totalRevenue}
                  prefix={<DollarOutlined />}
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: "#722ed1" }}
                />
              </StatCard>
            </Col>
          </Row>
        )}

        {/* Bảng chi tiết đơn hàng */}
        {loadingRevenue ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={revenueColumns}
            dataSource={dailyRevenue}
            rowKey="id"
            pagination={false}
          />
        )}
      </StyledCard>
      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?._id?.slice(-6)}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={1000}
      >
        <ModalContent>
          {selectedOrder && (
            <div>
              <Row gutter={24}>
                <Col span={12}>
                  <Title level={5}>
                    <UserOutlined /> Thông tin khách hàng
                  </Title>
                  <Descriptions
                    bordered
                    column={1}
                    size="small"
                    style={{ marginBottom: 24 }}
                  >
                    <Descriptions.Item label="Tên khách hàng">
                      {selectedOrder.userId?.name || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      <MailOutlined /> {selectedOrder.userId?.email || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Điện thoại">
                      <PhoneOutlined />{" "}
                      {selectedOrder.shippingAddress?.phone || "Chưa có"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ giao hàng">
                      <EnvironmentOutlined />{" "}
                      {selectedOrder.shippingAddress
                        ? `${selectedOrder.shippingAddress.address || ""}, ${
                            selectedOrder.shippingAddress.city || ""
                          }`
                        : "Chưa có"}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Title level={5}>
                    <TruckOutlined /> Trạng thái & Thanh toán
                  </Title>
                  <Descriptions
                    bordered
                    column={1}
                    size="small"
                    style={{ marginBottom: 24 }}
                  >
                    <Descriptions.Item label="Phương thức thanh toán">
                      <CreditCardOutlined /> {selectedOrder.paymentMethod}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái thanh toán">
                      {selectedOrder.isPaid ? (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                          Đã thanh toán
                        </Tag>
                      ) : (
                        <Tag color="red" icon={<CloseCircleOutlined />}>
                          Chưa thanh toán
                        </Tag>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đơn hàng">
                      <Tag
                        color={
                          {
                            Pending: "orange",
                            Processing: "blue",
                            Shipped: "purple",
                            Delivered: "green",
                            Cancelled: "red",
                          }[selectedOrder.status]
                        }
                      >
                        {selectedOrder.status}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo đơn">
                      <CalendarOutlined />{" "}
                      {dayjs(selectedOrder.createdAt)
                        .tz("Asia/Ho_Chi_Minh")
                        .format("DD/MM/YYYY HH:mm")}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>

              <Divider />

              <Title level={5}>
                <ShoppingOutlined /> Danh sách sản phẩm
              </Title>
              <Table
                dataSource={selectedOrder.items}
                rowKey="productId"
                pagination={false}
                bordered
                size="small"
                columns={[
                  {
                    title: "Ảnh sản phẩm",
                    dataIndex: "productId",
                    key: "image",
                    width: 110,
                    render: (product) => (
                      <ProductImage
                        src={product?.image}
                        width={50}
                        height={50}
                        fallback="https://via.placeholder.com/50x50?text=No+Image"
                      />
                    ),
                  },
                  {
                    title: "Tên sản phẩm",
                    dataIndex: "name",
                    key: "name",
                    ellipsis: true,
                  },
                  {
                    title: "Thể loại",
                    // dataIndex: "name",
                    // key: "name",
                    ellipsis: true,
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: "center",
                    width: 80,
                  },
                  {
                    title: "Giá đơn vị",
                    dataIndex: "price",
                    key: "price",
                    align: "right",
                    width: 120,
                    render: (price) => price,
                  },
                  {
                    title: "Tổng phụ",
                    key: "total",
                    align: "right",
                    width: 120,
                    render: (_, record) => record.price * record.quantity,
                  },
                ]}
              />

              <div className="summary-section">
                {selectedOrder.discount > 0 && (
                  <Row
                    justify="space-between"
                    align="middle"
                    style={{ marginBottom: 8 }}
                  >
                    <Col>
                      <Tag className="discount-tag">Giảm giá</Tag>
                    </Col>
                    <Col>{formatCurrency(selectedOrder.discount)}</Col>
                  </Row>
                )}
                <Divider style={{ margin: "8px 0" }} />
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                      Tổng thanh toán
                    </Title>
                  </Col>
                  <Col>
                    <Statistic
                      value={selectedOrder.totalPrice}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: "#52c41a", fontSize: "18px" }}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
