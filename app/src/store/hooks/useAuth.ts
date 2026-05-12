import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../index";
import { clearAuth, loginUser, setAuth, signupUser } from "../slices/authSlice";
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

  // Update the authenticated user's region id.
  const updateProfile = useCallback(
    async (data: Partial<Record<string, any>>) => {
      if (!token) {
        throw new Error("Not authenticated");
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const regionid = Number(data?.regionid);
      const response = await fetch(`${API_URL}/users/me/region`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ regionid }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.message || "Failed to update region");
      }

      dispatch(setAuth({ user: body, accessToken: token }));
      return body;
    },
    [dispatch, token]
  );

  return {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated,
    isCitizen,
    isAdmin,
    updateProfile,
  };
};
