import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TierConfigDto {
  sub_level: string;
  name: string;
  description?: string;
  max_edits: number;
  max_apps: number;
  allowed_tabs: string[];
  run_quota: number;
  price_monthly: number;
  price_onetime_registration: number;
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
