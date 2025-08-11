import type { UserMeResponse } from '../Redux/slices/userSlice';

/**
 * Check if user is a platform admin based on permissions
 */
export const isPlatformAdmin = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.roles_and_permissions.permissions.can_access_platform_admin || 
         user.feature_access.platform_admin_panel;
};

/**
 * Check if user is a super admin based on permissions
 */
export const isSuperAdmin = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.feature_access.super_admin_functions;
};

/**
 * Check if user is LE admin
 */
export const isLEAdmin = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.user_info.user_type === 'LE' || 
         user.roles_and_permissions.permissions.can_create_le_orgs ||
         user.feature_access.le_organization_creation;
};

/**
 * Check if user has admin role
 */
export const isAdmin = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.roles_and_permissions.primary_role === 'admin';
};

/**
 * Check if user has viewer role
 */
export const isViewer = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.roles_and_permissions.primary_role === 'viewer';
};

/**
 * Check if user has runner role
 */
export const isRunner = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.roles_and_permissions.primary_role === 'runner';
};

/**
 * Check if user has any of the required roles
 */
export const hasRequiredRole = (
  user: UserMeResponse | null, 
  requiredRoles: Array<'admin' | 'viewer' | 'runner' | 'platform_admin' | 'super_admin' | 'LE_ADMIN'>
): boolean => {
  if (!user || requiredRoles.length === 0) return true;

  for (const role of requiredRoles) {
    switch (role) {
      case 'admin':
        if (isAdmin(user)) return true;
        break;
      case 'viewer':
        if (isViewer(user)) return true;
        break;
      case 'runner':
        if (isRunner(user)) return true;
        break;
      case 'platform_admin':
        if (isPlatformAdmin(user)) return true;
        break;
      case 'super_admin':
        if (isSuperAdmin(user)) return true;
        break;
      case 'LE_ADMIN':
        if (isLEAdmin(user)) return true;
        break;
    }
  }

  return false;
};
