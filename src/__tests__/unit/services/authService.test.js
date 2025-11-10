import { describe, test, expect, vi, beforeEach } from 'vitest';
import { authService } from '../../../services/authService';
import apiClient from '../../../services/apiClient';

// Mock apiClient
vi.mock('../../../services/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn()
  }
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('AuthService - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('register', () => {
    test('should register user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        message: 'Đăng ký thành công',
        email: userData.email
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authService.register(userData);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', userData);
      expect(result).toEqual(mockResponse);
    });

    test('should throw error on registration failure', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const error = new Error('Email đã được đăng ký');
      apiClient.post.mockRejectedValue(error);

      await expect(authService.register(userData)).rejects.toThrow();
    });
  });

  describe('login', () => {
    test('should login successfully', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        token: 'mock-token',
        user: {
          _id: 'user123',
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      apiClient.post.mockResolvedValue(mockResponse);

      const result = await authService.login(credentials);

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse);
    });

    test('should throw error on login failure', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const error = new Error('Email hoặc mật khẩu không đúng');
      apiClient.post.mockRejectedValue(error);

      await expect(authService.login(credentials)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    test('should logout successfully', async () => {
      localStorageMock.setItem('accessToken', 'token');
      localStorageMock.setItem('user', JSON.stringify({ id: 'user123' }));

      apiClient.post.mockResolvedValue({});

      const result = await authService.logout();

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
      expect(result).toBe(true);
    });

    test('should clear localStorage even if API fails', async () => {
      localStorageMock.setItem('accessToken', 'token');
      localStorageMock.setItem('user', JSON.stringify({ id: 'user123' }));

      apiClient.post.mockRejectedValue(new Error('Network error'));

      // Suppress console.warn for this test
      const originalWarn = console.warn;
      console.warn = vi.fn();

      const result = await authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(result).toBe(true);

      // Restore console.warn
      console.warn = originalWarn;
    });
  });

  describe('getCurrentUser', () => {
    test('should get current user successfully', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User'
      };

      apiClient.get.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    test('should update profile successfully', async () => {
      const userData = {
        name: 'Updated Name',
        phone: '0123456789'
      };

      const mockResponse = {
        user: {
          _id: 'user123',
          ...userData
        }
      };

      apiClient.put.mockResolvedValue(mockResponse);

      const result = await authService.updateProfile(userData);

      expect(apiClient.put).toHaveBeenCalledWith('/auth/profile', userData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(mockResponse.user)
      );
      expect(result).toEqual(mockResponse);
    });
  });
});

