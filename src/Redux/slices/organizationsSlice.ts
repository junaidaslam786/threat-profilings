import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface OrgApp {
  app_name: string;
  app_profile: string;
  app_url?: string;
  app_additional_details?: string;
}

export interface OrgSubscription {
  subscription_level: string;
  run_quota: number;
  run_number: number;
  runs_remaining: number | string;
  max_edits: number;
  max_apps: number;
  progress: number;
  subscription_status: string;
  created_at: string;
}

export interface OrgAppsInfo {
  total_apps: number;
  apps_limit: number;
  apps_remaining: number | string;
  recent_apps: any[];
  has_apps_table: boolean;
}

export interface OrgUsageStats {
  total_runs: number;
  total_scans: number;
  quota_usage_percentage: number;
  apps_usage_percentage: number;
  last_activity: string;
}

export interface OrgAccessPermissions {
  can_create_apps: boolean;
  can_run_scans: boolean;
  can_edit: boolean;
  can_manage_users: boolean;
}

export interface ClientDataDto {
  client_name: string;
  created_at: string;
  email?: string;
  name?: string;
  organization_name: string;
  owner_email?: string;
  partner_code?: string | null;
  sector?: string;
  website_url?: string;
  countries_of_operation?: string[];
  home_url?: string;
  about_us_url?: string;
  additional_details?: string;
  apps?: Array<{
    app_name: string;
    app_profile: string;
    app_url?: string;
    app_additional_details?: string;
  }>;
  user_ids?: string[];
  report?: any;
  assessment?: any;
  controls_accepted_implemented?: {
    controls_implemented?: Record<string, { comment: string }>;
    controls_risk_accepted?: Record<string, { comment: string }>;
  };
  org_domain?: string;
  user_type?: "standard" | "LE" | "client";
  le_master?: boolean | string;
  managed_orgs?: string[];
  admins?: string[];
  viewers?: string[];
  runners?: string[];
  created_by?: string;
  type?: string;
  updated_at?: string;

  user_role?: string;
  is_le_master?: boolean;
  managed_orgs_count?: number;
  subscription?: OrgSubscription | null;
  apps_info?: OrgAppsInfo;
  usage?: OrgUsageStats;
  access?: OrgAccessPermissions;
}

export interface CreateOrgDto {
  orgName: string;
  orgDomain: string;
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

export interface LeCreateOrgDto {
  org_name: string;
  org_domain: string;
  industry: string;
  org_size: "1-10" | "11-50" | "51-100" | "101-500" | "500+";
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

export interface UpdateOrgDto {
  orgName?: string;
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

export interface CreateOrgResponse {
  clientName: string;
  user_type: "standard" | "LE";
  le_master?: boolean;
}

export interface LeCreateOrgResponse {
  clientName: string;
  le_master: string;
}

export interface SwitchOrgResponse {
  switchedTo: string;
  organization_name: string;
  user_role: string;
  org_type: string;
  is_le_master: boolean;
  le_master: string | null;
}

export interface UpdateOrgResponse {
  updated: boolean;
}

export interface DeleteOrgResponse {
  deleted: boolean;
  client_name: string;
}

interface OrganizationsState {
  organizations: ClientDataDto[];
  selectedOrg: ClientDataDto | null;
  leOrganizations: {
    le_master: ClientDataDto | null;
    managed_orgs: ClientDataDto[];
    total_managed: number;
  } | null;
  allOrgs: ClientDataDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrg: null,
  leOrganizations: null,
  allOrgs: [],
  isLoading: false,
  error: null,
};

const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<ClientDataDto[]>) => {
      state.organizations = action.payload;
      state.isLoading = false;
    },
    setSelectedOrg: (state, action: PayloadAction<ClientDataDto | null>) => {
      state.selectedOrg = action.payload;
    },
    setLeOrganizations: (
      state,
      action: PayloadAction<{
        le_master: ClientDataDto | null;
        managed_orgs: ClientDataDto[];
        total_managed: number;
      }>
    ) => {
      state.leOrganizations = action.payload;
      state.isLoading = false;
    },
    setAllOrgs: (state, action: PayloadAction<ClientDataDto[]>) => {
      state.allOrgs = action.payload;
      state.isLoading = false;
    },
    setOrgLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrgError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    addOrganization: (state, action: PayloadAction<ClientDataDto>) => {
      state.organizations.push(action.payload);
    },
    updateOrganization: (state, action: PayloadAction<ClientDataDto>) => {
      const index = state.organizations.findIndex(
        (org) => org.client_name === action.payload.client_name
      );
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
    },
    removeOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter(
        (org) => org.client_name !== action.payload
      );
      state.allOrgs = state.allOrgs.filter(
        (org) => org.client_name !== action.payload
      );
    },
  },
});

export const {
  setOrganizations,
  setSelectedOrg,
  setLeOrganizations,
  setAllOrgs,
  setOrgLoading,
  setOrgError,
  addOrganization,
  updateOrganization,
  removeOrganization,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
