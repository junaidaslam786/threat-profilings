// Vitest setup file to provide global mocks for APIs
import { vi } from 'vitest';

// Create a basic mock structure for RTK Query APIs
const createMockApi = (name: string) => ({
  reducerPath: `${name}Api`,
  reducer: (state = {}, action: any) => state,
  middleware: (store: any) => (next: any) => (action: any) => next(action),
  injectEndpoints: vi.fn(),
  enhanceEndpoints: vi.fn(),
});

// Global API mocks
global.mockApis = {
  organizationsApi: createMockApi('organizations'),
  partnersApi: createMockApi('partners'),
  paymentsApi: createMockApi('payments'),
  platformAdminApi: createMockApi('platformAdmin'),
  rolesApi: createMockApi('roles'),
  subscriptionsApi: createMockApi('subscriptions'),
  tiersApi: createMockApi('tiers'),
  userApi: createMockApi('user'),
  authApi: createMockApi('auth'),
  threatProfilingApi: createMockApi('threatProfiling'),
};

// Mock common RTK Query hooks
vi.mock('@reduxjs/toolkit/query/react', async () => {
  const actual = await vi.importActual('@reduxjs/toolkit/query/react');
  return {
    ...actual,
    // Add any specific mocks if needed
  };
});
