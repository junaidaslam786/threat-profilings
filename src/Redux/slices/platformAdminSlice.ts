import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AdminActionDto {
  action:
    | "grant"
    | "revoke"
    | "suspend"
    | "activate"
    | "delete"
    | "update_subscription";
  target_email: string;
  reason?: string;
  admin_level?: string;
  subscription_level?: string;
  force?: boolean;
}

export interface AdminAction {
  action: "grant" | "revoke" | "suspend" | "activate" | "delete";
  target_email: string;
  reason?: string;
  admin_level?: string;
}

export interface PlatformAdminUser {
  email: string;
  name: string;
  level: "super" | "admin" | "read-only";
  created_at: string;
  last_login?: string;
  granted_by?: string;
  granted_at?: string;
}
export interface StatsQueryDto {
  start_date?: string;
  end_date?: string;
  granularity?: "day" | "week" | "month";
  limit?: number;
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  le_users: number;
  platform_admins: number;
  recent_registrations: number;
  user_growth: GrowthData[];
}

export interface OrganizationStats {
  total: number;
  standard: number;
  le_master: number;
  le_client: number;
  by_industry: Record<string, number>;
  by_size: Record<string, number>;
  org_growth: GrowthData[];
}

export interface SubscriptionStats {
  total: number;
  l0: number;
  l1: number;
  l2: number;
  le: number;
  revenue_projection: number;
  subscription_trends: GrowthData[];
}

export interface SystemStats {
  uptime: string;
  total_api_calls: number;
  daily_api_calls: number;
  error_rate: number;
  avg_response_time: number;
  database_size: string;
  active_sessions: number;
}

export interface ActivityStats {
  daily_logins: number;
  weekly_logins: number;
  monthly_logins: number;
  recent_activities: ActivityLog[];
}

export interface GrowthData {
  date: string;
  count: number;
  percentage_change?: number;
}

export interface ActivityLog {
  id: string;
  user_email: string;
  action: string;
  resource: string;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

export interface ActivityLogQueryDto {
  user_email?: string;
  action?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface PlatformStats {
  users: UserStats;
  organizations: OrganizationStats;
  subscriptions: SubscriptionStats;
  system: SystemStats;
  activity: ActivityStats;
}

export interface GrantAdminDto {
  email: string;
  level: "super" | "admin" | "read-only";
  reason?: string;
}

export interface RevokeAdminDto {
  email: string;
  reason?: string;
}

export interface SuspendUserDto {
  email: string;
  reason: string;
  duration?: string;
}

export interface ActivityLogQueryDto {
  user_email?: string;
  action?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface GrantAdminResponse {
  granted: boolean;
  userEmail: string;
  level: string;
  grantedBy: string;
  reason?: string;
}

export interface RevokeAdminResponse {
  revoked: boolean;
  userEmail: string;
  revokedBy: string;
  reason?: string;
}

export interface SuspendUserResponse {
  suspended: boolean;
  userEmail: string;
  suspendedBy: string;
  reason: string;
  suspensionEndDate?: string;
}

export interface ActivateUserResponse {
  activated: boolean;
  userEmail: string;
  activatedBy: string;
}

export interface DeleteUserResponse {
  deleted: boolean;
  userEmail: string;
  deletedBy: string;
}

export interface ListAdminsResponse {
  total: number;
  admins: PlatformAdminUser[];
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  total: number;
}

export interface AdminInfo {
  email: string;
  name: string;
  user_id: string;
  admin_level: string;
  platform_admin: boolean;
  granted_by: string;
  granted_at: string; // ISO date string
  last_login: string; // ISO date string
  created_at: string; // ISO date string
}

export interface Permissions {
  level: string;
  permissions: {
    view_stats: boolean;
    view_logs: boolean;
    view_organizations: boolean;
    view_users: boolean;
    view_subscriptions: boolean;
    export_data: boolean;
    grant_admin: boolean;
    revoke_admin: boolean;
    suspend_users: boolean;
    activate_users: boolean;
    manage_partner_codes: boolean;
    modify_subscriptions: boolean;
    create_invoices: boolean;
    delete_users: boolean;
    delete_organizations: boolean;
    manage_super_admins: boolean;
    system_configuration: boolean;
    emergency_controls: boolean;
    backup_restore: boolean;
  };
  permission_count: number;
  restrictions: string[];
}

export interface SystemOverview {
  total_organizations: number;
  total_users: number;
  active_subscriptions: number;
  monthly_revenue: number;
  system_uptime: string; // e.g. "0h 34m"
  error_rate: number;
}

export interface OrgBreakdown {
  by_subscription: {
    L0: number;
    L1: number;
    L2: number;
    LE: number;
  };
  by_status: {
    active: number;
    suspended: number;
    pending: number;
  };
  by_type: {
    standard: number;
    le_master: number;
    le_client: number;
  };
}

export interface RecentOrgActivity {
  client_name: string;
  organization_name: string;
  last_activity: string; // ISO date string
  subscription_level: string;
  user_count: number;
}

export interface ManagedScope {
  total_managed_orgs: number;
  org_breakdown: OrgBreakdown;
  recent_org_activity: RecentOrgActivity[];
}

export interface RecentActivity {
  actions_count: number;
  last_7_days: number;
  recent_actions: string[];
}

export interface FeatureAccess {
  can_delete_users: boolean;
  can_manage_super_admins: boolean;
  can_access_system_config: boolean;
  can_manage_billing_settings: boolean;
  can_suspend_users: boolean;
  can_grant_admin_access: boolean;
  can_manage_partner_codes: boolean;
  can_modify_subscriptions: boolean;
  can_access_invoicing: boolean;
  can_view_statistics: boolean;
  can_view_activity_logs: boolean;
  can_view_organizations: boolean;
  can_export_reports: boolean;
}

export interface DashboardNavigation {
  show_user_management: boolean;
  show_org_management: boolean;
  show_billing_section: boolean;
  show_partner_management: boolean;
  show_system_config: boolean;
  show_audit_logs: boolean;
}

export interface DashboardWidgets {
  system_metrics: boolean;
  revenue_dashboard: boolean;
  user_activity: boolean;
  org_growth: boolean;
  security_alerts: boolean;
}

export interface DashboardActions {
  bulk_user_operations: boolean;
  emergency_suspend: boolean;
  manual_billing: boolean;
  system_maintenance: boolean;
}

export interface DashboardConfig {
  navigation: DashboardNavigation;
  widgets: DashboardWidgets;
  actions: DashboardActions;
}

export interface QuickAction {
  action: string;
  label: string;
  category: string;
}

export interface SessionPermissions {
  session_level: string;
  can_elevate: boolean;
  session_timeout: string;
  concurrent_sessions: string | number;
  ip_restrictions: string;
  mfa_required: boolean;
}

export interface SessionInfo {
  login_method: string;
  session_permissions: SessionPermissions;
}

export interface CurrentAdminResponse {
  admin_info: AdminInfo;
  permissions: Permissions;
  system_overview: SystemOverview;
  managed_scope: ManagedScope;
  recent_activity: RecentActivity;
  feature_access: FeatureAccess;
  dashboard_config: DashboardConfig;
  quick_actions: QuickAction[];
  alerts: unknown[];
  session_info: SessionInfo;
}

interface PlatformAdminState {
  selectedAdmin: PlatformAdminUser | null;
  currentAdminInfo: CurrentAdminResponse | null;
  statsCache: {
    data: PlatformStats | null;
    lastFetched: number | null;
  };
}

const initialState: PlatformAdminState = {
  selectedAdmin: null,
  currentAdminInfo: null,
  statsCache: {
    data: null,
    lastFetched: null,
  },
};

const platformAdminSlice = createSlice({
  name: "platformAdmin",
  initialState,
  reducers: {
    setSelectedAdmin: (
      state,
      action: PayloadAction<PlatformAdminUser | null>
    ) => {
      state.selectedAdmin = action.payload;
    },
    clearSelectedAdmin: (state) => {
      state.selectedAdmin = null;
    },
    setCurrentAdminInfo: (
      state,
      action: PayloadAction<CurrentAdminResponse | null>
    ) => {
      state.currentAdminInfo = action.payload;
    },
    clearCurrentAdminInfo: (state) => {
      state.currentAdminInfo = null;
    },
    cacheStats: (state, action: PayloadAction<PlatformStats>) => {
      state.statsCache.data = action.payload;
      state.statsCache.lastFetched = Date.now();
    },
    clearStatsCache: (state) => {
      state.statsCache.data = null;
      state.statsCache.lastFetched = null;
    },
  },
});

export const {
  setSelectedAdmin,
  clearSelectedAdmin,
  setCurrentAdminInfo,
  clearCurrentAdminInfo,
  cacheStats,
  clearStatsCache,
} = platformAdminSlice.actions;

export default platformAdminSlice.reducer;
