// src/api/rolesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { RoleConfigDto } from "../slices/rolesSlice";

interface GenericSuccessResponse {
  message: string;
}

export const rolesApi = createApi({
  reducerPath: "rolesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = Cookies.get("id_token");
      if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
      return headers;
    },
  }),
  tagTypes: ["Role"],
  endpoints: (builder) => ({
    // POST /roles - Create new role
    createRole: builder.mutation<RoleConfigDto, RoleConfigDto>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
    // GET /roles - Get all roles
    getRoles: builder.query<RoleConfigDto[], void>({
      query: () => "/roles",
      providesTags: [{ type: "Role", id: "LIST" }],
    }),
    // GET /roles/:role_id - Get a specific role
    getRole: builder.query<RoleConfigDto, string>({
      query: (role_id) => `/roles/${role_id}`,
      providesTags: (_res, _err, role_id) => [{ type: "Role", id: role_id }],
    }),
    // DELETE /roles/:role_id - Delete a role
    deleteRole: builder.mutation<GenericSuccessResponse, string>({
      query: (role_id) => ({
        url: `/roles/${role_id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useGetRolesQuery,
  useGetRoleQuery,
  useDeleteRoleMutation,
} = rolesApi;
