import { describe, it, expect } from 'vitest';
import {
  isPlatformAdmin,
  isSuperAdmin,
  isLEAdmin,
  isAdmin,
  isViewer,
  isRunner,
  hasRequiredRole,
} from '../../utils/roleUtils';

// Create proper mock data that matches UserMeResponse interface
const createMockUser = (overrides = {}) => ({
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
      organizations: {},
    },
  },
  accessible_organizations: [],
  subscriptions: [],
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
  ...overrides,
});

describe('roleUtils', () => {
  describe('isPlatformAdmin', () => {
    it('should return false for null user', () => {
      expect(isPlatformAdmin(null)).toBe(false);
    });

    it('should return true for user with can_access_platform_admin permission', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          permissions: {
            ...createMockUser().roles_and_permissions.permissions,
            can_access_platform_admin: true,
          },
        },
      });
      expect(isPlatformAdmin(user)).toBe(true);
    });

    it('should return true for user with platform_admin_panel feature access', () => {
      const user = createMockUser({
        feature_access: {
          ...createMockUser().feature_access,
          platform_admin_panel: true,
        },
      });
      expect(isPlatformAdmin(user)).toBe(true);
    });

    it('should return false for regular user', () => {
      const user = createMockUser();
      expect(isPlatformAdmin(user)).toBe(false);
    });
  });

  describe('isSuperAdmin', () => {
    it('should return false for null user', () => {
      expect(isSuperAdmin(null)).toBe(false);
    });

    it('should return true for user with super_admin_functions feature access', () => {
      const user = createMockUser({
        feature_access: {
          ...createMockUser().feature_access,
          super_admin_functions: true,
        },
      });
      expect(isSuperAdmin(user)).toBe(true);
    });

    it('should return false for regular user', () => {
      const user = createMockUser();
      expect(isSuperAdmin(user)).toBe(false);
    });
  });

  describe('isLEAdmin', () => {
    it('should return false for null user', () => {
      expect(isLEAdmin(null)).toBe(false);
    });

    it('should return true for user with LE user type', () => {
      const user = createMockUser({
        user_info: {
          ...createMockUser().user_info,
          user_type: 'LE' as const,
        },
      });
      expect(isLEAdmin(user)).toBe(true);
    });

    it('should return true for user with can_create_le_orgs permission', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          permissions: {
            ...createMockUser().roles_and_permissions.permissions,
            can_create_le_orgs: true,
          },
        },
      });
      expect(isLEAdmin(user)).toBe(true);
    });

    it('should return true for user with le_organization_creation feature access', () => {
      const user = createMockUser({
        feature_access: {
          ...createMockUser().feature_access,
          le_organization_creation: true,
        },
      });
      expect(isLEAdmin(user)).toBe(true);
    });

    it('should return false for regular user', () => {
      const user = createMockUser();
      expect(isLEAdmin(user)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return false for null user', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('should return true for user with admin role', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'admin' as const,
        },
      });
      expect(isAdmin(user)).toBe(true);
    });

    it('should return false for user with viewer role', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'viewer' as const,
        },
      });
      expect(isAdmin(user)).toBe(false);
    });

    it('should return false for user with runner role', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'runner' as const,
        },
      });
      expect(isAdmin(user)).toBe(false);
    });
  });

  describe('isViewer', () => {
    it('should return false for null user', () => {
      expect(isViewer(null)).toBe(false);
    });

    it('should return true for user with viewer role', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'viewer' as const,
        },
      });
      expect(isViewer(user)).toBe(true);
    });

    it('should return false for user with admin role', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'admin' as const,
        },
      });
      expect(isViewer(user)).toBe(false);
    });
  });

  describe('isRunner', () => {
    it('should return false for null user', () => {
      expect(isRunner(null)).toBe(false);
    });

    it('should return true for user with runner role', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'runner' as const,
        },
      });
      expect(isRunner(user)).toBe(true);
    });

    it('should return false for user with admin role', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'admin' as const,
        },
      });
      expect(isRunner(user)).toBe(false);
    });
  });

  describe('hasRequiredRole', () => {
    it('should return true for null user with empty required roles', () => {
      expect(hasRequiredRole(null, [])).toBe(true);
    });

    it('should return true for null user with required roles', () => {
      // According to the implementation, null user returns true when no roles or when user is null
      expect(hasRequiredRole(null, ['admin'])).toBe(true);
    });

    it('should return true for empty required roles array', () => {
      const user = createMockUser();
      expect(hasRequiredRole(user, [])).toBe(true);
    });

    it('should return true when user has admin role and admin is required', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'admin' as const,
        },
      });
      expect(hasRequiredRole(user, ['admin'])).toBe(true);
    });

    it('should return true when user matches any of multiple required roles', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'viewer' as const,
        },
      });
      expect(hasRequiredRole(user, ['admin', 'viewer', 'runner'])).toBe(true);
    });

    it('should return false when user does not match any required roles', () => {
      const user = createMockUser({
        roles_and_permissions: {
          ...createMockUser().roles_and_permissions,
          primary_role: 'runner' as const,
        },
      });
      expect(hasRequiredRole(user, ['admin', 'viewer'])).toBe(false);
    });
  });
});
