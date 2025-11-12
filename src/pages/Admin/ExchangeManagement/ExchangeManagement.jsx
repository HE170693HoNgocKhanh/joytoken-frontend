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
} from "antd";
import { exchangeService } from "../../../services";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const ExchangeManagement = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchExchanges();
  }, [statusFilter]);

  const fetchExchanges = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const response = await exchangeService.getAllExchanges(params);
      setExchanges(response.data || []);
    } catch (error) {
      console.error("Error fetching exchanges:", error);
      message.error("Không thể tải danh sách yêu cầu đổi hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (exchange) => {
    setSelectedExchange(exchange);
    setDetailModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      message.warning("Vui lòng chọn trạng thái mới");
      return;
    }

    // Kiểm tra nếu đang update thì không cho gọi lại
    if (updatingStatus) {
      return;
    }

    // Kiểm tra xem exchange đã được duyệt/từ chối chưa
    if (selectedExchange.status !== "Pending") {
      message.warning(`Yêu cầu này đã được ${selectedExchange.status === "Approved" ? "duyệt" : "từ chối"} rồi.`);
      setStatusModalVisible(false);
      setDetailModalVisible(false);
      fetchExchanges(); // Refresh để cập nhật data
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await exchangeService.updateExchangeStatus(
        selectedExchange._id,
        newStatus,
        adminNotes
      );
      
      if (newStatus === "Approved") {
        const newOrderId = response?.data?.newOrderId || response?.newOrder?._id;
        if (newOrderId) {
          message.success({
            content: `Yêu cầu đổi hàng đã được duyệt. Đơn hàng mới #${newOrderId.toString().slice(-6)} đã được tạo.`,
            duration: 5,
          });
        } else if (response?.data?.newOrder === null) {
          // Không có chênh lệch giá
          message.success("Yêu cầu đổi hàng đã được duyệt. Không có chênh lệch giá nên không tạo đơn hàng mới.");
        } else {
          message.success("Yêu cầu đổi hàng đã được duyệt.");
        }
      } else {
        message.success("Yêu cầu đổi hàng đã được từ chối");
      }
      
      setStatusModalVisible(false);
      setDetailModalVisible(false);
      setAdminNotes("");
      setNewStatus("");
      
      // Refresh danh sách exchanges
      await fetchExchanges();
    } catch (error) {
      console.error("Error updating status:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Không thể cập nhật trạng thái";
      message.error(errorMessage);
      
      // Nếu lỗi là "đã được duyệt", refresh data
      if (errorMessage.includes("đã được duyệt") || errorMessage.includes("đã được")) {
        fetchExchanges();
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const columns = [
    {
      title: "Mã yêu cầu",
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
      title: "Đơn hàng gốc",
      dataIndex: ["originalOrderId", "_id"],
      key: "originalOrderId",
      render: (id, record) => {
        const orderId = id || record.originalOrderId?._id || record.originalOrderId;
        return orderId ? `#${orderId.toString().slice(-6)}` : "N/A";
      },
    },
    {
      title: "Đơn hàng mới",
      dataIndex: ["newOrderId"],
      key: "newOrderId",
      render: (newOrderId, record) => {
        // newOrderId có thể là ObjectId string hoặc object có _id
        const orderId = newOrderId?._id || newOrderId;
        if (orderId) {
          return (
            <Tag color="green">
              #{orderId.toString().slice(-6)}
            </Tag>
          );
        }
        return <Text type="secondary">Chưa tạo</Text>;
      },
    },
    {
      title: "Sản phẩm trả",
      key: "itemsToReturn",
      render: (_, record) => (
        <div>
          {record.itemsToReturn?.length || 0} sản phẩm
        </div>
      ),
    },
    {
      title: "Sản phẩm đổi",
      key: "itemsToExchange",
      render: (_, record) => (
        <div>
          {record.itemsToExchange?.length || 0} sản phẩm
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          Pending: "orange",
          Approved: "green",
          Rejected: "red",
          Processing: "blue",
          Completed: "cyan",
          Cancelled: "default",
        };
        const textMap = {
          Pending: "Chờ xử lý",
          Approved: "Đã duyệt",
          Rejected: "Đã từ chối",
          Processing: "Đang xử lý",
          Completed: "Hoàn tất",
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
      <Title level={2}>Quản lý Yêu cầu Đổi hàng</Title>

        <div style={{ marginBottom: 16 }}>
          <Select
            placeholder="Lọc theo trạng thái"
            style={{ width: 200 }}
            allowClear
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="Pending">Chờ xử lý</Option>
            <Option value="Approved">Đã duyệt</Option>
            <Option value="Rejected">Đã từ chối</Option>
            <Option value="Processing">Đang xử lý</Option>
            <Option value="Completed">Hoàn tất</Option>
            <Option value="Cancelled">Đã hủy</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={exchanges}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />

        {/* Modal chi tiết */}
        <Modal
          title="Chi tiết Yêu cầu Đổi hàng"
          visible={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setSelectedExchange(null);
          }}
          footer={null}
          width={900}
          styles={{ body: { maxHeight: "70vh", overflowY: "auto" } }}
        >
          {selectedExchange && (
            <div>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Mã yêu cầu">
                  #{selectedExchange._id.slice(-6)}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag
                    color={
                      selectedExchange.status === "Pending"
                        ? "orange"
                        : selectedExchange.status === "Approved"
                        ? "green"
                        : "red"
                    }
                  >
                    {selectedExchange.status === "Pending"
                      ? "Chờ xử lý"
                      : selectedExchange.status === "Approved"
                      ? "Đã duyệt"
                      : selectedExchange.status === "Rejected"
                      ? "Đã từ chối"
                      : selectedExchange.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {selectedExchange.userId?.name || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedExchange.userId?.email || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn hàng gốc">
                  #{selectedExchange.originalOrderId?._id?.slice(-6) || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item label="Đơn hàng mới">
                  {(() => {
                    // Lấy ObjectId từ newOrderId (có thể là string hoặc object)
                    const newOrderId = selectedExchange.newOrderId?._id || selectedExchange.newOrderId;
                    if (newOrderId) {
                      const orderIdStr = newOrderId.toString();
                      return (
                        <Space>
                          <Tag color="green">
                            #{orderIdStr.slice(-6)}
                          </Tag>
                          <Button
                            type="link"
                            size="small"
                            onClick={() => {
                              window.open(`/admin/orders?orderId=${orderIdStr}`, '_blank');
                            }}
                          >
                            Xem đơn hàng
                          </Button>
                        </Space>
                      );
                    }
                    return <Text type="secondary">Chưa tạo (sẽ được tạo khi duyệt)</Text>;
                  })()}
                </Descriptions.Item>
                <Descriptions.Item label="Lý do đổi hàng" span={2}>
                  {selectedExchange.reason}
                </Descriptions.Item>
                {selectedExchange.adminNotes && (
                  <Descriptions.Item label="Ghi chú Admin" span={2}>
                    {selectedExchange.adminNotes}
                  </Descriptions.Item>
                )}
              </Descriptions>

              <Divider orientation="left">Sản phẩm cần trả</Divider>
              <List
                dataSource={selectedExchange.itemsToReturn || []}
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

              <Divider orientation="left">Sản phẩm muốn đổi</Divider>
              <List
                dataSource={selectedExchange.itemsToExchange || []}
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

              {selectedExchange.status === "Pending" && (
                <>
                  <Divider />
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={() => {
                        setNewStatus("Approved");
                        setStatusModalVisible(true);
                      }}
                    >
                      ✅ Duyệt yêu cầu
                    </Button>
                    <Button
                      type="default"
                      danger
                      size="large"
                      block
                      onClick={() => {
                        setNewStatus("Rejected");
                        setStatusModalVisible(true);
                      }}
                    >
                      ❌ Từ chối yêu cầu
                    </Button>
                  </Space>
                </>
              )}
            </div>
          )}
        </Modal>

        {/* Modal cập nhật trạng thái */}
        <Modal
          title={
            newStatus === "Approved"
              ? "Duyệt yêu cầu đổi hàng"
              : "Từ chối yêu cầu đổi hàng"
          }
          visible={statusModalVisible}
          onOk={handleUpdateStatus}
          onCancel={() => {
            setStatusModalVisible(false);
            setAdminNotes("");
            setNewStatus("");
            setUpdatingStatus(false);
          }}
          okText={newStatus === "Approved" ? "Duyệt" : "Từ chối"}
          cancelText="Hủy"
          confirmLoading={updatingStatus}
        >
          <div style={{ marginBottom: 16 }}>
            <Text>
              {newStatus === "Approved"
                ? "Bạn có chắc chắn muốn duyệt yêu cầu này? Hệ thống sẽ tự động tạo đơn hàng mới và cập nhật kho hàng."
                : "Bạn có chắc chắn muốn từ chối yêu cầu này?"}
            </Text>
          </div>
          <TextArea
            rows={4}
            placeholder="Ghi chú (tùy chọn)"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </Modal>
    </div>
  );
};

export default ExchangeManagement;

