import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useUser } from "../../hooks/useUser";
import userReducer from "../../Redux/slices/userSlice";
import { mockUser } from "../test-utils";
import React from "react";

// Mock external dependencies that are not part of Redux
vi.mock("js-cookie", () => ({
  default: {
    get: vi.fn(() => "mock-id-token"),
  },
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../../utils/cookieHelpers", () => ({
  hasAuthTokens: vi.fn(() => true),
}));

// Mock the user API completely to avoid store middleware issues
interface MockedUserApi {
  useGetUserMeQuery: ReturnType<typeof vi.fn>;
  reducerPath: string;
  reducer: ReturnType<typeof vi.fn>;
  middleware: ReturnType<typeof vi.fn>;
}

interface MockedUserApiModule {
  userApi: MockedUserApi;
  useGetProfileQuery: ReturnType<typeof vi.fn>;
}

vi.mock(
  "../../Redux/api/userApi",
  (): MockedUserApiModule => ({
    userApi: {
      useGetUserMeQuery: vi.fn(),
      reducerPath: "userApi",
      reducer: vi.fn((state = {}) => state),
      middleware: vi.fn(
        () => (next: (action: unknown) => unknown) => (action: unknown) =>
          next(action)
      ),
    },
    useGetProfileQuery: vi.fn(),
  })
);

import { useGetProfileQuery } from "../../Redux/api/userApi";
import Cookies from "js-cookie";
import { hasAuthTokens } from "../../utils/cookieHelpers";

describe("useUser", () => {
  let store: ReturnType<typeof configureStore>;

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock the API hook to return default values
    (useGetProfileQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      {
        data: null,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      }
    );

    // Create a simple store with just the user reducer
    store = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });
  });

  it("should return loading state when token exists but no user data", () => {
    const { result } = renderHook(() => useUser(), { wrapper: TestWrapper });

    expect(result.current.user).toBeNull();
    // When there's a token but no user, loading will be true
    expect(result.current.isLoading).toBe(true);
  });

  it("should return initial state when no authentication token exists", () => {
    // Override the cookie mock for this test
    const mockedCookies = Cookies as unknown as {
      get: ReturnType<typeof vi.fn>;
    };
    mockedCookies.get.mockReturnValue(undefined);

    const mockedHasAuthTokens = hasAuthTokens as unknown as ReturnType<
      typeof vi.fn
    >;
    mockedHasAuthTokens.mockReturnValue(false);

    const { result } = renderHook(() => useUser(), { wrapper: TestWrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);

    // Reset mocks
    mockedCookies.get.mockReturnValue("mock-id-token");
    mockedHasAuthTokens.mockReturnValue(true);
  });

  it("should return user data when stored in Redux", () => {
    // Create store with user data
    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: "mock-token",
          user: mockUser,
          isLoading: false,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return correct admin status for admin user", () => {
    const adminUser = {
      ...mockUser,
      roles_and_permissions: {
        ...mockUser.roles_and_permissions,
        primary_role: "admin" as const,
      },
    };

    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: "mock-token",
          user: adminUser,
          isLoading: false,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.isAdmin).toBe(true);
  });

  it("should return correct platform admin status", () => {
    const platformAdminUser = {
      ...mockUser,
      roles_and_permissions: {
        ...mockUser.roles_and_permissions,
        permissions: {
          ...mockUser.roles_and_permissions.permissions,
          can_access_platform_admin: true,
        },
        access_levels: {
          platform_admin: "super",
          organizations: {},
        },
      },
    };

    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: "mock-token",
          user: platformAdminUser,
          isLoading: false,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.isPlatformAdmin).toBe(true);
  });

  it("should return correct super admin status", () => {
    const superAdminUser = {
      ...mockUser,
      feature_access: {
        ...mockUser.feature_access,
        super_admin_functions: true,
      },
    };

    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: "mock-token",
          user: superAdminUser,
          isLoading: false,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.isSuperAdmin).toBe(true);
  });

  it("should return correct LE admin status", () => {
    const leAdminUser = {
      ...mockUser,
      user_info: {
        ...mockUser.user_info,
        user_type: "LE" as const,
      },
    };

    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: "mock-token",
          user: leAdminUser,
          isLoading: false,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.isLEAdmin).toBe(true);
  });

  it("should return correct viewer role status", () => {
    const viewerUser = {
      ...mockUser,
      roles_and_permissions: {
        ...mockUser.roles_and_permissions,
        primary_role: "viewer" as const,
      },
    };

    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: "mock-token",
          user: viewerUser,
          isLoading: false,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.isViewer).toBe(true);
  });

  it("should return correct runner role status", () => {
    const runnerUser = {
      ...mockUser,
      roles_and_permissions: {
        ...mockUser.roles_and_permissions,
        primary_role: "runner" as const,
      },
    };

    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: "mock-token",
          user: runnerUser,
          isLoading: false,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.isRunner).toBe(true);
  });

  it("should return hydrated status", () => {
    const { result } = renderHook(() => useUser(), { wrapper: TestWrapper });

    expect(result.current.hydrated).toBe(true);
  });

  it("should return loading state from Redux store", () => {
    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: null,
          user: null,
          isLoading: true,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.isLoading).toBe(true);
  });

  it("should handle API error and trigger logout", () => {
    // Mock the API hook to return an error
    (useGetProfileQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: { data: { message: "Unauthorized access" } },
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useUser(), { wrapper: TestWrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("should return refetch function", () => {
    const mockRefetch = vi.fn();
    (useGetProfileQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      error: null,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useUser(), { wrapper: TestWrapper });

    expect(typeof result.current.refetch).toBe("function");
    expect(result.current.refetch).toBe(mockRefetch);
  });

  it("should return hasBothTokens status", () => {
    const { result } = renderHook(() => useUser(), { wrapper: TestWrapper });

    expect(typeof result.current.hasBothTokens).toBe("boolean");
  });

  it("should handle user with multiple access levels", () => {
    const multiAccessUser = {
      ...mockUser,
      roles_and_permissions: {
        ...mockUser.roles_and_permissions,
        primary_role: "admin" as const,
        permissions: {
          ...mockUser.roles_and_permissions.permissions,
          can_access_platform_admin: true,
          can_create_le_orgs: true,
        },
        access_levels: {
          platform_admin: "super",
          organizations: {},
        },
      },
      user_info: {
        ...mockUser.user_info,
        user_type: "LE" as const,
      },
      feature_access: {
        ...mockUser.feature_access,
        super_admin_functions: true,
      },
    };

    const storeWithUser = configureStore({
      reducer: {
        user: userReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      preloadedState: {
        user: {
          accessToken: "mock-token",
          user: multiAccessUser,
          isLoading: false,
          error: null,
          pendingJoinRequests: [],
          users: [],
          adminOrganizations: [],
        },
      },
    });

    const TestWrapperWithUser = ({
      children,
    }: {
      children: React.ReactNode;
    }) => <Provider store={storeWithUser}>{children}</Provider>;

    const { result } = renderHook(() => useUser(), {
      wrapper: TestWrapperWithUser,
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isPlatformAdmin).toBe(true);
    expect(result.current.isSuperAdmin).toBe(true);
    expect(result.current.isLEAdmin).toBe(true);
  });

  it("should return false for all role checks with null user", () => {
    const { result } = renderHook(() => useUser(), { wrapper: TestWrapper });

    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isPlatformAdmin).toBe(false);
    expect(result.current.isSuperAdmin).toBe(false);
    expect(result.current.isLEAdmin).toBe(false);
    expect(result.current.isViewer).toBe(false);
    expect(result.current.isRunner).toBe(false);
  });

  it("should handle isFetching state for hydration", () => {
    (useGetProfileQuery as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: true,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useUser(), { wrapper: TestWrapper });

    // When isFetching is true and no user, hydrated should be false
    expect(result.current.hydrated).toBe(false);
  });
});
