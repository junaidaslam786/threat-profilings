// src/slices/tiersSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface TierConfigDto {
  sub_level: string; // "L0", "L1", "L2", "L3", "LE"
  name: string;
  description?: string;
  max_edits: number;
  max_apps: number;
  allowed_tabs: string[]; // ["ISM", "E8", "Detections"]
  run_quota: number;
  price_monthly: number;
  price_onetime_registration: number;
}

interface TiersState {
  tiers: TierConfigDto[];
  selectedTier: TierConfigDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TiersState = {
  tiers: [],
  selectedTier: null,
  isLoading: false,
  error: null,
};

const tiersSlice = createSlice({
  name: "tiers",
  initialState,
  reducers: {
    setTiers: (state, action: PayloadAction<TierConfigDto[]>) => {
      state.tiers = action.payload;
      state.isLoading = false;
    },
    setSelectedTier: (state, action: PayloadAction<TierConfigDto | null>) => {
      state.selectedTier = action.payload;
    },
    setTiersLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTiersError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setTiers, setSelectedTier, setTiersLoading, setTiersError } =
  tiersSlice.actions;

export default tiersSlice.reducer;
