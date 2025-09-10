// Mock setup for all APIs to prevent test failures
import { vi } from 'vitest';

// Create a generic API mock factory
const createApiMock = (name: string) => ({
  reducerPath: `${name}Api`,
  reducer: vi.fn(),
  middleware: vi.fn(),
  injectEndpoints: vi.fn(),
  enhanceEndpoints: vi.fn(),
  internalActions: {},
  util: {},
  endpoints: {},
});

// Create mock APIs
export const organizationsApi = createApiMock('organizations');
export const partnersApi = createApiMock('partners');
export const paymentsApi = createApiMock('payments');
export const platformAdminApi = createApiMock('platformAdmin');
export const rolesApi = createApiMock('roles');
export const subscriptionsApi = createApiMock('subscriptions');
export const tiersApi = createApiMock('tiers');
export const userApi = createApiMock('user');
export const authApi = createApiMock('auth');
export const threatProfilingApi = createApiMock('threatProfiling');

// Mock individual endpoints that tests might use
export const useCreateTierMutation = vi.fn(() => [vi.fn(), { isLoading: false }]);
export const useGetUsersQuery = vi.fn();
export const useCreateSubscriptionMutation = vi.fn(() => [vi.fn(), { isLoading: false }]);
export const useGetPaymentsQuery = vi.fn();

// Setup default returns for commonly used hooks
export const setupDefaultApiMocks = () => {
  useCreateTierMutation.mockReturnValue([vi.fn(), { isLoading: false }]);
  useGetUsersQuery.mockReturnValue({ data: [], isLoading: false });
  useCreateSubscriptionMutation.mockReturnValue([vi.fn(), { isLoading: false }]);
  useGetPaymentsQuery.mockReturnValue({ data: [], isLoading: false });
};
