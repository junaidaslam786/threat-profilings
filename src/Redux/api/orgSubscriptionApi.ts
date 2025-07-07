import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  CreateOrgDto,
  CreateSubscriptionDto,
  GenericSuccessResponse,
  LeCreateOrgDto,
  OrgDetails,
  SubscriptionDetails,
  UpdateOrgDto,
  UpdateSubscriptionDto,
} from "../slices/orgSubscriptionSlice";

export const orgSubscriptionApi = createApi({
  reducerPath: "orgSubscriptionApi",
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
    // Create organization (Standard)
    createOrganization: builder.mutation<OrgDetails, CreateOrgDto>({
      query: (body) => ({
        url: "/orgs",
        method: "POST",
        body,
      }),
    }),
    // Create organization (LE)
    createLEOrganization: builder.mutation<OrgDetails, LeCreateOrgDto>({
      query: (body) => ({
        url: "/orgs/le",
        method: "POST",
        body,
      }),
    }),
    // List all organizations (visible to user)
    getOrganizations: builder.query<OrgDetails[], void>({
      query: () => "/orgs",
    }),
    // Fetch single organization by clientName
    getOrganization: builder.query<OrgDetails, string>({
      query: (clientName) => `/orgs/${clientName}`,
    }),
    // Update org details (sector, website, etc.)
    updateOrganization: builder.mutation<
      OrgDetails,
      { clientName: string; body: UpdateOrgDto }
    >({
      query: ({ clientName, body }) => ({
        url: `/orgs/${clientName}`,
        method: "PATCH",
        body,
      }),
    }),
    // Delete organization (optional, if supported)
    deleteOrganization: builder.mutation<GenericSuccessResponse, string>({
      query: (clientName) => ({
        url: `/orgs/${clientName}`,
        method: "DELETE",
      }),
    }),
    // Switch organization (if supported)
    switchOrganization: builder.query<GenericSuccessResponse, string>({
      query: (clientName) => `/orgs/switch/${clientName}`,
    }),
    // Update admins list (PATCH /orgs/:clientName/admins)
    updateAdmins: builder.mutation<OrgDetails, { clientName: string; admins: string[] }>({
      query: ({ clientName, admins }) => ({
        url: `/orgs/${clientName}/admins`,
        method: "PATCH",
        body: { admins },
      }),
    }),
    // Update viewers list (PATCH /orgs/:clientName/viewers)
    updateViewers: builder.mutation<OrgDetails, { clientName: string; viewers: string[] }>({
      query: ({ clientName, viewers }) => ({
        url: `/orgs/${clientName}/viewers`,
        method: "PATCH",
        body: { viewers },
      }),
    }),
    // Update status (PATCH /orgs/:clientName/status)
    updateStatus: builder.mutation<OrgDetails, { clientName: string; status: string }>({
      query: ({ clientName, status }) => ({
        url: `/orgs/${clientName}/status`,
        method: "PATCH",
        body: { status },
      }),
    }),
    // Subscription management
    createSubscription: builder.mutation<
      SubscriptionDetails,
      CreateSubscriptionDto
    >({
      query: (body) => ({
        url: "/subscriptions",
        method: "POST",
        body,
      }),
    }),
    getSubscriptionDetails: builder.query<SubscriptionDetails, string>({
      query: (clientName) => `/subscriptions/${clientName}`,
    }),
    updateSubscription: builder.mutation<
      SubscriptionDetails,
      { clientName: string; body: UpdateSubscriptionDto }
    >({
      query: ({ clientName, body }) => ({
        url: `/subscriptions/${clientName}`,
        method: "PATCH",
        body,
      }),
    }),
  }),
});

// --- Export Hooks ---
export const {
  useCreateOrganizationMutation,
  useCreateLEOrganizationMutation,
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useSwitchOrganizationQuery,
  useUpdateAdminsMutation,
  useUpdateViewersMutation,
  useUpdateStatusMutation,
  useCreateSubscriptionMutation,
  useGetSubscriptionDetailsQuery,
  useUpdateSubscriptionMutation,
} = orgSubscriptionApi;
