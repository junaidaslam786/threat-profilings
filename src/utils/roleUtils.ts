import type { UserMeResponse } from '../Redux/slices/userSlice';

/**
 * Check if user is a platform admin based on permissions
 * Platform Admin: platform-level owner of admin portal/dashboards, subscriptions, 
 * partner codes, invoices, tax rules, manual upgrades, and user management across all orgs.
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
 * Check if user is LE Master (Enterprise Admin)
 * LE Master: manages multiple organizations under one LE account; 
 * invites team members and scopes them per org.
 */
export const isLEMaster = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.user_info.user_type === 'LE' || 
         user.roles_and_permissions.permissions.can_create_le_orgs ||
         user.feature_access.le_organization_creation ||
         user.roles_and_permissions.permissions.is_multi_org_controller;
};

/**
 * Check if user has Organization Admin role
 * Organization Admin: full control within a single organization 
 * (edit metadata, run/re-run profiling, manage users, download reports). 
 * First registrant for a domain becomes Admin by default.
 */
export const isOrgAdmin = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.roles_and_permissions.primary_role === 'admin';
};

/**
 * Check if user has Organization Viewer role
 * Organization Viewer: read-only access to results and reports 
 * for their scoped organization(s).
 */
export const isOrgViewer = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.roles_and_permissions.primary_role === 'viewer';
};

/**
 * Check if user has runner role (legacy compatibility)
 */
export const isRunner = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.roles_and_permissions.primary_role === 'runner';
};

/**
 * @deprecated Use isLEMaster instead
 */
export const isLEAdmin = (user: UserMeResponse | null): boolean => {
  return isLEMaster(user);
};

/**
 * @deprecated Use isOrgAdmin instead
 */
export const isAdmin = (user: UserMeResponse | null): boolean => {
  return isOrgAdmin(user);
};

/**
 * @deprecated Use isOrgViewer instead
 */
export const isViewer = (user: UserMeResponse | null): boolean => {
  return isOrgViewer(user);
};

/**
 * Check if user can manage multiple organizations (LE Master)
 */
export const canManageMultipleOrgs = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return isLEMaster(user);
};

/**
 * Check if user can access platform admin features
 */
export const canAccessPlatformAdmin = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return isPlatformAdmin(user) || isSuperAdmin(user);
};

/**
 * Check if user can manage payments and billing
 */
export const canManagePayments = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return isPlatformAdmin(user) || user.roles_and_permissions.permissions.can_view_billing;
};

/**
 * Check if user can create organizations
 */
export const canCreateOrganizations = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return isOrgAdmin(user) || isLEMaster(user) || user.roles_and_permissions.permissions.can_create_orgs;
};

/**
 * Check if user can run threat profiling
 */
export const canRunProfiling = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return user.roles_and_permissions.permissions.can_run_profiling && user.feature_access.threat_profiling;
};

/**
 * Check if user can manage users within their organization
 */
export const canManageOrgUsers = (user: UserMeResponse | null): boolean => {
  if (!user) return false;
  return isOrgAdmin(user) || isLEMaster(user) || user.roles_and_permissions.permissions.can_manage_users;
};

/**
 * Check if user has any of the required roles
 */
export const hasRequiredRole = (
  user: UserMeResponse | null, 
  requiredRoles: Array<'org_admin' | 'org_viewer' | 'runner' | 'platform_admin' | 'super_admin' | 'le_master' | 'admin' | 'viewer' | 'LE_ADMIN'>
): boolean => {
  if (!user || requiredRoles.length === 0) return true;

  for (const role of requiredRoles) {
    switch (role) {
      case 'org_admin':
      case 'admin':
        if (isOrgAdmin(user)) return true;
        break;
      case 'org_viewer':
      case 'viewer':
        if (isOrgViewer(user)) return true;
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
      case 'le_master':
      case 'LE_ADMIN':
        if (isLEMaster(user)) return true;
        break;
    }
  }

  return false;
};
