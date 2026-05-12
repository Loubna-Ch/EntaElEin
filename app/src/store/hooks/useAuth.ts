import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../index";
import { clearAuth, loginUser, signupUser } from "../slices/authSlice";
import type { UserRoleType } from "../../types";

// Provide auth helpers backed by Redux state.
export const useAuthStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  // Authenticate with email/password and persist the session.
  const login = useCallback(
    async (email: string, password: string) => {
      await dispatch(loginUser({ email, password })).unwrap();
    },
    [dispatch]
  );

  // Register a new user and create a session on success.
  const signup = useCallback(
    async (formData: {
      fullName: string;
      email: string;
      password: string;
      phoneNumber?: string;
      address?: string;
      regionId?: number;
      dateOfBirth?: string;
      role: string;
    }) => {
      await dispatch(signupUser(formData)).unwrap();
    },
    [dispatch]
  );

  // Clear the session state and cached credentials.
  const logout = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  const isAuthenticated = !!user;
  const userRole = (user?.role ?? "").toLowerCase() as UserRoleType;
  const isCitizen = userRole === "citizen";
  const isAdmin = userRole === "admin" || userRole === "officer";

  return { user, token, loading, error, login, signup, logout, isAuthenticated, isCitizen, isAdmin };
};
