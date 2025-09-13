import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getIdToken } from "../../utils/authStorage";
import type {
  ClientDataDto,
  CreateOrgDto,
  LeCreateOrgDto,
  UpdateOrgDto,
  CreateOrgResponse,
  LeCreateOrgResponse,
  SwitchOrgResponse,
  UpdateOrgResponse,
  DeleteOrgResponse,
} from "../slices/organizationsSlice";

export interface GenericSuccessResponse {
  message: string;
}

export const organizationsApi = createApi({
  reducerPath: "organizationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = getIdToken();
      if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
      return headers;
    },
  }),
  tagTypes: ["Organization", "AllOrgs"],
  endpoints: (builder) => ({
    createOrg: builder.mutation<CreateOrgResponse, CreateOrgDto>({
      query: (body) => ({
        url: "/orgs",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),

    createLeOrg: builder.mutation<LeCreateOrgResponse, LeCreateOrgDto>({
      query: (body) => ({
        url: "/orgs/le",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),

    getOrgs: builder.query<
      | ClientDataDto[]
      | {
          le_master: ClientDataDto | null;
          managed_orgs: ClientDataDto[];
          total_managed: number;
        },
      void
    >({
      query: () => "/orgs",
      providesTags: [{ type: "Organization", id: "LIST" }],
    }),
    getOrg: builder.query<
      | ClientDataDto
      | {
          le_master: ClientDataDto | null;
          managed_org: ClientDataDto;
          total_managed: number;
        },
      string
    >({
      query: (client_name) => `/orgs/${client_name}`,
      providesTags: [{ type: "Organization", id: "LIST" }],
    }),

    updateOrg: builder.mutation<
      UpdateOrgResponse,
      {
        clientName: string;
        body: UpdateOrgDto;
      }
    >({
      query: ({ clientName, body }) => ({
        url: `/orgs/${clientName}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [{ type: "Organization", id: "LIST" }],
    }),

    switchOrg: builder.query<SwitchOrgResponse, string>({
      query: (clientName) => `/orgs/switch/${clientName}`,
    }),

    getAllOrgs: builder.query<ClientDataDto[], void>({
      query: () => "/orgs/all",
      providesTags: [{ type: "AllOrgs", id: "LIST" }],
    }),

    deleteOrg: builder.mutation<DeleteOrgResponse, string>({
      query: (clientName) => ({
        url: `/orgs/${clientName}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Organization", id: "LIST" },
        { type: "AllOrgs", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateOrgMutation,
  useCreateLeOrgMutation,
  useGetOrgsQuery,
  useGetOrgQuery,
  useUpdateOrgMutation,
  useSwitchOrgQuery,
  useGetAllOrgsQuery,
  useDeleteOrgMutation,
} = organizationsApi;
