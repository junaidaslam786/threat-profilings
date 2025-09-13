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
  const { isProduction, hostname } = getEnvironmentInfo();

  // Use number of days instead of absolute date for better compatibility
  const options = {
    expires: 1, // 1 day in days (not milliseconds)
    secure: isProduction,
    sameSite: isProduction ? ("None" as const) : ("Lax" as const),
    path: "/",
  };

  // Only set domain if we're in production and on the correct domain
  if (isProduction && (hostname === "tp.cyorn.com" || hostname.endsWith(".cyorn.com"))) {
    return {
      ...options,
      domain: ".cyorn.com", // Use leading dot for subdomain support
    };
  }

  return options;
};

export const setAuthTokens = (
  idTokenOrTokens: string | { id_token: string; access_token: string },
  accessToken?: string
) => {
  try {
    const options = getAuthCookieOptions();
    
    // Log cookie options for debugging in development
    if (!getEnvironmentInfo().isProduction) {
      console.log("Setting cookies with options:", options);
    }

    if (typeof idTokenOrTokens === 'string' && accessToken) {
      // Called with two separate parameters
      Cookies.set("id_token", idTokenOrTokens, options);
      Cookies.set("access_token", accessToken, options);
      
      // Verify cookies were set
      const setIdToken = Cookies.get("id_token");
      const setAccessToken = Cookies.get("access_token");
      
      if (!setIdToken || !setAccessToken) {
        console.error("Failed to set cookies - they were not saved properly", {
          idTokenSet: !!setIdToken,
          accessTokenSet: !!setAccessToken,
          options
        });
      }
      
    } else if (typeof idTokenOrTokens === 'object' && idTokenOrTokens.id_token && idTokenOrTokens.access_token) {
      // Called with an object containing both tokens
      Cookies.set("id_token", idTokenOrTokens.id_token, options);
      Cookies.set("access_token", idTokenOrTokens.access_token, options);
      
      // Verify cookies were set
      const setIdToken = Cookies.get("id_token");
      const setAccessToken = Cookies.get("access_token");
      
      if (!setIdToken || !setAccessToken) {
        console.error("Failed to set cookies - they were not saved properly", {
          idTokenSet: !!setIdToken,
          accessTokenSet: !!setAccessToken,
          options
        });
      }
      
    } else {
      throw new Error('Invalid parameters provided to setAuthTokens');
    }
  } catch (error) {
    console.error("Failed to set auth tokens:", error);
    throw error; // Re-throw to ensure calling code knows about the failure
  }
};

export const removeAuthTokens = () => {
  try {
    const { isProduction, hostname } = getEnvironmentInfo();
    
    // Create the same options used when setting cookies
    const currentOptions = getAuthCookieOptions();
    
    // Remove tokens with the current options
    Cookies.remove("id_token", currentOptions);
    Cookies.remove("access_token", currentOptions);

    // Also try removing with basic options (fallback)
    const fallbackOptions = {
      secure: isProduction,
      sameSite: isProduction ? ("None" as const) : ("Lax" as const),
      path: "/",
    };
    
    Cookies.remove("id_token", fallbackOptions);
    Cookies.remove("access_token", fallbackOptions);

    // Remove with minimal options as final fallback
    Cookies.remove("id_token", { path: "/" });
    Cookies.remove("access_token", { path: "/" });
    
    // If we're in production, also try removing with explicit domain variants
    if (isProduction && (hostname === "tp.cyorn.com" || hostname.endsWith(".cyorn.com"))) {
      Cookies.remove("id_token", { path: "/", domain: ".cyorn.com", secure: true, sameSite: "None" as const });
      Cookies.remove("access_token", { path: "/", domain: ".cyorn.com", secure: true, sameSite: "None" as const });
      Cookies.remove("id_token", { path: "/", domain: "tp.cyorn.com", secure: true, sameSite: "None" as const });
      Cookies.remove("access_token", { path: "/", domain: "tp.cyorn.com", secure: true, sameSite: "None" as const });
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

// Debug function to help troubleshoot cookie issues
export const debugCookies = () => {
  const { isProduction, hostname, isLocalhost } = getEnvironmentInfo();
  const options = getAuthCookieOptions();
  const idToken = getIdToken();
  const accessToken = getAccessToken();
  
  console.log("Cookie Debug Info:", {
    environment: {
      isProduction,
      hostname,
      isLocalhost,
      protocol: window.location.protocol,
      origin: window.location.origin
    },
    cookieOptions: options,
    tokens: {
      hasIdToken: !!idToken,
      hasAccessToken: !!accessToken,
      idTokenLength: idToken?.length || 0,
      accessTokenLength: accessToken?.length || 0
    },
    allCookies: document.cookie
  });
  
  return {
    isProduction,
    hostname,
    isLocalhost,
    options,
    hasTokens: !!(idToken && accessToken)
  };
};
