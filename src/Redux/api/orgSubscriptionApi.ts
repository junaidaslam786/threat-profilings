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
    createOrganization: builder.mutation<OrgDetails, CreateOrgDto>({
      query: (body) => ({
        url: "/orgs",
        method: "POST",
        body,
      }),
    }),
    createLEOrganization: builder.mutation<OrgDetails, LeCreateOrgDto>({
      query: (body) => ({
        url: "/orgs/le",
        method: "POST",
        body,
      }),
    }),
    getOrganizations: builder.query<OrgDetails[], void>({
      query: () => "/orgs",
    }),
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
    switchOrganization: builder.query<GenericSuccessResponse, string>({
      query: (clientName) => `/orgs/switch/${clientName}`,
    }),

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
  useUpdateOrganizationMutation,
  useSwitchOrganizationQuery,
  useCreateSubscriptionMutation,
  useGetSubscriptionDetailsQuery,
  useUpdateSubscriptionMutation,
} = orgSubscriptionApi;
