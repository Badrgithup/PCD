"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User, Sun, Moon, Languages, Coins, AlertCircle, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/authStore";
import apiClient from "@/lib/api/axios";

// ── Mini i18n ─────────────────────────────────────────────────────────────
const T: Record<string, Record<string, string>> = {
  fr: {
    marketplace: "Marketplace", dashboard: "Tableau de bord",
    signin: "Connexion", cta: "Obtenir Mon FinScore", logout: "Déconnexion",
    credits: "crédits",
  },
  ar: {
    marketplace: "السوق", dashboard: "لوحة التحكم",
    signin: "تسجيل الدخول", cta: "احصل على FinScore", logout: "تسجيل الخروج",
    credits: "رصيد",
  },
};

// ── Insufficient Credits Modal ─────────────────────────────────────────────
export function InsufficientCreditsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl mx-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Crédits insuffisants</h2>
          <p className="text-gray-400 text-sm">
            Vous n'avez plus de crédits pour débloquer des contacts.<br />
            Veuillez recharger votre compte pour continuer.
          </p>
          <div className="flex gap-3 w-full mt-2">
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-gray-300 hover:bg-white/5 transition-all">
              Fermer
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-sm font-bold hover:bg-teal-400 transition-all">
              Recharger 🔋
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, hydrateAuth } = useAuthStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<"fr" | "ar">("fr");
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    hydrateAuth();
    setMounted(true);
    const savedLang = (localStorage.getItem("finscore_lang") as "fr" | "ar") || "fr";
    setLang(savedLang);
    applyLang(savedLang);
  }, [hydrateAuth]);

  // Fetch credits when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      apiClient.get("/auth/me")
        .then(res => {
          setCredits(res.data.credits);
          console.log("[NAVBAR] Credits loaded:", res.data.credits);
        })
        .catch(err => console.warn("[NAVBAR] Could not fetch credits:", err.message));
    } else {
      setCredits(null);
    }
  }, [isAuthenticated]);

  const applyLang = (l: "fr" | "ar") => {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  };

  const toggleLang = () => {
    const next = lang === "fr" ? "ar" : "fr";
    setLang(next);
    localStorage.setItem("finscore_lang", next);
    applyLang(next);
    window.dispatchEvent(new Event("langchange")); // notify other components
  };

  const t = T[lang];

  const handleLogout = () => {
    logout();
    setCredits(null);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl
        bg-white/5 dark:bg-white/5 light:bg-slate-100/80 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">

        <Link href="/" className="text-2xl font-bold tracking-tighter">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
            FinScore PME
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/marketplace" className="text-sm font-medium text-gray-300 dark:text-gray-300 hover:text-white transition-colors">
            {t.marketplace}
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link href={user.role === "PME" ? "/dashboard/pme" : "/dashboard/investor"}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {t.dashboard}
              </Link>

              {/* Credit Badge */}
              {credits !== null && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold
                  ${credits === 0
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-teal-500/10 border-teal-500/20 text-teal-400"}`}>
                  <Coins className="w-3.5 h-3.5" />
                  {credits} {t.credits}
                </div>
              )}

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-teal-400" />
                <span className="text-sm text-gray-300 max-w-[120px] truncate">{user.email}</span>
              </div>

              <button onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all active:scale-95 flex items-center gap-1.5">
                <LogOut className="w-4 h-4" />
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {t.signin}
              </Link>
              <Link href="/register"
                className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 text-sm font-bold hover:bg-teal-400 transition-all shadow-[0_0_15px_rgba(45,212,191,0.3)] active:scale-95">
                {t.cta}
              </Link>
            </>
          )}

          {/* Language Toggle */}
          <button onClick={toggleLang} title="Changer de langue"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-xs font-bold text-gray-300">
            <Languages className="w-4 h-4" />
            {lang === "fr" ? "عربي" : "FR"}
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              title="Toggle dark/light mode"
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-all text-gray-300">
              {resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
