import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SubscriptionLevel = "L0" | "L1" | "L2" | "L3" | "LE";
export type PaymentStatus = "paid" | "unpaid";

export interface ClientSubscriptionDto {
  client_name: string;
  created_at: string;
  progress: number;
  run_quota: number;
  subscription_level: SubscriptionLevel;
  run_number?: number;
  max_edits?: number;
  max_apps?: number;
  features_access?: string[];
  payment_status?: PaymentStatus;
  invoice_s3_key?: string | null;
}

export interface CreateSubscriptionDto {
  client_name: string;
  tier: SubscriptionLevel;
}

export interface UpdateSubscriptionDto {
  tier?: SubscriptionLevel;
  run_number?: number;
}

interface SubscriptionsState {
  selectedSubscription: ClientSubscriptionDto | null;
}

const initialState: SubscriptionsState = {
  selectedSubscription: null,
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    setSelectedSubscription: (
      state,
      action: PayloadAction<ClientSubscriptionDto | null>
    ) => {
      state.selectedSubscription = action.payload;
    },
    clearSelectedSubscription: (state) => {
      state.selectedSubscription = null;
    },
  },
});

export const { setSelectedSubscription, clearSelectedSubscription } =
  subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
