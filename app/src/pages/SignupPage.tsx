import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { UserRole, type UserRoleType } from "../types/index";
import { Shield, User, Lock, Mail, Phone, MapPin, Calendar, Loader2 } from "lucide-react";

export function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });
  const [selectedRole, setSelectedRole] = useState<UserRoleType>(UserRole.CITIZEN);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Pass data to AuthContext signup
      // AuthContext will handle the exact field mapping for the backend
      await signup({ ...formData, role: selectedRole });

      // After context-level login is successful, use the actual role to navigate
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const actualRole = savedUser.role?.toLowerCase();

      if (actualRole === "admin" || actualRole === "officer") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/citizen");
      }
    } catch (err: any) {
      // Catches backend errors like "Email already registered"
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="bg-[#1a2744] rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-[#dc143c]/10 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#dc143c]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tighter">Enta el Ein</h1>
            <p className="text-slate-400 text-sm font-medium">Create your community account</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full bg-[#0f1729] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#dc143c] outline-none transition-all"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-[#0f1729] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#dc143c] outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <input
                    type="tel"
                    required
                    placeholder="+961 ..."
                    className="w-full bg-[#0f1729] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#dc143c] outline-none transition-all"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <input
                    type="date"
                    required
                    className="w-full bg-[#0f1729] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#dc143c] outline-none transition-all"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                <input
                  type="password"
                  required
                  placeholder="Min. 6 characters"
                  className="w-full bg-[#0f1729] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#dc143c] outline-none transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Home Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                <input
                  type="text"
                  required
                  placeholder="Street, City"
                  className="w-full bg-[#0f1729] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-[#dc143c] outline-none transition-all"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Register as</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: UserRole.CITIZEN, label: "Citizen" },
                  { value: UserRole.ADMIN, label: "Official" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRole === option.value 
                        ? "border-[#dc143c] bg-[#dc143c]/5" 
                        : "border-white/5 bg-[#0f1729]"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      checked={selectedRole === option.value}
                      onChange={() => setSelectedRole(option.value)}
                    />
                    <span className={`text-sm font-bold ${selectedRole === option.value ? 'text-white' : 'text-slate-500'}`}>
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#dc143c] text-white py-4 rounded-xl font-bold mt-4 hover:bg-[#c41236] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-red-900/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : "Join Enta el Ein"}
            </motion.button>
          </form>

          <p className="text-slate-500 text-sm text-center mt-6">
            Already part of the community?{" "}
            <Link to="/login" className="text-[#dc143c] font-bold hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-center mt-2">
            <Link to="/" className="text-[#94a3b8] text-xs hover:text-white transition-colors">
              Return to homepage
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}