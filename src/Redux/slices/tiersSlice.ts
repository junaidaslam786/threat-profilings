import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TierConfigDto {
  sub_level: string;
  name: string;
  description?: string;
  max_edits: number;
  max_apps: number;
  allowed_tabs?: string[];
  run_quota: number;
  price_monthly: number;
  price_onetime_registration: number;
  features?: {
    threat_detection?: boolean;
    compliance_reports?: boolean;
    api_access?: boolean;
    custom_branding?: boolean;
    priority_support?: boolean;
    sso_integration?: boolean;
    audit_logs?: boolean;
    data_export?: boolean;
    is_active?: boolean;
    promotion_code?: string;
    le_eligible?: boolean;
    max_users?: number;
    storage_limit_gb?: number;
    compliance_frameworks?: string[];
    discount_percent?: number;
  };
  compliance_frameworks?: string[];
  is_active?: boolean;
  discount_percent?: number;
  promotion_code?: string;
  max_users?: number;
  storage_limit_gb?: number;
  le_eligible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TierCreateResponse {
  saved: boolean;
  sub_level: string;
}

export interface TierDeleteResponse {
  deleted: boolean;
  sub_level: string;
}

interface TiersState {
  selectedTier: TierConfigDto | null;
}

const initialState: TiersState = {
  selectedTier: null,
};

const tiersSlice = createSlice({
  name: "tiers",
  initialState,
  reducers: {
    setSelectedTier: (state, action: PayloadAction<TierConfigDto | null>) => {
      state.selectedTier = action.payload;
    },
    clearSelectedTier: (state) => {
      state.selectedTier = null;
    },
  },
});

export const { setSelectedTier, clearSelectedTier } = tiersSlice.actions;

export default tiersSlice.reducer;
