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
  Typography,
  Popconfirm,
  Row,
  Col,
  Statistic,
  message,
} from "antd";
import "antd/dist/reset.css";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { categoryService } from "../../../services";
import apiClient from "../../../services/apiClient";

dayjs.extend(utc);
dayjs.extend(timezone);

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

/* ---------------- Styled Components ---------------- */
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

/* ---------------- Main Component ---------------- */
const CategoryManagement = () => {
  const [messageApi, contextHolder] = message.useMessage(); // ✅ Ant Design v5 message hook
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  /* ---------------- Fetch categories ---------------- */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/categories");
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
      messageApi.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ---------------- Create / Update ---------------- */
  const createOrUpdateCategory = async (values) => {
    const payload = {
      name: values.name.trim(),
      description: values.description,
      isActive: values.isActive === "active",
    };

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, payload);
        messageApi.success("Cập nhật danh mục thành công!");
      } else {
        await categoryService.createCategory(payload);
        messageApi.success("Thêm danh mục mới thành công!");
      }
    } catch (err) {
      if (err?.statusCode === 409 || err?.message?.includes("tồn tại")) {
        messageApi.warning("Tên danh mục đã tồn tại, vui lòng chọn tên khác!");
      } else {
        console.error(err);
        messageApi.error("Thao tác thất bại!");
      }
      throw err;
    }
  };

  /* ---------------- Delete ---------------- */
  const deleteCategory = async (id) => {
    try {
      await apiClient.delete(`/categories/${id}`);
      messageApi.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch {
      messageApi.error("Không thể xóa danh mục");
    }
  };

  /* ---------------- Modal ---------------- */
  const openModal = (category = null) => {
    setEditingCategory(category);
    setIsModalVisible(true);
    form.setFieldsValue(
      category
        ? {
            name: category.name,
            description: category.description,
            isActive: category.isActive ? "active" : "inactive",
          }
        : {}
    );
  };

  const closeModal = () => {
    form.resetFields();
    setEditingCategory(null);
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createOrUpdateCategory(values);
      closeModal();
      fetchCategories();
    } catch {
      /* không đóng modal nếu bị lỗi */
    }
  };

  /* ---------------- Derived ---------------- */
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.isActive).length,
    inactive: categories.filter((c) => !c.isActive).length,
  };

  /* ---------------- Render ---------------- */
  return (
    <div>
      {contextHolder} {/* ✅ BẮT BUỘC để message hiển thị */}
      {/* Title */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>Quản lý Danh mục</Title>
        </Col>
      </Row>
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: "Tổng danh mục", value: stats.total, color: "#1890ff" },
          { title: "Đang hoạt động", value: stats.active, color: "#3f8600" },
          { title: "Không hoạt động", value: stats.inactive, color: "#cf1322" },
        ].map((item, i) => (
          <Col xs={24} sm={8} key={i}>
            <StatCard>
              <Statistic
                title={item.title}
                value={item.value}
                valueStyle={{ color: item.color }}
              />
            </StatCard>
          </Col>
        ))}
      </Row>
      {/* Table */}
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
            <Button icon={<ExportOutlined />}>Xuất Excel</Button>
            {user && user.role !== "staff" && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openModal()}
              >
                Thêm danh mục
              </Button>
            )}
          </Space>
        </div>

        <Table
          dataSource={filteredCategories}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} danh mục`,
          }}
        >
          <Table.Column
            title="Số thứ tự"
            key="index"
            render={(_, __, index) => index + 1}
          />
          <Table.Column
            title="Tên danh mục"
            dataIndex="name"
            sorter={(a, b) => a.name.localeCompare(b.name)}
          />
          <Table.Column title="Mô tả" dataIndex="description" ellipsis />
          <Table.Column
            title="Trạng thái"
            dataIndex="isActive"
            filters={[
              { text: "Hoạt động", value: true },
              { text: "Không hoạt động", value: false },
            ]}
            onFilter={(v, r) => r.isActive === v}
            render={(isActive) => (
              <Tag color={isActive ? "green" : "red"}>
                {isActive ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            )}
          />
          <Table.Column
            title="Ngày tạo"
            dataIndex="createdAt"
            sorter={(a, b) =>
              new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
            }
            defaultSortOrder="descend"
            render={(v) =>
              v
                ? dayjs(v).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm")
                : "Chưa có dữ liệu"
            }
          />
          {user && user.role !== "staff" && (
            <Table.Column
              title="Thao tác"
              key="action"
              width={120}
              render={(_, record) => (
                <Space>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => openModal(record)}
                    size="small"
                  />
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa danh mục này?"
                    onConfirm={() => deleteCategory(record._id)}
                    okText="Có"
                    cancelText="Không"
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Popconfirm>
                </Space>
              )}
            />
          )}
        </Table>
      </StyledCard>
      {/* Modal Form */}
      <Modal
        title={editingCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={closeModal}
        width={600}
        okText={editingCategory ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="categoryForm">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Ví dụ: Điện thoại" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Mô tả về danh mục này" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
