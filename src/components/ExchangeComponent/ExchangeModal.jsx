import React, { useState, useEffect, useMemo } from "react";
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  List,
  Avatar,
  Tag,
  Space,
  Checkbox,
  InputNumber,
  message,
  Divider,
  Typography,
  Alert,
  Empty,
  Spin,
  Steps,
  Row,
  Col,
  Pagination,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { exchangeService, productService, orderService } from "../../services";

const { Option } = Select;

const { TextArea } = Input;
const { Text, Title } = Typography;
const { Step } = Steps;

const ExchangeModal = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0: Chọn đơn hàng, 1: Chọn sản phẩm đổi
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedReturnItems, setSelectedReturnItems] = useState([]);
  const [selectedExchangeItems, setSelectedExchangeItems] = useState([]);
  
  // ✅ State cho filter và search
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "oldest"
  
  // ✅ State để lưu danh sách exchanges đang pending/approved
  const [pendingExchanges, setPendingExchanges] = useState([]);
  
  // ✅ State cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Hiển thị 5 đơn hàng mỗi trang

  useEffect(() => {
    if (visible) {
      fetchDeliveredOrders();
      fetchProducts();
      fetchPendingExchanges(); // ✅ Load danh sách exchanges đang pending
    } else {
      // Reset khi đóng modal
      setStep(0);
      setSelectedOrder(null);
      setSelectedReturnItems([]);
      setSelectedExchangeItems([]);
      setSearchQuery("");
      setSortBy("newest");
      setPendingExchanges([]);
      setCurrentPage(1); // Reset về trang 1 khi đóng modal
      form.resetFields();
    }
  }, [visible]);

  const fetchDeliveredOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders();
      console.log("Orders response:", response);
      
      // Xử lý response format
      let ordersData = [];
      if (response && response.success && response.data) {
        ordersData = response.data;
      } else if (Array.isArray(response)) {
        ordersData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        ordersData = response.data;
      }
      
      console.log("Total orders from API:", ordersData.length);
      console.log("Orders data:", ordersData);
      
      // Chỉ lấy đơn hàng đã giao
      // Kiểm tra status === "Delivered"
      const deliveredOrders = ordersData.filter(
        (order) => {
          // Chỉ cần status === "Delivered" là đủ
          const isDelivered = order.status === "Delivered";
          console.log(`Order ${order._id}: status=${order.status}, isDelivered=${order.isDelivered}, filtered=${isDelivered}`);
          return isDelivered;
        }
      );
      
      // Nếu không có đơn hàng đã giao, hiển thị thông báo chi tiết hơn
      if (deliveredOrders.length === 0 && ordersData.length > 0) {
        const statusCounts = {};
        ordersData.forEach(order => {
          statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
        });
        console.log("Order status distribution:", statusCounts);
        message.info({
          content: `Bạn có ${ordersData.length} đơn hàng nhưng chưa có đơn nào đã giao. Trạng thái đơn hàng: ${Object.keys(statusCounts).join(", ")}`,
          duration: 5,
        });
      }
      
      console.log("Delivered orders count:", deliveredOrders.length);
      console.log("Delivered orders:", deliveredOrders);
      
      setOrders(deliveredOrders);
      
      // Nếu không có đơn hàng đã giao, hiển thị thông báo
      if (deliveredOrders.length === 0 && ordersData.length > 0) {
        console.log("Có đơn hàng nhưng chưa có đơn nào đã giao");
        message.info("Bạn chưa có đơn hàng nào đã giao. Chỉ có thể đổi hàng từ các đơn đã được giao thành công.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng: " + (error.response?.data?.message || error.message));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      const productsData = response?.data || (Array.isArray(response) ? response : []);
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // ✅ Fetch danh sách exchanges đang pending/approved để filter orders
  const fetchPendingExchanges = async () => {
    try {
      const response = await exchangeService.getMyExchanges();
      const exchangesData = response?.data || (Array.isArray(response) ? response : []);
      
      // Lọc các exchange đang pending hoặc approved (chưa completed/cancelled)
      const pending = exchangesData.filter(
        (exchange) => 
          exchange.status === "Pending" || 
          exchange.status === "Approved"
      );
      
      setPendingExchanges(pending);
    } catch (error) {
      console.error("Error fetching pending exchanges:", error);
      setPendingExchanges([]);
    }
  };

  const getItemKey = (item) => {
    const variantId = item.variant?._id?.toString() || "no-variant";
    return `${item.productId?.toString() || item.productId}-${variantId}`;
  };

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setSelectedReturnItems([]);
    setSelectedExchangeItems([]);
    setStep(1);
  };

  const handleReturnItemToggle = (item, checked) => {
    const itemKey = getItemKey(item);
    if (checked) {
      setSelectedReturnItems([...selectedReturnItems, { ...item, quantity: 1, itemKey }]);
    } else {
      setSelectedReturnItems(
        selectedReturnItems.filter((i) => i.itemKey !== itemKey)
      );
    }
  };

  const handleReturnQuantityChange = (itemKey, quantity) => {
    setSelectedReturnItems(
      selectedReturnItems.map((item) =>
        item.itemKey === itemKey ? { ...item, quantity } : item
      )
    );
  };

  const handleAddExchangeItem = () => {
    const productId = form.getFieldValue("exchangeProductId");
    const variantId = form.getFieldValue("exchangeVariantId");
    let quantity = form.getFieldValue("exchangeQuantity") || 1;

    // Force validate before proceed (hiển thị lỗi đỏ nếu có)
    try {
      form.validateFields(["exchangeQuantity"]);
    } catch (e) {
      return;
    }

    if (!productId) {
      message.warning("Vui lòng chọn sản phẩm muốn đổi");
      return;
    }

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    let variant = null;
    let price = product.price;
    let name = product.name;
    let image = product.image;

    if (variantId && product.variants && product.variants.length > 0) {
      variant = product.variants.find((v) => v._id === variantId);
      if (variant) {
        price = variant.price || product.price;
        name = `${product.name} - ${variant.size || ""} ${variant.color || ""}`;
        image = variant.image || product.image;
      }
    }

    // Validate by stock (không tự động điều chỉnh)
    const available =
      (variant && typeof variant.countInStock === "number"
        ? variant.countInStock
        : (typeof product.countInStock === "number" ? product.countInStock : 0)) || 0;
    if (available > 0 && quantity > available) {
      message.warning(`Chỉ được mua tối đa ${available} sản phẩm theo tồn kho`);
      return;
    }

    const newItem = {
      productId,
      name,
      price,
      quantity,
      image,
      variant: variant
        ? {
            _id: variant._id,
            size: variant.size,
            color: variant.color,
            name: variant.name,
            image: variant.image,
            price: variant.price,
          }
        : null,
    };

    setSelectedExchangeItems([...selectedExchangeItems, newItem]);
    form.setFieldsValue({
      exchangeProductId: undefined,
      exchangeVariantId: undefined,
      exchangeQuantity: 1,
    });
  };

  const handleRemoveExchangeItem = (index) => {
    setSelectedExchangeItems(
      selectedExchangeItems.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = async () => {
    if (selectedReturnItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm cần trả");
      return;
    }

    if (selectedExchangeItems.length === 0) {
      message.warning("Vui lòng chọn ít nhất một sản phẩm muốn đổi");
      return;
    }

    const reason = form.getFieldValue("reason");
    if (!reason || reason.trim() === "") {
      message.warning("Vui lòng nhập lý do đổi hàng");
      return;
    }

    try {
      setLoading(true);
      const exchangeData = {
        originalOrderId: selectedOrder._id,
        itemsToReturn: selectedReturnItems,
        itemsToExchange: selectedExchangeItems,
        reason: reason.trim(),
        paymentMethod: form.getFieldValue("paymentMethod") || "COD",
      };

      console.log("📤 Sending exchange request to backend:", {
        originalOrderId: exchangeData.originalOrderId,
        itemsToReturnCount: exchangeData.itemsToReturn.length,
        itemsToExchangeCount: exchangeData.itemsToExchange.length,
        reason: exchangeData.reason,
      });

      console.log("📤 Exchange data being sent:", JSON.stringify(exchangeData, null, 2));
      
      const response = await exchangeService.createExchange(exchangeData);
      
      console.log("✅ Exchange request sent successfully:", response);
      
      if (response && response.success) {
        // Kiểm tra xem có payment link PayOS không (có chênh lệch giá và chọn PayOS)
        if (response.payOS?.checkoutUrl && response.requiresPayment) {
          message.success({
            content: "Yêu cầu đổi hàng đã được tạo. Đang chuyển hướng đến PayOS để thanh toán chênh lệch giá...",
            duration: 3,
          });
          
          // Lưu exchangeId để xử lý sau khi thanh toán
          if (response.data?._id) {
            localStorage.setItem("pendingExchangeId", response.data._id);
          }
          
          // Redirect đến PayOS
          setTimeout(() => {
            window.location.href = response.payOS.checkoutUrl;
          }, 1000);
          return; // Không đóng modal ngay, để redirect
        } else {
          // Không có payment link (không có chênh lệch giá hoặc không chọn PayOS)
          message.success(response.message || "Yêu cầu đổi hàng đã được gửi thành công. Seller sẽ xem xét và phản hồi.");
          window.dispatchEvent(new Event("notificationsUpdated"));
        }
      } else {
        message.success("Yêu cầu đổi hàng đã được gửi thành công. Seller sẽ xem xét và phản hồi.");
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
      
      // Chỉ reset và đóng modal nếu không redirect đến PayOS
      if (!response?.payOS?.checkoutUrl) {
        form.resetFields();
        setSelectedOrder(null);
        setSelectedReturnItems([]);
        setSelectedExchangeItems([]);
        setStep(0);
        onSuccess && onSuccess();
        onCancel();
      }
    } catch (error) {
      console.error("❌ Error creating exchange:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message ||
        "Không thể tạo yêu cầu đổi hàng. Vui lòng thử lại";
      
      message.error(errorMessage);
      
      // Hiển thị chi tiết lỗi trong development
      if (process.env.NODE_ENV === "development" && error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter và sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // ✅ Filter ra các đơn hàng đã có exchange đang pending/approved
    const orderIdsWithPendingExchange = new Set(
      pendingExchanges.map((ex) => ex.originalOrderId?._id?.toString() || ex.originalOrderId?.toString())
    );
    
    filtered = filtered.filter((order) => {
      const orderId = order._id?.toString();
      return !orderIdsWithPendingExchange.has(orderId);
    });

    // Filter theo tên sản phẩm hoặc mã đơn hàng
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((order) => {
        // Tìm kiếm theo mã đơn hàng
        const orderId = (order._id?.toString() || "").toLowerCase();
        if (orderId.includes(query)) {
          return true;
        }
        
        // Tìm kiếm trong tên sản phẩm của các items trong đơn hàng
        return order.items?.some((item) => {
          const itemName = (item.name || item.productId?.name || "").toLowerCase();
          return itemName.includes(query);
        });
      });
    }

    // Sort theo ngày
    filtered.sort((a, b) => {
      const dateA = new Date(a.deliveredAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.deliveredAt || b.createdAt || 0).getTime();
      
      if (sortBy === "newest") {
        return dateB - dateA; // Mới nhất trước
      } else {
        return dateA - dateB; // Cũ nhất trước
      }
    });

    return filtered;
  }, [orders, searchQuery, sortBy, pendingExchanges]);

  // ✅ Tính toán pagination
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedOrders.slice(startIndex, endIndex);
  }, [filteredAndSortedOrders, currentPage, pageSize]);

  // ✅ Reset về trang 1 khi filter/search thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  const selectedProductId = Form.useWatch("exchangeProductId", form);
  const selectedVariantId = Form.useWatch("exchangeVariantId", form);
  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const selectedVariant =
    selectedProduct?.variants?.find((v) => v._id === selectedVariantId) || null;
  const maxExchangeStock =
    (selectedVariant && typeof selectedVariant.countInStock === "number"
      ? selectedVariant.countInStock
      : (typeof selectedProduct?.countInStock === "number"
          ? selectedProduct.countInStock
          : 0)) || 0;
  const exchangeQuantity = Form.useWatch("exchangeQuantity", form);
  const isExchangeQtyInvalid =
    !exchangeQuantity ||
    exchangeQuantity < 1 ||
    (maxExchangeStock > 0 && exchangeQuantity > maxExchangeStock);

  return (
    <Modal
      title="Đổi hàng"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
    >
      <Steps current={step} style={{ marginBottom: 24 }}>
        <Step title="Chọn đơn hàng" />
        <Step title="Chọn sản phẩm đổi" />
      </Steps>

      {step === 0 && (
        <div>
          <Title level={4}>Chọn đơn hàng muốn đổi</Title>
          
          {/* ✅ Filter và Search */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col flex="auto">
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col>
              <Select
                value={sortBy}
                onChange={setSortBy}
                size="large"
                style={{ width: 180 }}
              >
                <Select.Option value="newest">Mới nhất</Select.Option>
                <Select.Option value="oldest">Cũ nhất</Select.Option>
              </Select>
            </Col>
          </Row>

          {/* ✅ Hiển thị số lượng kết quả */}
          {!loading && orders.length > 0 && (
            <div style={{ marginBottom: 12, fontSize: 14, color: "#666" }}>
              {filteredAndSortedOrders.length === 0 ? (
                <Text type="secondary">
                  Không tìm thấy đơn hàng nào phù hợp với "{searchQuery}"
                </Text>
              ) : (
                <Text>
                  Hiển thị {filteredAndSortedOrders.length} / {orders.length} đơn hàng
                  {searchQuery && ` cho "${searchQuery}"`}
                </Text>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin tip="Đang tải danh sách đơn hàng..." />
            </div>
          ) : orders.length === 0 ? (
            <Empty 
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>Bạn chưa có đơn hàng nào đã giao</div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    Chỉ có thể đổi hàng từ các đơn hàng đã được giao thành công
                  </div>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : filteredAndSortedOrders.length === 0 ? (
            <Empty 
              description={
                <div>
                  <div style={{ marginBottom: 8 }}>Không tìm thấy đơn hàng nào</div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc
                  </div>
                </div>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <>
            <List
              dataSource={paginatedOrders}
              renderItem={(order) => {
                // ✅ Kiểm tra xem đơn hàng này có exchange đang pending không
                const hasPendingExchange = pendingExchanges.some(
                  (ex) => (ex.originalOrderId?._id?.toString() || ex.originalOrderId?.toString()) === order._id?.toString()
                );
                
                return (
                  <List.Item
                    style={{
                      padding: "16px",
                      border: "1px solid #e8e8e8",
                      borderRadius: 8,
                      marginBottom: 12,
                      cursor: hasPendingExchange ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      opacity: hasPendingExchange ? 0.6 : 1,
                      background: hasPendingExchange ? "#f5f5f5" : "transparent",
                    }}
                    onClick={() => {
                      if (hasPendingExchange) {
                        message.warning("Đơn hàng này đang có yêu cầu đổi hàng đang xử lý. Vui lòng chờ xử lý xong.");
                        return;
                      }
                      handleOrderSelect(order);
                    }}
                    onMouseEnter={(e) => {
                      if (!hasPendingExchange) {
                        e.currentTarget.style.borderColor = "#1890ff";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(24,144,255,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e8e8e8";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <Text strong>Mã đơn: #{order._id?.slice(-6) || order._id}</Text>
                        <Space>
                          {hasPendingExchange && (
                            <Tag color="orange">Đang xử lý đổi hàng</Tag>
                          )}
                          <Tag color="green">Đã giao</Tag>
                        </Space>
                      </div>
                    <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                      Ngày giao: {order.deliveredAt 
                        ? new Date(order.deliveredAt).toLocaleDateString("vi-VN")
                        : order.createdAt 
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      {order.items?.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "4px 8px",
                            background: "#f5f5f5",
                            borderRadius: 4,
                          }}
                        >
                          <Avatar
                            src={item.image || item.productId?.image}
                            size={24}
                            shape="square"
                          />
                          <Text style={{ fontSize: 12 }}>
                            {item.name} x{item.quantity}
                          </Text>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <Text style={{ fontSize: 12, color: "#999" }}>
                          +{order.items.length - 3} sản phẩm khác
                        </Text>
                      )}
                    </div>
                    <div style={{ marginTop: 8, textAlign: "right" }}>
                      <Text strong style={{ color: "#52c41a" }}>
                        Tổng: {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.totalPrice || 0)}
                      </Text>
                    </div>
                  </div>
                </List.Item>
                );
              }}
            />
            {filteredAndSortedOrders.length > 0 && (
              <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                <Pagination
                  current={currentPage}
                  total={filteredAndSortedOrders.length}
                  pageSize={pageSize}
                  showSizeChanger
                  showQuickJumper
                  showTotal={(total, range) => 
                    `${range[0]}-${range[1]} của ${total} đơn hàng`
                  }
                  pageSizeOptions={["5", "10", "20", "50"]}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  onShowSizeChange={(current, size) => {
                    setCurrentPage(1);
                    setPageSize(size);
                  }}
                />
              </div>
            )}
            </>
          )}
        </div>
      )}

      {step === 1 && selectedOrder && (
        <Form form={form} layout="vertical">
          <Alert
            message="Thông tin đơn hàng"
            description={`Mã đơn: #${selectedOrder._id.slice(-6)} | Ngày giao: ${new Date(selectedOrder.deliveredAt || selectedOrder.createdAt).toLocaleDateString("vi-VN")}`}
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
            action={
              <Button size="small" onClick={() => setStep(0)}>
                Chọn đơn khác
              </Button>
            }
          />

          {/* Chọn sản phẩm cần trả */}
          <Title level={5}>1. Chọn sản phẩm cần trả</Title>
          <List
            dataSource={selectedOrder.items}
            renderItem={(item) => {
              const itemKey = getItemKey(item);
              const isSelected = selectedReturnItems.some((i) => i.itemKey === itemKey);
              const selectedItem = selectedReturnItems.find((i) => i.itemKey === itemKey);
              const maxQuantity = item.quantity;

              return (
                <List.Item
                  key={itemKey}
                  style={{
                    padding: "12px",
                    border: isSelected ? "2px solid #1890ff" : "1px solid #e8e8e8",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={(e) => handleReturnItemToggle(item, e.target.checked)}
                    style={{ marginRight: 12 }}
                  />
                  <Avatar
                    src={item.image || item.productId?.image}
                    size={48}
                    shape="square"
                    style={{ marginRight: 12 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {item.variant?.size} - {item.variant?.color} | Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </div>
                  </div>
                  {isSelected && (
                    <InputNumber
                      min={1}
                      max={maxQuantity}
                      value={selectedItem?.quantity || 1}
                      onChange={(value) =>
                        handleReturnQuantityChange(itemKey, value)
                      }
                      style={{ width: 80 }}
                    />
                  )}
                </List.Item>
              );
            }}
          />

          <Divider />

          {/* Chọn sản phẩm muốn đổi */}
          <Title level={5}>2. Chọn sản phẩm muốn đổi</Title>
          <Space style={{ width: "100%", marginBottom: 16 }} direction="vertical">
            <Form.Item label="Sản phẩm" name="exchangeProductId">
              <Select
                placeholder="Chọn sản phẩm muốn đổi"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {products.map((product) => (
                  <Select.Option key={product._id} value={product._id}>
                    {product.name} -{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.price)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {selectedProduct &&
              selectedProduct.variants &&
              selectedProduct.variants.length > 0 && (
                <Form.Item label="Phân loại hàng" name="exchangeVariantId">
                  <Select placeholder="Chọn phân loại hàng">
                    {selectedProduct.variants.map((variant) => (
                      <Select.Option key={variant._id} value={variant._id}>
                        {variant.size} - {variant.color} -{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(variant.price || selectedProduct.price)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}

            <Form.Item
              label="Số lượng"
              name="exchangeQuantity"
              initialValue={1}
              validateTrigger={['onChange','onBlur']}
              extra={
                maxExchangeStock
                  ? <span style={{ color: "#e53935" }}>Số lượng tối đa: {maxExchangeStock}</span>
                  : null
              }
              rules={[
                {
                  validator: (_, value) => {
                    const v = Number(value || 0);
                    if (!v || v < 1) return Promise.reject("Số lượng phải >= 1");
                    if (maxExchangeStock > 0 && v > maxExchangeStock) {
                      return Promise.reject(
                        `Tối đa ${maxExchangeStock} theo tồn kho`
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                min={1}
                max={maxExchangeStock || undefined}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  const raw = Number(e.target.value || 0);
                  let next = raw;
                  if (!raw || raw < 1) {
                    next = 1;
                    message.warning("Số lượng phải >= 1");
                  } else if (maxExchangeStock > 0 && raw > maxExchangeStock) {
                    next = maxExchangeStock;
                    message.warning(`Chỉ được mua tối đa ${maxExchangeStock} sản phẩm theo tồn kho`);
                  }
                  if (next !== raw) {
                    form.setFieldsValue({ exchangeQuantity: next });
                  }
                }}
              />
            </Form.Item>

            <Button type="dashed" onClick={handleAddExchangeItem} disabled={isExchangeQtyInvalid || !selectedProductId} block>
              + Thêm sản phẩm muốn đổi
            </Button>
          </Space>

          {/* Danh sách sản phẩm muốn đổi đã chọn */}
          {selectedExchangeItems.length > 0 && (
            <List
              dataSource={selectedExchangeItems}
              renderItem={(item, index) => (
                <List.Item
                  style={{
                    padding: "12px",
                    border: "1px solid #e8e8e8",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <Avatar
                    src={item.image}
                    size={48}
                    shape="square"
                    style={{ marginRight: 12 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {item.variant?.size} - {item.variant?.color} | SL: {item.quantity} | Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price * item.quantity)}
                    </div>
                  </div>
                  <Button
                    type="link"
                    danger
                    onClick={() => handleRemoveExchangeItem(index)}
                  >
                    Xóa
                  </Button>
                </List.Item>
              )}
              style={{ marginBottom: 16 }}
            />
          )}

          <Divider />

          <Form.Item
            label="Lý do đổi hàng"
            name="reason"
            rules={[{ required: true, message: "Vui lòng nhập lý do đổi hàng" }]}
          >
            <TextArea rows={4} placeholder="Nhập lý do đổi hàng..." />
          </Form.Item>

          <Form.Item
            label="Phương thức thanh toán"
            name="paymentMethod"
            initialValue="COD"
          >
            <Select>
              <Select.Option value="COD">COD (Thanh toán khi nhận hàng)</Select.Option>
              <Select.Option value="PayOS">PayOS</Select.Option>
              <Select.Option value="Credit Card">Thẻ tín dụng</Select.Option>
              <Select.Option value="Bank Transfer">Chuyển khoản ngân hàng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button onClick={() => setStep(0)}>Quay lại</Button>
              <Button onClick={onCancel}>Hủy</Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                disabled={selectedReturnItems.length === 0 || selectedExchangeItems.length === 0}
              >
                Gửi yêu cầu đổi hàng
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default ExchangeModal;


