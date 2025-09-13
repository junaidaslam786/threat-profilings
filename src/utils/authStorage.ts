// Storage keys for localStorage
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

// Helper functions for localStorage only
const setToStorage = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set ${key} in localStorage:`, error);
    try {
      // Fallback to sessionStorage if localStorage fails
      sessionStorage.setItem(key, value);
      console.warn(`Fallback: Using sessionStorage for ${key}`);
      return true;
    } catch (sessionError) {
      console.error(`Failed to set ${key} in sessionStorage:`, sessionError);
      return false;
    }
  }
};

const getFromStorage = (key: string): string | null => {
  try {
    // Try localStorage first
    const value = localStorage.getItem(key);
    if (value) return value;
    
    // Fallback to sessionStorage
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get ${key} from storage:`, error);
    return null;
  }
};

const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key); // Remove from both to be safe
  } catch (error) {
    console.error(`Failed to remove ${key} from storage:`, error);
  }
};

export const setAuthTokens = (
  idTokenOrTokens: string | { id_token: string; access_token: string },
  accessToken?: string
) => {
  try {
    console.log("Setting tokens to localStorage");

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

    // Set tokens to localStorage
    const idTokenSet = setToStorage(ID_TOKEN_KEY, idToken);
    const accessTokenSet = setToStorage(ACCESS_TOKEN_KEY, accessTokenValue);

    if (!idTokenSet || !accessTokenSet) {
      console.error("Failed to set tokens to localStorage", {
        idTokenSet,
        accessTokenSet
      });
      throw new Error("Failed to save tokens to storage");
    } else {
      console.log("Tokens successfully set in localStorage");
      // Cancel any scheduled token removal since we just set valid tokens
      cancelTokenRemoval();
    }
      
  } catch (error) {
    console.error("Failed to set auth tokens:", error);
    throw error;
  }
};

// Enhanced token management with grace period
let tokenRemovalScheduled = false;

export const scheduleTokenRemoval = (reason: string) => {
  if (tokenRemovalScheduled) {
    console.warn("Token removal already scheduled, skipping");
    return;
  }

  console.warn(`Scheduling token removal in 5 seconds. Reason: ${reason}`);
  tokenRemovalScheduled = true;

  setTimeout(() => {
    // Double-check if tokens should still be removed
    const currentIdToken = getIdToken();
    const currentAccessToken = getAccessToken();
    
    if (currentIdToken && currentAccessToken) {
      console.warn("Executing scheduled token removal");
      removeAuthTokens();
    } else {
      console.warn("Tokens already removed, skipping scheduled removal");
    }
    
    tokenRemovalScheduled = false;
  }, 5000); // 5 second grace period
};

export const cancelTokenRemoval = () => {
  if (tokenRemovalScheduled) {
    console.log("Cancelling scheduled token removal");
    tokenRemovalScheduled = false;
  }
};

export const removeAuthTokens = () => {
  try {
    console.log("Removing tokens from localStorage");
    
    // Remove tokens from localStorage
    removeFromStorage(ID_TOKEN_KEY);
    removeFromStorage(ACCESS_TOKEN_KEY);
    
    console.log("Tokens successfully removed from localStorage");
  } catch (error) {
    console.error("Failed to remove auth tokens:", error);
  }
};

export const getIdToken = (): string | undefined => {
  const token = getFromStorage(ID_TOKEN_KEY);
  return token || undefined;
};

export const getAccessToken = (): string | undefined => {
  const token = getFromStorage(ACCESS_TOKEN_KEY);
  return token || undefined;
};

export const hasAuthTokens = (): boolean => {
  const idToken = getFromStorage(ID_TOKEN_KEY);
  const accessToken = getFromStorage(ACCESS_TOKEN_KEY);
  return !!(idToken && accessToken);
};

export const performLogout = (redirectPath: string = "/dashboard") => {
  removeAuthTokens();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = redirectPath;
};

// Debug function to help troubleshoot storage issues
export const debugCookies = () => {
  const isProduction = window.location.protocol === "https:";
  const hostname = window.location.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  
  const idToken = getIdToken();
  const accessToken = getAccessToken();
  
  // Check localStorage directly
  const storageIdToken = getFromStorage(ID_TOKEN_KEY);
  const storageAccessToken = getFromStorage(ACCESS_TOKEN_KEY);
  
  console.log("Storage Debug Info:", {
    environment: {
      isProduction,
      hostname,
      isLocalhost,
      protocol: window.location.protocol,
      origin: window.location.origin
    },
    tokens: {
      hasIdToken: !!idToken,
      hasAccessToken: !!accessToken,
      idTokenLength: idToken?.length || 0,
      accessTokenLength: accessToken?.length || 0
    },
    storage: {
      localStorage: {
        idToken: !!storageIdToken,
        accessToken: !!storageAccessToken,
        available: typeof(Storage) !== "undefined"
      }
    },
    localStorage: {
      available: typeof(Storage) !== "undefined",
      items: Object.keys(localStorage).filter(key => key.includes('token'))
    }
  });
  
  return {
    isProduction,
    hostname,
    isLocalhost,
    hasTokens: !!(idToken && accessToken),
    usingLocalStorage: true
  };
};

// Monitor token stability to prevent premature removal
export const monitorTokenStability = () => {
  const checkInterval = 2000; // Check every 2 seconds
  let checkCount = 0;
  const maxChecks = 5; // Monitor for 10 seconds total
  
  const interval = setInterval(() => {
    checkCount++;
    const idToken = getIdToken();
    const accessToken = getAccessToken();
    
    if (idToken && accessToken) {
      console.log(`Token stability check ${checkCount}/${maxChecks}: Tokens present`);
    } else {
      console.warn(`Token stability check ${checkCount}/${maxChecks}: Tokens missing!`);
    }
    
    if (checkCount >= maxChecks) {
      clearInterval(interval);
      console.log("Token stability monitoring completed");
    }
  }, checkInterval);
  
  return interval;
};

// Test function to verify localStorage functionality
export const testCookieSupport = () => {
  const testKey = 'storage_test_' + Date.now();
  const testValue = 'test_value_' + Math.random();
  
  try {
    // Test localStorage setting
    const success = setToStorage(testKey, testValue);
    const retrieved = getFromStorage(testKey);
    
    // Clean up
    removeFromStorage(testKey);
    
    const result = {
      supported: success && retrieved === testValue,
      retrieved,
      expected: testValue
    };
    
    console.log("LocalStorage support test:", result);
    return result;
  } catch (error) {
    console.error("Storage test failed:", error);
    return {
      supported: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
