import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
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
      const idToken = Cookies.get("id_token");
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    createSubscription: builder.mutation<ClientSubscriptionDto, CreateSubscriptionDto>({
      query: (body) => ({
        url: "/subscriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to create subscription';
      },
    }),

    getSubscription: builder.query<ClientSubscriptionDto, string>({
      query: (clientName) => `/subscriptions/${encodeURIComponent(clientName)}`,
      providesTags: (_result, _error, clientName) => [
        { type: "Subscription", id: clientName },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch subscription';
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
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to update subscription';
      },
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useLazyGetSubscriptionQuery,
} = subscriptionsApi;