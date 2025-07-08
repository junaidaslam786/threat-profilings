// src/api/tiersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type { TierConfigDto } from "../slices/tiersSlice";

interface GenericSuccessResponse {
  message: string;
}

export const tiersApi = createApi({
  reducerPath: "tiersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = Cookies.get("id_token");
      if (idToken) headers.set("Authorization", `Bearer ${idToken}`);
      return headers;
    },
  }),
  tagTypes: ["Tier"],
  endpoints: (builder) => ({
    // POST /tiers - create a new tier config
    createTier: builder.mutation<TierConfigDto, TierConfigDto>({
      query: (body) => ({
        url: "/tiers",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tier", id: "LIST" }],
    }),
    // GET /tiers - get all tiers
    getTiers: builder.query<TierConfigDto[], void>({
      query: () => "/tiers",
      providesTags: [{ type: "Tier", id: "LIST" }],
    }),
    // GET /tiers/:sub_level - get a specific tier by sub_level
    getTier: builder.query<TierConfigDto, string>({
      query: (sub_level) => `/tiers/${sub_level}`,
      providesTags: (_res, _err, sub_level) => [
        { type: "Tier", id: sub_level },
      ],
    }),
    // DELETE /tiers/:sub_level - delete a specific tier by sub_level
    deleteTier: builder.mutation<GenericSuccessResponse, string>({
      query: (sub_level) => ({
        url: `/tiers/${sub_level}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tier", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateTierMutation,
  useGetTiersQuery,
  useGetTierQuery,
  useDeleteTierMutation,
} = tiersApi;
