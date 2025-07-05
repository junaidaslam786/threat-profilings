import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
export interface RegisterUserDto {
  email: string;
  name: string;
  partnerCode?: string;
}

export interface ApproveJoinRequestDto {
  role: "Admin" | "Viewer";
}
export interface RegisterResponse {
  message: string;
  client_name: string;
}
export interface UserMeResponse {
  email: string;
  name: string;
  client_name?: string;
  role: "Admin" | "Viewer" | "LE_Admin";
  status: string;
  partner_code?: string;
  created_at: string;
}
export interface AuthState {
  accessToken: string | null;
  user: UserMeResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: Cookies.get("userAccessToken") || null,
  user: null,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isLoading = false;
      state.error = null;
      Cookies.set("userAccessToken", action.payload, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    },
    setUserDetails: (state, action: PayloadAction<UserMeResponse | null>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    logoutUser: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isLoading = false;
      state.error = null;
      Cookies.remove("userAccessToken");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUserAccessToken,
  setUserDetails,
  logoutUser,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
