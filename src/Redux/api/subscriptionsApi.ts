import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getIdToken } from "../../utils/authStorage";
import type {
  ClientSubscriptionDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from "../slices/subscriptionsSlice";

export const subscriptionsApi = createApi({
  reducerPath: "subscriptionsApi",
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
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    createSubscription: builder.mutation<
      ClientSubscriptionDto,
      CreateSubscriptionDto
    >({
      query: (body) => ({
        url: "/subscriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to create subscription";
      },
    }),

    getSubscription: builder.query<ClientSubscriptionDto, string>({
      query: (clientName) => `/subscriptions/${encodeURIComponent(clientName)}`,
      providesTags: (_result, _error, clientName) => [
        { type: "Subscription", id: clientName },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch subscription";
      },
    }),

    updateSubscription: builder.mutation<
      ClientSubscriptionDto,
      { clientName: string; body: UpdateSubscriptionDto }
    >({
      query: ({ clientName, body }) => ({
        url: `/subscriptions/${encodeURIComponent(clientName)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Subscription", id: arg.clientName },
        { type: "Subscription", id: "LIST" },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to update subscription";
      },
    }),

    checkFeatureAllowed: builder.query<{ feature: string; allowed: boolean }, { clientName: string; feature: string }>({
      query: ({ clientName, feature }) => `/subscriptions/${encodeURIComponent(clientName)}/features/${encodeURIComponent(feature)}`,
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to check feature availability";
      },
    }),

    incrementRuns: builder.mutation<ClientSubscriptionDto, string>({
      query: (clientName) => ({
        url: `/subscriptions/${encodeURIComponent(clientName)}/usage/runs`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, clientName) => [
        { type: "Subscription", id: clientName },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to increment runs";
      },
    }),

    incrementUsageCounter: builder.mutation<
      ClientSubscriptionDto,
      { clientName: string; counter: 'apps_count' | 'edits_count' | 'users_count' }
    >({
      query: ({ clientName, counter }) => ({
        url: `/subscriptions/${encodeURIComponent(clientName)}/usage/${counter}`,
        method: "PUT",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Subscription", id: arg.clientName },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to increment usage counter";
      },
    }),

    updateStorageUsage: builder.mutation<
      ClientSubscriptionDto,
      { clientName: string; storageUsedGb: number }
    >({
      query: ({ clientName, storageUsedGb }) => ({
        url: `/subscriptions/${encodeURIComponent(clientName)}/storage`,
        method: "PUT",
        body: { storage_used_gb: storageUsedGb },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Subscription", id: arg.clientName },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to update storage usage";
      },
    }),

    suspendSubscription: builder.mutation<
      ClientSubscriptionDto,
      { clientName: string; reason: string }
    >({
      query: ({ clientName, reason }) => ({
        url: `/subscriptions/${encodeURIComponent(clientName)}/suspend`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Subscription", id: arg.clientName },
        { type: "Subscription", id: "LIST" },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to suspend subscription";
      },
    }),

    reactivateSubscription: builder.mutation<ClientSubscriptionDto, string>({
      query: (clientName) => ({
        url: `/subscriptions/${encodeURIComponent(clientName)}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, clientName) => [
        { type: "Subscription", id: clientName },
        { type: "Subscription", id: "LIST" },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to reactivate subscription";
      },
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useLazyGetSubscriptionQuery,
  useCheckFeatureAllowedQuery,
  useLazyCheckFeatureAllowedQuery,
  useIncrementRunsMutation,
  useIncrementUsageCounterMutation,
  useUpdateStorageUsageMutation,
  useSuspendSubscriptionMutation,
  useReactivateSubscriptionMutation,
} = subscriptionsApi;
