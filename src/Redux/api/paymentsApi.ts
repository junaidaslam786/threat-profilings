import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  StripePaymentDto,
  CreatePaymentIntentDto,
  PaymentIntentResponse,
  PaymentStatusResponse,
  PaymentRecord,
  StripeCheckoutDto,
  StripeCheckoutResponse,
} from "../slices/paymentsSlice";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
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
  tagTypes: ["Payment", "PaymentStatus", "Invoice", "Subscription"],
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<
      PaymentIntentResponse,
      CreatePaymentIntentDto
    >({
      query: (body) => ({
        url: "/payments/create-intent",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to create payment intent";
      },
    }),

    createCheckoutSession: builder.mutation<
      StripeCheckoutResponse,
      StripeCheckoutDto
    >({
      query: (body) => ({
        url: "/payments/create-checkout-session",
        method: "POST",
        body,
      }),
    }),

    processPayment: builder.mutation<PaymentRecord, StripePaymentDto>({
      query: (body) => ({
        url: "/payments/process",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "PaymentStatus", id: arg.client_name },
        { type: "Invoice", id: arg.client_name },
        { type: "Subscription", id: arg.client_name },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Payment processing failed";
      },
    }),

    getPaymentStatus: builder.query<PaymentStatusResponse, string>({
      query: (client_name) =>
        `/payments/status/${encodeURIComponent(client_name)}`,
      providesTags: (_result, _error, client_name) => [
        { type: "PaymentStatus", id: client_name },
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch payment status";
      },
    }),

    getInvoices: builder.query<PaymentRecord[], string>({
      query: (client_name) =>
        `/payments/invoices/${encodeURIComponent(client_name)}`,
      providesTags: (_result, _error, client_name) => [
        { type: "Invoice", id: client_name },
        { type: "Invoice", id: "LIST" },
        ...(_result?.map((invoice) => ({
          type: "Invoice" as const,
          id: invoice.payment_id,
        })) || []),
      ],
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch invoices";
      },
    }),

    handlePaymentSuccess: builder.query<{ success: boolean; message: string; session?: object }, string>({
      query: (session_id) => `/payments/success?session_id=${session_id}`,
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to handle payment success";
      },
    }),

    getCheckoutSession: builder.query<Record<string, unknown>, string>({
      query: (sessionId) => `/payments/checkout-session/${sessionId}`,
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch checkout session";
      },
    }),

    testWebhookProcessing: builder.mutation<{ success: boolean; message: string; session_id: string }, string>({
      query: (sessionId) => ({
        url: `/payments/test-webhook-processing/${sessionId}`,
        method: "POST",
      }),
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to test webhook processing";
      },
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useCreateCheckoutSessionMutation,
  useProcessPaymentMutation,
  useGetPaymentStatusQuery,
  useGetInvoicesQuery,
  useLazyGetPaymentStatusQuery,
  useLazyGetInvoicesQuery,
  useLazyHandlePaymentSuccessQuery,
  useGetCheckoutSessionQuery,
  useLazyGetCheckoutSessionQuery,
  useTestWebhookProcessingMutation,
} = paymentsApi;

export const selectPaymentStatusByClient = (client_name: string) =>
  paymentsApi.endpoints.getPaymentStatus.select(client_name);

export const selectInvoicesByClient = (client_name: string) =>
  paymentsApi.endpoints.getInvoices.select(client_name);

export const selectPaymentStatus =
  paymentsApi.endpoints.getPaymentStatus.select;
export const selectInvoices = paymentsApi.endpoints.getInvoices.select;
