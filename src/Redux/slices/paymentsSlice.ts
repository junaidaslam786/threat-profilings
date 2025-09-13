import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// This interface is used by the backend service and is not needed on the frontend.
// export interface InvoiceData { ... }

export interface StripeCheckoutDto {
  amount: number;
  client_name: string;
  partner_code?: string;
  tier?: string;
  payment_type: "registration" | "monthly" | "upgrade" | "onetime";
  success_url?: string;
  cancel_url?: string;
}

export interface StripeCheckoutResponse {
  session_id: string;
  checkout_url: string;
}

export interface StripePaymentDto {
  payment_method_id: string;
  amount: number;
  client_name: string;
  partner_code?: string;
  tier?: string;
}

export interface CreatePaymentIntentDto {
  amount: number;
  client_name: string;
  partner_code?: string;
  tier?: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  amount: number;
  discount: number;
  final_amount: number;
  tax_amount: number;
  tax_type: "GST" | "VAT";
  total_amount: number;
}

// Corrected to match the backend's PaymentRecord interface
export interface PaymentRecord {
  payment_id: string;
  client_name: string;
  user_email?: string;
  amount: number;
  discount: number;
  final_amount: number;
  tax_amount: number;
  tax_type: "GST" | "VAT";
  total_amount: number;
  partner_code?: string;
  payment_status: "succeeded" | "failed" | "pending";
  created_at: string;
  session_id?: string;
  payment_type?: string;
  tier?: string;
  stripe_payment_intent_id?: string;
  updated_at?: string;
}

export interface PaymentStatusResponse {
  payment_status: "paid" | "unpaid";
  subscription_level: "L0" | "L1" | "L2" | "L3" | "LE";
  can_run_profiling: boolean;
}

interface PaymentsState {
  currentPaymentIntent: PaymentIntentResponse | null;
  lastPaymentResult: PaymentRecord | null;
  selectedInvoice: PaymentRecord | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  currentPaymentIntent: null,
  lastPaymentResult: null,
  selectedInvoice: null,
  isLoading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setCurrentPaymentIntent: (
      state,
      action: PayloadAction<PaymentIntentResponse | null>
    ) => {
      state.currentPaymentIntent = action.payload;
    },
    setLastPaymentResult: (
      state,
      action: PayloadAction<PaymentRecord | null>
    ) => {
      state.lastPaymentResult = action.payload;
    },
    setSelectedInvoice: (
      state,
      action: PayloadAction<PaymentRecord | null>
    ) => {
      state.selectedInvoice = action.payload;
    },
    clearPaymentState: (state) => {
      state.currentPaymentIntent = null;
      state.lastPaymentResult = null;
      state.selectedInvoice = null;
    },
  },
});

export const {
  setCurrentPaymentIntent,
  setLastPaymentResult,
  setSelectedInvoice,
  clearPaymentState,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;
