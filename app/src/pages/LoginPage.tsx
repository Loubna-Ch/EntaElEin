import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Shield, Lock, Loader2 } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Perform login through AuthContext
      await login(email, password);

      // 2. Retrieve user from local storage to verify the ACTUAL role from the backend
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const actualRole = savedUser.role?.toLowerCase();

      // 3. Smart Redirection logic
      // We check the role returned by the DB, not just the UI toggle
      if (actualRole === "admin" || actualRole === "officer") {
        navigate("/dashboard/admin");
      } else if (actualRole === "citizen") {
        navigate("/dashboard/citizen");
      } else {
        // Fallback for safety
        navigate("/");
      }
    } catch (err: any) {
      // Catching the ApiError messages from your backend
      setError(err.message || "Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1a2744] rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Logo Section */}
          <div className="flex flex-col items-center gap-2 mb-10">
            <div className="w-12 h-12 bg-[#dc143c]/10 rounded-full flex items-center justify-center mb-2">
              <Shield className="w-8 h-8 text-[#dc143c]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">Enta el Ein</h1>
            <p className="text-slate-400 text-sm font-medium">Community Safety Portal</p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm font-medium overflow-hidden"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0f1729] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-[#dc143c] focus:ring-1 focus:ring-[#dc143c] outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Lock className="w-3 h-3" />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0f1729] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:border-[#dc143c] focus:ring-1 focus:ring-[#dc143c] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>



            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#dc143c] text-white py-4 rounded-xl font-bold hover:bg-[#c41236] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-red-900/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : "Sign In to Portal"}
            </motion.button>
          </form>

          {/* System Info */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[#64748b] text-[10px] leading-relaxed">
              <strong>System Notice:</strong> This portal is for North Lebanon regional security. 
              Unauthorized access is monitored.
            </p>
            <button 
              onClick={() => navigate("/signup")}
              className="mt-4 text-[#dc143c] text-xs font-bold hover:underline"
            >
              Need an account? Register here
            </button>
            <div>
              <Link to="/" className="mt-3 inline-block text-[#94a3b8] text-xs hover:text-white transition-colors">
                Return to homepage
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}