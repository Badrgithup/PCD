"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";

// Mini i18n store — no external library needed
const TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    marketplace: "Marketplace",
    dashboard: "Tableau de bord",
    signin: "Connexion",
    cta: "Obtenir Mon FinScore",
    logout: "Déconnexion",
  },
  ar: {
    marketplace: "السوق",
    dashboard: "لوحة التحكم",
    signin: "تسجيل الدخول",
    cta: "احصل على FinScore",
    logout: "تسجيل الخروج",
  },
};

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, hydrateAuth } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"fr" | "ar">("fr");

  useEffect(() => {
    hydrateAuth();
    setMounted(true);
    const savedLang = (localStorage.getItem("finscore_lang") as "fr" | "ar") || "fr";
    setLang(savedLang);
    applyLang(savedLang);
  }, [hydrateAuth]);

  const applyLang = (l: "fr" | "ar") => {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const toggleLang = () => {
    const next = lang === "fr" ? "ar" : "fr";
    setLang(next);
    localStorage.setItem("finscore_lang", next);
    applyLang(next);
  };

  const t = TRANSLATIONS[lang];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
            FinScore PME
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          <Link
            href="/marketplace"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            {t.marketplace}
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link
                href={user.role === "PME" ? "/dashboard/pme" : "/dashboard/investor"}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {t.dashboard}
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-gray-300 max-w-[120px] truncate">{user.email}</span>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {t.signin}
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-sm font-bold hover:bg-teal-400 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] active:scale-95"
              >
                {t.cta}
              </Link>
            </>
          )}

          {/* ── Language Toggle ── */}
          <button
            onClick={toggleLang}
            title="Changer de langue / تغيير اللغة"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-xs font-bold text-gray-300"
          >
            <Languages className="w-4 h-4" />
            {lang === "fr" ? "عربي" : "FR"}
          </button>

          {/* ── Theme Toggle ── */}
          {mounted && (
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              title="Toggle dark/light mode"
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-gray-300"
            >
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
