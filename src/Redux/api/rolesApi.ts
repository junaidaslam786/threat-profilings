import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getIdToken } from "../../utils/authStorage";
import type { 
  CreateRoleDto,
  RoleConfigDto, 
  RoleCreateResponse, 
  RoleDeleteResponse 
} from "../slices/rolesSlice";

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = getIdToken();
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Role"],
  endpoints: (builder) => ({
    createRole: builder.mutation<RoleCreateResponse, CreateRoleDto>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: () => [
        { type: "Role", id: "LIST" },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }): string => {
        return response.data?.message || 'Failed to create/update role';
      },
    }),

    // GET /roles - Get all roles
    getRoles: builder.query<RoleConfigDto[], void>({
      query: () => "/roles",
      providesTags: (result) => [
        { type: "Role", id: "LIST" },
        // Provide tags for each individual role
        ...(result?.map(role => ({ type: "Role" as const, id: role.role_id })) || []),
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch roles';
      },
    }),

    // GET /roles/:role_id - Get a specific role
    getRole: builder.query<RoleConfigDto, string>({
      query: (role_id) => `/roles/${encodeURIComponent(role_id)}`,
      providesTags: (_result, _error, role_id) => [
        { type: "Role", id: role_id },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch role';
      },
    }),

    // DELETE /roles/:role_id - Delete a role
    deleteRole: builder.mutation<RoleDeleteResponse, string>({
      query: (role_id) => ({
        url: `/roles/${encodeURIComponent(role_id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, role_id) => [
        { type: "Role", id: "LIST" },
        { type: "Role", id: role_id },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to delete role';
      },
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useGetRolesQuery,
  useGetRoleQuery,
  useDeleteRoleMutation,
  // Export lazy queries for more control
  useLazyGetRoleQuery,
  useLazyGetRolesQuery,
} = rolesApi;

// Export selectors for getting cached data
export const selectRoleById = (role_id: string) => 
  rolesApi.endpoints.getRole.select(role_id);

export const selectAllRoles = rolesApi.endpoints.getRoles.select();
