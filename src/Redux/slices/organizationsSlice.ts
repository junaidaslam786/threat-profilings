// src/slices/organizationsSlice.ts
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

export type LeCreateOrgDto = CreateOrgDto;

export interface UpdateOrgDto {
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}


interface OrganizationsState {
  organizations: ClientDataDto[];
  selectedOrg: ClientDataDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationsState = {
  organizations: [],
  selectedOrg: null,
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
    setOrgLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrgError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setOrganizations,
  setSelectedOrg,
  setOrgLoading,
  setOrgError,
} = organizationsSlice.actions;

export default organizationsSlice.reducer;
