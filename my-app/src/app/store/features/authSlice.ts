import { LoginUsertype } from "@/app/types";
import { LoginDB } from "@/lib/data";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface UserCredentials {
  email: string;
  password: string;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginUsertype, { rejectWithValue }) => {
    try {
      const response = await LoginDB(credentials);
      if (!response?.ok) {
        const errorData = await response?.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      Cookies.set("access_token", data.access_token, {
        expires: 1 / 1440, // 1 minute
        sameSite: "strict",
      });

      return data.access_token;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("access_token");
      state.token = null;
      state.isAuthenticated = false;
    },
    setAuth: (state, action) => {
      // Better to use payload: string | null here
      state.token = action.payload;
      state.isAuthenticated = !!action.payload; // Ensure boolean
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload; // Use payload directly, it's the token
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = "Login failed"; // Extract from payload
        state.isAuthenticated = false;
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
