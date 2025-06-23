import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import type {
  RegisterUserDto,
  RegisterResponse,
} from "../slices/userOrganizationSlice";

export const userOrganizationApi = createApi({
  reducerPath: "userOrganizationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const idToken = Cookies.get("token");

      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterResponse, RegisterUserDto>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = userOrganizationApi;
