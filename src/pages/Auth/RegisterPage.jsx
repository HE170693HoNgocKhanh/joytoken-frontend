import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services';
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
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  SubmitButton,
  ErrorText,
  SuccessText,
  LinkText,
  PasswordRequirements,
  RequirementItem,
} from './style';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('form');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password) => {
    const errors = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    setPasswordErrors(errors);
    return Object.values(errors).every(v => v === true);
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');
    
    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.name || !form.email || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (!validatePassword(form.password)) {
      setError('Mật khẩu chưa đáp ứng yêu cầu. Vui lòng kiểm tra các điều kiện bên dưới.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    if (!agreeTerms) {
      setError('Vui lòng đồng ý với điều khoản dịch vụ');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.register({ 
        name: form.name, 
        email: form.email, 
        password: form.password 
      });
      setMessage(res?.message || 'Đăng ký thành công, vui lòng kiểm tra email để lấy mã OTP');
      setStep('otp');
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 chữ số');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.verifyRegisterEmail(form.email, otp);
      setMessage(res?.message || 'Xác thực thành công! Hãy đăng nhập.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Xác thực thất bại');
    } finally {
      setLoading(false);
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
            <Tab onClick={() => navigate('/login')}>Sign In</Tab>
            <Tab active>Register</Tab>
          </TabContainer>

          <FormTitle>Register</FormTitle>

          {error && <ErrorText>{error}</ErrorText>}
          {message && <SuccessText>{message}</SuccessText>}

          {step === 'form' ? (
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>FULL NAME</Label>
                <Input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter Your Full Name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>EMAIL</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Enter Your Email"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>PASSWORD</Label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
                {form.password && (
                  <PasswordRequirements>
                    <RequirementItem valid={passwordErrors.minLength}>
                      Ít nhất 8 ký tự
                    </RequirementItem>
                    <RequirementItem valid={passwordErrors.hasUppercase}>
                      Có chữ hoa (A-Z)
                    </RequirementItem>
                    <RequirementItem valid={passwordErrors.hasLowercase}>
                      Có chữ thường (a-z)
                    </RequirementItem>
                    <RequirementItem valid={passwordErrors.hasNumber}>
                      Có số (0-9)
                    </RequirementItem>
                    <RequirementItem valid={passwordErrors.hasSpecialChar}>
                      Có ký tự đặc biệt (!@#$%^&*...)
                    </RequirementItem>
                  </PasswordRequirements>
                )}
              </FormGroup>

              <FormGroup>
                <Label>CONFIRM PASSWORD</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </FormGroup>

              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <CheckboxLabel htmlFor="terms">
                  I agree All the Statements in{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms of service</a>
                </CheckboxLabel>
              </CheckboxContainer>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Sign Up'}
              </SubmitButton>
            </Form>
          ) : (
            <Form onSubmit={handleVerifyOtp}>
              <FormGroup>
                <Label>OTP CODE</Label>
                <Input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setError('');
                  }}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
                <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  Mã OTP đã được gửi tới {form.email}
                </p>
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Đang xác thực...' : 'Verify OTP'}
              </SubmitButton>

              <LinkText>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setStep('form');
                  setOtp('');
                }}>
                  Quay lại đăng ký
                </a>
              </LinkText>
            </Form>
          )}

          <LinkText>
            Đã có tài khoản? <a href="/login">Sign In</a>
          </LinkText>
        </FormContainer>
      </RightSection>
    </Container>
  );
};

export default RegisterPage;

