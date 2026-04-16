"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calculator, Search, CheckCircle2, Bot, TrendingUp, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function InvestorDashboardPage() {
  const [activeTab, setActiveTab] = useState<"manual" | "auto">("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [scrapingText, setScrapingText] = useState("");

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowResult(true);
    }, 1500);
  };

  const handleAutoScrape = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const steps = [
      "Initializing Web Scraper AI...",
      "Extracting public RNE data...",
      "Analyzing LinkedIn footprint...",
      "Synthesizing alternative signals...",
      "Processing FinScore...",
    ];
    
    let i = 0;
    setScrapingText(steps[0]);
    
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setScrapingText(steps[i]);
      } else {
        clearInterval(interval);
        setIsSubmitting(false);
        setShowResult(true);
      }
    }, 800);
  };

  const mockShapData = [
    { name: "Risk", value: 30, color: "#ef4444" },
    { name: "Compliance", value: 50, color: "#2dd4bf" },
    { name: "Market", value: 20, color: "#6366f1" },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen px-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Investor Quick-Score</h1>
          <p className="text-gray-400">Evaluate unlisted SMEs instantly using our predictive models.</p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex border-b border-white/10">
                <button
                  onClick={() => setActiveTab("manual")}
                  className={`flex-1 py-4 text-center font-bold transition-all ${
                    activeTab === "manual" ? "bg-white/10 text-white border-b-2 border-indigo-500" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  onClick={() => setActiveTab("auto")}
                  className={`flex-1 py-4 text-center font-bold transition-all ${
                    activeTab === "auto" ? "bg-white/10 text-white border-b-2 border-teal-500" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <Bot className="w-5 h-5 mr-2" />
                    Auto-Scrape (Beta)
                  </span>
                </button>
              </div>

              <div className="p-8">
                {activeTab === "manual" ? (
                  <form onSubmit={handleManualSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Estimated Turnover (TND)</label>
                        <input type="number" required className="w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white outline-none" placeholder="e.g. 500000" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Sector</label>
                        <select className="w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white outline-none">
                          <option>Technology</option>
                          <option>Agriculture</option>
                          <option>Manufacturing</option>
                          <option>Retail</option>
                        </select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Company Age (Years)</label>
                        <input type="number" required className="w-full px-5 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white outline-none" placeholder="e.g. 5" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-indigo-500 text-white font-bold flex items-center justify-center hover:bg-indigo-400 transition-all disabled:opacity-50 mt-4 active:scale-95"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Quick-Score"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAutoScrape} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 ml-1">Target Company URL / LinkedIn</label>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="url" required className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-white outline-none" placeholder="https://linkedin.com/company/tunis-tech" />
                      </div>
                      <p className="text-xs text-gray-400 mt-2 ml-1">Our AI will crawl public domains, RNE registries, and social footprint to infer financial health.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center hover:bg-teal-400 transition-all disabled:opacity-50 mt-4 active:scale-95 relative overflow-hidden"
                    >
                      {isSubmitting ? (
                        <div className="flex flex-col items-center justify-center w-full relative z-10 font-mono text-sm">
                          <Loader2 className="w-4 h-4 animate-spin mb-1" />
                          <span className="text-slate-900">{scrapingText}</span>
                        </div>
                      ) : (
                        <><Bot className="mr-2 w-5 h-5" /> Run Web Scraper</>
                      )}
                      
                      {isSubmitting && (
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="w-32 h-32 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockShapData}
                          innerRadius={45}
                          outerRadius={60}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {mockShapData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-2xl text-white">
                      612
                    </div>
                  </div>
                  <h3 className="mt-4 font-bold text-lg text-yellow-400">Medium Risk</h3>
                  <p className="text-xs text-gray-400 mt-1">Simulated FinScore Profile</p>
                </div>

                <div className="md:col-span-2 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-4 flex items-center text-white"><AlertTriangle className="mr-2 text-yellow-400 w-5 h-5" /> Evaluation Summary</h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Based on the {activeTab === "auto" ? "scraped semantic parameters" : "manual entry data"}, this entity demonstrates fair compliance but suffers from high operational expenses. Wait for Q3 filings for a more accurate solvency check.
                  </p>
                  
                  <div className="mt-6 flex space-x-4">
                    <button onClick={() => setShowResult(false)} className="px-5 py-2.5 rounded-lg border border-white/10 text-sm font-bold text-gray-300 hover:bg-white/5 transition-all">New Evaluation</button>
                    <button className="px-5 py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-all flex items-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      <TrendingUp className="w-4 h-4 mr-2" /> Add to Watchlist
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
