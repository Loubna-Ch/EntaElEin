import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types";

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

type AuthPayload = {
  user: User;
  accessToken: string;
};

type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  regionId?: number;
  dateOfBirth?: string;
  role: string;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Read the saved user and token from localStorage.
// Returns the stored session if it exists, otherwise empty auth state.
const loadAuthFromStorage = (): { user: User | null; token: string | null } => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    return {
      user: storedUser ? (JSON.parse(storedUser) as User) : null,
      token: storedToken ?? null,
    };
  } catch {
    return { user: null, token: null };
  }
};

const { user, token } = loadAuthFromStorage();

const initialState: AuthState = {
  user,
  token,
  loading: false,
  error: null,
};

// Send login data to the backend and store the returned session.
// Parameters: email and password.
// Returns: user data plus access token on success.
export const loginUser = createAsyncThunk<AuthPayload, { email: string; password: string }>(
  "auth/login",
  async ({ email, password }, thunkApi) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Invalid credentials");
      }

      return { user: data.user, accessToken: data.accessToken };
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message || "Login failed");
    }
  }
);

// Register a new user through /users, then log in to create a session.
// Parameters: signup form fields.
// Returns: user data plus access token on success.
export const signupUser = createAsyncThunk<AuthPayload, SignupPayload>(
  "auth/signup",
  async (payload, thunkApi) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: payload.fullName,
          email: payload.email,
          password: payload.password,
          phonenumber: payload.phoneNumber || null,
          address: payload.address || null,
          regionid: payload.regionId ?? null,
          dateofbirth: payload.dateOfBirth || null,
          role: payload.role.toLowerCase(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: payload.email, password: payload.password }),
      });

      const loginData = await loginResponse.json().catch(() => ({}));
      if (!loginResponse.ok) {
        throw new Error(loginData?.message || "Login failed");
      }

      return { user: loginData.user, accessToken: loginData.accessToken };
    } catch (error: any) {
      return thunkApi.rejectWithValue(error?.message || "Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Remove the current user session from Redux.
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
    // Clear the stored auth error message.
    clearAuthError(state) {
      state.error = null;
    },
    // Replace the stored user and token values.
    setAuth(state, action: PayloadAction<AuthPayload>) {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.error = null;
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
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Login failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Signup failed";
      });
  },
});

export const { clearAuth, clearAuthError, setAuth } = authSlice.actions;
export default authSlice.reducer;
