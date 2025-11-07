import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Space,
  message,
  Select,
  Input,
  Typography,
  Divider,
  List,
  Avatar,
  Card,
  Badge,
  Statistic,
  Row,
  Col,
} from "antd";
import { orderService } from "../../../services";
import { useLocation } from "react-router-dom";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const location = useLocation();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get("orderId");
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o._id === orderId);
      if (order) {
        handleViewDetail(order);
      }
    }
  }, [location.search, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await orderService.getAllOrders(params);
      const ordersData = response.data || [];
      setOrders(ordersData);
      
      // Tính toán thống kê
      const newStats = {
        total: ordersData.length,
        pending: ordersData.filter(o => o.status === "Pending").length,
        processing: ordersData.filter(o => o.status === "Processing").length,
        shipped: ordersData.filter(o => o.status === "Shipped").length,
        delivered: ordersData.filter(o => o.status === "Delivered").length,
        cancelled: ordersData.filter(o => o.status === "Cancelled").length,
      };
      setStats(newStats);
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, { status: newStatus });
      message.success(`Đã cập nhật trạng thái đơn hàng thành ${newStatus}`);
      fetchOrders();
      setDetailModalVisible(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error(error.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      render: (id) => `#${id.slice(-6)}`,
    },
    {
      title: "Khách hàng",
      dataIndex: ["userId", "name"],
      key: "userId",
      render: (name, record) => (
        <div>
          <div>{name || record.userId?.name || "N/A"}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.userId?.email || ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      key: "items",
      render: (_, record) => (
        <div>
          {record.items?.length || 0} sản phẩm
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          Pending: "orange",
          Processing: "blue",
          Shipped: "cyan",
          Delivered: "green",
          Cancelled: "red",
        };
        const textMap = {
          Pending: "Chờ xử lý",
          Processing: "Đang xử lý",
          Shipped: "Đã gửi hàng",
          Delivered: "Đã giao",
          Cancelled: "Đã hủy",
        };
        return <Tag color={colorMap[status]}>{textMap[status]}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý Đơn hàng</Title>

        {/* Thống kê */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic title="Tổng đơn" value={stats.total} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Chờ xử lý" value={stats.pending} valueStyle={{ color: "#faad14" }} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Đang xử lý" value={stats.processing} valueStyle={{ color: "#1890ff" }} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Đã gửi" value={stats.shipped} valueStyle={{ color: "#13c2c2" }} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Đã giao" value={stats.delivered} valueStyle={{ color: "#52c41a" }} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Đã hủy" value={stats.cancelled} valueStyle={{ color: "#ff4d4f" }} />
            </Card>
          </Col>
        </Row>

        <div style={{ marginBottom: 16 }}>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            allowClear
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="Pending">Chờ xử lý</Option>
            <Option value="Processing">Đang xử lý</Option>
            <Option value="Shipped">Đã gửi hàng</Option>
            <Option value="Delivered">Đã giao</Option>
            <Option value="Cancelled">Đã hủy</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />

        {/* Modal chi tiết */}
        <Modal
          title={`Chi tiết Đơn hàng #${selectedOrder?._id?.slice(-6)}`}
          visible={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setSelectedOrder(null);
          }}
          footer={null}
          width={900}
          styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
        >
          {selectedOrder && (
            <div>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Mã đơn">
                  #{selectedOrder._id.slice(-6)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag
                    color={
                      selectedOrder.status === "Pending"
                        ? "orange"
                        : selectedOrder.status === "Processing"
                        ? "blue"
                        : selectedOrder.status === "Delivered"
                        ? "green"
                        : "red"
                    }
                  >
                    {selectedOrder.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {selectedOrder.userId?.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedOrder.userId?.email || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(selectedOrder.totalPrice || 0)}
                </Descriptions.Item>
                <Descriptions.Item label="Phương thức thanh toán">
                  {selectedOrder.paymentMethod || "N/A"}
                </Descriptions.Item>
                {selectedOrder.notes && (
                  <Descriptions.Item label="Ghi chú" span={2}>
                    {selectedOrder.notes}
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Divider orientation="left">Sản phẩm</Divider>
              <List
                dataSource={selectedOrder.items || []}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} shape="square" size={64} />}
                      title={item.name}
                      description={
                        <div>
                          <div>
                            {item.variant?.size} - {item.variant?.color}
                          </div>
                          <div>
                            Số lượng: {item.quantity} | Giá:{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price * item.quantity)}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />

              <Divider orientation="left">Cập nhật trạng thái</Divider>
              <Space>
                {selectedOrder.status !== "Processing" && (
                  <Button onClick={() => handleUpdateStatus(selectedOrder._id, "Processing")}>
                    Đang xử lý
                  </Button>
                )}
                {selectedOrder.status !== "Shipped" && (
                  <Button onClick={() => handleUpdateStatus(selectedOrder._id, "Shipped")}>
                    Đã gửi hàng
                  </Button>
                )}
                {selectedOrder.status !== "Delivered" && (
                  <Button
                    type="primary"
                    onClick={() => handleUpdateStatus(selectedOrder._id, "Delivered")}
                  >
                    Đã giao
                  </Button>
                )}
              </Space>
            </div>
          )}
        </Modal>
    </div>
  );
};

export default OrderManagement;

