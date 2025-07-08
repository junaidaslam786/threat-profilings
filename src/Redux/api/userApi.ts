// src/api/userApi.ts
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
  }),
  endpoints: (builder) => ({
    // Register user
    createUser: builder.mutation<GenericSuccessResponse, RegisterUserDto>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),
    // Request to join org
    joinOrgRequest: builder.mutation<GenericSuccessResponse, JoinOrgRequestDto>({
      query: (body) => ({
        url: "/users/join-request",
        method: "POST",
        body,
      }),
    }),
    // Approve join request
    approveJoinRequest: builder.mutation<GenericSuccessResponse, { joinId: string; body: ApproveJoinDto }>({
      query: ({ joinId, body }) => ({
        url: `/users/approve-join/${joinId}`,
        method: "POST",
        body,
      }),
    }),
    // Invite user
    inviteUser: builder.mutation<GenericSuccessResponse, InviteUserDto>({
      query: (body) => ({
        url: "/users/invite",
        method: "POST",
        body,
      }),
    }),
    // Update user role
    updateUserRole: builder.mutation<GenericSuccessResponse, { userId: string; body: UpdateUserRoleDto }>({
      query: ({ userId, body }) => ({
        url: `/users/role/${userId}`,
        method: "PATCH",
        body,
      }),
    }),
    // Remove user
    removeUser: builder.mutation<GenericSuccessResponse, { userId: string }>({
      query: ({ userId }) => ({
        url: `/users/remove/${userId}`,
        method: "DELETE",
      }),
    }),
    // Get all pending join requests
    getPendingJoinRequests: builder.query<PendingJoinDto[], void>({
      query: () => `/users/join-requests`,
    }),
    // Get profile (me)
    getProfile: builder.mutation<UserMeResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "POST",
        body: {},
      }),
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
  useGetProfileMutation,
} = userApi;
