import React, { useState } from "react";
import {
  Container,
  LeftSection,
  RightSection,
  LoginBox,
  Title,
  InputField,
  Button,
  TextLink,
  ErrorText,
  ImageSide,
} from "./style";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại!");
      }

      // ✅ Lưu token vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Đăng nhập thành công!");
      window.location.href = "/"; // chuyển trang (tùy bạn)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LeftSection>
        <LoginBox>
          <Title>Đăng nhập tài khoản</Title>
          {error && <ErrorText>{error}</ErrorText>}

          <form onSubmit={handleLogin}>
            <InputField
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <TextLink>
            Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
          </TextLink>
        </LoginBox>
      </LeftSection>

      <RightSection>
        <ImageSide
          src="https://tophinhanh.net/wp-content/uploads/2023/12/anh-jellycat-stuffed-animals-3.jpg"
          alt="Login illustration"
        />
      </RightSection>
    </Container>
  );
};

export default LoginPage;
