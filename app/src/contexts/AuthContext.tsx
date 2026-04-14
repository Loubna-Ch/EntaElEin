import { createContext, useState, useContext, useEffect, type ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isCitizen: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Initial Session Check
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("accessToken");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }
    }
    setLoading(false);
  }, []);

  // 2. Login Logic
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error messages from your ApiError middleware
        throw new Error(data.message || "Invalid credentials");
      }

      // Backend returns { authenticated: true, accessToken, user }
      setUser(data.user);
      setToken(data.accessToken);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 3. Signup Logic
  const signup = async (formData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Matching backend keys exactly: username, email, password, phonenumber, address, dateofbirth, role
        body: JSON.stringify({
          username: formData.fullName,
          email: formData.email,
          password: formData.password,
          phonenumber: formData.phoneNumber || null,
          address: formData.address || null,
          dateofbirth: formData.dateOfBirth || null,
          role: formData.role.toLowerCase(), // Must be 'admin', 'officer', or 'citizen'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // After successful registration, your backend returns the new user object.
      // We trigger login to get the access token and set up the session.
      await login(formData.email, formData.password);
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 4. Logout Logic
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  // 5. Auth Helpers
  const isAuthenticated = !!user;
  
  // Use lowercase for comparisons as your backend normalizes roles to lowercase
  const isCitizen = user?.role?.toLowerCase() === "citizen";
  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "officer";

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        token, 
        loading, 
        login, 
        signup, 
        logout, 
        isAuthenticated, 
        isCitizen, 
        isAdmin 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}