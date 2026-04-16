"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Landmark, Lock, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export default function RegisterPage() {
  const [role, setRole] = useState<"PME" | "BANK">("PME");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", { 
        email, 
        password, 
        role,
        company_name: companyName || undefined 
      });
      
      login(res.data.access_token, {
        id: res.data.user_id,
        email: res.data.email,
        role: res.data.role
      });
      window.location.href = res.data.role === "PME" ? "/dashboard/pme" : "/dashboard/investor";
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-10 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue to-neon-green"></div>
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-400 mb-8">Join the FinScore network.</p>

        {/* Role Selector */}
        <div className="flex p-1 bg-white/5 rounded-xl mb-8 border border-white/10">
          <button
            type="button"
            onClick={() => setRole("PME")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-all ${role === "PME" ? "bg-neon-green text-black" : "text-gray-400 hover:text-white"}`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            SME Entity
          </button>
          <button
            type="button"
            onClick={() => setRole("BANK")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center transition-all ${role === "BANK" ? "bg-neon-blue text-black" : "text-gray-400 hover:text-white"}`}
          >
            <Landmark className="w-4 h-4 mr-2" />
            Investor / Bank
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {role === "PME" && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-500" />
                </div>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-colors text-white"
                  placeholder="Acme Corp"
                  required={role === "PME"}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-colors text-white"
                placeholder="admin@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Secure Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-colors text-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 text-black ${role === "PME" ? "bg-neon-green hover:bg-[#00e6b8] shadow-[0_0_15px_rgba(0,255,204,0.3)]" : "bg-neon-blue hover:bg-[#0099ff] shadow-[0_0_15px_rgba(0,179,255,0.3)]"}`}
          >
            {loading ? "Registering Node..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already verified? <Link href="/login" className={`hover:underline ${role === "PME" ? "text-neon-green" : "text-neon-blue"}`}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
