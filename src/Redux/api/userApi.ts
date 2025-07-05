import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  RegisterUserDto,
  RegisterResponse,
  UserMeResponse,
  ApproveJoinRequestDto,
} from "../slices/userSlice";

interface GenericSuccessResponse {
  message: string;
}

export const userApi = createApi({
  reducerPath: "userApi",
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
    createUser: builder.mutation<RegisterResponse, RegisterUserDto>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),
    approveJoinRequest: builder.mutation<
      GenericSuccessResponse,
      { joinId: string; body: ApproveJoinRequestDto }
    >({
      query: ({ joinId, body }) => ({
        url: `/users/approve-join/${joinId}`,
        method: "POST",
        body,
      }),
    }),
    getProfile: builder.mutation<UserMeResponse, void>({
      query: () => ({
        url: "/users/me",
        method: "POST",
        body: {},
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useApproveJoinRequestMutation,
  useGetProfileMutation,
} = userApi;
