// src/api/organizationsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  ClientDataDto,
  CreateOrgDto,
  LeCreateOrgDto,
  UpdateOrgDto,
} from "../slices/organizationsSlice";

export  interface GenericSuccessResponse {
  message: string;
}

export const organizationsApi = createApi({
  reducerPath: "organizationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = Cookies.get("id_token");
      if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
      return headers;
    },
  }),
  tagTypes: ["Organization"],
  endpoints: (builder) => ({
    // POST /orgs - Create Org
    createOrg: builder.mutation<ClientDataDto, CreateOrgDto>({
      query: (body) => ({
        url: "/orgs",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),
    // POST /orgs/le - Create Org as LE user
    createLeOrg: builder.mutation<ClientDataDto, LeCreateOrgDto>({
      query: (body) => ({
        url: "/orgs/le",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),
    // GET /orgs - List Orgs (for current user)
    getOrgs: builder.query<ClientDataDto[], void>({
      query: () => "/orgs",
      providesTags: [{ type: "Organization", id: "LIST" }],
    }),
    // PATCH /orgs/:clientName - Update Org
    updateOrg: builder.mutation<ClientDataDto, { clientName: string; body: UpdateOrgDto }>({
      query: ({ clientName, body }) => ({
        url: `/orgs/${clientName}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),
    // GET /orgs/switch/:clientName - Switch Org Context
    switchOrg: builder.query<ClientDataDto, string>({
      query: (clientName) => `/orgs/switch/${clientName}`,
    }),
  }),
});

export const {
  useCreateOrgMutation,
  useCreateLeOrgMutation,
  useGetOrgsQuery,
  useUpdateOrgMutation,
  useSwitchOrgQuery,
} = organizationsApi;
