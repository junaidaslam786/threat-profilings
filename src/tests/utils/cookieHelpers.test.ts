import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Cookies from 'js-cookie';
import {
  getAuthCookieOptions,
  setAuthTokens,
  removeAuthTokens,
  getIdToken,
  getAccessToken,
  hasAuthTokens,
  performLogout,
} from '../../utils/cookieHelpers';

// Mock js-cookie
vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

const mockCookies = Cookies as unknown as {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
  remove: ReturnType<typeof vi.fn>;
};

// Mock window.location
const mockLocation = {
  href: 'http://localhost:3000',
  protocol: 'http:',
  hostname: 'localhost',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

describe('cookieHelpers utility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset location to default
    mockLocation.protocol = 'http:';
    mockLocation.hostname = 'localhost';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getAuthCookieOptions', () => {
    it('should return development options for localhost', () => {
      mockLocation.protocol = 'http:';
      mockLocation.hostname = 'localhost';

      const options = getAuthCookieOptions();
      
      expect(options.secure).toBe(false);
      expect(options.sameSite).toBe('Lax');
      expect(options.path).toBe('/');
      expect(options).not.toHaveProperty('domain');
    });

    it('should return production options for https', () => {
      mockLocation.protocol = 'https:';
      mockLocation.hostname = 'tp.cyorn.com';

      const options = getAuthCookieOptions();
      
      expect(options.secure).toBe(true);
      expect(options.sameSite).toBe('None');
      expect(options.path).toBe('/');
      expect(options.domain).toBe('tp.cyorn.com');
    });

    it('should include expiration date', () => {
      const options = getAuthCookieOptions();
      expect(options.expires).toBeInstanceOf(Date);
      
      const expectedExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const actualExpiry = options.expires as Date;
      
      // Allow for small time difference (1 second)
      expect(Math.abs(actualExpiry.getTime() - expectedExpiry.getTime())).toBeLessThan(1000);
    });
  });

  describe('setAuthTokens', () => {
    it('should set both id_token and access_token cookies', () => {
      const idToken = 'test_id_token';
      const accessToken = 'test_access_token';

      setAuthTokens(idToken, accessToken);

      expect(mockCookies.set).toHaveBeenCalledTimes(2);
      expect(mockCookies.set).toHaveBeenCalledWith('id_token', idToken, expect.any(Object));
      expect(mockCookies.set).toHaveBeenCalledWith('access_token', accessToken, expect.any(Object));
    });

    it('should use correct options when setting cookies', () => {
      const idToken = 'test_id_token';
      const accessToken = 'test_access_token';

      setAuthTokens(idToken, accessToken);

      const expectedOptions = getAuthCookieOptions();
      expect(mockCookies.set).toHaveBeenCalledWith('id_token', idToken, expectedOptions);
      expect(mockCookies.set).toHaveBeenCalledWith('access_token', accessToken, expectedOptions);
    });
  });

  describe('removeAuthTokens', () => {
    it('should remove tokens in development environment', () => {
      mockLocation.protocol = 'http:';
      
      removeAuthTokens();

      expect(mockCookies.remove).toHaveBeenCalledWith('id_token', expect.any(Object));
      expect(mockCookies.remove).toHaveBeenCalledWith('access_token', expect.any(Object));
    });

    it('should remove tokens in production environment', () => {
      mockLocation.protocol = 'https:';
      
      removeAuthTokens();

      // Should be called multiple times with different options for production
      expect(mockCookies.remove).toHaveBeenCalledWith('id_token', expect.any(Object));
      expect(mockCookies.remove).toHaveBeenCalledWith('access_token', expect.any(Object));
      expect(mockCookies.remove).toHaveBeenCalledTimes(8); // Multiple removal attempts
    });
  });

  describe('getIdToken', () => {
    it('should return id_token from cookies', () => {
      const expectedToken = 'test_id_token';
      mockCookies.get.mockReturnValue(expectedToken);

      const result = getIdToken();

      expect(mockCookies.get).toHaveBeenCalledWith('id_token');
      expect(result).toBe(expectedToken);
    });

    it('should return undefined when token is not present', () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = getIdToken();

      expect(result).toBeUndefined();
    });
  });

  describe('getAccessToken', () => {
    it('should return access_token from cookies', () => {
      const expectedToken = 'test_access_token';
      mockCookies.get.mockReturnValue(expectedToken);

      const result = getAccessToken();

      expect(mockCookies.get).toHaveBeenCalledWith('access_token');
      expect(result).toBe(expectedToken);
    });

    it('should return undefined when token is not present', () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = getAccessToken();

      expect(result).toBeUndefined();
    });
  });

  describe('hasAuthTokens', () => {
    it('should return true when both tokens are present', () => {
      mockCookies.get
        .mockReturnValueOnce('id_token_value')
        .mockReturnValueOnce('access_token_value');

      const result = hasAuthTokens();

      expect(result).toBe(true);
      expect(mockCookies.get).toHaveBeenCalledWith('id_token');
      expect(mockCookies.get).toHaveBeenCalledWith('access_token');
    });

    it('should return false when id_token is missing', () => {
      mockCookies.get
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce('access_token_value');

      const result = hasAuthTokens();

      expect(result).toBe(false);
    });

    it('should return false when access_token is missing', () => {
      mockCookies.get
        .mockReturnValueOnce('id_token_value')
        .mockReturnValueOnce(undefined);

      const result = hasAuthTokens();

      expect(result).toBe(false);
    });

    it('should return false when both tokens are missing', () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = hasAuthTokens();

      expect(result).toBe(false);
    });
  });

  describe('performLogout', () => {
    beforeEach(() => {
      // Mock localStorage and sessionStorage
      const mockStorage = {
        clear: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', { value: mockStorage });
      Object.defineProperty(window, 'sessionStorage', { value: mockStorage });
    });

    it('should clear tokens and redirect to default path', () => {
      performLogout();

      expect(mockCookies.remove).toHaveBeenCalled();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(sessionStorage.clear).toHaveBeenCalled();
      expect(mockLocation.href).toBe('/dashboard');
    });

    it('should redirect to custom path', () => {
      const customPath = '/login';
      
      performLogout(customPath);

      expect(mockLocation.href).toBe(customPath);
    });

    it('should clear all storage', () => {
      performLogout();

      expect(localStorage.clear).toHaveBeenCalled();
      expect(sessionStorage.clear).toHaveBeenCalled();
    });
  });
});
