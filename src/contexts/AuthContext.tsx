import React, { useEffect, useState } from "react";
import type { UserMeResponse } from "../Redux/slices/userSlice";
import {
  getIdToken,
  performLogout,
  setAuthTokens,
} from "../utils/authStorage";
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
        // Be more conservative about token removal in production
        // Don't remove tokens immediately - let explicit logout handle this
        console.warn(`User fetch failed with status ${response.status}, but preserving tokens`);
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      // Don't automatically remove tokens - let the application handle this explicitly
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
    setAuthTokens(token, token); // Set both tokens (assuming access token is same as id token)
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
