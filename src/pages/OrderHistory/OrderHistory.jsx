import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Card,
  Typography,
  Tag,
  Avatar,
  Row,
  Col,
  Input,
  Space,
  Statistic,
  Modal,
  Descriptions,
  Divider,
  List,
  Button,
  Spin,
  message,
  Empty,
  Select,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { orderService } from "../../services";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text } = Typography;
const { Option } = Select;

const OrderHistory = () => {
  const [searchText, setSearchText] = useState("");
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // ✅ State cho sort option
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "oldest"

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await orderService.getUserOrders();
       
        if (response && response.success && response.data) {
          setOrdersData(response.data);
        } else if (Array.isArray(response)) {
          setOrdersData(response);
        } else {
          console.error("Unexpected response format:", response);
          setOrdersData([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Không thể tải lịch sử đơn hàng. Vui lòng thử lại.";
        message.error(errorMessage);
        setError(errorMessage);
        setOrdersData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Thống kê tổng số đơn và tổng tiền
  const totalOrders = ordersData?.length || 0;
  const totalRevenue = ordersData?.reduce(
    (acc, order) => acc + (order.totalPrice || 0),
    0
  ) || 0;

  // ✅ Filter và sort orders với useMemo
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...(ordersData || [])];

    // Filter theo tên sản phẩm hoặc người nhận
    if (searchText.trim()) {
      const query = searchText.toLowerCase().trim();
      filtered = filtered.filter(
        (order) =>
          order.items?.some((item) =>
            (item.name || item.productId?.name || "").toLowerCase().includes(query)
          ) ||
          order.shippingAddress?.fullName
            ?.toLowerCase()
            .includes(query) ||
          order._id?.toLowerCase().includes(query) // Tìm theo mã đơn
      );
    }

    // Sort theo ngày
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      
      if (sortBy === "newest") {
        return dateB - dateA; // Mới nhất trước
      } else {
        return dateA - dateB; // Cũ nhất trước
      }
    });

    return filtered;
  }, [ordersData, searchText, sortBy]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          padding: "24px",
        }}
      >
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (error && ordersData.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          padding: "24px",
        }}
      >
        <Empty
          description={error}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button
          type="primary"
          onClick={() => {
            setError(null);
            setIsLoading(true);
            const fetchOrders = async () => {
              try {
                const response = await orderService.getUserOrders();
                if (response && response.success && response.data) {
                  setOrdersData(response.data);
                } else if (Array.isArray(response)) {
                  setOrdersData(response);
                } else {
                  setOrdersData([]);
                }
              } catch (err) {
                console.error("Error fetching orders:", err);
                message.error(
                  err.response?.data?.message ||
                    err.message ||
                    "Không thể tải lịch sử đơn hàng. Vui lòng thử lại."
                );
                setError(
                  err.response?.data?.message ||
                    err.message ||
                    "Không thể tải lịch sử đơn hàng. Vui lòng thử lại."
                );
                setOrdersData([]);
              } finally {
                setIsLoading(false);
              }
            };
            fetchOrders();
          }}
          style={{ marginTop: 16 }}
        >
          Thử lại
        </Button>
      </div>
    );
  }

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "_id",
      key: "_id",
      width: 100,
      render: (id) => (
        <strong style={{ color: "#1890ff" }}>{id.slice(-6)}</strong>
      ),
    },
    {
      title: "Người nhận",
      dataIndex: "shippingAddress",
      key: "fullName",
      width: 150,
      render: (address) => (
        <div>
          <div style={{ fontWeight: 500 }}>{address.fullName}</div>
          <div style={{ fontSize: 12, color: "#666" }}>{address.phone}</div>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "items",
      key: "items",
      width: 300,
      render: (items) => (
        <div>
          {items.slice(0, 2).map((item, index) => (
            <div
              key={item._id || item.productId?._id || index}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 8,
                padding: 8,
                background: "#f5f5f5",
                borderRadius: 6,
                border: "1px solid #e8e8e8",
              }}
            >
              <Avatar
                src={item.image || item.productId?.image}
                size={32}
                shape="square"
                style={{ marginRight: 8, borderRadius: 4 }}
                icon={!item.image && !item.productId?.image ? "?" : undefined}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {item.variant?.size} - {item.variant?.color} | x
                  {item.quantity}
                </div>
              </div>
            </div>
          ))}
          {items.length > 2 && (
            <div style={{ fontSize: 12, color: "#999", textAlign: "center" }}>
              +{items.length - 2} sản phẩm khác
            </div>
          )}
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              marginTop: 4,
              color: "#52c41a",
            }}
          >
            Tổng SL: {items.reduce((acc, i) => acc + i.quantity, 0)}
          </div>
        </div>
      ),
    },
    {
      title: "Phương thức TT",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 120,
      render: (method) => (
        <Tag
          color={method === "COD" ? "blue" : "green"}
          style={{ fontWeight: 500 }}
        >
          {method}
        </Tag>
      ),
    },
    {
      title: "Địa chỉ nhận",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      width: 100,
      render: (address) => (
        <div style={{ fontSize: 12, lineHeight: 1.4 }}>
          <div style={{ fontWeight: 500 }}>
            {address.address}, {address.city}, {address.country}
          </div>
          <div style={{ color: "#666" }}>
            Mã bưu điện: {address.postalCode} | {address.phone}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 100,
      align: "right",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status, record) => {
        let color = "default";
        let displayStatus = status;
        if (status === "Pending") {
          color = record.isPaid ? "orange" : "default";
          displayStatus = record.isPaid ? "Đã thanh toán" : "Chờ xử lý";
        } else if (status === "Delivered") {
          color = "green";
          displayStatus = "Đã giao";
        } else if (status === "Cancelled") {
          color = "red";
          displayStatus = "Đã hủy";
        }
        return (
          <div>
            <Tag color={color} style={{ fontWeight: 600 }}>
              {displayStatus}
            </Tag>
            {record.isDelivered && (
              <Tag color="cyan" size="small">
                Giao hàng
              </Tag>
            )}
            {record.isPaid && (
              <Tag color="green" style={{ fontSize: 11, marginTop: 4 }}>
                Đã thanh toán
              </Tag>
            )}
            {status === "Cancelled" && record.cancelReason && (
              <div style={{ fontSize: 12, color: "#ff4d4f", marginTop: 4 }}>
                Lý do: {record.cancelReason}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) =>
        dayjs(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
    },
    {
      title: "Ngày nhận hàng",
      dataIndex: "deliveredAt",
      key: "deliveredAt",
      width: 150,
      render: (date, record) => {
        if (date && record.isDelivered) {
          return (
            <div>
              <div style={{ color: "#52c41a", fontWeight: 500 }}>
                {dayjs(date).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm")}
              </div>
            </div>
          );
        }
        return (
          <div style={{ color: "#999", fontStyle: "italic" }}>Chưa giao</div>
        );
      },
      sorter: (a, b) => {
        const dateA = a.deliveredAt ? new Date(a.deliveredAt).getTime() : 0;
        const dateB = b.deliveredAt ? new Date(b.deliveredAt).getTime() : 0;
        return dateA - dateB;
      },
    },
  ];

  const handleOrderClick = (record) => {
    setSelectedOrder(record);
  };

  const renderOrderDetails = (order) => {
    const subtotal = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return (
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Mã đơn hàng">
          <strong>{order._id}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {dayjs(order.createdAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("DD/MM/YYYY HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {dayjs(order.updatedAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("DD/MM/YYYY HH:mm:ss")}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày nhận hàng">
          {order.deliveredAt && order.isDelivered ? (
            <Tag color="green">
              {dayjs(order.deliveredAt)
                .tz("Asia/Ho_Chi_Minh")
                .format("DD/MM/YYYY HH:mm:ss")}
            </Tag>
          ) : (
            <Tag color="default">Chưa giao hàng</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Người nhận">
          {order.shippingAddress.fullName} - {order.shippingAddress.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng">
          {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          <Tag color="blue">{order.paymentMethod}</Tag>
          {order.isPaid && (
            <Tag color="green" style={{ marginLeft: 8 }}>
              Đã thanh toán{" "}
              {dayjs(order.paidAt).tz("Asia/Ho_Chi_Minh").format("DD/MM HH:mm")}
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái đơn hàng">
          <Tag
            color={
              order.status === "Delivered"
                ? "green"
                : order.status === "Cancelled"
                ? "red"
                : "orange"
            }
          >
            {order.status}
          </Tag>
          {order.isDelivered && (
            <Tag color="cyan" style={{ marginLeft: 8 }}>
              Đã giao hàng
            </Tag>
          )}
          {order.status === "Cancelled" && order.cancelReason && (
            <div style={{ marginTop: 8, color: "#ff4d4f" }}>
              Lý do hủy: {order.cancelReason}
            </div>
          )}
        </Descriptions.Item>
        <Divider orientation="left">Sản phẩm</Divider>
        <Descriptions.Item label="">
          <List
            dataSource={order.items}
            renderItem={(item) => (
              <List.Item style={{ padding: "8px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Avatar
                    src={item.image || item.productId?.image}
                    size={48}
                    shape="square"
                    style={{ marginRight: 12 }}
                    icon={
                      !item.image && !item.productId?.image ? "?" : undefined
                    }
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      Kích cỡ: {item.variant?.size} | Màu: {item.variant?.color}{" "}
                      | SL: {item.quantity}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#1890ff", marginTop: 4 }}
                    >
                      Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}{" "}
                      x {item.quantity} ={" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
            bordered={false}
            style={{ marginBottom: 16 }}
          />
        </Descriptions.Item>
        <Divider orientation="left">Tóm tắt giá</Divider>
        <Descriptions.Item label="Tiền hàng">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(order.itemsPrice)}
        </Descriptions.Item>
        <Descriptions.Item label="Thuế">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(order.taxPrice)}
        </Descriptions.Item>
        <Descriptions.Item label="Phí ship">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(order.shippingPrice)}
        </Descriptions.Item>
        <Descriptions.Item label="Giảm giá">
          {order.discountApplied
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order.discountAmount)
            : "Không"}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền" span={3}>
          <strong style={{ color: "#52c41a", fontSize: 16 }}>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(order.totalPrice)}
          </strong>
        </Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <div style={{ background: "#f0f2f5", padding: "24px", borderRadius: 12, minHeight: "100vh" }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2} style={{ margin: 0, color: "#262626" }}>
            Lịch sử mua hàng
          </Title>
        </Col>
      </Row>

      {/* Thống kê nhanh */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <Statistic
              title="Tổng đơn hàng"
              value={totalOrders}
              valueStyle={{ fontSize: 24, color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card
            style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            <Statistic
              title="Tổng chi tiêu"
              value={totalRevenue}
              precision={0}
              prefix="₫"
              valueStyle={{ color: "#52c41a", fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
        bodyStyle={{ padding: "24px" }}
      >
        {/* ✅ Filter và Search */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Input
              placeholder="Tìm kiếm theo tên sản phẩm, người nhận hoặc mã đơn..."
              prefix={<SearchOutlined />}
              allowClear
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              value={sortBy}
              onChange={setSortBy}
              size="large"
              style={{ width: 180 }}
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="oldest">Cũ nhất</Option>
            </Select>
          </Col>
        </Row>

        {/* ✅ Hiển thị số lượng kết quả */}
        <div style={{ marginBottom: 16, fontSize: 14, color: "#666" }}>
          {filteredAndSortedOrders.length === 0 && searchText ? (
            <Text type="secondary">
              Không tìm thấy đơn hàng nào phù hợp với "{searchText}"
            </Text>
          ) : (
            <Text>
              Hiển thị {filteredAndSortedOrders.length} / {totalOrders} đơn hàng
              {searchText && ` cho "${searchText}"`}
            </Text>
          )}
        </div>

        {filteredAndSortedOrders.length === 0 && !isLoading ? (
          <Empty
            description={
              searchText 
                ? "Không tìm thấy đơn hàng nào. Thử thay đổi từ khóa tìm kiếm."
                : "Chưa có đơn hàng nào"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredAndSortedOrders}
            rowKey="_id"
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
            bordered={false}
            rowClassName={() => "ant-table-row-hover"}
            onRow={(record) => ({
              onClick: () => handleOrderClick(record),
              style: { cursor: "pointer", background: "#fafafa" },
            })}
            scroll={{ x: 1000 }}
            loading={isLoading}
          />
        )}
      </Card>

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <strong>Chi tiết đơn hàng #{selectedOrder?._id?.slice(-6)}</strong>
          </div>
        }
        visible={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        footer={null}
        width={800}
        bodyStyle={{ padding: "24px", maxHeight: "70vh", overflowY: "auto" }}
      >
        {selectedOrder && renderOrderDetails(selectedOrder)}
      </Modal>

    </div>
  );
};

export default OrderHistory;
