import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
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
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setError("");

      const response = await login({ email, password });

      if (response.error) {
        setError(response.error);
        return;
      }

      alert("Đăng nhập thành công!");

      navigate("/");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại!");
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
              autoComplete="current-password"
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
