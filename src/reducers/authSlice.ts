import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { removeFromStorage } from "../constants/storage";
import type { RootState } from "../app/store";


export interface AuthState {
  user: any | null;
  token: any;
  tempToken: string | null;
  roleName: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  tempToken: null,
  roleName:null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      removeFromStorage(STORAGE_KEYS.token);
      state.user = null;
      state.token = null;
    },
    setCredentials: (
      state,
      action: PayloadAction<Pick<AuthState, "user" | "token">>
    ) => {
      state.user = action.payload.user ? action.payload.user : null;
      state.token = action.payload.token ? action.payload.token : null;
    },
    setToken: (state, action: any) => {
      state.token = action.payload ? action.payload : null;

    },
    temporaryToken: (
      state,
      action: PayloadAction<Pick<AuthState, "tempToken">>
    ) => {
      state.tempToken = action.payload.tempToken;
    },
    role: (state, action: PayloadAction<Pick<AuthState, "roleName">>) => {
      state.roleName = action.payload.roleName;
    },
  },
});

export const { resetAuth, setCredentials, temporaryToken, setToken,role } = authSlice.actions;
export const getCurrentUser = (state: RootState) => state.auth.user;
export const getToken = (state: RootState) => state.auth.token;
export const getTempToken = (state: RootState) => state.auth.tempToken;
export const getRole = (state: RootState) => state.auth.roleName;

export default authSlice.reducer;