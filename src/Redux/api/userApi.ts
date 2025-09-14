import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getIdToken } from "../../utils/authStorage";
import { debugTokenDetails } from "../../utils/debugTokens";
import type {
  RegisterUserDto,
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
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = getIdToken();
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
        
        // Debug token details when making API calls
        if (import.meta.env.MODE === 'development' || window.location.search.includes('debug=true')) {
          console.log('🔍 Preparing headers for API call');
          debugTokenDetails();
        }
      } else {
        console.warn('⚠️ No ID token found when preparing headers');
      }
      return headers;
    },
    validateStatus: (response) => {
      // Consider 401 as an error that should not be cached, but DON'T remove tokens
      // Let the application logic handle token management to avoid premature removal
      if (response.status === 401) {
        console.warn("401 response received, but preserving tokens for application to handle");
        return false;
      }
      return response.status >= 200 && response.status <= 299;
    },
  }),
  tagTypes: ['User', 'PendingJoins', 'AdminOrgs'],
  endpoints: (builder) => ({
    detectRegistrationFlow: builder.mutation<DetectFlowResponse, DetectFlowDto>({
      query: (body) => ({
        url: "/users/register/detect-flow",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response: { status: number; data: unknown }) => {
        // Enhanced error logging for detect flow
        console.group('❌ Detect Flow Error');
        console.log('Status:', response.status);
        console.log('Response Data:', response.data);
        console.log('Full Response:', response);
        
        if (response.status === 401) {
          console.log('🔍 Token debugging for 401 error:');
          debugTokenDetails();
        }
        
        console.groupEnd();
        return response;
      },
    }),

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
