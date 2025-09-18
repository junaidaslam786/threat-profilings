import { createApi } from "@reduxjs/toolkit/query/react";
import { createAuthenticatedBaseQuery } from "../../utils/authenticatedBaseQuery";
import type {
  RegisterUserDto,
  RegisterUserResponse,
  JoinOrgRequestDto,
  ApproveJoinDto,
  InviteUserDto,
  UpdateUserRoleDto,
  UserMeResponse,
  PendingJoinDto,
  AdminOrgResponse,
  DetectFlowDto,
  DetectFlowResponse,
} from "../slices/userSlice";

interface GenericSuccessResponse {
  message: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: createAuthenticatedBaseQuery(import.meta.env.VITE_API_BASE_URL),
  tagTypes: ['User', 'PendingJoins', 'AdminOrgs'],
  endpoints: (builder) => ({
    detectRegistrationFlow: builder.mutation<DetectFlowResponse, DetectFlowDto>({
      query: (body) => ({
        url: "/users/register/detect-flow",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response: { status: number; data: unknown }) => {
        console.groupEnd();
        return response;
      },
    }),

    createUser: builder.mutation<RegisterUserResponse, RegisterUserDto>({
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

    getUserRoles: builder.query<UserMeResponse, void>({
      query: () => "/users/me/roles",
      providesTags: ['User'],
    }),
  }),
});

export const {
  useDetectRegistrationFlowMutation,
  useCreateUserMutation,
  useJoinOrgRequestMutation,
  useApproveJoinRequestMutation,
  useInviteUserMutation,
  useUpdateUserRoleMutation,
  useRemoveUserMutation,
  useGetPendingJoinRequestsQuery,
  useGetProfileQuery,
  useGetAdminOrganizationsQuery,
  useGetUserRolesQuery,
} = userApi;
