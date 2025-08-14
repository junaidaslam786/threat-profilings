import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';
import { AuthContext } from '../../contexts/AuthContextTypes';
import { mockUser } from '../test-utils';
import React from 'react';

// Mock auth context value
const mockAuthContextValue = {
  isAuthenticated: true,
  user: mockUser,
  login: vi.fn(),
  logout: vi.fn(),
  isLoading: false,
  refetchUser: vi.fn().mockResolvedValue(undefined),
};

// Wrapper component for testing
const AuthWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={mockAuthContextValue}>
    {children}
  </AuthContext.Provider>
);

describe('useAuth', () => {
  it('should return auth context value when used within AuthProvider', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthWrapper,
    });

    expect(result.current).toEqual(mockAuthContextValue);
  });

  it('should throw error when used outside AuthProvider', () => {
    // Mock console.error to avoid error output in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });

  it('should provide access to auth methods', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthWrapper,
    });

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.refetchUser).toBe('function');
  });

  it('should provide access to auth state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthWrapper,
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toEqual(mockUser);
  });
});
