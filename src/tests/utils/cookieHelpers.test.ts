import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Cookies from "js-cookie";
import {
  getAuthCookieOptions,
  setAuthTokens,
  removeAuthTokens,
  getIdToken,
  getAccessToken,
  hasAuthTokens,
  performLogout,
} from "../../utils/cookieHelpers";

// Mock js-cookie
vi.mock("js-cookie", () => ({
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
  href: "http://localhost:3000",
  protocol: "http:",
  hostname: "localhost",
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

describe("cookieHelpers utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset location to default
    mockLocation.protocol = "http:";
    mockLocation.hostname = "localhost";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getAuthCookieOptions", () => {
    it("should return development options for localhost", () => {
      mockLocation.protocol = "http:";
      mockLocation.hostname = "localhost";

      const options = getAuthCookieOptions();

      expect(options.secure).toBe(false);
      expect(options.sameSite).toBe("Lax");
      expect(options.path).toBe("/");
      expect(options).not.toHaveProperty("domain");
    });

    it("should return production options for https", () => {
      mockLocation.protocol = "https:";
      mockLocation.hostname = "tp.cyorn.com";

      const options = getAuthCookieOptions();

      expect(options.secure).toBe(true);
      expect(options.sameSite).toBe("None");
      expect(options.path).toBe("/");
      expect(options.domain).toBe("tp.cyorn.com");
    });

    it("should include expiration date", () => {
      const options = getAuthCookieOptions();
      expect(options.expires).toBeInstanceOf(Date);

      const expectedExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const actualExpiry = options.expires as Date;

      // Allow for small time difference (1 second)
      expect(
        Math.abs(actualExpiry.getTime() - expectedExpiry.getTime())
      ).toBeLessThan(1000);
    });
  });

  describe("setAuthTokens", () => {
    it("should set both id_token and access_token cookies", () => {
      const idToken = "test_id_token";
      const accessToken = "test_access_token";

      setAuthTokens(idToken, accessToken);

      expect(mockCookies.set).toHaveBeenCalledTimes(2);
      expect(mockCookies.set).toHaveBeenCalledWith(
        "id_token",
        idToken,
        expect.any(Object)
      );
      expect(mockCookies.set).toHaveBeenCalledWith(
        "access_token",
        accessToken,
        expect.any(Object)
      );
    });

    it("should use correct options when setting cookies", () => {
      const idToken = "test_id_token";
      const accessToken = "test_access_token";

      setAuthTokens(idToken, accessToken);

      // Check that both calls were made with objects that have the expected structure
      expect(mockCookies.set).toHaveBeenCalledWith(
        "id_token",
        idToken,
        expect.objectContaining({
          secure: false,
          sameSite: "Lax",
          path: "/",
          expires: expect.any(Date)
        })
      );
      expect(mockCookies.set).toHaveBeenCalledWith(
        "access_token",
        accessToken,
        expect.objectContaining({
          secure: false,
          sameSite: "Lax", 
          path: "/",
          expires: expect.any(Date)
        })
      );
    });
  });

  describe("removeAuthTokens", () => {
    it("should remove tokens in development environment", () => {
      mockLocation.protocol = "http:";

      removeAuthTokens();

      expect(mockCookies.remove).toHaveBeenCalledWith(
        "id_token",
        expect.any(Object)
      );
      expect(mockCookies.remove).toHaveBeenCalledWith(
        "access_token",
        expect.any(Object)
      );
    });

    it("should remove tokens in production environment", () => {
      mockLocation.protocol = "https:";

      removeAuthTokens();

      // Should be called multiple times with different options for production
      expect(mockCookies.remove).toHaveBeenCalledWith(
        "id_token",
        expect.any(Object)
      );
      expect(mockCookies.remove).toHaveBeenCalledWith(
        "access_token",
        expect.any(Object)
      );
      expect(mockCookies.remove).toHaveBeenCalledTimes(8); // Multiple removal attempts
    });
  });

  describe("getIdToken", () => {
    it("should return id_token from cookies", () => {
      const expectedToken = "test_id_token";
      mockCookies.get.mockReturnValue(expectedToken);

      const result = getIdToken();

      expect(mockCookies.get).toHaveBeenCalledWith("id_token");
      expect(result).toBe(expectedToken);
    });

    it("should return undefined when token is not present", () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = getIdToken();

      expect(result).toBeUndefined();
    });
  });

  describe("getAccessToken", () => {
    it("should return access_token from cookies", () => {
      const expectedToken = "test_access_token";
      mockCookies.get.mockReturnValue(expectedToken);

      const result = getAccessToken();

      expect(mockCookies.get).toHaveBeenCalledWith("access_token");
      expect(result).toBe(expectedToken);
    });

    it("should return undefined when token is not present", () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = getAccessToken();

      expect(result).toBeUndefined();
    });
  });

  describe("hasAuthTokens", () => {
    it("should return true when both tokens are present", () => {
      mockCookies.get
        .mockReturnValueOnce("id_token_value")
        .mockReturnValueOnce("access_token_value");

      const result = hasAuthTokens();

      expect(result).toBe(true);
      expect(mockCookies.get).toHaveBeenCalledWith("id_token");
      expect(mockCookies.get).toHaveBeenCalledWith("access_token");
    });

    it("should return false when id_token is missing", () => {
      mockCookies.get
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce("access_token_value");

      const result = hasAuthTokens();

      expect(result).toBe(false);
    });

    it("should return false when access_token is missing", () => {
      mockCookies.get
        .mockReturnValueOnce("id_token_value")
        .mockReturnValueOnce(undefined);

      const result = hasAuthTokens();

      expect(result).toBe(false);
    });

    it("should return false when both tokens are missing", () => {
      mockCookies.get.mockReturnValue(undefined);

      const result = hasAuthTokens();

      expect(result).toBe(false);
    });
  });

  describe("performLogout", () => {
    beforeEach(() => {
      // Mock localStorage and sessionStorage
      const mockStorage = {
        clear: vi.fn(),
      };
      Object.defineProperty(window, "localStorage", { value: mockStorage });
      Object.defineProperty(window, "sessionStorage", { value: mockStorage });
    });

    it("should clear tokens and redirect to default path", () => {
      performLogout();

      expect(mockCookies.remove).toHaveBeenCalled();
      expect(localStorage.clear).toHaveBeenCalled();
      expect(sessionStorage.clear).toHaveBeenCalled();
      expect(mockLocation.href).toBe("/dashboard");
    });

    it("should redirect to custom path", () => {
      const customPath = "/login";

      performLogout(customPath);

      expect(mockLocation.href).toBe(customPath);
    });

    it("should clear all storage", () => {
      performLogout();

      expect(localStorage.clear).toHaveBeenCalled();
      expect(sessionStorage.clear).toHaveBeenCalled();
    });
  });

  describe("cookieHelpers edge cases", () => {
    it("should handle malformed cookies gracefully", () => {
      mockCookies.get.mockReturnValue("malformed-token-data");

      const result = hasAuthTokens();
      expect(result).toBe(true); // Should still work with any string value
    });

    it("should handle very long cookie values", () => {
      const longValue = "a".repeat(4096);
      mockCookies.get.mockReturnValue(longValue);

      const result = getIdToken();
      expect(result).toBe(longValue);
    });

    it("should handle empty string cookies", () => {
      mockCookies.get.mockReturnValue("");

      const hasTokens = hasAuthTokens();
      const idToken = getIdToken();
      const accessToken = getAccessToken();

      expect(hasTokens).toBe(false);
      expect(idToken).toBe("");
      expect(accessToken).toBe("");
    });

    it("should handle null cookie values", () => {
      mockCookies.get.mockReturnValue(null);

      const hasTokens = hasAuthTokens();
      const idToken = getIdToken();
      const accessToken = getAccessToken();

      expect(hasTokens).toBe(false);
      expect(idToken).toBeNull();
      expect(accessToken).toBeNull();
    });

    it("should handle undefined cookie values", () => {
      mockCookies.get.mockReturnValue(undefined);

      const hasTokens = hasAuthTokens();
      const idToken = getIdToken();
      const accessToken = getAccessToken();

      expect(hasTokens).toBe(false);
      expect(idToken).toBeUndefined();
      expect(accessToken).toBeUndefined();
    });

    it("should handle cookies with special characters", () => {
      const specialValue = "token-with-$pecial-char@cters!";
      mockCookies.get.mockReturnValue(specialValue);

      const result = getIdToken();
      expect(result).toBe(specialValue);
    });

    it("should handle concurrent cookie operations", () => {
      const idToken = "concurrent_id_token";
      const accessToken = "concurrent_access_token";

      // Simulate multiple simultaneous calls
      setAuthTokens(idToken, accessToken);
      const hasTokens1 = hasAuthTokens();
      const hasTokens2 = hasAuthTokens();

      expect(hasTokens1).toBe(hasTokens2);
      expect(mockCookies.set).toHaveBeenCalledTimes(2); // Once for each token
    });

    it("should handle cookie setting errors gracefully", () => {
      mockCookies.set.mockImplementation(() => {
        throw new Error("Cookie storage full");
      });

      const idToken = "error_test_token";
      const accessToken = "error_test_access";

      // Should not throw error even if cookie setting fails
      expect(() => setAuthTokens(idToken, accessToken)).not.toThrow();
    });

    it("should handle cookie removal errors gracefully", () => {
      mockCookies.remove.mockImplementation(() => {
        throw new Error("Cookie removal failed");
      });

      // Should not throw error even if cookie removal fails
      expect(() => removeAuthTokens()).not.toThrow();
    });
  });
});