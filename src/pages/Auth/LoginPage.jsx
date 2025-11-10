import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import {
  Container,
  LeftSection,
  RightSection,
  Moon,
  TreeBranch,
  Bird,
  Hills,
  Trees,
  WelcomeContent,
  WelcomeTitle,
  WelcomeText,
  SocialSection,
  SocialTitle,
  SocialIcons,
  SocialIcon,
  FormContainer,
  TabContainer,
  Tab,
  FormTitle,
  Form,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  ErrorText,
  LinkText,
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

      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Đăng nhập thất bại!");
    }
  };

  return (
    <Container>
      <LeftSection>
        <Moon />
        <TreeBranch />
        <Bird top="18%" left="46%" />
        <Bird top="19%" left="52%" rotate="-45deg" />
        <Hills />
        <Trees />
        
        <WelcomeContent>
          <WelcomeTitle>Welcome Page</WelcomeTitle>
          <WelcomeText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Donec pharetra lacinia maximus. Integer pulvinar lacus.
          </WelcomeText>
        </WelcomeContent>

        <SocialSection>
          <SocialTitle>GET CONNECTED WITH</SocialTitle>
          <SocialIcons>
            <SocialIcon bg="#1da1f2" href="#" title="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
              </svg>
            </SocialIcon>
            <SocialIcon bg="#dd4b39" href="#" title="Google+">
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>G+</span>
            </SocialIcon>
            <SocialIcon bg="#3b5998" href="#" title="Facebook">
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>f</span>
            </SocialIcon>
          </SocialIcons>
        </SocialSection>
      </LeftSection>

      <RightSection>
        <FormContainer>
          <TabContainer>
            <Tab active>Sign In</Tab>
            <Tab onClick={() => navigate('/register')}>Register</Tab>
          </TabContainer>

          <FormTitle>Sign In</FormTitle>

          {error && <ErrorText>{error}</ErrorText>}

          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label>EMAIL</Label>
              <Input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>PASSWORD</Label>
              <Input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Sign In"}
            </SubmitButton>
          </Form>

          <LinkText>
            Chưa có tài khoản? <a href="/register">Register</a>
          </LinkText>
        </FormContainer>
      </RightSection>
    </Container>
  );
};

export default LoginPage;

