import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface AuthConfig {
  signInUrl: string;
  signUpUrl: string;
  logoutUrl: string;
  instructions: {
    signUp: string;
    signIn: string;
    flow: string;
    fields: {
      signUp: string[];
      signIn: string[];
      custom: string[];
    };
    endpoints: Record<string, string>;
    uiCustomization: {
      note: string;
      signUpFields: string;
      signInFields: string;
      customAttributes: string;
    };
  };
}

export interface ExchangeCodeDto {
  code: string;
  state?: string;
}

export interface ExchangeCodeResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    fullName: string;
    givenName?: string;
    familyName?: string;
    emailVerified: boolean;
  };
  tokens: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  session: {
    loginTime: string;
    expiresAt: string;
  };
}

export interface ValidateTokenDto {
  token: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    [key: string]: unknown;
  };
  expires_at?: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    getAuthConfig: builder.query<AuthConfig, void>({
      query: () => "/auth/config",
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to fetch auth configuration";
      },
    }),

    exchangeCode: builder.mutation<ExchangeCodeResponse, ExchangeCodeDto>({
      query: (body) => ({
        url: "/auth/exchange-code",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to exchange authorization code";
      },
    }),

    validateToken: builder.mutation<ValidateTokenResponse, ValidateTokenDto>({
      query: (body) => ({
        url: "/auth/validate",
        method: "POST",
        body,
      }),
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to validate token";
      },
    }),

    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformErrorResponse: (response: {
        status: number;
        data?: { message?: string };
      }) => {
        return response.data?.message || "Failed to logout";
      },
    }),

    // Direct redirect endpoints (used as fetch calls to trigger redirects)
    redirectToSignIn: builder.mutation<void, void>({
      queryFn: async () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/signin`;
        return { data: undefined };
      },
    }),

    redirectToSignUp: builder.mutation<void, void>({
      queryFn: async () => {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/signup`;
        return { data: undefined };
      },
    }),
  }),
});

export const {
  useGetAuthConfigQuery,
  useExchangeCodeMutation,
  useValidateTokenMutation,
  useLogoutMutation,
  useRedirectToSignInMutation,
  useRedirectToSignUpMutation,
  useLazyGetAuthConfigQuery,
} = authApi;

export const selectAuthConfig = authApi.endpoints.getAuthConfig.select();
