import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getIdToken } from "../../utils/authStorage";
import type {
  Application,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  CreateApplicationResponse,
  UpdateApplicationResponse,
  DeleteApplicationResponse,
  OrganizationAppsResponse,
  UserApplicationsResponse,
  ApplicationStatistics,
  ScanResultUpdate,
} from "../slices/types/applicationTypes";

export interface ApplicationDashboardResponse {
  success: boolean;
  organization: string;
  dashboard: {
    apps: Application[];
    usageSummary: Record<string, unknown>;
    appStatistics: {
      totalApps: number;
      activeApps: number;
      archivedApps: number;
      appsByType: Record<string, number>;
      recentActivity: {
        appsCreatedLast30Days: number;
        appsScannedLast30Days: number;
        totalScansLast30Days: number;
      };
      threatAnalysis: {
        highRiskApps: number;
        mediumRiskApps: number;
        lowRiskApps: number;
        unscannedApps: number;
        averageThreatScore: number;
      };
    };
    recommendations: string[];
  };
}

export interface ApplicationUsageResponse {
  success: boolean;
  organization: string;
  usageSummary: Record<string, unknown>;
}

export interface ApplicationDetailResponse {
  success: boolean;
  app: Application;
}

export interface ApplicationStatisticsResponse {
  success: boolean;
  userEmail: string;
  statistics: ApplicationStatistics;
}

export const applicationsApi = createApi({
  reducerPath: "applicationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = getIdToken();
      if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
      return headers;
    },
  }),
  tagTypes: ["Application", "ApplicationList", "ApplicationStatistics", "ApplicationUsage"],
  endpoints: (builder) => ({
    // Create new application
    createApplication: builder.mutation<CreateApplicationResponse, CreateApplicationRequest>({
      query: (body) => ({
        url: "/apps",
        method: "POST",
        body: {
          app_name: body.appName,
          description: body.description,
          app_type: body.appType,
          technologies: body.technologies,
          repository_url: body.repositoryUrl,
          deployment_url: body.deploymentUrl,
          contact_email: body.contactEmail,
          priority: body.priority,
        },
      }),
      invalidatesTags: [
        { type: "ApplicationList", id: "LIST" },
        { type: "ApplicationUsage", id: "USAGE" },
        { type: "ApplicationStatistics", id: "STATS" },
      ],
    }),

    // Get applications for current organization
    getApplications: builder.query<OrganizationAppsResponse, void>({
      query: () => ({
        url: "/apps",
        method: "GET",
      }),
      providesTags: [{ type: "ApplicationList", id: "LIST" }],
    }),

    // Get user's applications across all organizations
    getUserApplications: builder.query<UserApplicationsResponse, void>({
      query: () => ({
        url: "/apps/my-apps",
        method: "GET",
      }),
      providesTags: [{ type: "ApplicationList", id: "USER_APPS" }],
    }),

    // Get specific application by ID
    getApplicationById: builder.query<ApplicationDetailResponse, string>({
      query: (appId) => ({
        url: `/apps/${appId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, appId) => [
        { type: "Application", id: appId },
      ],
    }),

    // Update application
    updateApplication: builder.mutation<
      UpdateApplicationResponse,
      { appId: string; data: UpdateApplicationRequest }
    >({
      query: ({ appId, data }) => ({
        url: `/apps/${appId}`,
        method: "PATCH",
        body: {
          app_name: data.appName,
          description: data.description,
          app_type: data.appType,
          technologies: data.technologies,
          repository_url: data.repositoryUrl,
          deployment_url: data.deploymentUrl,
          contact_email: data.contactEmail,
          priority: data.priority,
          status: data.status,
          last_scan_date: data.lastScanDate,
          scan_status: data.scanStatus,
        },
      }),
      invalidatesTags: (_result, _error, { appId }) => [
        { type: "Application", id: appId },
        { type: "ApplicationList", id: "LIST" },
        { type: "ApplicationList", id: "USER_APPS" },
        { type: "ApplicationStatistics", id: "STATS" },
      ],
    }),

    // Delete/Archive application
    deleteApplication: builder.mutation<DeleteApplicationResponse, string>({
      query: (appId) => ({
        url: `/apps/${appId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, appId) => [
        { type: "Application", id: appId },
        { type: "ApplicationList", id: "LIST" },
        { type: "ApplicationList", id: "USER_APPS" },
        { type: "ApplicationUsage", id: "USAGE" },
        { type: "ApplicationStatistics", id: "STATS" },
      ],
    }),

    // Get organization dashboard with apps
    getApplicationDashboard: builder.query<ApplicationDashboardResponse, void>({
      query: () => ({
        url: "/apps/dashboard",
        method: "GET",
      }),
      providesTags: [{ type: "ApplicationList", id: "DASHBOARD" }],
    }),

    // Get application usage summary
    getApplicationUsage: builder.query<ApplicationUsageResponse, void>({
      query: () => ({
        url: "/apps/usage",
        method: "GET",
      }),
      providesTags: [{ type: "ApplicationUsage", id: "USAGE" }],
    }),

    // Get user application statistics
    getApplicationStatistics: builder.query<ApplicationStatisticsResponse, void>({
      query: () => ({
        url: "/apps/statistics",
        method: "GET",
      }),
      providesTags: [{ type: "ApplicationStatistics", id: "STATS" }],
    }),

    // Update application scan results (for internal use)
    updateApplicationScanResults: builder.mutation<
      { success: boolean; message: string },
      { appId: string; scanResults: ScanResultUpdate }
    >({
      query: ({ appId, scanResults }) => ({
        url: `/apps/${appId}/scan-results`,
        method: "PATCH",
        body: {
          threat_score: scanResults.threatScore,
          compliance_status: scanResults.complianceStatus,
          scan_status: scanResults.scanStatus,
          scan_details: scanResults.scanDetails,
        },
      }),
      invalidatesTags: (_result, _error, { appId }) => [
        { type: "Application", id: appId },
        { type: "ApplicationList", id: "LIST" },
        { type: "ApplicationList", id: "USER_APPS" },
        { type: "ApplicationStatistics", id: "STATS" },
      ],
    }),
  }),
});

export const {
  useCreateApplicationMutation,
  useGetApplicationsQuery,
  useGetUserApplicationsQuery,
  useGetApplicationByIdQuery,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useGetApplicationDashboardQuery,
  useGetApplicationUsageQuery,
  useGetApplicationStatisticsQuery,
  useUpdateApplicationScanResultsMutation,
  useLazyGetApplicationsQuery,
  useLazyGetUserApplicationsQuery,
  useLazyGetApplicationByIdQuery,
  useLazyGetApplicationDashboardQuery,
  useLazyGetApplicationUsageQuery,
  useLazyGetApplicationStatisticsQuery,
} = applicationsApi;