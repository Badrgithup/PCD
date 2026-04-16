"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, hydrateAuth } = useAuthStore();

  // Rehydrate auth state from localStorage on mount
  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500 animate-pulse">
            FinScore PME
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Marketplace
          </Link>

          {isAuthenticated && user ? (
            <>
              {/* Dashboard link based on role */}
              <Link
                href={user.role === "PME" ? "/dashboard/pme" : "/dashboard/investor"}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Dashboard
              </Link>

              {/* User badge */}
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-gray-300 max-w-[140px] truncate">{user.email}</span>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all active:scale-95 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-sm font-bold hover:bg-teal-400 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] active:scale-95"
              >
                Get Your FinScore
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
