import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  PartnerCode,
  CreatePartnerCodeDto,
  UpdatePartnerCodeDto,
  CreatePartnerCodeResponse,
  PartnerStats,
  GenericSuccessResponse,
} from "../slices/partnersSlice";

export const partnersApi = createApi({
  reducerPath: "partnersApi",
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
  tagTypes: ["PartnerCode", "PartnerStats"],
  endpoints: (builder) => ({
    createPartnerCode: builder.mutation<CreatePartnerCodeResponse, CreatePartnerCodeDto>({
      query: (body) => ({
        url: "/partners/codes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "PartnerCode", id: "LIST" }],
    }),

    getAllPartnerCodes: builder.query<PartnerCode[], void>({
      query: () => "/partners/codes",
      providesTags: [{ type: "PartnerCode", id: "LIST" }],
    }),

    validatePartnerCode: builder.query<PartnerCode, string>({
      query: (code) => `/partners/codes/${encodeURIComponent(code)}`,
      providesTags: (_result, _error, code) => [
        { type: "PartnerCode", id: code }
      ],
    }),

    updatePartnerCode: builder.mutation<GenericSuccessResponse, {
      code: string;
      body: UpdatePartnerCodeDto;
    }>({
      query: ({ code, body }) => ({
        url: `/partners/codes/${encodeURIComponent(code)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { code }) => [
        { type: "PartnerCode", id: "LIST" },
        { type: "PartnerCode", id: code }
      ],
    }),

    deletePartnerCode: builder.mutation<GenericSuccessResponse, string>({
      query: (code) => ({
        url: `/partners/codes/${encodeURIComponent(code)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, code) => [
        { type: "PartnerCode", id: "LIST" },
        { type: "PartnerCode", id: code }
      ],
    }),

    getPartnerStats: builder.query<PartnerStats, string>({
      query: (code) => `/partners/codes/${encodeURIComponent(code)}/stats`,
      providesTags: (_result, _error, code) => [
        { type: "PartnerStats", id: code }
      ],
    }),
  }),
});

export const {
  useCreatePartnerCodeMutation,
  useGetAllPartnerCodesQuery,
  useValidatePartnerCodeQuery,
  useLazyValidatePartnerCodeQuery,
  useUpdatePartnerCodeMutation,
  useDeletePartnerCodeMutation,
  useGetPartnerStatsQuery,
  useLazyGetPartnerStatsQuery,
} = partnersApi;