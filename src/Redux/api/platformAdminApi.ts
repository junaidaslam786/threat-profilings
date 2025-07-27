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
  tagTypes: ["PlatformStats", "PlatformAdmin", "ActivityLogs", "CurrentAdmin"],
  endpoints: (builder) => ({
    getPlatformStats: builder.query<PlatformStats, void>({
      query: () => "/stats",
      providesTags: ["PlatformStats"],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch platform statistics';
      },
    }),

    getActivityLogs: builder.query<ActivityLogsResponse, ActivityLogQueryDto | void>({
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
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch activity logs';
      },
    }),

    listPlatformAdmins: builder.query<ListAdminsResponse, void>({
      query: () => "/admins",
      providesTags: (result) => [
        { type: "PlatformAdmin", id: "LIST" },
        ...(result?.admins?.map(admin => ({ type: "PlatformAdmin" as const, id: admin.email })) || []),
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch platform administrators';
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
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to grant platform admin access';
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
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to revoke platform admin access';
      },
    }),

    suspendUser: builder.mutation<SuspendUserResponse, { email: string } & Omit<SuspendUserDto, 'email'>>({
      query: ({ email, ...body }) => ({
        url: `/users/${encodeURIComponent(email)}/suspend`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "PlatformStats",
        "ActivityLogs",
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to suspend user';
      },
    }),

    activateUser: builder.mutation<ActivateUserResponse, { email: string }>({
      query: ({ email }) => ({
        url: `/users/${encodeURIComponent(email)}/activate`,
        method: "POST",
      }),
      invalidatesTags: [
        "PlatformStats",
        "ActivityLogs",
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to activate user';
      },
    }),

    deleteUser: builder.mutation<DeleteUserResponse, { email: string; force?: boolean }>({
      query: ({ email, force = false }) => ({
        url: `/users/${encodeURIComponent(email)}`,
        method: "DELETE",
        params: force ? { force: 'true' } : {},
      }),
      invalidatesTags: [
        "PlatformStats",
        "ActivityLogs",
        { type: "PlatformAdmin", id: "LIST" },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to delete user';
      },
    }),

    getCurrentAdmin: builder.query<CurrentAdminResponse, void>({
      query: () => "/me",
      providesTags: ["CurrentAdmin"],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch current admin info';
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
  useLazyGetPlatformStatsQuery,
  useLazyGetActivityLogsQuery,
  useLazyListPlatformAdminsQuery,
  useLazyGetCurrentAdminQuery,
} = platformAdminApi;

export const selectPlatformStats = platformAdminApi.endpoints.getPlatformStats.select();
export const selectPlatformAdmins = platformAdminApi.endpoints.listPlatformAdmins.select();
export const selectCurrentAdmin = platformAdminApi.endpoints.getCurrentAdmin.select();
export const selectActivityLogs = (params?: ActivityLogQueryDto) => 
  platformAdminApi.endpoints.getActivityLogs.select(params || {});