import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string;
  username: string;
  user_id: string;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: "",
  username: "", // Default to empty string
  user_id: "",
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{
        token: string;
        username: string; // Keep this as string
        user_id: string;
      }>
    ) {
      state.token = action.payload.token;
      state.username = action.payload.username || ""; // Default to empty string
      state.user_id = action.payload.user_id;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<{ message: string }>) {
      state.error = action.payload.message;
      state.isAuthenticated = false;
      state.token = "";
      state.username = "";
      state.user_id = "";
    },
    logout(state) {
      state.token = "";
      state.username = "";
      state.user_id = "";
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;

export default authSlice.reducer;
