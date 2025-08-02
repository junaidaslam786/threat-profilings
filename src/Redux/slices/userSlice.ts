import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "viewer" | "runner";

export interface RegisterUserDto {
  email: string;
  name: string;
  org_name: string;
  org_domain: string;
  industry: string;
  org_size: "1-10" | "11-50" | "51-100" | "101-500" | "500+";
  user_type?: "standard" | "LE";
  partnerCode?: string;
}

export interface JoinOrgRequestDto {
  orgDomain: string;
  message?: string;
}

export interface ApproveJoinDto {
  role: UserRole;
}

export interface InviteUserDto {
  email: string;
  name: string;
  orgName: string;
}

export interface UpdateUserRoleDto {
  role: UserRole;
}

export interface UserMeResponse {
  email: string;
  name: string;
  client_name: string;
  partner_code?: string | null;
  role: UserRole;
  status: "active" | "pending_approval";
  created_at: string;
}

export interface PendingJoinDto {
  join_id: string;
  client_name: string;
  email: string;
  name: string;
  created_at: string;
  status: "pending" | "approved" | "rejected";
  message?: string;
}

export interface AdminOrgResponse {
  client_name: string;
  organization_name: string;
  created_at: string;
  owner_email: string;
  admins: string[];
  viewers: string[];
}

interface UserState {
  accessToken: string | null;
  user: UserMeResponse | null;
  isLoading: boolean;
  error: string | null;
  pendingJoinRequests: PendingJoinDto[];
  users: UserMeResponse[];
  adminOrganizations: AdminOrgResponse[];
}

const initialState: UserState = {
  accessToken: null,
  user: null,
  isLoading: false,
  error: null,
  pendingJoinRequests: [],
  users: [],
  adminOrganizations: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isLoading = false;
      state.error = null;
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
      state.adminOrganizations = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPendingJoinRequests: (
      state,
      action: PayloadAction<PendingJoinDto[]>
    ) => {
      state.pendingJoinRequests = action.payload;
    },
    setUsers: (state, action: PayloadAction<UserMeResponse[]>) => {
      state.users = action.payload;
    },
    setAdminOrganizations: (
      state,
      action: PayloadAction<AdminOrgResponse[]>
    ) => {
      state.adminOrganizations = action.payload;
    },
  },
});

export const {
  setUserAccessToken,
  setUserDetails,
  logoutUser,
  setLoading,
  setError,
  setPendingJoinRequests,
  setUsers,
  setAdminOrganizations,
} = userSlice.actions;

export default userSlice.reducer;
