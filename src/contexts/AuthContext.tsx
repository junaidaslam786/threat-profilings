import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import type { UserMeResponse } from "../Redux/slices/userSlice";
import {
  getAuthCookieOptions,
  removeAuthTokens,
  getIdToken,
  performLogout,
} from "../utils/cookieHelpers";
import { AuthContext } from "./AuthContextTypes";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async (): Promise<UserMeResponse | null> => {
    const token = getIdToken();
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Only remove tokens for specific authentication errors
        if (response.status === 401 || response.status === 403) {
          console.warn("Authentication failed, removing tokens:", response.status);
          removeAuthTokens();
        } else {
          console.warn("API error, but keeping tokens:", response.status);
        }
        throw new Error("Failed to fetch user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      // Don't automatically remove tokens for network errors
      // Only remove for authentication-specific errors
      if (error instanceof Error && error.message.includes("401")) {
        removeAuthTokens();
      }
      return null;
    }
  };

  const refetchUser = async () => {
    setIsLoading(true);
    try {
      const userData = await fetchUser();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token: string) => {
    const options = getAuthCookieOptions();
    Cookies.set("id_token", token, options);
    refetchUser();
  };

  const logout = () => {
    performLogout("/dashboard");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await fetchUser();
        setUser(userData);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
