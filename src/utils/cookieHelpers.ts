const ID_TOKEN_KEY = "id_token";
const ACCESS_TOKEN_KEY = "access_token";

const setToStorage = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to set ${key} in localStorage:`, error);
    try {
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
    const value = localStorage.getItem(key);
    if (value) return value;
    return sessionStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to get ${key} from storage:`, error);
    return null;
  }
};

const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from storage:`, error);
  }
};

export const setAuthTokens = (
  idTokenOrTokens: string | { id_token: string; access_token: string },
  accessToken?: string
) => {
  try {
    let idToken: string;
    let accessTokenValue: string;

    if (typeof idTokenOrTokens === "string" && accessToken) {
      idToken = idTokenOrTokens;
      accessTokenValue = accessToken;
    } else if (
      typeof idTokenOrTokens === "object" &&
      idTokenOrTokens.id_token &&
      idTokenOrTokens.access_token
    ) {
      idToken = idTokenOrTokens.id_token;
      accessTokenValue = idTokenOrTokens.access_token;
    } else {
      throw new Error("Invalid parameters provided to setAuthTokens");
    }

    const idTokenSet = setToStorage(ID_TOKEN_KEY, idToken);
    const accessTokenSet = setToStorage(ACCESS_TOKEN_KEY, accessTokenValue);

    if (!idTokenSet || !accessTokenSet) {
      console.error("Failed to set tokens to localStorage", {
        idTokenSet,
        accessTokenSet,
      });
      throw new Error("Failed to save tokens to storage");
    } else {
      cancelTokenRemoval();
    }
  } catch (error) {
    console.error("Failed to set auth tokens:", error);
    throw error;
  }
};

let tokenRemovalScheduled = false;

export const scheduleTokenRemoval = (reason: string) => {
  if (tokenRemovalScheduled) {
    console.warn("Token removal already scheduled, skipping");
    return;
  }

  console.warn(`Scheduling token removal in 5 seconds. Reason: ${reason}`);
  tokenRemovalScheduled = true;

  setTimeout(() => {
    const currentIdToken = getIdToken();
    const currentAccessToken = getAccessToken();

    if (currentIdToken && currentAccessToken) {
      console.warn("Executing scheduled token removal");
      removeAuthTokens();
    } else {
      console.warn("Tokens already removed, skipping scheduled removal");
    }

    tokenRemovalScheduled = false;
  }, 5000);
};

export const cancelTokenRemoval = () => {
  if (tokenRemovalScheduled) {
    tokenRemovalScheduled = false;
  }
};

export const removeAuthTokens = () => {
  try {
    removeFromStorage(ID_TOKEN_KEY);
    removeFromStorage(ACCESS_TOKEN_KEY);
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

export const debugStorage = () => {
  const isProduction = window.location.protocol === "https:";
  const hostname = window.location.hostname;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

  const idToken = getIdToken();
  const accessToken = getAccessToken();

  return {
    isProduction,
    hostname,
    isLocalhost,
    hasTokens: !!(idToken && accessToken),
    usingLocalStorage: true,
  };
};
export const monitorTokenStability = () => {
  const checkInterval = 2000;
  let checkCount = 0;
  const maxChecks = 5;

  const interval = setInterval(() => {
    checkCount++;

    if (checkCount >= maxChecks) {
      clearInterval(interval);
    }
  }, checkInterval);

  return interval;
};

export const testStorageSupport = () => {
  const testKey = "storage_test_" + Date.now();
  const testValue = "test_value_" + Math.random();

  try {
    const success = setToStorage(testKey, testValue);
    const retrieved = getFromStorage(testKey);
    removeFromStorage(testKey);

    const result = {
      supported: success && retrieved === testValue,
      retrieved,
      expected: testValue,
    };

    return result;
  } catch (error) {
    return {
      supported: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
