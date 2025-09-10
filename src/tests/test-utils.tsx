import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import type { ReactElement } from 'react';

// Import the actual store structure
import organizationsReducer from '../Redux/slices/organizationsSlice';
import partnersReducer from '../Redux/slices/partnersSlice';
import paymentsReducer from '../Redux/slices/paymentsSlice';
import platformAdminReducer from '../Redux/slices/platformAdminSlice';
import rolesReducer from '../Redux/slices/rolesSlice';
import subscriptionsReducer from '../Redux/slices/subscriptionsSlice';
import tiersReducer from '../Redux/slices/tiersSlice';
import userReducer from '../Redux/slices/userSlice';
import { organizationsApi } from '../Redux/api/organizationsApi';
import { partnersApi } from '../Redux/api/partnersApi';
import { paymentsApi } from '../Redux/api/paymentsApi';
import { platformAdminApi } from '../Redux/api/platformAdminApi';
import { tiersApi } from '../Redux/api/tiersApi';
import { rolesApi } from '../Redux/api/rolesApi';
import { subscriptionsApi } from '../Redux/api/subscriptionsApi';
import { userApi } from '../Redux/api/userApi';
import { authApi } from '../Redux/api/authApi';
import { threatProfilingApi } from '../Redux/api/threatProfilingApi';

// Create test store matching the production structure
const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      organizations: organizationsReducer,
      partners: partnersReducer,
      payments: paymentsReducer,
      platformAdmin: platformAdminReducer,
      roles: rolesReducer,
      subscriptions: subscriptionsReducer,
      tiers: tiersReducer,
      user: userReducer,
      [organizationsApi.reducerPath]: organizationsApi.reducer,
      [partnersApi.reducerPath]: partnersApi.reducer,
      [paymentsApi.reducerPath]: paymentsApi.reducer,
      [platformAdminApi.reducerPath]: platformAdminApi.reducer,
      [rolesApi.reducerPath]: rolesApi.reducer,
      [subscriptionsApi.reducerPath]: subscriptionsApi.reducer,
      [tiersApi.reducerPath]: tiersApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [threatProfilingApi.reducerPath]: threatProfilingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        organizationsApi.middleware,
        partnersApi.middleware,
        paymentsApi.middleware,
        platformAdminApi.middleware,
        rolesApi.middleware,
        subscriptionsApi.middleware,
        tiersApi.middleware,
        userApi.middleware,
        authApi.middleware,
        threatProfilingApi.middleware
      ),
    preloadedState,
  });

// Custom render function
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Record<string, unknown>;
  store?: ReturnType<typeof createTestStore>;
  initialEntries?: string[];
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    initialEntries = ['/'],
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Mock user data
export const mockUser = {
  user_info: {
    email: 'test@example.com',
    name: 'Test User',
    user_id: 'user-123',
    client_name: 'test-org',
    user_type: 'standard' as const,
    status: 'active' as const,
    created_at: '2023-01-01T00:00:00Z',
  },
  roles_and_permissions: {
    primary_role: 'admin' as const,
    all_roles: ['admin'],
    permissions: {
      can_create_orgs: true,
      can_manage_users: true,
      can_run_profiling: true,
      can_edit_org_data: true,
      can_view_billing: true,
      can_manage_subscriptions: true,
      can_access_platform_admin: false,
      can_manage_partners: false,
      can_create_le_orgs: false,
      is_multi_org_controller: false,
    },
    access_levels: {
      platform_admin: null,
      organizations: {
        'test-org': {
          role: 'admin',
          organization_name: 'Test Organization',
          permissions: ['manage_users', 'run_profiling'],
        },
      },
    },
  },
  accessible_organizations: [
    {
      client_name: 'test-org',
      organization_name: 'Test Organization',
      role: 'admin',
      access_type: 'direct',
    },
  ],
  subscriptions: [
    {
      client_name: 'test-org',
      created_at: '2023-01-01T00:00:00Z',
      run_quota: 100,
      subscription_level: 'L1',
      progress: 25,
    },
  ],
  feature_access: {
    platform_admin_panel: false,
    super_admin_functions: false,
    organization_creation: true,
    le_organization_creation: false,
    user_management: true,
    billing_access: true,
    threat_profiling: true,
    data_export: true,
    partner_management: false,
    organization_switching: true,
  },
  ui_config: {
    navigation: {
      show_admin_menu: true,
      show_platform_admin_menu: false,
      show_le_controls: false,
      show_billing_section: true,
    },
    buttons: {
      create_organization: true,
      invite_users: true,
      run_profiling: true,
      manage_subscriptions: true,
      switch_organizations: true,
    },
    sections: {
      user_management: true,
      billing_dashboard: true,
      platform_statistics: false,
      partner_codes: false,
    },
  },
  session_info: {
    login_method: 'cognito',
  },
};

export const mockPlatformAdminUser = {
  ...mockUser,
  roles_and_permissions: {
    ...mockUser.roles_and_permissions,
    permissions: {
      ...mockUser.roles_and_permissions.permissions,
      can_access_platform_admin: true,
    },
  },
  feature_access: {
    ...mockUser.feature_access,
    platform_admin_panel: true,
    super_admin_functions: false,
  },
};

export const mockSuperAdminUser = {
  ...mockPlatformAdminUser,
  feature_access: {
    ...mockPlatformAdminUser.feature_access,
    super_admin_functions: true,
  },
};

// Mock organization data
export const mockOrganization = {
  client_name: 'test-org',
  organization_name: 'Test Organization',
  organization_description: 'A test organization',
  organization_size: '1-10',
  industry: 'Technology',
  country: 'US',
  admins: ['test@example.com'],
  users: ['test@example.com'],
  viewers: [],
  runners: [],
  created_by: 'test@example.com',
  type: 'STANDARD',
  user_role: 'admin',
  is_le_master: false,
  subscription: {
    subscription_level: 'L1',
    run_quota: 100,
    run_number: 25,
    runs_remaining: 75,
    max_edits: 10,
    max_apps: 5,
    progress: 25,
    subscription_status: 'active',
    created_at: '2023-01-01T00:00:00Z',
  },
  apps_info: {
    total_apps: 2,
    apps_limit: 5,
    apps_remaining: 3,
    recent_apps: [],
    has_apps_table: true,
  },
  usage: {
    total_runs: 25,
    total_scans: 50,
    quota_usage_percentage: 25,
    apps_usage_percentage: 40,
    last_activity: '2023-01-01T00:00:00Z',
  },
  access: {
    can_create_apps: true,
    can_run_scans: true,
    can_edit: true,
    can_manage_users: true,
  },
};

// Helper functions
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

export const createMockApiResponse = (data: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(data),
  text: () => Promise.resolve(JSON.stringify(data)),
});

export const createMockApiError = (message: string, status = 400) => ({
  ok: false,
  status,
  json: () => Promise.resolve({ message }),
  text: () => Promise.resolve(JSON.stringify({ message })),
});

// Re-export testing library
export {
  screen,
  fireEvent,
  waitFor,
  cleanup,
  act,
  within,
  getByRole,
  getByText,
  queryByText,
  findByText,
} from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';
export { renderWithProviders as render };
