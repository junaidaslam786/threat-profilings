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

// Enhanced cookie options with multiple fallback strategies
export const getAuthCookieOptions = () => {
  const { isProduction, hostname } = getEnvironmentInfo();

  // Use number of days instead of absolute date for better compatibility
  const baseOptions = {
    expires: 1, // 1 day in days (not milliseconds)
    secure: isProduction,
    sameSite: isProduction ? ("None" as const) : ("Lax" as const),
    path: "/",
  };

  // Only set domain if we're in production and on the correct domain
  if (isProduction && (hostname === "tp.cyorn.com" || hostname.endsWith(".cyorn.com"))) {
    return {
      ...baseOptions,
      domain: ".cyorn.com", // Use leading dot for subdomain support
    };
  }

  return baseOptions;
};

// Backup storage for when cookies fail
const BACKUP_STORAGE_PREFIX = 'auth_backup_';

const setBackupStorage = (key: string, value: string) => {
  try {
    // Try localStorage first
    localStorage.setItem(BACKUP_STORAGE_PREFIX + key, value);
  } catch (error) {
    try {
      // Fallback to sessionStorage
      sessionStorage.setItem(BACKUP_STORAGE_PREFIX + key, value);
    } catch (sessionError) {
      console.warn('Both localStorage and sessionStorage failed:', error, sessionError);
    }
  }
};

const getBackupStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(BACKUP_STORAGE_PREFIX + key) || 
           sessionStorage.getItem(BACKUP_STORAGE_PREFIX + key);
  } catch (error) {
    console.warn('Failed to read backup storage:', error);
    return null;
  }
};

const clearBackupStorage = (key: string) => {
  try {
    localStorage.removeItem(BACKUP_STORAGE_PREFIX + key);
    sessionStorage.removeItem(BACKUP_STORAGE_PREFIX + key);
  } catch (error) {
    console.warn('Failed to clear backup storage:', error);
  }
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

    let idToken: string;
    let accessTokenValue: string;

    if (typeof idTokenOrTokens === 'string' && accessToken) {
      idToken = idTokenOrTokens;
      accessTokenValue = accessToken;
    } else if (typeof idTokenOrTokens === 'object' && idTokenOrTokens.id_token && idTokenOrTokens.access_token) {
      idToken = idTokenOrTokens.id_token;
      accessTokenValue = idTokenOrTokens.access_token;
    } else {
      throw new Error('Invalid parameters provided to setAuthTokens');
    }

    // First, set backup storage
    setBackupStorage("id_token", idToken);
    setBackupStorage("access_token", accessTokenValue);

    // Try multiple cookie setting strategies for HTTPS compatibility
    const setWithFallback = (key: string, value: string) => {
      // Strategy 1: Use the calculated options
      Cookies.set(key, value, options);
      
      // Verify if the cookie was set
      let cookieValue = Cookies.get(key);
      if (cookieValue) {
        return true;
      }

      // Strategy 2: Try without domain (for HTTPS issues)
      if ('domain' in options) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { domain: _, ...optionsWithoutDomain } = options as typeof options & { domain?: string };
        Cookies.set(key, value, optionsWithoutDomain);
        cookieValue = Cookies.get(key);
        if (cookieValue) {
          console.warn(`Cookie ${key} set without domain due to HTTPS restrictions`);
          return true;
        }
      }

      // Strategy 3: Try with minimal options for HTTPS
      if (getEnvironmentInfo().isProduction) {
        Cookies.set(key, value, {
          expires: 1,
          secure: true,
          sameSite: "None" as const,
          path: "/",
        });
        cookieValue = Cookies.get(key);
        if (cookieValue) {
          console.warn(`Cookie ${key} set with minimal HTTPS options`);
          return true;
        }
      }

      // Strategy 4: Try basic options as last resort
      Cookies.set(key, value, {
        expires: 1,
        path: "/",
      });
      cookieValue = Cookies.get(key);
      return !!cookieValue;
    };

    const idTokenSet = setWithFallback("id_token", idToken);
    const accessTokenSet = setWithFallback("access_token", accessTokenValue);

    if (!idTokenSet || !accessTokenSet) {
      console.error("Failed to set cookies - they were not saved properly", {
        idTokenSet,
        accessTokenSet,
        options,
        environment: getEnvironmentInfo()
      });
      
      // Don't throw error - we have backup storage
      console.warn("Cookies failed to set, but tokens are saved in backup storage");
    } else {
      console.log("Tokens successfully set in cookies");
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

    // Clear backup storage as well
    clearBackupStorage("id_token");
    clearBackupStorage("access_token");
    
  } catch (error) {
    console.error("Failed to remove auth tokens:", error);
  }
};

export const getIdToken = (): string | undefined => {
  const cookieToken = Cookies.get("id_token");
  if (cookieToken) {
    return cookieToken;
  }
  
  // Fallback to backup storage
  const backupToken = getBackupStorage("id_token");
  if (backupToken) {
    console.warn("Using backup storage for id_token - cookies may have failed");
    return backupToken;
  }
  
  return undefined;
};

export const getAccessToken = (): string | undefined => {
  const cookieToken = Cookies.get("access_token");
  if (cookieToken) {
    return cookieToken;
  }
  
  // Fallback to backup storage
  const backupToken = getBackupStorage("access_token");
  if (backupToken) {
    console.warn("Using backup storage for access_token - cookies may have failed");
    return backupToken;
  }
  
  return undefined;
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
  
  // Check both cookie and backup storage
  const cookieIdToken = Cookies.get("id_token");
  const cookieAccessToken = Cookies.get("access_token");
  const backupIdToken = getBackupStorage("id_token");
  const backupAccessToken = getBackupStorage("access_token");
  
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
    storage: {
      cookies: {
        idToken: !!cookieIdToken,
        accessToken: !!cookieAccessToken
      },
      backup: {
        idToken: !!backupIdToken,
        accessToken: !!backupAccessToken
      }
    },
    allCookies: document.cookie,
    localStorage: {
      available: typeof(Storage) !== "undefined",
      items: Object.keys(localStorage).filter(key => key.startsWith(BACKUP_STORAGE_PREFIX))
    }
  });
  
  return {
    isProduction,
    hostname,
    isLocalhost,
    options,
    hasTokens: !!(idToken && accessToken),
    usingBackup: !!backupIdToken || !!backupAccessToken
  };
};

// Test function to verify cookie functionality
export const testCookieSupport = () => {
  const testKey = 'cookie_test_' + Date.now();
  const testValue = 'test_value_' + Math.random();
  
  try {
    const options = getAuthCookieOptions();
    
    // Test cookie setting
    Cookies.set(testKey, testValue, options);
    const retrieved = Cookies.get(testKey);
    
    // Clean up
    Cookies.remove(testKey, options);
    Cookies.remove(testKey, { path: "/" });
    
    const result = {
      supported: retrieved === testValue,
      options,
      retrieved,
      expected: testValue
    };
    
    console.log("Cookie support test:", result);
    return result;
  } catch (error) {
    console.error("Cookie test failed:", error);
    return {
      supported: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
