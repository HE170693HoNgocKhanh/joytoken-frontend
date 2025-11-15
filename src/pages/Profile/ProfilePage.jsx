import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  Space,
  Divider,
  Modal,
  Row,
  Col,
  Avatar,
  Spin,
  Select,
  Alert,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CameraOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { userService } from "../../services";
import { useAuth } from "../../hooks/useAuth";

// API endpoint cho địa chỉ Việt Nam
const VIETNAM_API_BASE = "https://provinces.open-api.vn/api";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const { updateUser } = useAuth();

  // ✅ State cho địa chỉ Việt Nam
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  
  // ✅ State cho địa chỉ được chọn
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // ✅ State cho thông báo thành công trên trang
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchProvinces();
  }, []);

  // ✅ Load danh sách tỉnh/thành phố
  const fetchProvinces = async () => {
    try {
      setLoadingProvinces(true);
      const response = await axios.get(`${VIETNAM_API_BASE}/p/`);
      const provincesData = response.data.map((p) => ({
        value: p.code,
        label: p.name,
        name: p.name,
      }));
      setProvinces(provincesData);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      message.error("Không thể tải danh sách tỉnh/thành phố");
    } finally {
      setLoadingProvinces(false);
    }
  };

  // ✅ Load danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      setSelectedDistrict(null);
      setSelectedWard(null);
      return;
    }

    const fetchDistricts = async () => {
      try {
        setLoadingDistricts(true);
        const response = await axios.get(
          `${VIETNAM_API_BASE}/p/${selectedProvince}?depth=2`
        );
        const districtsData = response.data.districts?.map((d) => ({
          value: d.code,
          label: d.name,
          name: d.name,
        })) || [];
        setDistricts(districtsData);
        // Reset district và ward khi đổi tỉnh/thành phố
        setSelectedDistrict(null);
        setSelectedWard(null);
        setWards([]);
        // Clear địa chỉ trong form
        form.setFieldsValue({ address: "" });
      } catch (error) {
        console.error("Error fetching districts:", error);
        message.error("Không thể tải danh sách quận/huyện");
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // ✅ Load danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (!selectedDistrict) {
      setWards([]);
      setSelectedWard(null);
      return;
    }

    const fetchWards = async () => {
      try {
        setLoadingWards(true);
        const response = await axios.get(
          `${VIETNAM_API_BASE}/d/${selectedDistrict}?depth=2`
        );
        const wardsData = response.data.wards?.map((w) => ({
          value: w.code,
          label: w.name,
          name: w.name,
        })) || [];
        setWards(wardsData);
        // Reset ward khi đổi quận/huyện
        setSelectedWard(null);
        // Clear địa chỉ trong form
        form.setFieldsValue({ address: "" });
      } catch (error) {
        console.error("Error fetching wards:", error);
        message.error("Không thể tải danh sách phường/xã");
      } finally {
        setLoadingWards(false);
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  // ✅ Tạo chuỗi địa chỉ khi chọn đủ 3 mục
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const provinceName = provinces.find((p) => p.value === selectedProvince)?.name || "";
      const districtName = districts.find((d) => d.value === selectedDistrict)?.name || "";
      const wardName = wards.find((w) => w.value === selectedWard)?.name || "";
      
      if (provinceName && districtName && wardName) {
        const addressString = `${wardName}, ${districtName}, ${provinceName}`;
        form.setFieldsValue({ address: addressString });
      }
    }
  }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards, form]);

  // ✅ Parse địa chỉ khi provinces đã load và có user address
  useEffect(() => {
    if (provinces.length > 0 && user?.address && !selectedProvince && !selectedDistrict && !selectedWard) {
      parseAddressString(user.address);
    }
  }, [provinces, user?.address]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      console.log("📥 Fetching profile...");
      
      const response = await userService.getProfile();
      console.log("✅ Profile response:", response);
      
      // apiClient interceptor đã return response.data, nên response đã là data rồi
      const userData = response || {};
      
      if (!userData || !userData._id) {
        console.error("❌ Invalid user data:", userData);
        message.error("Không thể tải thông tin cá nhân");
        return;
      }
      
      setUser(userData);
      // Xử lý avatar URL - nếu đã có http thì giữ nguyên, nếu không thì thêm base URL
      if (userData.avatar) {
        const avatarUrl = userData.avatar.startsWith('http') 
          ? userData.avatar 
          : `http://localhost:8080${userData.avatar}`;
        setAvatarUrl(avatarUrl);
      } else {
        setAvatarUrl("");
      }
      
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || "",
        address: userData.address || "",
      });

      // Parse địa chỉ sẽ được xử lý trong useEffect khi provinces đã load
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      
      // Kiểm tra nếu là lỗi 401 thì không hiển thị message (đã redirect)
      if (error.response?.status === 401) {
        console.log("🔒 Unauthorized - user will be redirected to login");
        return;
      }
      
      message.error("Không thể tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      console.log("📝 Updating profile with values:", values);
      
      // ✅ Validate các trường bắt buộc trước khi submit
      if (!values.name || !values.name.trim()) {
        message.error("Vui lòng nhập họ và tên");
        setLoading(false);
        return;
      }
      
      if (!values.phone || !values.phone.trim()) {
        message.error("Vui lòng nhập số điện thoại");
        setLoading(false);
        return;
      }
      
      if (!/^[0-9]{10,11}$/.test(values.phone)) {
        message.error("Số điện thoại phải có 10-11 chữ số");
        setLoading(false);
        return;
      }
      
      if (!selectedProvince || !selectedDistrict || !selectedWard) {
        message.error("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã");
        setLoading(false);
        return;
      }
      
      if (!values.address || !values.address.trim()) {
        message.error("Vui lòng chọn địa chỉ");
        setLoading(false);
        return;
      }
      
      const response = await userService.updateProfile(values);
      console.log("✅ Update profile response:", response);
      
      // apiClient interceptor đã return response.data, nên response đã là data rồi
      const updatedUser = response?.user || response || values;
      
      if (!updatedUser || !updatedUser._id) {
        console.warn("⚠️ Invalid user data in response:", response);
        message.warning("Cập nhật thành công nhưng không nhận được thông tin user mới");
        // Reload profile để lấy dữ liệu mới nhất
        await fetchProfile();
        return;
      }
      
      setUser(updatedUser);
      
      // Cập nhật user trong context/auth
      if (updateUser) {
        updateUser(updatedUser);
      }
      
      // Cập nhật localStorage - giữ nguyên các field khác
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const mergedUser = { ...storedUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(mergedUser));
      
      // Cập nhật lại form với giá trị mới
      form.setFieldsValue({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
      });

      // ✅ Cập nhật lại dropdown địa chỉ nếu có địa chỉ mới
      if (updatedUser.address) {
        // Clear các selection cũ và parse lại địa chỉ mới
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
        // Parse địa chỉ mới sau một chút để đảm bảo provinces đã load
        setTimeout(() => {
          if (provinces.length > 0) {
            parseAddressString(updatedUser.address);
          }
        }, 300);
      } else {
        // Nếu không có địa chỉ, clear các selection
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSelectedWard(null);
      }
      
      // ✅ Hiển thị thông báo thành công
      message.success({
        content: "Cập nhật thông tin thành công!",
        duration: 3,
      });

      // ✅ Hiển thị thông báo trên trang
      setShowSuccessMessage(true);
      // Tự động ẩn sau 5 giây
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      
      // Chỉ redirect nếu là lỗi authentication thực sự (401/403), không phải validation error (400)
      if (error.response?.status === 401 || error.response?.status === 403) {
        const errorMessage = error.response?.data?.message || '';
        if (errorMessage.includes('Token') || errorMessage.includes('token') || 
            errorMessage.includes('Chưa đăng nhập') || errorMessage.includes('hết hạn')) {
          console.log("🔒 Unauthorized - user will be redirected to login");
          // Không hiển thị message vì sẽ redirect
          return;
        }
      }
      
      // Nếu là lỗi validation (400), chỉ hiển thị message, không redirect
      const errorMessage = error.response?.data?.message || error.message || "Cập nhật thông tin thất bại";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      setUploading(true);
      console.log("📤 Uploading avatar:", file.name, file.type, file.size);

      const formData = new FormData();
      formData.append("avatar", file);

      console.log("📡 Sending request to upload avatar...");
      const response = await userService.uploadAvatar(formData);
      console.log("✅ Upload response:", response);

      // apiClient interceptor đã return response.data, nên response đã là data rồi
      const updatedUser = response?.user || response;
      
      if (updatedUser?.avatar) {
        // Xử lý avatar URL - nếu đã có http thì giữ nguyên, nếu không thì thêm base URL
        const fullAvatarUrl = updatedUser.avatar.startsWith('http') 
          ? updatedUser.avatar 
          : `http://localhost:8080${updatedUser.avatar}`;
        console.log("🖼️ Avatar URL:", fullAvatarUrl);
        setAvatarUrl(fullAvatarUrl);
        setUser(updatedUser);
        
        // Cập nhật user trong context/auth
        if (updateUser) {
          updateUser(updatedUser);
        }
        
        // Cập nhật localStorage - giữ nguyên các field khác
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const mergedUser = { ...storedUser, ...updatedUser };
        localStorage.setItem("user", JSON.stringify(mergedUser));
        
        message.success("Cập nhật ảnh đại diện thành công!");
      } else {
        console.warn("⚠️ No avatar in response:", response);
        message.warning("Cập nhật thành công nhưng không có URL ảnh");
      }
    } catch (error) {
      console.error("❌ Error uploading avatar:", error);
      
      // Kiểm tra nếu là lỗi 401 thì không hiển thị message (đã redirect)
      if (error.response?.status === 401) {
        console.log("🔒 Unauthorized - user will be redirected to login");
        return;
      }
      
      const errorMessage = error.response?.data?.message || error.message || "Tải ảnh thất bại";
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      message.error("Vui lòng nhập email hợp lệ");
      return;
    }

    try {
      setSendingOtp(true);
      await userService.changeEmail(newEmail);
      message.success("Đã gửi mã OTP đến email mới. Vui lòng kiểm tra hộp thư!");
      setShowOtpModal(true);
    } catch (error) {
      message.error(error.response?.data?.message || "Gửi mã OTP thất bại");
      console.error(error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      message.error("Mã OTP phải có 6 chữ số");
      return;
    }

    try {
      setLoading(true);
      await userService.verifyEmailOtp(otp);
      message.success("Đổi email thành công!");
      setShowOtpModal(false);
      setEditingEmail(false);
      setNewEmail("");
      setOtp("");
      fetchProfile(); // Reload profile
    } catch (error) {
      message.error(error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Parse địa chỉ string để set lại các dropdown
  const parseAddressString = async (addressString) => {
    if (!addressString || typeof addressString !== "string") return;
    
    // Format: "Xã/Phường, Quận/Huyện, Tỉnh/Thành phố"
    const parts = addressString.split(",").map((p) => p.trim());
    if (parts.length !== 3) return;

    const [wardName, districtName, provinceName] = parts;

    try {
      // Tìm tỉnh/thành phố
      const province = provinces.find((p) => p.name === provinceName);
      if (province) {
        setSelectedProvince(province.value);
        
        // Đợi districts load xong
        setTimeout(async () => {
          const districtsResponse = await axios.get(
            `${VIETNAM_API_BASE}/p/${province.value}?depth=2`
          );
          const districtsData = districtsResponse.data.districts?.map((d) => ({
            value: d.code,
            label: d.name,
            name: d.name,
          })) || [];
          setDistricts(districtsData);
          
          // Tìm quận/huyện
          const district = districtsData.find((d) => d.name === districtName);
          if (district) {
            setSelectedDistrict(district.value);
            
            // Đợi wards load xong
            setTimeout(async () => {
              const wardsResponse = await axios.get(
                `${VIETNAM_API_BASE}/d/${district.value}?depth=2`
              );
              const wardsData = wardsResponse.data.wards?.map((w) => ({
                value: w.code,
                label: w.name,
                name: w.name,
              })) || [];
              setWards(wardsData);
              
              // Tìm phường/xã
              const ward = wardsData.find((w) => w.name === wardName);
              if (ward) {
                setSelectedWard(ward.value);
              }
            }, 300);
          }
        }, 300);
      }
    } catch (error) {
      console.error("Error parsing address:", error);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ có thể tải lên file ảnh!");
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return Upload.LIST_IGNORE;
      }
      handleAvatarUpload(file);
      return false; // Prevent auto upload
    },
    showUploadList: false,
  };

  // Kiểm tra authentication trước khi render
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      message.warning("Vui lòng đăng nhập để xem thông tin cá nhân");
      window.location.href = "/login";
    }
  }, []);

  if (loading && !user) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large">
          <div style={{ marginTop: 16, color: "#666" }}>Đang tải thông tin...</div>
        </Spin>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Text type="secondary">Không thể tải thông tin cá nhân</Text>
        <br />
        <Button type="link" onClick={fetchProfile} style={{ marginTop: 16 }}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Title level={2} style={{ marginBottom: 24, color: "#1890ff" }}>
          <UserOutlined style={{ marginRight: 8 }} />
          Thông tin cá nhân
        </Title>

        {/* ✅ Thông báo thành công trên trang */}
        {showSuccessMessage && (
          <Alert
            message="Cập nhật thông tin thành công!"
            type="success"
            showIcon
            closable
            onClose={() => setShowSuccessMessage(false)}
            style={{
              marginBottom: 24,
              borderRadius: 8,
              fontSize: "16px",
              padding: "12px 16px",
            }}
          />
        )}

        {/* Thông tin tài khoản */}
        {user && (
          <Card 
            style={{ marginBottom: 24, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            styles={{ body: { color: "#fff" } }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <div>
                <Text style={{ color: "#fff", opacity: 0.9 }}>Vai trò:</Text>
                <div>
                  <Text strong style={{ color: "#fff", fontSize: "16px" }}>
                    {user.role === "admin" ? "Quản trị viên" : 
                     user.role === "seller" ? "Người bán" : 
                     user.role === "staff" ? "Nhân viên" : 
                     "Khách hàng"}
                  </Text>
                </div>
              </div>
              {user.emailVerified && (
                <div>
                  <Text style={{ color: "#52c41a", fontSize: "14px" }}>
                    ✓ Email đã được xác thực
                  </Text>
                </div>
              )}
            </Space>
          </Card>
        )}

        <Card>
          {/* Avatar Section */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Space direction="vertical" size="large">
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  size={120}
                  src={avatarUrl || undefined}
                  icon={!avatarUrl ? <UserOutlined /> : undefined}
                  style={{ 
                    border: "4px solid #1890ff",
                    backgroundColor: avatarUrl ? "transparent" : "#1890ff",
                    boxShadow: "0 4px 12px rgba(24, 144, 255, 0.3)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#1890ff",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <CameraOutlined style={{ color: "#fff", fontSize: "18px" }} />
                </div>
              </div>
              <div>
                <Upload {...uploadProps}>
                  <Button
                    icon={<CameraOutlined />}
                    loading={uploading}
                    type="primary"
                    size="large"
                    style={{ borderRadius: "20px", padding: "0 24px" }}
                  >
                    {uploading ? "Đang tải..." : "Đổi ảnh đại diện"}
                  </Button>
                </Upload>
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    Chỉ chấp nhận file ảnh, tối đa 2MB
                  </Text>
                </div>
              </div>
            </Space>
          </div>

          <Divider />

          {/* Profile Form */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateProfile}
            initialValues={user}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Nhập họ và tên"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Email">
                  {editingEmail ? (
                    <Space.Compact style={{ width: "100%" }}>
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="Email mới"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        size="large"
                      />
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleChangeEmail}
                        loading={sendingOtp}
                        size="large"
                      >
                        Gửi OTP
                      </Button>
                      <Button
                        icon={<CloseOutlined />}
                        onClick={() => {
                          setEditingEmail(false);
                          setNewEmail("");
                        }}
                        size="large"
                      />
                    </Space.Compact>
                  ) : (
                    <Space>
                      <Input
                        prefix={<MailOutlined />}
                        value={user?.email || ""}
                        disabled
                        size="large"
                        style={{ flex: 1 }}
                      />
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => setEditingEmail(true)}
                        size="large"
                      >
                        Đổi email
                      </Button>
                    </Space>
                  )}
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại phải có 10-11 chữ số",
                    },
                  ]}
                  help="Nhập số điện thoại 10-11 chữ số"
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Nhập số điện thoại (10-11 chữ số)"
                    size="large"
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    { required: true, message: "Vui lòng chọn địa chỉ" },
                    {
                      validator: (_, value) => {
                        if (!value || !value.trim()) {
                          return Promise.reject("Vui lòng chọn địa chỉ");
                        }
                        if (!selectedProvince || !selectedDistrict || !selectedWard) {
                          return Promise.reject("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  help="Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã"
                >
                  <Input
                    prefix={<HomeOutlined />}
                    placeholder="Địa chỉ sẽ được tạo tự động sau khi chọn đầy đủ"
                    size="large"
                    readOnly
                    style={{ background: "#f5f5f5" }}
                  />
                </Form.Item>
              </Col>

              {/* ✅ Dropdowns cho địa chỉ Việt Nam */}
              <Col xs={24} md={8}>
                <Form.Item
                  label="Tỉnh/Thành phố"
                  required
                  rules={[
                    {
                      validator: () => {
                        if (!selectedProvince) {
                          return Promise.reject("Vui lòng chọn Tỉnh/Thành phố");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    size="large"
                    value={selectedProvince}
                    onChange={(value) => {
                      setSelectedProvince(value);
                      setSelectedDistrict(null);
                      setSelectedWard(null);
                      form.setFieldsValue({ address: "" });
                    }}
                    loading={loadingProvinces}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={loadingProvinces ? <Spin size="small" /> : null}
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.value} value={province.value}>
                        {province.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Quận/Huyện"
                  required
                  rules={[
                    {
                      validator: () => {
                        if (!selectedDistrict) {
                          return Promise.reject("Vui lòng chọn Quận/Huyện");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    size="large"
                    value={selectedDistrict}
                    onChange={(value) => {
                      setSelectedDistrict(value);
                      setSelectedWard(null);
                      form.setFieldsValue({ address: "" });
                    }}
                    disabled={!selectedProvince}
                    loading={loadingDistricts}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={loadingDistricts ? <Spin size="small" /> : null}
                  >
                    {districts.map((district) => (
                      <Select.Option key={district.value} value={district.value}>
                        {district.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label="Phường/Xã"
                  required
                  rules={[
                    {
                      validator: () => {
                        if (!selectedWard) {
                          return Promise.reject("Vui lòng chọn Phường/Xã");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Select
                    placeholder="Chọn Phường/Xã"
                    size="large"
                    value={selectedWard}
                    onChange={(value) => {
                      setSelectedWard(value);
                      form.setFieldsValue({ address: "" });
                    }}
                    disabled={!selectedDistrict}
                    loading={loadingWards}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                    }
                    notFoundContent={loadingWards ? <Spin size="small" /> : null}
                  >
                    {wards.map((ward) => (
                      <Select.Option key={ward.value} value={ward.value}>
                        {ward.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
              >
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

      {/* OTP Verification Modal */}
      <Modal
        title="Xác thực email mới"
        open={showOtpModal}
        onOk={handleVerifyOtp}
        onCancel={() => {
          setShowOtpModal(false);
          setOtp("");
        }}
        okText="Xác thực"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Text>
            Mã OTP đã được gửi đến email <strong>{newEmail}</strong>. Vui lòng nhập mã OTP để xác thực.
          </Text>
          <Input
            placeholder="Nhập mã OTP (6 chữ số)"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            maxLength={6}
            size="large"
            style={{ textAlign: "center", fontSize: "20px", letterSpacing: "8px" }}
          />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Mã OTP sẽ hết hạn sau 5 phút
          </Text>
        </Space>
      </Modal>
    </div>
  );
};

export default ProfilePage;

