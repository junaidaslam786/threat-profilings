// src/slices/rolesSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface RoleConfigDto {
  role_id: string;
  name: string;
  description?: string;
  permissions: string[];
}

interface RolesState {
  roles: RoleConfigDto[];
  selectedRole: RoleConfigDto | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  isLoading: false,
  error: null,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRoles: (state, action: PayloadAction<RoleConfigDto[]>) => {
      state.roles = action.payload;
      state.isLoading = false;
    },
    setSelectedRole: (state, action: PayloadAction<RoleConfigDto | null>) => {
      state.selectedRole = action.payload;
    },
    setRolesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRolesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setRoles, setSelectedRole, setRolesLoading, setRolesError } =
  rolesSlice.actions;

export default rolesSlice.reducer;
