import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Pump } from "../slices/exampleSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers: Headers, {}: { getState: () => any }) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const pumpApi = createApi({
  reducerPath: "pumpApi",
  baseQuery,
  tagTypes: ["Pump"],
  endpoints: (builder) => ({
    getPumps: builder.query<Pump[], void>({
      query: () => ({
        url: "pumps",
        method: "GET",
      }),
      providesTags: ["Pump"],
    }),
    getPumpById: builder.query<Pump, string>({
      query: (PumpId: string) => ({
        url: `pumps/${PumpId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Pump", id }],
    }),
    createPump: builder.mutation<Pump, Partial<FormData>>({
      query: (formData) => ({
        url: "pumps",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Pump"],
    }),
    updatePump: builder.mutation<
      Pump,
      Partial<{ id: string; formData: FormData }>
    >({
      query: ({ id, ...formData }) => ({
        url: `pumps/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Pump", id }],
    }),
    deletePump: builder.mutation<{ success: boolean }, string>({
      query: (PumpId: string) => ({
        url: `pumps/${PumpId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Pump", id }],
    }),
  }),
});

export const {
  useGetPumpsQuery,
  useGetPumpByIdQuery,
  useCreatePumpMutation,
  useUpdatePumpMutation,
  useDeletePumpMutation,
} = pumpApi;

export default pumpApi;
