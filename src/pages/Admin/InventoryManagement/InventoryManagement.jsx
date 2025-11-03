import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
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
  Input,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  WarningOutlined,
  SyncOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { inventoryService } from "../../../services/inventoryService";
import { productService } from "../../../services/productService";

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
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [stockAction, setStockAction] = useState("in");
  const [selectedItem, setSelectedItem] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState([]);

  const token = localStorage.getItem("token");

  // --- Fetch products ---
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts();
      const inventoryWithStatus = res.data.map((product) => {
        const minStock = product.minStock ?? 5;
        let status = "in_stock";
        if (product.countInStock <= 0) status = "out_of_stock";
        else if (product.countInStock <= minStock) status = "low_stock";

        return {
          id: product._id,
          productId: product._id,
          productName: product.name,
          currentStock: product.countInStock,
          minStock,
          availableStock: product.countInStock,
          status,
          price: product.price || 0,
        };
      });
      setInventory(inventoryWithStatus);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const inventoryStats = {
    totalItems: inventory.length,
    inStock: inventory.filter((i) => i.status === "in_stock").length,
    lowStock: inventory.filter((i) => i.status === "low_stock").length,
    outOfStock: inventory.filter((i) => i.status === "out_of_stock").length,
    totalValue: inventory.reduce((sum, i) => sum + i.price * i.currentStock, 0),
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const showStockModal = (item, action) => {
    setSelectedItem(item);
    setStockAction(action);
    setIsStockModalVisible(true);
    form.resetFields();
  };

  const showHistoryModal = async (item) => {
    setSelectedItem(item);
    try {
      console.log("Fetching history for product ID:", item.productId);
      const res = await inventoryService.productHistory(item.productId);
      console.log("History data:", res);
      setSelectedHistory(res.history || []);
      setIsHistoryModalVisible(true);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải lịch sử kho");
    }
  };

  const handleHistoryCancel = () => {
    setIsHistoryModalVisible(false);
    setSelectedItem(null);
    setSelectedHistory([]);
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

      if (stockAction === "in") {
        await inventoryService.importStock(
          { productId: selectedItem.productId, quantity, note: reason },
          token
        );
      } else {
        await inventoryService.exportStock(
          { productId: selectedItem.productId, quantity, note: reason },
          token
        );
      }

      message.success(
        stockAction === "in"
          ? `Đã nhập kho ${quantity} sản phẩm`
          : `Đã xuất kho ${quantity} sản phẩm`
      );
      fetchProducts();
      handleStockCancel();
    } catch (err) {
      console.error(err);
      message.error("Thao tác kho thất bại");
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case "in_stock":
        return "green";
      case "low_stock":
        return "orange";
      case "out_of_stock":
        return "red";
      default:
        return "default";
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case "in_stock":
        return "Còn hàng";
      case "low_stock":
        return "Sắp hết";
      case "out_of_stock":
        return "Hết hàng";
      default:
        return "Không xác định";
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.productName.toLowerCase().includes(searchText.toLowerCase())
  );
  const lowStockItems = inventory.filter(
    (i) => i.status === "low_stock" || i.status === "out_of_stock"
  );

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Tồn kho hiện tại",
      dataIndex: "currentStock",
      key: "currentStock",
      sorter: (a, b) => a.currentStock - b.currentStock,
      render: (stock, record) => {
        let progressStatus = "normal"; // mặc định xanh
        if (stock <= 20) progressStatus = "exception"; // đỏ
        else if (stock > 20 && stock <= 100) progressStatus = "active"; // vàng

        let progressColor =
          stock <= 20 ? "#ff4d4f" : stock <= 100 ? "#faad14" : "#52c41a";

        return (
          <div>
            <Text strong>{stock}</Text>
            <Progress
              percent={(stock / Math.max(record.minStock * 2, 1)) * 100}
              size="small"
              strokeColor={progressColor}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: "Có thể bán",
      dataIndex: "availableStock",
      key: "availableStock",
    },
    {
      title: "Tổng giá trị mặt hàng",
      dataIndex: "price",
      key: "price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Còn hàng", value: "in_stock" },
        { text: "Sắp hết", value: "low_stock" },
        { text: "Hết hàng", value: "out_of_stock" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={getStockStatusColor(status)}>
          {getStockStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Nhập kho cuối",
      dataIndex: "lastRestocked",
      key: "lastRestocked",
      sorter: (a, b) => new Date(a.lastRestocked) - new Date(b.lastRestocked),
    },
    {
      title: "Lịch sử nhập/xuất kho",
      key: "action",
      render: (_, record) => (
        <Button
          type="default"
          size="small"
          icon={<InboxOutlined />} // hoặc icon nào bạn muốn
          onClick={() => showHistoryModal(record)} // dùng type "detail" hoặc hàm xử lý riêng
        >
          Xem chi tiết
        </Button>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => showStockModal(record, "in")}
          />
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => showStockModal(record, "out")}
            disabled={record.availableStock === 0}
          />{" "}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>Quản lý Kho</Title>
        </Col>
      </Row>
      {lowStockItems.length > 0 && (
        <Row style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Alert
              message={`Cảnh báo: Có ${lowStockItems.length} sản phẩm sắp hết hoặc đã hết hàng`}
              type="warning"
              showIcon
              icon={<WarningOutlined />}
            />
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Tổng mặt hàng"
              value={inventoryStats.totalItems}
              prefix={<InboxOutlined />}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Còn hàng"
              value={inventoryStats.inStock}
              prefix={<CheckCircleOutlined />}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Sắp hết"
              value={inventoryStats.lowStock}
              prefix={<WarningOutlined />}
            />
          </StatCard>
        </Col>
        <Col xs={24} sm={6}>
          <StatCard>
            <Statistic
              title="Giá trị kho"
              value={inventoryStats.totalValue}
              formatter={formatCurrency}
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
          <Input.Search
            placeholder="Tìm kiếm theo tên"
            allowClear
            style={{ width: 300 }}
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Space>
            <Button icon={<SyncOutlined />} onClick={fetchProducts}>
              Đồng bộ
            </Button>
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredInventory}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          rowClassName={(record) =>
            record.status === "out_of_stock"
              ? "row-out-of-stock"
              : record.status === "low_stock"
              ? "row-low-stock"
              : ""
          }
        />
      </StyledCard>

      <Modal
        title={
          <span style={{ fontWeight: 600 }}>
            Lịch sử kho -{" "}
            <span style={{ color: "#1890ff" }}>
              {selectedItem?.productName}
            </span>
          </span>
        }
        open={isHistoryModalVisible}
        onCancel={handleHistoryCancel}
        footer={[
          <Button key="close" type="primary" onClick={handleHistoryCancel}>
            Đóng
          </Button>,
        ]}
        width={1200}
        bodyStyle={{ padding: "16px 24px" }}
      >
        <Tabs type="card">
          {(() => {
            // Nhóm history theo variant
            const groupedByVariant = selectedHistory.reduce((acc, h) => {
              const variantKey = h.variant
                ? h.variant.name ||
                  `${h.variant.size ?? ""} - ${h.variant.color ?? ""}`.trim()
                : "Không có variant";
              if (!acc[variantKey]) acc[variantKey] = [];
              acc[variantKey].push(h);
              return acc;
            }, {});

            return Object.entries(groupedByVariant).map(
              ([variantName, records]) => (
                <TabPane tab={variantName} key={variantName}>
                  <Table
                    dataSource={records}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    rowClassName={(record) =>
                      record.type === "import"
                        ? "row-import"
                        : record.type === "export"
                        ? "row-export"
                        : ""
                    }
                    columns={[
                      {
                        title: "Loại",
                        dataIndex: "type",
                        key: "type",
                        render: (type) =>
                          type === "import" ? (
                            <Tag color="green">Nhập kho</Tag>
                          ) : (
                            <Tag color="red">Xuất kho</Tag>
                          ),
                      },
                      {
                        title: "Số lượng",
                        dataIndex: "quantity",
                        key: "quantity",
                      },
                      {
                        title: "Tồn sau",
                        dataIndex: "stockAfter",
                        key: "stockAfter",
                      },
                      { title: "Ghi chú", dataIndex: "note", key: "note" },
                      {
                        title: "Phiên bản",
                        dataIndex: "variant",
                        key: "variant",
                        render: (v) =>
                          v
                            ? v.name ||
                              `${v.size ?? ""} - ${v.color ?? ""}`.trim()
                            : "-",
                      },
                      {
                        title: "Đơn hàng",
                        dataIndex: "orderInfo",
                        key: "orderInfo",
                        render: (order) =>
                          order ? (
                            <div style={{ whiteSpace: "pre-line" }}>
                              {order.customerName}
                              <br />
                              Mã đơn hàng:{" "}
                              <span style={{ color: "#1890ff" }}>
                                {order.orderId?.slice(-5) || ""}
                              </span>
                            </div>
                          ) : (
                            "-"
                          ),
                      },
                      {
                        title: "Địa chỉ",
                        dataIndex: ["orderInfo", "address"],
                        key: "address",
                        render: (addr) => addr || "-",
                      },
                      {
                        title: "SĐT",
                        dataIndex: ["orderInfo", "phone"],
                        key: "phone",
                        render: (phone) => phone || "-",
                      },
                      {
                        title: "Trạng thái đơn",
                        dataIndex: ["orderInfo", "status"],
                        key: "orderStatus",
                        render: (status) =>
                          status ? (
                            <Tag
                              color={status === "Pending" ? "orange" : "blue"}
                            >
                              {status}
                            </Tag>
                          ) : (
                            "-"
                          ),
                      },
                      {
                        title: "Ngày",
                        dataIndex: "date",
                        key: "date",
                        render: (d) =>
                          new Date(d).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                      },
                    ]}
                  />
                </TabPane>
              )
            );
          })()}
        </Tabs>

        <style jsx>{`
          .row-import {
            background: linear-gradient(90deg, #f6ffed 0%, #d9f7be 100%);
            transition: all 0.3s;
          }
          .row-import:hover {
            background: linear-gradient(90deg, #d9f7be 0%, #b7eb8f 100%);
          }
          .row-export {
            background: linear-gradient(90deg, #fff1f0 0%, #ffa39e 100%);
            transition: all 0.3s;
          }
          .row-export:hover {
            background: linear-gradient(90deg, #ffa39e 0%, #ff7875 100%);
          }
          .ant-table-thead > tr > th {
            background-color: #fafafa;
            font-weight: 600;
          }
        `}</style>
      </Modal>

      <Modal
        title={
          stockAction === "in"
            ? `Nhập kho - ${selectedItem?.productName}`
            : `Xuất kho - ${selectedItem?.productName}`
        }
        open={isStockModalVisible}
        onOk={handleStockSubmit}
        onCancel={handleStockCancel}
        okText={stockAction === "in" ? "Nhập kho" : "Xuất kho"}
        cancelText="Hủy"
      >
        {selectedItem && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>Tồn kho hiện tại: </Text>
            <Text>{selectedItem.currentStock}</Text>
          </div>
        )}
        <Form form={form} layout="vertical" name="stockForm">
          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[
              { required: true, message: "Vui lòng nhập số lượng!" },
              { type: "number", min: 1, message: "Số lượng phải lớn hơn 0!" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              max={
                stockAction === "out" ? selectedItem?.availableStock : undefined
              }
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: "Vui lòng nhập lý do!" }]}
          >
            <Select placeholder="Chọn lý do">
              {stockAction === "in" ? (
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
