import Cookies from "js-cookie";

const getEnvironmentInfo = () => {
  const isProduction = window.location.protocol === "https:";
  const hostname = window.location.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  
  return {
    isProduction,
    isLocalhost,
    hostname,
  };
};

export const getAuthCookieOptions = () => {
  const { isProduction } = getEnvironmentInfo();

  return {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    secure: isProduction,
    sameSite: isProduction ? ("None" as const) : ("Lax" as const),
    path: "/",
    ...(isProduction && {
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
  const { isProduction } = getEnvironmentInfo();
  
  const baseOptions = {
    secure: isProduction,
    sameSite: isProduction ? ("None" as const) : ("Lax" as const),
    path: "/",
  };

  const productionOptions = {
    ...baseOptions,
    ...(isProduction && {
      domain: "tp.cyorn.com",
    }),
  };

  Cookies.remove("id_token", productionOptions);
  Cookies.remove("access_token", productionOptions);

  if (isProduction) {
    Cookies.remove("id_token", baseOptions);
    Cookies.remove("access_token", baseOptions);
  }

  Cookies.remove("id_token", { path: "/" });
  Cookies.remove("access_token", { path: "/" });
  
  if (isProduction) {
    Cookies.remove("id_token", { path: "/", domain: ".cyorn.com" });
    Cookies.remove("access_token", { path: "/", domain: ".cyorn.com" });
  }
};

export const getIdToken = (): string | undefined => {
  return Cookies.get("id_token");
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get("access_token");
};

export const hasAuthTokens = (): boolean => {
  const idToken = Cookies.get("id_token");
  const accessToken = Cookies.get("access_token");
  return !!(idToken && accessToken);
};

export const performLogout = (redirectPath: string = "/dashboard") => {
  // Remove all authentication tokens
  removeAuthTokens();
  
  // Clear all local storage and session storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Redirect to the specified path
  window.location.href = redirectPath;
};
