import React, { useState, useEffect } from "react";
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
} from "antd";
import { exchangeService, productService, orderService } from "../../services";

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

  useEffect(() => {
    if (visible) {
      fetchDeliveredOrders();
      fetchProducts();
    } else {
      // Reset khi đóng modal
      setStep(0);
      setSelectedOrder(null);
      setSelectedReturnItems([]);
      setSelectedExchangeItems([]);
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
        message.success(response.message || "Yêu cầu đổi hàng đã được gửi thành công. Seller sẽ xem xét và phản hồi.");
        window.dispatchEvent(new Event("notificationsUpdated"));
      } else {
        message.success("Yêu cầu đổi hàng đã được gửi thành công. Seller sẽ xem xét và phản hồi.");
        window.dispatchEvent(new Event("notificationsUpdated"));
      }
      form.resetFields();
      setSelectedOrder(null);
      setSelectedReturnItems([]);
      setSelectedExchangeItems([]);
      setStep(0);
      onSuccess && onSuccess();
      onCancel();
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
          ) : (
            <List
              dataSource={orders}
              renderItem={(order) => (
                <List.Item
                  style={{
                    padding: "16px",
                    border: "1px solid #e8e8e8",
                    borderRadius: 8,
                    marginBottom: 12,
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                  onClick={() => handleOrderSelect(order)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#1890ff";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(24,144,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e8e8e8";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <Text strong>Mã đơn: #{order._id?.slice(-6) || order._id}</Text>
                      <Tag color="green">Đã giao</Tag>
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
              )}
            />
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

