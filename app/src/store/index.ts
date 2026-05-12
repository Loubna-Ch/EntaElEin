import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import reportsReducer from "./slices/reportsSlice";

// Central Redux store for shared app state.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
  },
});

// Keep auth credentials synchronized with localStorage.
store.subscribe(() => {
  const { user, token } = store.getState().auth;
  try {
    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  } catch {
    // Ignore storage write errors (private mode, quota, etc.).
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
