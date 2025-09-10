import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export interface StartProfilingDto {
  client_name: string;
  description?: string;
  compliance_frameworks?: string[];
  [key: string]: unknown;
}

export interface ProfilingProgress {
  client_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress_percentage: number;
  current_step?: string;
  estimated_completion?: string;
  error_message?: string;
}

export interface ProfilingResults {
  client_name: string;
  has_results: boolean;
  results?: {
    threats: Record<string, unknown>[];
    detections: Record<string, unknown>[];
    compliance: Record<string, unknown>[];
    recommendations: Record<string, unknown>[];
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
  tagTypes: ["ThreatProfiling", "ProfilingProgress", "ProfilingResults", "ProfilingHistory"],
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
} = threatProfilingApi;

export const selectProfilingProgress = (clientName: string) =>
  threatProfilingApi.endpoints.getProfilingProgress.select(clientName);

export const selectProfilingResults = (clientName: string) =>
  threatProfilingApi.endpoints.getProfilingResults.select(clientName);

export const selectProfilingHistory = (clientName: string) =>
  threatProfilingApi.endpoints.getProfilingHistory.select(clientName);
