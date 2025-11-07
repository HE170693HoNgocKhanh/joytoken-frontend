import React, { useState } from 'react';
import { authService } from '../../services';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('form');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!form.name || !form.email || !form.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }
    try {
      setLoading(true);
      const res = await authService.register({ name: form.name, email: form.email, password: form.password });
      setMessage(res?.message || 'Đăng ký thành công, vui lòng kiểm tra email để lấy mã OTP');
      setStep('otp');
    } catch (err) {
      setError(err?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!otp) {
      setError('Vui lòng nhập mã OTP');
      return;
    }
    try {
      setLoading(true);
      const res = await authService.verifyRegisterEmail(form.email, otp);
      setMessage(res?.message || 'Xác thực thành công! Hãy đăng nhập.');
    } catch (err) {
      setError(err?.message || 'Xác thực thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
      <h2>Đăng ký</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      {message && <div style={{ color: 'green', marginBottom: 12 }}>{message}</div>}

      {step === 'form' && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Họ và tên</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              style={{ width: '100%', padding: 8 }}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              style={{ width: '100%', padding: 8 }}
              placeholder="email@domain.com"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Mật khẩu</label>
            <input
              type="password"
              autoComplete="new-password"
              name="password"
              value={form.password}
              onChange={onChange}
              style={{ width: '100%', padding: 8 }}
              placeholder="••••••••"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Nhập lại mật khẩu</label>
            <input
              type="password"
              autoComplete="new-password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              style={{ width: '100%', padding: 8 }}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <div style={{ marginBottom: 12 }}>
            <label>Nhập mã OTP (gửi tới {form.email})</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              placeholder="6 số"
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
            {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterPage;


