import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { getIdToken, removeAuthTokens } from "./authStorage";

export const createAuthenticatedBaseQuery = (
  baseUrl: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const idToken = getIdToken();
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      } else {
        console.warn("⚠️ No ID token found when preparing headers");
      }
      return headers;
    },
  });

  return async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    const url = typeof args === "string" ? args : args.url;
    const isUserMeEndpoint =
      url.includes("/users/me") || url.includes("/platform-admin/me");
    if (result.error && isUserMeEndpoint) {
      const status = result.error.status;

      if (status === 401 || status === 403 || status === 404) {
        console.warn(
          `Authentication error ${status} on ${url}. Clearing tokens and redirecting to auth.`
        );
        removeAuthTokens();
        window.location.href = "/auth";
        return result;
      }
    }

    return result;
  };
};
