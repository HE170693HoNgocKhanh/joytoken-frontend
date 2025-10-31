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
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
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

  // 🧩 1️⃣ Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getAllProducts();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      messageApi.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 2️⃣ Lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data);
      // messageApi.success("Tải danh mục thành công!");
    } catch (err) {
      console.error(err);
      messageApi.error("Không thể tải danh mục!");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 🧩 3️⃣ Mở modal thêm / sửa
  const showModal = (product = null) => {
    setEditingProduct(product);
    setIsModalVisible(true);

    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        stock: product.countInStock,
        description: product.description,
        categoryId: product.category?._id,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  // 🧩 4️⃣ Submit form thêm / sửa
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        countInStock: Number(values.stock),
        category: values.categoryId,
      };

      setLoading(true);

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
        messageApi.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(payload);
        messageApi.success("Thêm sản phẩm mới thành công!");
      }

      handleCancel();
      fetchProducts();
    } catch (error) {
      console.error(error);
      messageApi.error("❌ Lưu sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 5️⃣ Xóa sản phẩm
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      messageApi.success("🗑️ Xóa sản phẩm thành công!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      messageApi.error("❌ Xóa sản phẩm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 6️⃣ Cột table
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (img) => (
        <Image
          width={50}
          height={50}
          src={img || "https://via.placeholder.com/80"}
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
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Tồn kho",
      dataIndex: "countInStock",
      key: "countInStock",
      sorter: (a, b) => a.countInStock - b.countInStock,
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
            <Button type="text" icon={<DeleteOutlined />} danger title="Xóa" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 🧩 7️⃣ JSX render
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
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
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
            dataSource={products.filter((p) =>
              p.name.toLowerCase().includes(searchText.toLowerCase())
            )}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </StyledCard>

      {/* Modal Form */}
      <Modal
        title={editingProduct ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={800}
      >
        <Form form={form} layout="vertical">
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
                name="categoryId"
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá bán (VNĐ)"
                rules={[{ required: true, message: "Nhập giá bán" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(v) =>
                    `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="Số lượng tồn"
                rules={[{ required: true, message: "Nhập số lượng tồn" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Nhập mô tả sản phẩm..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
