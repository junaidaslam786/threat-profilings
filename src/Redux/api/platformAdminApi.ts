import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  PlatformStats,
  GrantAdminDto,
  RevokeAdminDto,
  SuspendUserDto,
  ActivityLogQueryDto,
  GrantAdminResponse,
  RevokeAdminResponse,
  SuspendUserResponse,
  ActivateUserResponse,
  DeleteUserResponse,
  ListAdminsResponse,
  ActivityLogsResponse,
  CurrentAdminResponse,
} from "../slices/platformAdminSlice";

// Extended types for new endpoints
export interface GetAllUsersParams {
  page?: number;
  limit?: number;
  status?: string;
  user_type?: string;
  has_partner?: boolean;
  partner_code?: string;
  search?: string;
}

export interface UserWithPartnerInfo {
  email: string;
  name: string;
  status: string;
  user_type: string;
  role: string;
  created_at: string;
  organization?: {
    organization_name: string;
  };
  partner_relationship?: {
    has_partner: boolean;
    partner_info?: {
      partner_code: string;
      partner_email: string;
      discount_percent: number;
      commission_percent: number;
    };
    referral_info?: {
      referral_date: string;
    };
  };
  payment_summary?: {
    total_payments: number;
    total_amount_spent: number;
    last_payment_date: string;
  };
}

export interface GetAllUsersResponse {
  users: UserWithPartnerInfo[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaymentFilters {
  page?: number;
  limit?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
  le_org_name?: string;
  org_name?: string;
  tier?: string;
  has_partner?: boolean;
  partner_code?: string;
}

export interface UserDetails {
  email: string;
  name: string;
  user_type: string;
  role: string;
}

export interface Organization {
  client_name: string;
  organization_name?: string;
  org_domain?: string;
  industry?: string;
  org_size?: string;
  owner_email?: string;
  managed_orgs?: string[];
  is_le_master?: boolean;
  user_type?: string;
}

export interface LEOrganization extends Organization {
  org_domain: string;
  managed_orgs: string[];
  is_le_master: boolean;
}

export interface PartnerRelationship {
  has_partner: boolean;
  source: string;
}

export interface PaymentRecord {
  stripe_payment_intent_id: string;
  created_at: string;
  user_email: string;
  tier: string;
  partner_code?: string;
  client_name: string;
  payment_status: string;
  discount: number;
  tax_type: string;
  payment_type: string;
  updated_at: string;
  payment_id: string;
  session_id: string;
  amount: number;
  tax_amount: number;
  final_amount: number;
  total_amount: number;
  le_organization?: LEOrganization;
  organization?: Organization;
  user_details: UserDetails;
  partner_relationship: PartnerRelationship;
  payment_category: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaymentSummary {
  total_payments: number;
  successful_payments: number;
  failed_payments: number;
  total_amount: number;
  average_amount: number;
  success_rate: number;
  tier_breakdown?: {
    [key: string]: {
      count: number;
      amount: number;
    };
  };
}

export interface PartnerAnalytics {
  partner_payments: {
    count: number;
    successful: number;
    total_revenue: number;
    average_amount: number;
  };
  direct_payments: {
    count: number;
    successful: number;
    total_revenue: number;
    average_amount: number;
  };
  financial_impact: {
    total_commission_owed: number;
    total_discount_given: number;
    partner_revenue_share: number;
    net_partner_cost: number;
  };
}

export interface PaymentsResponse {
  payments: PaymentRecord[];
  pagination: Pagination;
  summary: PaymentSummary;
  partner_analytics: PartnerAnalytics;
  category: string;
}

export interface MonthlyRevenue {
  [key: string]: {
    revenue: number;
    count: number;
  };
}

export interface TierBreakdown {
  [key: string]: {
    count: number;
    amount: number;
  };
}

export interface AdminAnalytics {
  total_revenue: number;
  total_payments: number;
  success_rate: number;
  average_payment: number;
  monthly_revenue: MonthlyRevenue;
  growth_trend: string;
  tier_breakdown?: TierBreakdown;
}

export interface UserBreakdown {
  standard_users: number;
  le_users: number;
  active_users: number;
  suspended_users: number;
}

export interface PaymentBreakdown {
  total_payments: number;
  successful_payments: number;
  failed_payments: number;
  average_payment_amount: number;
}

export interface PartnerPerformance {
  partner_code: string;
  partner_email: string;
  status: string;
  created_at: string;
  usage_count: number;
  usage_limit: number;
  discount_percent: number;
  commission_percent: number;
  total_revenue_generated: number;
  total_commission_earned: number;
  total_discount_given: number;
  total_referrals: number;
  registered_users: number;
  paying_users: number;
  conversion_rate: number;
  payment_conversion_rate: number;
  user_breakdown: UserBreakdown;
  payment_breakdown: PaymentBreakdown;
  recent_registrations: number;
  recent_payments: number;
}

export interface TopPerformers {
  by_revenue: PartnerPerformance[];
  by_users: PartnerPerformance[];
  by_conversion: PartnerPerformance[];
}

export interface MonthlyTrend {
  month: string;
  new_users: number;
  payments_count: number;
  revenue: number;
  successful_payments: number;
}

export interface PartnerAnalyticsResponse {
  total_partners: number;
  active_partners: number;
  total_referrals: number;
  total_commission_earned: number;
  partner_performance: PartnerPerformance[];
  top_performers: TopPerformers;
  monthly_trends: MonthlyTrend[];
}

export interface PaymentAnalytics {
  le_admin_analytics: AdminAnalytics;
  standard_admin_analytics: AdminAnalytics;
  comparison: {
    le_vs_standard_revenue_ratio: number;
    le_vs_standard_volume_ratio: number;
    total_platform_revenue: number;
    total_platform_payments: number;
  };
}

// Permissions Types
export interface Permission {
  name: string;
  description: string;
  required_level: string;
  scope: string;
}

export interface PermissionCategory {
  category: string;
  permissions: Record<string, Permission>;
}

export interface PermissionLevel {
  name: string;
  description: string;
  level: number;
}

export interface SystemPermissionsResponse {
  permissions: Record<string, PermissionCategory>;
  permission_levels: Record<string, PermissionLevel>;
}

export const platformAdminApi = createApi({
  reducerPath: "platformAdminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}/platform-admin`,
    prepareHeaders: (headers) => {
      const idToken = Cookies.get("id_token");
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["PlatformStats", "PlatformAdmin", "ActivityLogs", "CurrentAdmin", "Users", "Payments", "PaymentAnalytics"],
  endpoints: (builder) => ({
    getPlatformStats: builder.query<PlatformStats, void>({
      query: () => "/stats",
      providesTags: ["PlatformStats"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch platform statistics";
      },
    }),

    getActivityLogs: builder.query<
      ActivityLogsResponse,
      ActivityLogQueryDto | void
    >({
      query: (params = {}) => ({
        url: "/activity-logs",
        params: {
          ...params,
          ...Object.fromEntries(
            Object.entries(params || {}).filter(([, value]) => value !== undefined)
          ),
        },
      }),
      providesTags: ["ActivityLogs"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch activity logs";
      },
    }),

    listPlatformAdmins: builder.query<ListAdminsResponse, void>({
      query: () => "/admins",
      providesTags: (result) => [
        { type: "PlatformAdmin", id: "LIST" },
        ...(result?.admins?.map((admin) => ({
          type: "PlatformAdmin" as const,
          id: admin.email,
        })) || []),
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return (
          response.data?.message || "Failed to fetch platform administrators"
        );
      },
    }),

    grantPlatformAdmin: builder.mutation<GrantAdminResponse, GrantAdminDto>({
      query: (body) => ({
        url: "/grant",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "PlatformAdmin", id: "LIST" },
        "PlatformStats",
        "ActivityLogs",
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return (
          response.data?.message || "Failed to grant platform admin access"
        );
      },
    }),

    revokePlatformAdmin: builder.mutation<RevokeAdminResponse, RevokeAdminDto>({
      query: (body) => ({
        url: "/revoke",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "PlatformAdmin", id: "LIST" },
        "PlatformStats",
        "ActivityLogs",
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return (
          response.data?.message || "Failed to revoke platform admin access"
        );
      },
    }),

    suspendUser: builder.mutation<
      SuspendUserResponse,
      { email: string } & Omit<SuspendUserDto, "email">
    >({
      query: ({ email, ...body }) => ({
        url: `/users/${encodeURIComponent(email)}/suspend`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PlatformStats", "ActivityLogs"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to suspend user";
      },
    }),

    activateUser: builder.mutation<ActivateUserResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/users/${encodeURIComponent(email)}/activate`,
        method: "POST",
      }),
      invalidatesTags: ["PlatformStats", "ActivityLogs"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to activate user";
      },
    }),

    deleteUser: builder.mutation<
      DeleteUserResponse,
      { email: string; force?: boolean }
    >({
      query: ({ email, force = false }) => ({
        url: `/users/${encodeURIComponent(email)}`,
        method: "DELETE",
        params: force ? { force: "true" } : {},
      }),
      invalidatesTags: [
        "PlatformStats",
        "ActivityLogs",
        { type: "PlatformAdmin", id: "LIST" },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to delete user";
      },
    }),

    getCurrentAdmin: builder.query<CurrentAdminResponse, void>({
      query: () => "/me",
      providesTags: ["CurrentAdmin"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch current admin info";
      },
    }),

    getAllUsers: builder.query<GetAllUsersResponse, GetAllUsersParams | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/users",
          params: {
            page: queryParams.page || 1,
            limit: queryParams.limit || 50,
            ...Object.fromEntries(
              Object.entries(queryParams).filter(([, value]) => value !== undefined)
            ),
          },
        };
      },
      providesTags: (result) => [
        { type: "Users", id: "LIST" },
        ...(result?.users?.map((user) => ({
          type: "Users" as const,
          id: user.email,
        })) || []),
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch users";
      },
    }),

    getLEAdminPayments: builder.query<PaymentsResponse, PaymentFilters | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/payments/le-admins",
          params: {
            page: queryParams.page || 1,
            limit: queryParams.limit || 50,
            ...Object.fromEntries(
              Object.entries(queryParams).filter(([, value]) => value !== undefined)
            ),
          },
        };
      },
      providesTags: ["Payments"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch LE admin payments";
      },
    }),

    getStandardAdminPayments: builder.query<PaymentsResponse, PaymentFilters | void>({
      query: (params) => {
        const queryParams = params || {};
        return {
          url: "/payments/standard-admins",
          params: {
            page: queryParams.page || 1,
            limit: queryParams.limit || 50,
            ...Object.fromEntries(
              Object.entries(queryParams).filter(([, value]) => value !== undefined)
            ),
          },
        };
      },
      providesTags: ["Payments"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch standard admin payments";
      },
    }),

    getPaymentAnalytics: builder.query<PaymentAnalytics, void>({
      query: () => "/payments/analytics",
      providesTags: ["PaymentAnalytics"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch payment analytics";
      },
    }),

    updateUserStatus: builder.mutation<
      { message: string },
      {
        email: string;
        status: "active" | "suspended" | "inactive" | "pending";
        reason?: string;
      }
    >({
      query: ({ email, ...body }) => ({
        url: `/users/${encodeURIComponent(email)}/status`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users", "PlatformStats", "ActivityLogs"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to update user status";
      },
    }),

    bulkUpdateUserStatus: builder.mutation<
      { message: string },
      {
        user_emails: string[];
        status: "active" | "suspended" | "inactive";
        reason?: string;
      }
    >({
      query: (body) => ({
        url: "/users/bulk-status",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Users", "PlatformStats", "ActivityLogs"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to bulk update user status";
      },
    }),

    getPartnerAnalytics: builder.query<PartnerAnalyticsResponse, void>({
      query: () => "/partners/analytics",
      providesTags: ["PaymentAnalytics"],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch partner analytics";
      },
    }),

    getPartnerPerformance: builder.query<
      {
        partner_info: {
          partner_code: string;
          partner_email: string;
          status: string;
          created_at: string;
        };
        performance_metrics: {
          total_referrals: number;
          active_referrals: number;
          total_commission_earned: number;
          avg_commission_per_referral: number;
        };
        recent_referrals: Array<{
          user_email: string;
          referral_date: string;
          status: string;
          total_spent: number;
          commission_earned: number;
        }>;
      },
      string
    >({
      query: (partnerCode) => `/partners/${encodeURIComponent(partnerCode)}/performance`,
      providesTags: (_result, _error, partnerCode) => [
        { type: "PaymentAnalytics", id: partnerCode },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch partner performance";
      },
    }),

    getAllSystemPermissions: builder.query<SystemPermissionsResponse, void>({
      query: () => "/permissions/all",
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch system permissions";
      },
    }),
  }),
});

export const {
  useGetPlatformStatsQuery,
  useGetActivityLogsQuery,
  useListPlatformAdminsQuery,
  useGrantPlatformAdminMutation,
  useRevokePlatformAdminMutation,
  useSuspendUserMutation,
  useActivateUserMutation,
  useDeleteUserMutation,
  useGetCurrentAdminQuery,
  useGetAllUsersQuery,
  useGetLEAdminPaymentsQuery,
  useGetStandardAdminPaymentsQuery,
  useGetPaymentAnalyticsQuery,
  useUpdateUserStatusMutation,
  useBulkUpdateUserStatusMutation,
  useGetPartnerAnalyticsQuery,
  useGetPartnerPerformanceQuery,
  useGetAllSystemPermissionsQuery,
  useLazyGetPlatformStatsQuery,
  useLazyGetActivityLogsQuery,
  useLazyListPlatformAdminsQuery,
  useLazyGetCurrentAdminQuery,
  useLazyGetAllUsersQuery,
  useLazyGetLEAdminPaymentsQuery,
  useLazyGetStandardAdminPaymentsQuery,
  useLazyGetPaymentAnalyticsQuery,
  useLazyGetPartnerAnalyticsQuery,
  useLazyGetPartnerPerformanceQuery,
  useLazyGetAllSystemPermissionsQuery,
} = platformAdminApi;

export const selectPlatformStats =
  platformAdminApi.endpoints.getPlatformStats.select();
export const selectPlatformAdmins =
  platformAdminApi.endpoints.listPlatformAdmins.select();
export const selectCurrentAdmin =
  platformAdminApi.endpoints.getCurrentAdmin.select();
export const selectActivityLogs = (params?: ActivityLogQueryDto) =>
  platformAdminApi.endpoints.getActivityLogs.select(params || {});
export const selectAllUsers = (params?: GetAllUsersParams) =>
  platformAdminApi.endpoints.getAllUsers.select(params || {});
export const selectLEAdminPayments = (params?: PaymentFilters) =>
  platformAdminApi.endpoints.getLEAdminPayments.select(params || {});
export const selectStandardAdminPayments = (params?: PaymentFilters) =>
  platformAdminApi.endpoints.getStandardAdminPayments.select(params || {});
export const selectPaymentAnalytics =
  platformAdminApi.endpoints.getPaymentAnalytics.select();
export const selectPartnerAnalytics =
  platformAdminApi.endpoints.getPartnerAnalytics.select();
export const selectPartnerPerformance = (partnerCode: string) =>
  platformAdminApi.endpoints.getPartnerPerformance.select(partnerCode);
