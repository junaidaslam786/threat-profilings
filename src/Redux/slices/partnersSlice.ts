// ================================
// src/slices/partnersSlice.ts
// ================================
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ✅ Partner Code interfaces matching backend DTOs
export interface CreatePartnerCodeDto {
  partner_code: string;
  discount_percent: number;
  commission_percent: number;
  partner_email: string;
  usage_limit?: number;
}

export interface UpdatePartnerCodeDto {
  discount_percent?: number;
  commission_percent?: number;
  partner_email?: string;
  usage_limit?: number;
}

// ✅ Partner Code data structure (matches backend service response)
export interface PartnerCode {
  partner_code: string;        // Primary key
  discount_percent: number;
  commission_percent: number;
  partner_email: string;
  usage_limit?: number;
  usage_count: number;         // Added by backend
  created_at: string;          // Added by backend
  status: 'active' | 'inactive'; // Added by backend
}

// ✅ Validation response structure
export interface PartnerCodeValidation {
  partner_code: string;
  discount_percent: number;
  commission_percent: number;
  partner_email: string;
  usage_limit?: number;
  usage_count: number;
  created_at: string;
  status: 'active' | 'inactive';
  valid: boolean;              // Frontend computed
}

// ✅ Partner stats structure (from backend service method)
export interface PartnerStats {
  code: string;
  usage_count: number;
  usage_limit?: number;
  total_discount_given: number;
  commission_earned: number;
}

// ✅ API Response interfaces
export interface CreatePartnerCodeResponse {
  partner_code: string;
}

export interface GenericSuccessResponse {
  message?: string;
  deleted?: boolean;
  updated?: boolean;
}

interface PartnersState {
  partnerCodes: PartnerCode[];
  selectedPartnerCode: PartnerCode | null;
  partnerStats: PartnerStats | null;
  validationResult: PartnerCodeValidation | null;
  isLoading: boolean;
  error: string | null;
  // UI state
  isCreatingCode: boolean;
  isValidatingCode: boolean;
  isUpdatingCode: boolean;
  isDeletingCode: boolean;
}

const initialState: PartnersState = {
  partnerCodes: [],
  selectedPartnerCode: null,
  partnerStats: null,
  validationResult: null,
  isLoading: false,
  error: null,
  isCreatingCode: false,
  isValidatingCode: false,
  isUpdatingCode: false,
  isDeletingCode: false,
};

const partnersSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {
    // ✅ Partner codes management
    setPartnerCodes: (state, action: PayloadAction<PartnerCode[]>) => {
      state.partnerCodes = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedPartnerCode: (state, action: PayloadAction<PartnerCode | null>) => {
      state.selectedPartnerCode = action.payload;
    },
    addPartnerCode: (state, action: PayloadAction<PartnerCode>) => {
      state.partnerCodes.push(action.payload);
      state.isCreatingCode = false;
    },
    updatePartnerCode: (state, action: PayloadAction<PartnerCode>) => {
      const index = state.partnerCodes.findIndex(
        code => code.partner_code === action.payload.partner_code
      );
      if (index !== -1) {
        state.partnerCodes[index] = action.payload;
      }
      state.isUpdatingCode = false;
    },
    removePartnerCode: (state, action: PayloadAction<string>) => {
      state.partnerCodes = state.partnerCodes.filter(
        code => code.partner_code !== action.payload
      );
      state.isDeletingCode = false;
      if (state.selectedPartnerCode?.partner_code === action.payload) {
        state.selectedPartnerCode = null;
      }
    },

    // ✅ Partner stats
    setPartnerStats: (state, action: PayloadAction<PartnerStats | null>) => {
      state.partnerStats = action.payload;
    },

    // ✅ Validation
    setValidationResult: (state, action: PayloadAction<PartnerCodeValidation | null>) => {
      state.validationResult = action.payload;
      state.isValidatingCode = false;
    },
    clearValidationResult: (state) => {
      state.validationResult = null;
    },

    // ✅ Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCreatingCode: (state, action: PayloadAction<boolean>) => {
      state.isCreatingCode = action.payload;
    },
    setValidatingCode: (state, action: PayloadAction<boolean>) => {
      state.isValidatingCode = action.payload;
    },
    setUpdatingCode: (state, action: PayloadAction<boolean>) => {
      state.isUpdatingCode = action.payload;
    },
    setDeletingCode: (state, action: PayloadAction<boolean>) => {
      state.isDeletingCode = action.payload;
    },

    // ✅ Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isCreatingCode = false;
      state.isValidatingCode = false;
      state.isUpdatingCode = false;
      state.isDeletingCode = false;
    },
    clearError: (state) => {
      state.error = null;
    },

    resetPartnersState: () => {
      return { ...initialState };
    },
  },
});

export const {
  setPartnerCodes,
  setSelectedPartnerCode,
  addPartnerCode,
  updatePartnerCode,
  removePartnerCode,
  setPartnerStats,
  setValidationResult,
  clearValidationResult,
  setLoading,
  setCreatingCode,
  setValidatingCode,
  setUpdatingCode,
  setDeletingCode,
  setError,
  clearError,
  resetPartnersState,
} = partnersSlice.actions;

export default partnersSlice.reducer;