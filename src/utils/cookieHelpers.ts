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

export const setAuthTokens = (
  idTokenOrTokens: string | { id_token: string; access_token: string },
  accessToken?: string
) => {
  try {
    const options = getAuthCookieOptions();

    if (typeof idTokenOrTokens === 'string' && accessToken) {
      // Called with two separate parameters
      Cookies.set("id_token", idTokenOrTokens, options);
      Cookies.set("access_token", accessToken, options);
    } else if (typeof idTokenOrTokens === 'object' && idTokenOrTokens.id_token && idTokenOrTokens.access_token) {
      // Called with an object containing both tokens
      Cookies.set("id_token", idTokenOrTokens.id_token, options);
      Cookies.set("access_token", idTokenOrTokens.access_token, options);
    } else {
      throw new Error('Invalid parameters provided to setAuthTokens');
    }
  } catch (error) {
    console.error("Failed to set auth tokens:", error);
  }
};

export const removeAuthTokens = () => {
  try {
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
  } catch (error) {
    console.error("Failed to remove auth tokens:", error);
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
  removeAuthTokens();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = redirectPath;
};
