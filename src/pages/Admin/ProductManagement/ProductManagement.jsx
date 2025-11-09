import React, { useEffect, useState } from "react";
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
  Image,
  Spin,
  Upload,
  Checkbox,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  UploadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import styled from "styled-components";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 24px;
  }
`;

const ProductManagement = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const SIZES = ["Lớn", "Trung Bình", "Nhỏ"];

  // Danh sách sự kiện và tags (đã gộp chung)
  const EVENT_OPTIONS = [
    { label: "Sinh nhật", value: "birthday" },
    { label: "Halloween", value: "halloween" },
    { label: "Giáng sinh", value: "christmas" },
    { label: "Tết", value: "tet" },
    { label: "Valentine", value: "valentine" },
    { label: "8/3", value: "8/3" },
    { label: "20/10", value: "20/10" },
    { label: "1/6", value: "1/6" },
    { label: "Khai trương", value: "khai trương" },
    { label: "Tốt nghiệp", value: "tốt nghiệp" },
    { label: "Quà tặng", value: "quà tặng" },
    { label: "Dễ thương", value: "dễ thương" },
    { label: "Tình yêu", value: "tình yêu" },
    { label: "Thiếu nhi", value: "thiếu nhi" },
    { label: "Trẻ em", value: "trẻ em" },
    { label: "Bestseller", value: "bestseller" },
    { label: "Mới", value: "mới" },
    { label: "Hot", value: "hot" },
  ];

  // 🧩 1️⃣ Lấy danh sách sản phẩm (đã sửa để hỗ trợ pagination và search server-side)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts({
        page,
        limit: pageSize,
        search: searchText,
      });

      console.log("🚀 Fetched products:", res.data);
      setProducts(res.data || []); // ✅ Lấy mảng products từ res.data.data
      setTotal(res.data.pagination?.total || 0); // ✅ Lấy total từ res.data.pagination.total
    } catch (err) {
      console.error(err);
      messageApi.error("Không thể tải danh sách sản phẩm!");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 2️⃣ Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      messageApi.error("Không thể tải danh mục!");
    }
  };

  // ✅ useEffect cho products: refetch khi page, pageSize, searchText thay đổi
  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, searchText]);

  // ✅ useEffect cho categories: chỉ chạy 1 lần
  useEffect(() => {
    fetchCategories();
  }, []);

  // 🧩 3️⃣ Mở modal thêm / sửa
  const showModal = (product = null) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    form.resetFields();
  };

  useEffect(() => {
    if (isModalVisible) {
      if (editingProduct) {
        // Chỉnh sửa: set giá trị form từ product
        form.setFieldsValue({
          name: editingProduct.name,
          price: editingProduct.price,
          stock: editingProduct.countInStock,
          description: editingProduct.description,
          category: editingProduct.category?._id,
          events: [
            ...(editingProduct.events || []),
            ...(editingProduct.tags || []),
          ],
          isBestSeller: editingProduct.isBestSeller || false,
          isNew: editingProduct.isNew || false,
          isBackInStock: editingProduct.isBackInStock || false,
          label: editingProduct.label || null,
          variants: editingProduct.variants?.length
            ? editingProduct.variants.map((v) => ({
                size: v.size,
                color: v.color,
                price: v.price,
                countInStock: v.countInStock,
              }))
            : [{}],
          image: editingProduct.image
            ? [
                {
                  uid: "-1",
                  name: "image.jpg",
                  status: "done",
                  url: editingProduct.image,
                },
              ]
            : [],
          images: editingProduct.images
            ? editingProduct.images.map((img, index) => ({
                uid: index,
                name: `image-${index}.jpg`,
                status: "done",
                url: img,
              }))
            : [],
        });
      } else {
        // Thêm mới: reset form
        form.resetFields();
        form.setFieldsValue({
          variants: [{}],
          image: [],
          images: [],
          events: [],
          isBestSeller: false,
          isNew: false,
          isBackInStock: false,
        });
      }
    }
  }, [isModalVisible, editingProduct, form]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  // 🧩 4️⃣ Submit form thêm / sửa (sửa nhỏ: bỏ hardcode price=1000, dùng variants để tính)
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      // ✅ Bỏ hardcode price=1000, backend sẽ tính từ variants
      formData.append("category", values.category);

      // Events (đã gộp tags vào) - LUÔN gửi, kể cả mảng rỗng
      formData.append("events", JSON.stringify(values.events || []));

      // Flags - LUÔN gửi
      formData.append("isBestSeller", values.isBestSeller ? "true" : "false");
      formData.append("isNew", values.isNew ? "true" : "false");
      formData.append("isBackInStock", values.isBackInStock ? "true" : "false");

      // Label - gửi rỗng nếu không có
      formData.append("label", values.label || "");

      let totalStock = 0;
      if (values.variants && values.variants.length > 0) {
        values.variants.forEach((v) => {
          totalStock += v.countInStock || 0;
          formData.append("variants", JSON.stringify(v));
        });
      }
      formData.append("countInStock", totalStock);

      // Ảnh chính
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0].originFileObj);
      }

      // Ảnh phụ
      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          if (file.originFileObj) {
            formData.append("images", file.originFileObj);
          }
        });
      }

      console.log("📦 FormData entries:");
      for (let [key, val] of formData.entries()) {
        console.log(key, val);
      }

      let res;
      if (editingProduct) {
        res = await productService.updateProduct(editingProduct._id, formData);
      } else {
        res = await productService.createProduct(formData);
      }

      handleCancel();
      fetchProducts(); // Refetch sau khi tạo/cập nhật

      messageApi.success(
        editingProduct
          ? "Cập nhật sản phẩm thành công"
          : "Tạo sản phẩm thành công"
      );
    } catch (err) {
      console.error(err);
      messageApi.error("Lỗi khi lưu sản phẩm!");
    }
  };

  // 🧩 5️⃣ Xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      messageApi.success("🗑️ Xóa sản phẩm thành công!");
      fetchProducts(); // Refetch sau xóa
    } catch (err) {
      console.error(err);
      messageApi.error("❌ Xóa sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 6️⃣ Cột table (giữ nguyên)
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (img) => (
        <Image
          width={50}
          height={50}
          src={img || "https://placehold.co/80x80?text=No+Image"}
          alt="product"
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      key: "category",
      render: (text) => text || "-",
    },
    {
      title: "Giá bán",
      key: "minPrice",
      sorter: (a, b) => {
        const minA = Math.min(...a.variants.map((v) => v.price));
        const minB = Math.min(...b.variants.map((v) => v.price));
        return minA - minB;
      },
      render: (_, record) => {
        const minPrice = Math.min(...record.variants.map((v) => v.price));
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(minPrice);
      },
    },
    {
      title: "Phiên bản",
      key: "variants",
      render: (_, record) => record.variants?.length || 0,
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      key: "countInStock",
      sorter: (a, b) => a.countInStock - b.countInStock,
    },
    {
      title: "Sự kiện & Tags",
      key: "events",
      render: (_, record) => {
        const allEvents = [...(record.events || []), ...(record.tags || [])];
        if (allEvents.length === 0) return "-";
        return (
          <Space size={[0, 4]} wrap>
            {allEvents.slice(0, 5).map((event, idx) => (
              <Tag key={idx} color="blue">
                {event}
              </Tag>
            ))}
            {allEvents.length > 5 && (
              <Tag color="default">+{allEvents.length - 5}</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        const stock = record.countInStock;

        if (stock > 10) {
          return <Tag color="green">Còn hàng</Tag>;
        } else if (stock > 0 && stock <= 10) {
          return <Tag color="orange">Sắp hết hàng</Tag>;
        } else {
          return <Tag color="red">Hết hàng</Tag>;
        }
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            title="Xem chi tiết"
            onClick={() => showModal(record)}
          />
          {user && user.role !== "staff" && (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                title="Chỉnh sửa"
                onClick={() => showModal(record)}
              />
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa sản phẩm này?"
                onConfirm={() => handleDelete(record._id)}
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  danger
                  title="Xóa"
                />
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 🧩 7️⃣ JSX render (sửa search và table pagination)
  return (
    <div>
      {contextHolder}
      <Title level={2}>Quản lý Sản phẩm</Title>
      <StyledCard>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            style={{ width: 300 }}
            onSearch={(value) => {
              setSearchText(value);
              setPage(1); // ✅ Reset về page 1 khi search mới
            }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Thêm Sản phẩm
          </Button>
        </Row>

        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={products} // ✅ Bỏ filter client-side, dùng server-side search
            rowKey="_id"
            pagination={{
              current: page,
              pageSize: pageSize,
              total: total, // ✅ total là number đúng từ BE
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                if (newPageSize) {
                  setPageSize(newPageSize);
                  setPage(1); // ✅ Reset page về 1 khi thay đổi pageSize
                }
              },
            }}
          />
        </Spin>
      </StyledCard>

      {/* Modal Form (giữ nguyên) */}
      <Modal
        title={editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            variants: [{}],
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Danh mục"
                rules={[{ required: true, message: "Chọn danh mục" }]}
              >
                <Select placeholder="Chọn danh mục">
                  {categories.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Nhập mô tả sản phẩm..." />
          </Form.Item>

          <Form.Item name="events" label="Sự kiện & Tags">
            <Select
              mode="tags"
              placeholder="Chọn sự kiện hoặc nhập tags tự do"
              allowClear
              tokenSeparators={[","]}
            >
              {EVENT_OPTIONS.map((event) => (
                <Option key={event.value} value={event.value}>
                  {event.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="isBestSeller" valuePropName="checked">
                <Checkbox>Bestseller</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isNew" valuePropName="checked">
                <Checkbox>Sản phẩm mới</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isBackInStock" valuePropName="checked">
                <Checkbox>Vừa về hàng</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="label" label="Nhãn">
                <Select placeholder="Chọn nhãn" allowClear>
                  <Option value="Sale">Sale</Option>
                  <Option value="New">New</Option>
                  <Option value="Hot">Hot</Option>
                  <Option value="Best">Best</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Typography.Text strong style={{ display: "block", marginBottom: 8 }}>
            Phiên bản
          </Typography.Text>

          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Row
                    gutter={16}
                    key={key}
                    align="middle"
                    style={{ marginBottom: 8 }}
                  >
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "size"]}
                        rules={[{ required: true, message: "Chọn size" }]}
                      >
                        <Select placeholder="Chọn size">
                          {SIZES.map((size) => (
                            <Option key={size} value={size}>
                              {size}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "color"]}
                        rules={[{ required: true, message: "Nhập màu" }]}
                      >
                        <Input placeholder="Nhập màu" />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "price"]}
                        rules={[{ required: true, message: "Nhập giá" }]}
                      >
                        <InputNumber
                          placeholder="Nhập giá"
                          style={{ width: "100%" }}
                          min={0}
                          formatter={(v) =>
                            `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        {...restField}
                        name={[name, "countInStock"]}
                        rules={[{ required: true, message: "Nhập tồn kho" }]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          min={0}
                          placeholder="Nhập tồn kho"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ fontSize: 20, color: "red", marginBottom: 23 }}
                      />
                    </Col>
                  </Row>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Thêm phiên bản
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="image"
            label="Ảnh chính"
            valuePropName="fileList"
            getValueFromEvent={(e) => e && e.fileList}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              {form.getFieldValue("image")?.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            name="images"
            label="Ảnh phụ (tối đa 3 ảnh)"
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList || []}
          >
            <Upload
              listType="picture-card"
              multiple
              maxCount={3}
              beforeUpload={() => false}
            >
              {form.getFieldValue("images")?.length >= 3 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;