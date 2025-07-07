// src/slices/orgSubscriptionSlice.ts

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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
  orgName: string;
  orgDomain: string;
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

export interface UpdateOrgDto {
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
}

export interface CreateSubscriptionDto {
  client_name: string;
  tier: "L0" | "L1" | "L2" | "L3" | "LE";
}

export interface UpdateSubscriptionDto {
  tier?: "L0" | "L1" | "L2" | "L3" | "LE";
  run_number?: number;
}
export interface GenericSuccessResponse {
  message: string;
}

export interface OrgDetails {
  clientName: string;
  orgName: string;
  orgDomain: string;
  sector?: string;
  websiteUrl?: string;
  countriesOfOperation?: string[];
  homeUrl?: string;
  aboutUsUrl?: string;
  additionalDetails?: string;
  admins?: string[];
  viewers?: string[];
  subscriptionTier?: "L0" | "L1" | "L2" | "L3" | "LE";
  run_number?: number;
  status?: string;
}


export interface SubscriptionDetails {
  client_name: string;
  tier: "L0" | "L1" | "L2" | "L3" | "LE";
  run_number: number;
  max_edits: number;
  max_apps: number;
  compliance_tabs: string[];
  detection_access: string;
  profiling_runs_allowed: number | "Unlimited";
  progress?: number;
}

export interface OrgSubscriptionState {
  organizations: OrgDetails[];
  selectedOrganization: OrgDetails | null;
  currentSubscription: SubscriptionDetails | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrgSubscriptionState = {
  organizations: [],
  selectedOrganization: null,
  currentSubscription: null,
  isLoading: false,
  error: null,
};

export const orgSubscriptionSlice = createSlice({
  name: "orgSubscription",
  initialState,
  reducers: {
    setOrganizations: (state, action: PayloadAction<OrgDetails[]>) => {
      state.organizations = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedOrganization: (
      state,
      action: PayloadAction<OrgDetails | null>
    ) => {
      state.selectedOrganization = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentSubscription: (
      state,
      action: PayloadAction<SubscriptionDetails | null>
    ) => {
      state.currentSubscription = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setOrgSubLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOrgSubError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addOrganization: (state, action: PayloadAction<OrgDetails>) => {
      state.organizations.push(action.payload);
    },
    updateOrganizationInState: (state, action: PayloadAction<OrgDetails>) => {
      const index = state.organizations.findIndex(
        (org) => org.clientName === action.payload.clientName
      );
      if (index !== -1) {
        state.organizations[index] = action.payload;
      }
      if (
        state.selectedOrganization?.clientName === action.payload.clientName
      ) {
        state.selectedOrganization = action.payload;
      }
    },
  },
});

export const {
  setOrganizations,
  setSelectedOrganization,
  setCurrentSubscription,
  setOrgSubLoading,
  setOrgSubError,
  addOrganization,
  updateOrganizationInState,
} = orgSubscriptionSlice.actions;

export default orgSubscriptionSlice.reducer;
