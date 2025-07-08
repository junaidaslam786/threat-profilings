// src/api/subscriptionsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  ClientSubscriptionDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from "../slices/subscriptionsSlice";

// For PATCH/POST responses
export interface GenericSuccessResponse {
  message: string;
}

export const subscriptionsApi = createApi({
  reducerPath: "subscriptionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = Cookies.get("id_token");
      if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
      return headers;
    },
  }),
  tagTypes: ["Subscription"],
  endpoints: (builder) => ({
    // POST /subscriptions - create a new subscription
    createSubscription: builder.mutation<ClientSubscriptionDto, CreateSubscriptionDto>({
      query: (body) => ({
        url: "/subscriptions",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
    }),
    // GET /subscriptions/:client_name - get a subscription by client_name
    getSubscription: builder.query<ClientSubscriptionDto, string>({
      query: (clientName) => `/subscriptions/${clientName}`,
      providesTags: (_res, _err, clientName) => [{ type: "Subscription", id: clientName }],
    }),
    // PATCH /subscriptions/:client_name - update a subscription
    updateSubscription: builder.mutation<ClientSubscriptionDto, { clientName: string; body: UpdateSubscriptionDto }>({
      query: ({ clientName, body }) => ({
        url: `/subscriptions/${clientName}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [
        { type: "Subscription", id: arg.clientName },
        { type: "Subscription", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateSubscriptionMutation,
  useGetSubscriptionQuery,
  useUpdateSubscriptionMutation,
} = subscriptionsApi;
