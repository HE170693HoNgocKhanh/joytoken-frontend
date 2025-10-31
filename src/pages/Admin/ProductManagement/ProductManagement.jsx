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

  const SIZES = ["Lớn", "Trung Bình", "Nhỏ"];

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

    // ❌ Bỏ form.setFieldsValue() ở đây đi
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
          variants: editingProduct.variants?.length
            ? editingProduct.variants.map((v) => ({
                size: v.size,
                color: v.color,
                price: v.price,
                countInStock: v.countInStock,
              }))
            : [{}], // nếu không có variant thì tạo 1 trống
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
        });
      }
    }
  }, [isModalVisible, editingProduct, form]);

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingProduct(null);
    form.resetFields();
  };

  // 🧩 4️⃣ Submit form thêm / sửa
  // --- Thay thế nguyên hàm handleSubmit ---
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // lấy giá trị từ form

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("category", values.category);

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
          formData.append("images", file.originFileObj);
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
      fetchProducts();

      // Sau khi modal đóng, show message
      messageApi.success(
        editingProduct
          ? "Cập nhật sản phẩm thành công"
          : "Tạo sản phẩm thành công"
      );
    } catch (err) {
      console.error(err);
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
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            variants: [{}], // tạo sẵn 1 variant trống
          }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
              >
                <Input placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={8}>
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
            <Col span={8}>
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
