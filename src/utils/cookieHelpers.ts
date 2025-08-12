import Cookies from "js-cookie";

export const getAuthCookieOptions = () => {
  const isProduction = window.location.protocol === "https:";

  return {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: isProduction,
    sameSite: "None" as const,
    path: "/",
    ...(isProduction && {
      // Uncomment and set your domain if needed
      domain: "tp.cyorn.com",
    }),
  };
};

export const setAuthTokens = (idToken: string, accessToken: string) => {
  const options = getAuthCookieOptions();

  Cookies.set("id_token", idToken, options);
  Cookies.set("access_token", accessToken, options);
};

export const removeAuthTokens = () => {
  const isProduction = window.location.protocol === "https:";
  const options = {
    secure: isProduction,
    sameSite: "None" as const,
    path: "/",
  };

  Cookies.remove("id_token", options);
  Cookies.remove("access_token", options);
};

export const getIdToken = (): string | undefined => {
  return Cookies.get("id_token");
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get("access_token");
};
