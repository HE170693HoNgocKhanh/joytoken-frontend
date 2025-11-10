import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from '../../../hooks/useAuth';

// Mock authService - must define inside factory to avoid hoisting issues
vi.mock('../../../services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    updateProfile: vi.fn()
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

// Mock getCurrentUser and isLoggedIn from services
vi.mock('../../../services', async () => {
  const actual = await vi.importActual('../../../services');
  return {
    ...actual,
    getCurrentUser: () => {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    },
    isLoggedIn: () => {
      return !!localStorage.getItem('accessToken');
    }
  };
});

describe('useAuth Hook - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    test('should login successfully and update state', async () => {
      const mockResponse = {
        token: 'mock-token',
        user: {
          _id: 'user123',
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      const { authService } = await import('../../../services/authService');
      authService.login.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.user).toEqual(mockResponse.user);
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'accessToken',
        'mock-token'
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(mockResponse.user)
      );
    });

    test('should handle login error', async () => {
      const error = new Error('Login failed');
      const { authService } = await import('../../../services/authService');
      authService.login.mockRejectedValue(error);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await expect(
          result.current.login({
            email: 'test@example.com',
            password: 'wrongpassword'
          })
        ).rejects.toThrow();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe('logout', () => {
    test('should logout successfully and clear state', async () => {
      // Setup: login first
      localStorageMock.setItem('accessToken', 'token');
      localStorageMock.setItem('user', JSON.stringify({ id: 'user123' }));

      const { authService } = await import('../../../services/authService');
      authService.logout.mockResolvedValue(true);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.user).toBeNull();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('register', () => {
    test('should register successfully', async () => {
      const mockResponse = {
        message: 'Đăng ký thành công',
        email: 'test@example.com'
      };

      const { authService } = await import('../../../services/authService');
      authService.register.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useAuth());

      let response;
      await act(async () => {
        response = await result.current.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        });
      });

      expect(response).toEqual(mockResponse);
      const { authService: authServiceCheck } = await import('../../../services/authService');
      expect(authServiceCheck.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  describe('updateProfile', () => {
    test('should update profile successfully', async () => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Updated Name'
      };

      const { authService } = await import('../../../services/authService');
      authService.updateProfile.mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuth());

      // Setup initial user
      act(() => {
        result.current.updateUser(mockUser);
      });

      let response;
      await act(async () => {
        response = await result.current.updateProfile({
          name: 'Updated Name'
        });
      });

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      expect(response.user).toEqual(mockUser);
    });
  });
});

