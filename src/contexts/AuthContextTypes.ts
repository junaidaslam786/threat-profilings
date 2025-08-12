import { createContext } from 'react';
import type { UserMeResponse } from '../Redux/slices/userSlice';

export interface AuthContextType {
  user: UserMeResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
