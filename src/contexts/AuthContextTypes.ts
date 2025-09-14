import { createContext } from 'react';
import type { UserMeResponse } from '../Redux/slices/userSlice';

export interface TotpSetupResult {
  secretCode: string;
  otpauthUri: string;
  qrCodeDataUrl: string;
  session?: string;
}

export interface AuthContextType {
  user: UserMeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
  // TOTP methods
  setupTotp: (userEmail?: string, accessToken?: string, session?: string) => Promise<TotpSetupResult>;
  verifyTotp: (code: string, accessToken?: string, session?: string) => Promise<boolean>;
  enableTotpPreference: (accessToken: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
