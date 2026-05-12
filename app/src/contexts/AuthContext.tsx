import type { ReactNode } from "react";
import { useAuthStore } from "../store/hooks/useAuth";

// Keep AuthProvider as a compatibility wrapper for the app tree.
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// Expose the same AuthContext API but backed by Redux.
export function useAuth() {
  return useAuthStore();
}