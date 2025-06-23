import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Renamed from CreateUserDto
export interface RegisterUserDto {
  email: string;
  name: string;
}

export interface RegisterResponse {
  message: string;
  client_name: string;
}

export interface AuthState {
  accessToken: string | null;
  user: {
    email: string;
    name: string;
    organization_name?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: Cookies.get("userOrganizationAccessToken") || null,
  user: null,
  isLoading: false,
  error: null,
};

export const userOrganizationSlice = createSlice({
  name: "userOrganization",
  initialState,
  reducers: {
    setUserOrganizationAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isLoading = false;
      state.error = null;
      // Updated cookie key
      Cookies.set("userOrganizationAccessToken", action.payload, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });
    },
    setUserOrganizationDetails: (
      state,
      action: PayloadAction<AuthState["user"]>
    ) => {
      state.user = action.payload;
    },
    logoutUserOrganization: (state) => {
      // Renamed logout
      state.accessToken = null;
      state.user = null;
      state.isLoading = false;
      state.error = null;
      // Updated cookie key
      Cookies.remove("userOrganizationAccessToken");
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
  setUserOrganizationAccessToken,
  setUserOrganizationDetails,
  logoutUserOrganization,
  setLoading,
  setError,
} = userOrganizationSlice.actions;

export default userOrganizationSlice.reducer;
