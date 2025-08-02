import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface RoleConfigDto {
  role_id: string;
  name: string;
  description?: string;
  permissions: string[];
}

export interface RoleCreateResponse {
  saved: boolean;
  role_id: string;
}

export interface RoleDeleteResponse {
  deleted: boolean;
  role_id: string;
}

interface RolesState {
  selectedRole: RoleConfigDto | null;
}

const initialState: RolesState = {
  selectedRole: null,
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<RoleConfigDto | null>) => {
      state.selectedRole = action.payload;
    },
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    },
  },
});

export const { setSelectedRole, clearSelectedRole } = rolesSlice.actions;

export default rolesSlice.reducer;
