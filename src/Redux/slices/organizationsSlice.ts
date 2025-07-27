import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface OrgApp {
  app_name: string;
  app_profile: string;
  app_url?: string;
  app_additional_details?: string;
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
  apps?: OrgApp[];
  user_ids?: string[];
  report?: unknown;
  assessment?: unknown;
  controls_accepted_implemented?: {
    controls_implemented?: Record<string, { comment: string }>;
    controls_risk_accepted?: Record<string, { comment: string }>;
  };
  // ✅ Added missing fields from backend
  user_type?: 'standard' | 'LE' | 'client';
  le_master?: boolean | string;
  managed_orgs?: string[];
  admins?: string[];
  viewers?: string[];
  runners?: string[];
  user_role?: 'admin' | 'viewer' | 'runner' | 'le_master'; // For frontend display
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

// ✅ Fixed LE Create Org DTO to match backend
export interface LeCreateOrgDto {
  org_name: string;        // ✅ Changed from orgName
  org_domain: string;      // ✅ Changed from orgDomain
  industry: string;        // ✅ Added required field
  org_size: '1-10' | '11-50' | '51-100' | '101-500' | '500+'; // ✅ Added required field
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

// ✅ Fixed Update Org DTO to match backend
export interface UpdateOrgDto {
  orgName?: string;        // ✅ Added missing field
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

// ✅ Added missing response interfaces
export interface CreateOrgResponse {
  clientName: string;
  user_type: 'standard' | 'LE';
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
}

export interface UpdateOrgResponse {
  updated: boolean;
}

export interface DeleteOrgResponse {
  deleted: boolean;
  client_name: string;
}

// ✅ Enhanced organizations state
interface OrganizationsState {
  organizations: ClientDataDto[];
  selectedOrg: ClientDataDto | null;
  leOrganizations: {
    le_master: ClientDataDto | null;
    managed_orgs: ClientDataDto[];
    total_managed: number;
  } | null;
  allOrgs: ClientDataDto[]; // For platform admin
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
    setLeOrganizations: (state, action: PayloadAction<{
      le_master: ClientDataDto | null;
      managed_orgs: ClientDataDto[];
      total_managed: number;
    }>) => {
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
    // ✅ Added organization management actions
    addOrganization: (state, action: PayloadAction<ClientDataDto>) => {
      state.organizations.push(action.payload);
    },
    updateOrganization: (state, action: PayloadAction<ClientDataDto>) => {
      const index = state.organizations.findIndex(
        org => org.client_name === action.payload.client_name
      );
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
    },
    removeOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter(
        org => org.client_name !== action.payload
      );
      state.allOrgs = state.allOrgs.filter(
        org => org.client_name !== action.payload
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