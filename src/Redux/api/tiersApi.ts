import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getIdToken } from "../../utils/authStorage";
import type { 
  TierConfigDto, 
  TierCreateResponse, 
  TierDeleteResponse 
} from "../slices/tiersSlice";

export const tiersApi = createApi({
  reducerPath: "tiersApi",
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
  tagTypes: ["Tier"],
  endpoints: (builder) => ({
    createTier: builder.mutation<TierCreateResponse, TierConfigDto>({
      query: (body: TierConfigDto) => ({
        url: "/tiers",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tier", id: "LIST" },
        { type: "Tier", id: arg.sub_level },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to create/update tier';
      },
    }),
    getTiers: builder.query<TierConfigDto[], void>({
      query: () => "/tiers",
      providesTags: (result) => [
        { type: "Tier", id: "LIST" },
        ...(result?.map(tier => ({ type: "Tier" as const, id: tier.sub_level })) || []),
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch tiers';
      },
    }),

    getTier: builder.query<TierConfigDto, string>({
      query: (sub_level) => `/tiers/${encodeURIComponent(sub_level)}`,
      providesTags: (_result, _error, sub_level) => [
        { type: "Tier", id: sub_level },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch tier';
      },
    }),

    updateTier: builder.mutation<TierCreateResponse, { sub_level: string } & Partial<TierConfigDto>>({
      query: ({ sub_level, ...body }) => ({
        url: `/tiers/${encodeURIComponent(sub_level)}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Tier", id: "LIST" },
        { type: "Tier", id: arg.sub_level },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to update tier';
      },
    }),

    deleteTier: builder.mutation<TierDeleteResponse, string>({
      query: (sub_level) => ({
        url: `/tiers/${encodeURIComponent(sub_level)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, sub_level) => [
        { type: "Tier", id: "LIST" },
        { type: "Tier", id: sub_level },
      ],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to delete tier';
      },
    }),

    getTierPricing: builder.query<
      { price: number; discount_price?: number; partner_discount?: number },
      { sub_level: string; partner_code?: string }
    >({
      query: ({ sub_level, partner_code }) => {
        const params = partner_code ? `?partner_code=${encodeURIComponent(partner_code)}` : '';
        return `/tiers/pricing/${encodeURIComponent(sub_level)}${params}`;
      },
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch tier pricing';
      },
    }),

    getLeEligibleTiers: builder.query<TierConfigDto[], void>({
      query: () => "/tiers/le-eligible",
      providesTags: [{ type: "Tier", id: "LE_ELIGIBLE" }],
      transformErrorResponse: (response: { status: number; data?: { message?: string } }) => {
        return response.data?.message || 'Failed to fetch LE eligible tiers';
      },
    }),
  }),
});

export const {
  useCreateTierMutation,
  useGetTiersQuery,
  useGetTierQuery,
  useUpdateTierMutation,
  useDeleteTierMutation,
  useLazyGetTierQuery,
  useLazyGetTiersQuery,
  useGetTierPricingQuery,
  useLazyGetTierPricingQuery,
  useGetLeEligibleTiersQuery,
  useLazyGetLeEligibleTiersQuery,
} = tiersApi;

export const selectTierById = (sub_level: string) => 
  tiersApi.endpoints.getTier.select(sub_level);

export const selectAllTiers = tiersApi.endpoints.getTiers.select();