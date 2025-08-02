import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
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
      const idToken = Cookies.get("id_token");
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
  }),
});

export const {
  useCreateTierMutation,
  useGetTiersQuery,
  useGetTierQuery,
  useDeleteTierMutation,
  useLazyGetTierQuery,
  useLazyGetTiersQuery,
} = tiersApi;

export const selectTierById = (sub_level: string) => 
  tiersApi.endpoints.getTier.select(sub_level);

export const selectAllTiers = tiersApi.endpoints.getTiers.select();