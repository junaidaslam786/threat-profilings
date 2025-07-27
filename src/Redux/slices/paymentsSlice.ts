// src/slices/paymentsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// DTOs matching backend
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
}

// Response interfaces
export interface PaymentIntentResponse {
  client_secret: string;
  amount: number;
  discount: number;
  final_amount: number;
  tax_amount: number;
  tax_type: 'GST' | 'VAT';
  total_amount: number;
}

export interface ProcessPaymentResponse {
  success: boolean;
  payment_id: string;
  invoice_number: string;
}

export interface PaymentStatusResponse {
  payment_status: 'paid' | 'unpaid';
  subscription_level: 'L0' | 'L1' | 'L2' | 'L3' | 'LE';
  can_run_profiling: boolean;
}

export interface InvoiceRecord {
  payment_id: string;
  client_name: string;
  user_email?: string;
  amount: number;
  discount: number;
  final_amount: number;
  tax_amount: number;
  tax_type: 'GST' | 'VAT';
  total_amount: number;
  partner_code?: string;
  payment_status: 'succeeded' | 'failed' | 'pending';
  created_at: string;
}

// Simplified state - let RTK Query handle most data management
interface PaymentsState {
  currentPaymentIntent: PaymentIntentResponse | null;
  lastPaymentResult: ProcessPaymentResponse | null;
  selectedInvoice: InvoiceRecord | null;
}

const initialState: PaymentsState = {
  currentPaymentIntent: null,
  lastPaymentResult: null,
  selectedInvoice: null,
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setCurrentPaymentIntent: (state, action: PayloadAction<PaymentIntentResponse | null>) => {
      state.currentPaymentIntent = action.payload;
    },
    setLastPaymentResult: (state, action: PayloadAction<ProcessPaymentResponse | null>) => {
      state.lastPaymentResult = action.payload;
    },
    setSelectedInvoice: (state, action: PayloadAction<InvoiceRecord | null>) => {
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