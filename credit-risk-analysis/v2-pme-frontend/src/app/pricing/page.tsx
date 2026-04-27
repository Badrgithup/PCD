"use client";

import { Check, Mail } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function PricingPage() {
  return (
    <AuthGuard>
      <div className="pt-32 pb-24 min-h-screen px-6 relative overflow-hidden bg-slate-950 font-sans">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-black text-white mb-6 tracking-tight">
            Unlock Full Ecosystem Intelligence
          </h1>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
            Scale your corporate origination pipeline. Gain real-time contact data, compliance scoring, and Groq-powered AI abstractions.
          </p>

          <div className="max-w-md mx-auto rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              Most Popular
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Premium Banker Plan</h3>
            <p className="text-gray-400 text-sm mb-6">Designed for enterprise scaling and rapid lead generation.</p>
            
            <div className="text-5xl font-black text-white mb-8">
              50 <span className="text-xl text-gray-500 font-medium tracking-normal">Credits</span>
            </div>

            <ul className="space-y-4 text-left mb-10">
              {["Full Contact Details (Email/Phone)", "Bypass RNE Restrictions", "Enterprise SLA Support", "Dual-Model Risk Forecasting"].map((feature) => (
                <li key={feature} className="flex items-center text-gray-300">
                  <Check className="w-5 h-5 text-teal-400 mr-3 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="mailto:admin@finscore.tn?subject=Account Recharge Request"
              className="w-full py-4 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition-all flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              onClick={() => alert("Redirecting to email client to contact administrator.")}
            >
              <Mail className="w-4 h-4 mr-2" /> Contact Administrator to Recharge
            </a>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
