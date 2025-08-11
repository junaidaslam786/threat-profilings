import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type SubscriptionLevel = "L0" | "L1" | "L2" | "L3" | "LE";
export type PaymentStatus = "paid" | "unpaid";

export interface BillingAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface BillingInfo {
  company_name?: string;
  billing_email?: string;
  tax_id?: string;
  billing_address?: BillingAddress;
}

export interface CustomLimits {
  max_edits?: number;
  max_apps?: number;
  run_quota?: number;
  max_users?: number;
}

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

export interface BaseSubscription {
  client_name: string;
  subscription_level: SubscriptionLevel;
  run_number: number;
  max_edits: number;
  max_apps: number;
  max_users: number;
  features_access: string[];
  compliance_frameworks: string[];
  run_quota: number;
  storage_limit_gb: number;
  progress: number;
  payment_status: string;
  payment_method: string;
  partner_code?: string;
  auto_renewal: boolean;
  billing_info?: BillingInfo;
  currency: string;
  pricing_info?: Record<string, unknown>;
  features: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  apps_count: number;
  edits_count: number;
  users_count: number;
  storage_used_gb: number;
  billing_cycle_start: string;
  next_billing_date: string;
  grace_period_days: number;
  is_suspended: boolean;
  suspension_reason?: string;
  suspended_at?: string;
  reactivated_at?: string;
}

export interface EnhancedSubscription extends BaseSubscription {
  runs_remaining: number | string;
  apps_remaining: number | string;
  edits_remaining: number | string;
  users_remaining: number | string;
  storage_remaining_gb: number | string;
  is_over_quota: boolean;
  days_until_billing: number;
  subscription_status: string;
}

export interface UpdateSubscriptionDto {
  tier?: SubscriptionLevel;
  run_number?: number;
  payment_status?: "paid" | "unpaid" | "overdue" | "cancelled" | "pending";
  auto_renewal?: boolean;
  grace_period_days?: number;
  custom_limits?: CustomLimits;
  suspension_reason?: string;
  is_suspended?: boolean;
  subscription_level?: "L0" | "L1" | "L2" | "L3" | "LE";
  max_edits?: number;
  max_apps?: number;
  max_users?: number;
  run_quota?: number;
  storage_limit_gb?: number;
  features_access?: string[];
  compliance_frameworks?: string[];
  features?: Record<string, unknown>;
  updated_at?: string;
}

export interface CreateSubscriptionDto {
  client_name: string;
  tier: "L0" | "L1" | "L2" | "L3" | "LE";
  initial_run_number?: number;
  payment_method?: "stripe" | "invoice" | "partner_code";
  partner_code?: string;
  auto_renewal?: boolean;
  billing_info?: BillingInfo;
  currency?: "USD" | "AUD" | "EUR" | "GBP";
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