import React, { useEffect, useState } from "react";
import type { UserMeResponse } from "../Redux/slices/userSlice";
import {
  getIdToken,
  performLogout,
  setAuthTokens,
} from "../utils/authStorage";
import { AuthContext, type TotpSetupResult } from "./AuthContextTypes";
import { 
  setupTotpFlow, 
  completeTotpSetup, 
  preferTotp 
} from "../utils/totpHelpers";

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
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
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

  // TOTP methods
  const setupTotp = async (
    userEmail?: string, 
    accessToken?: string, 
    session?: string
  ): Promise<TotpSetupResult> => {
    // Try to get email from user object or fallback to provided email
    const email = userEmail || (user && 'email' in user ? (user as { email: string }).email : null) || 'user@example.com';
    return await setupTotpFlow(email, accessToken, session, 'auth.cyorn.com');
  };

  const verifyTotp = async (
    code: string, 
    accessToken?: string, 
    session?: string
  ): Promise<boolean> => {
    try {
      const result = await completeTotpSetup(code, accessToken, session);
      return result.success;
    } catch (error) {
      console.error('TOTP verification failed:', error);
      return false;
    }
  };

  const enableTotpPreference = async (accessToken: string): Promise<void> => {
    await preferTotp(accessToken);
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
        setupTotp,
        verifyTotp,
        enableTotpPreference,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
