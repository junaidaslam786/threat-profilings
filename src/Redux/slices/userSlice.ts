import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "admin" | "viewer" | "runner";

export const UserRegistrationType = {
  STANDARD: "standard",
  LE_ADMIN: "LE",
  PLATFORM_ADMIN: "platform_admin",
  JOIN_EXISTING: "join_existing",
} as const;

export type UserRegistrationType = typeof UserRegistrationType[keyof typeof UserRegistrationType];

export const OrgSize = {
  SMALL: "1-10",
  MEDIUM: "11-50", 
  LARGE: "51-100",
  XLARGE: "101-500",
  ENTERPRISE: "500+",
} as const;

export type OrgSize = typeof OrgSize[keyof typeof OrgSize];

export interface RegisterUserDto {
  email: string;
  name: string;
  registration_type?: UserRegistrationType;
  partnerCode?: string;
  
  // Standard organization fields
  org_name?: string;
  org_domain?: string;
  industry?: string;
  org_size?: OrgSize;
  
  // LE admin specific fields
  sector?: string;
  website_url?: string;
  countries_of_operation?: string[];
  home_url?: string;
  about_us_url?: string;
  additional_details?: string;
  
  // Platform admin specific fields
  platform_admin_level?: "super" | "admin" | "read-only";
  admin_justification?: string;
  
  // Join existing organization fields
  target_org_domain?: string;
  join_message?: string;
  requested_role?: "viewer" | "admin";
  
  // Legacy support
  user_type?: string;
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
  user_info: {
    email: string;
    name: string;
    user_id: string;
    client_name: string;
    user_type: "standard" | "LE";
    status: "active" | "pending_approval";
    created_at: string;
  };
  roles_and_permissions: {
    primary_role: "admin" | "viewer" | "runner";
    all_roles: string[];
    permissions: {
      can_create_orgs: boolean;
      can_manage_users: boolean;
      can_run_profiling: boolean;
      can_edit_org_data: boolean;
      can_view_billing: boolean;
      can_manage_subscriptions: boolean;
      can_access_platform_admin: boolean;
      can_manage_partners: boolean;
      can_create_le_orgs: boolean;
      is_multi_org_controller: boolean;
    };
    access_levels: {
      platform_admin: string | null;
      organizations: Record<string, {
        role: string;
        organization_name: string;
        permissions: string[];
      }>;
    };
  };
  accessible_organizations: Array<{
    client_name: string;
    organization_name: string;
    role: string;
    access_type: string;
  }>;
  subscriptions: Array<{
    client_name: string;
    created_at: string;
    run_quota: number;
    subscription_level: string;
    progress: number;
  }>;
  feature_access: {
    platform_admin_panel: boolean;
    super_admin_functions: boolean;
    organization_creation: boolean;
    le_organization_creation: boolean;
    user_management: boolean;
    billing_access: boolean;
    threat_profiling: boolean;
    data_export: boolean;
    partner_management: boolean;
    organization_switching: boolean;
  };
  ui_config: {
    navigation: {
      show_admin_menu: boolean;
      show_platform_admin_menu: boolean;
      show_le_controls: boolean;
      show_billing_section: boolean;
    };
    buttons: {
      create_organization: boolean;
      invite_users: boolean;
      run_profiling: boolean;
      manage_subscriptions: boolean;
      switch_organizations: boolean;
    };
    sections: {
      user_management: boolean;
      billing_dashboard: boolean;
      platform_statistics: boolean;
      partner_codes: boolean;
    };
  };
  session_info: {
    login_method: string;
  };
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
