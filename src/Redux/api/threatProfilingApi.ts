import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface StartProfilingDto {
  client_name: string;
  reason?: string;
}

export interface BulkStatusDto {
  client_names: string[];
}

export type ProfilingStatus = 
  | 'idle'
  | 'preparing'
  | 'in_progress'
  | 'analyzing'
  | 'generating_report'
  | 'completed'
  | 'failed';

export interface ProfilingProgress {
  client_name: string;
  status: ProfilingStatus;
  progress: number;
  current_step?: string;
  estimated_completion?: string;
  error_message?: string;
  message?: string;
}

export interface ProfilingResults {
  client_name: string;
  has_results: boolean;
  results?: {
    isms?: Array<{
      control_id: string;
      control_description: string;
      applicability: boolean;
      implementation_guidance: string;
      control_name: string;
      implementation_status: string;
      recommendations: string[];
      compliance_score: number;
    }>;
    e8s?: Array<{
      gaps_identified: string[];
      mitigation_name: string;
      description: string;
      mitigation_id: string;
      implementation_level: string;
      priority: string;
      recommendations: string[];
      current_implementation: string;
    }>;
    tas?: Array<{
      capabilities: string[];
      sophistication: string;
      techniques: string[];
      motivation: string[];
      name: string;
      id: string;
      type: string;
      relevance_score: number;
    }>;
    ttps_applicable?: Array<{
      applicability_score: number;
      detection_methods: string[];
      technique_name: string;
      description: string;
      technique_id: string;
      mitigations: string[];
      tactic: string;
    }>;
    detections?: Array<{
      query: string;
      confidence_level: string;
      name: string;
      description: string;
      query_language: string;
      mitre_techniques: string[];
      detection_id: string;
      data_sources: string[];
      false_positive_rate: string;
    }>;
    executive_summary?: {
      overview: string;
      recommendations: string[];
      key_findings: string[];
      risk_posture: string;
    };
    compliance_status?: {
      ism_compliance_percentage: number;
      overall_security_score: number;
      e8_maturity_level: number;
    };
    metadata?: {
      last_updated: string;
      profiling_duration_seconds: number;
      data_sources_analyzed: string[];
      confidence_level: string;
    };
    report_id?: string;
    generated_at?: string;
    generated_by?: string;
    version?: string;
    // Legacy fields for backward compatibility
    threats?: Record<string, unknown>[];
    compliance?: Record<string, unknown>[];
    recommendations?: Record<string, unknown>[];
    [key: string]: unknown;
  };
}

export interface ProfilingHistory {
  client_name: string;
  history: {
    run_id: string;
    started_at: string;
    completed_at?: string;
    status: string;
    results_available: boolean;
    [key: string]: unknown;
  }[];
}

export interface CanRerunResponse {
  can_rerun: boolean;
  reason?: string;
  next_allowed_run?: string;
  runs_remaining?: number;
}

export interface OrganizationProfilingOverview {
  client_name: string;
  organization_name: string;
  user_role: string;
  profiling_status: ProfilingStatus;
  progress: number;
  last_profiling_date?: string;
  runs_used: number;
  runs_remaining: number | string;
  can_run_profiling: boolean;
  can_rerun: boolean;
  has_results: boolean;
}

export interface AvailableOrganization {
  client_name: string;
  organization_name: string;
  user_role: string;
  subscription_level: string;
  profiling_status: ProfilingStatus;
  progress: number;
  runs_used: number;
  runs_remaining: string | number;
  can_run_profiling: boolean;
  can_rerun: boolean;
  has_results: boolean;
}

export interface AvailableOrganizationsResponse {
  available_organizations: AvailableOrganization[];
  total_count: number;
  user_email: string;
  user_id: string;
}

export interface StatusOverviewResponse {
  organizations: OrganizationProfilingOverview[];
  profiling_in_progress: number;
  total_organizations: number;
  available_for_profiling: number;
  completed_profiles: number;
}

export interface BulkStatusResponse {
  statuses: Record<string, {
    status: ProfilingStatus;
    progress: number;
    can_rerun: boolean;
    has_results: boolean;
    last_updated?: string;
  }>;
}

export interface FieldLockStatus {
  locked_fields: string[];
  locked_at: string;
  locked_reason: string;
  can_unlock: string[];
}

export interface FieldLockResponse {
  client_name: string;
  field_name: string;
  is_locked: boolean;
}

export const threatProfilingApi = createApi({
  reducerPath: "threatProfilingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = Cookies.get("id_token");
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["ThreatProfiling", "ProfilingProgress", "ProfilingResults", "ProfilingHistory", "AvailableOrganizations", "StatusOverview", "FieldLocks"],
  endpoints: (builder) => ({
    startProfiling: builder.mutation<{ success: boolean; message: string; execution_arn?: string }, StartProfilingDto>({
      query: (body) => ({
        url: "/threat-profiling/start",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "ProfilingProgress", id: arg.client_name },
        { type: "ProfilingHistory", id: arg.client_name },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to start threat profiling";
      },
    }),

    getProfilingProgress: builder.query<ProfilingProgress, string>({
      query: (clientName) => `/threat-profiling/progress/${encodeURIComponent(clientName)}`,
      providesTags: (_result, _error, clientName) => [
        { type: "ProfilingProgress", id: clientName },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch profiling progress";
      },
    }),

    getProfilingResults: builder.query<ProfilingResults, string>({
      query: (clientName) => `/threat-profiling/results/${encodeURIComponent(clientName)}`,
      providesTags: (_result, _error, clientName) => [
        { type: "ProfilingResults", id: clientName },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch profiling results";
      },
    }),

    canRerunProfiling: builder.query<CanRerunResponse, string>({
      query: (clientName) => `/threat-profiling/can-rerun/${encodeURIComponent(clientName)}`,
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to check rerun eligibility";
      },
    }),

    getProfilingHistory: builder.query<ProfilingHistory, string>({
      query: (clientName) => `/threat-profiling/history/${encodeURIComponent(clientName)}`,
      providesTags: (_result, _error, clientName) => [
        { type: "ProfilingHistory", id: clientName },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch profiling history";
      },
    }),

    // New endpoints
    getAvailableOrganizations: builder.query<AvailableOrganizationsResponse, void>({
      query: () => '/threat-profiling/available-organizations',
      providesTags: [{ type: "AvailableOrganizations" }],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch available organizations";
      },
    }),

    getStatusOverview: builder.query<StatusOverviewResponse, void>({
      query: () => '/threat-profiling/status-overview',
      providesTags: [{ type: "StatusOverview" }],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch status overview";
      },
    }),

    getBulkStatus: builder.mutation<BulkStatusResponse, BulkStatusDto>({
      query: (body) => ({
        url: '/threat-profiling/bulk-status',
        method: 'POST',
        body,
      }),
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch bulk status";
      },
    }),

    getFieldLocks: builder.query<FieldLockStatus, string>({
      query: (clientName) => `/threat-profiling/field-locks/${encodeURIComponent(clientName)}`,
      providesTags: (_result, _error, clientName) => [
        { type: "FieldLocks", id: clientName },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch field locks";
      },
    }),

    isFieldLocked: builder.query<FieldLockResponse, { clientName: string; fieldName: string }>({
      query: ({ clientName, fieldName }) => 
        `/threat-profiling/field-locks/${encodeURIComponent(clientName)}/${encodeURIComponent(fieldName)}`,
      providesTags: (_result, _error, { clientName, fieldName }) => [
        { type: "FieldLocks", id: `${clientName}-${fieldName}` },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to check field lock status";
      },
    }),

    updateFieldLock: builder.mutation<
      FieldLockResponse,
      { client_name: string; field_name: string; is_locked: boolean }
    >({
      query: ({ client_name, field_name, is_locked }) => ({
        url: `/threat-profiling/field-locks/${encodeURIComponent(client_name)}/${encodeURIComponent(field_name)}`,
        method: "PUT",
        body: { is_locked },
      }),
      invalidatesTags: (_result, _error, { client_name, field_name }) => [
        { type: "FieldLocks", id: client_name },
        { type: "FieldLocks", id: `${client_name}-${field_name}` },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to update field lock";
      },
    }),
  }),
});

export const {
  useStartProfilingMutation,
  useGetProfilingProgressQuery,
  useGetProfilingResultsQuery,
  useCanRerunProfilingQuery,
  useGetProfilingHistoryQuery,
  useLazyGetProfilingProgressQuery,
  useLazyGetProfilingResultsQuery,
  useLazyCanRerunProfilingQuery,
  useLazyGetProfilingHistoryQuery,
  // New hooks
  useGetAvailableOrganizationsQuery,
  useLazyGetAvailableOrganizationsQuery,
  useGetStatusOverviewQuery,
  useLazyGetStatusOverviewQuery,
  useGetBulkStatusMutation,
  useGetFieldLocksQuery,
  useLazyGetFieldLocksQuery,
  useIsFieldLockedQuery,
  useLazyIsFieldLockedQuery,
  useUpdateFieldLockMutation,
} = threatProfilingApi;

export const selectProfilingProgress = (clientName: string) =>
  threatProfilingApi.endpoints.getProfilingProgress.select(clientName);

export const selectProfilingResults = (clientName: string) =>
  threatProfilingApi.endpoints.getProfilingResults.select(clientName);

export const selectProfilingHistory = (clientName: string) =>
  threatProfilingApi.endpoints.getProfilingHistory.select(clientName);

export const selectAvailableOrganizations = () =>
  threatProfilingApi.endpoints.getAvailableOrganizations.select();

export const selectStatusOverview = () =>
  threatProfilingApi.endpoints.getStatusOverview.select();

export const selectFieldLocks = (clientName: string) =>
  threatProfilingApi.endpoints.getFieldLocks.select(clientName);

export const selectFieldLock = (clientName: string, fieldName: string) =>
  threatProfilingApi.endpoints.isFieldLocked.select({ clientName, fieldName });
