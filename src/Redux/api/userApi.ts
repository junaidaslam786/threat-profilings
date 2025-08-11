import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  RegisterUserDto,
  JoinOrgRequestDto,
  ApproveJoinDto,
  InviteUserDto,
  UpdateUserRoleDto,
  UserMeResponse,
  PendingJoinDto,
  AdminOrgResponse,
} from "../slices/userSlice";

interface GenericSuccessResponse {
  message: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = Cookies.get("id_token");
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
    validateStatus: (response) => {
      // Consider 401 as an error that should not be cached
      if (response.status === 401) {
        // Clear invalid token
        Cookies.remove("id_token");
        return false;
      }
      return response.status >= 200 && response.status <= 299;
    },
  }),
  tagTypes: ['User', 'PendingJoins', 'AdminOrgs'],
  endpoints: (builder) => ({
    createUser: builder.mutation<GenericSuccessResponse, RegisterUserDto>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User'],
    }),

    joinOrgRequest: builder.mutation<GenericSuccessResponse, JoinOrgRequestDto>({
      query: (body) => ({
        url: "/users/join-request",
        method: "POST",
        body,
      }),
      invalidatesTags: ['PendingJoins'],
    }),

    approveJoinRequest: builder.mutation<
      GenericSuccessResponse,
      { joinId: string; body: ApproveJoinDto }
    >({
      query: ({ joinId, body }) => ({
        url: `/users/approve-join/${joinId}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ['PendingJoins', 'User'],
    }),

    inviteUser: builder.mutation<GenericSuccessResponse, InviteUserDto>({
      query: (body) => ({
        url: "/users/invite",
        method: "POST",
        body,
      }),
      invalidatesTags: ['User'],
    }),

    updateUserRole: builder.mutation<
      GenericSuccessResponse,
      { userId: string; org: string; body: UpdateUserRoleDto }
    >({
      query: ({ userId, org, body }) => ({
        url: `/users/role/${userId}?org=${encodeURIComponent(org)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ['User'],
    }),

    removeUser: builder.mutation<
      GenericSuccessResponse,
      { userId: string; org: string }
    >({
      query: ({ userId, org }) => ({
        url: `/users/remove/${userId}?org=${encodeURIComponent(org)}`,
        method: "DELETE",
      }),
      invalidatesTags: ['User'],
    }),

    getPendingJoinRequests: builder.query<PendingJoinDto[], { org: string }>({
      query: ({ org }) => `/users/join-requests?org=${encodeURIComponent(org)}`,
      providesTags: ['PendingJoins'],
    }),

    getProfile: builder.query<UserMeResponse, void>({
      query: () => "/users/me",
      providesTags: ['User'],
    }),

    getAdminOrganizations: builder.query<AdminOrgResponse[], void>({
      query: () => "/users/admin-orgs",
      providesTags: ['AdminOrgs'],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useJoinOrgRequestMutation,
  useApproveJoinRequestMutation,
  useInviteUserMutation,
  useUpdateUserRoleMutation,
  useRemoveUserMutation,
  useGetPendingJoinRequestsQuery,
  useGetProfileQuery,
  useGetAdminOrganizationsQuery,
} = userApi;