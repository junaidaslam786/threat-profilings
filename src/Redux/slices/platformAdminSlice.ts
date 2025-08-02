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

export interface CurrentAdminResponse {
  email: string;
  name: string;
  level: string;
  permissions: string[];
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