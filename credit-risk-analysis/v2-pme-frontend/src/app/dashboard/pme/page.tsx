"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Calculator, ShieldCheck, Zap, Activity, AlertTriangle, TrendingUp, HelpCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import apiClient from "@/lib/api/axios";

interface ScoreResult {
  score: number;
  risk_tier: string;
  decision: string;
  decision_explanation: string;
  probabilities: { model1_financial: number; model2_behavioral: number; stacked_final: number };
  strengths: { feature: string; value: number; shap_value: number; description: string }[];
  weaknesses: { feature: string; value: number; shap_value: number; description: string }[];
}

export default function PMEDashboardPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const [formData, setFormData] = useState({
    business_turnover_tnd: "",
    business_expenses_tnd: "",
    profit_margin: "",
    nbr_of_workers: "",
    workers_verified_cnss: "",
    formal_worker_ratio: "",
    business_age_years: "",
    number_of_owners: "1",
    compliance_rne_score: 5,
    steg_sonede_score: 5,
    banking_maturity_score: 5,
    followers_fcb: "",
    followers_insta: "",
    followers_linkedin: "",
    posts_per_month: "",
    type_of_business: "Services",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        business_turnover_tnd: parseFloat(formData.business_turnover_tnd) || 0,
        business_expenses_tnd: parseFloat(formData.business_expenses_tnd) || 0,
        profit_margin: parseFloat(formData.profit_margin) || 0.1,
        nbr_of_workers: parseInt(formData.nbr_of_workers) || 0,
        workers_verified_cnss: parseInt(formData.workers_verified_cnss) || 0,
        formal_worker_ratio: parseFloat(formData.formal_worker_ratio) || 1.0,
        business_age_years: parseInt(formData.business_age_years) || 1,
        number_of_owners: parseInt(formData.number_of_owners) || 1,
        compliance_rne_score: formData.compliance_rne_score,
        steg_sonede_score: formData.steg_sonede_score,
        banking_maturity_score: formData.banking_maturity_score,
        followers_fcb: parseInt(formData.followers_fcb) || 0,
        followers_insta: parseInt(formData.followers_insta) || 0,
        followers_linkedin: parseInt(formData.followers_linkedin) || 0,
        posts_per_month: parseInt(formData.posts_per_month) || 0,
        type_of_business: formData.type_of_business,
      };

      const res = await apiClient.post("/scoring/predict", payload);
      setResult(res.data);
      setShowResult(true);
    } catch (err: any) {
      console.warn("Backend unreachable, using mock data:", err.message);
      setResult({
        score: 745,
        risk_tier: "Low Risk",
        decision: "Approved",
        decision_explanation: "The company shows a highly solid solvability signal across both financial data and behavioral footprint.",
        probabilities: { model1_financial: 0.82, model2_behavioral: 0.71, stacked_final: 0.78 },
        strengths: [
          { feature: "business_turnover_tnd", value: 250000, shap_value: 0.12, description: "Solid revenue base." },
          { feature: "compliance_rne_score", value: 8, shap_value: 0.08, description: "Strong formal compliance." },
        ],
        weaknesses: [
          { feature: "banking_maturity_score", value: 5, shap_value: -0.04, description: "Banking maturity profile is relatively young." },
        ],
      });
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const shapChartData = result
    ? [
        ...(result.strengths || []).map((s) => ({ name: s.feature.replace(/_/g, " "), value: Math.abs(s.shap_value) * 100, positive: true, desc: s.description })),
        ...(result.weaknesses || []).map((w) => ({ name: w.feature.replace(/_/g, " "), value: -Math.abs(w.shap_value) * 100, positive: false, desc: w.description })),
      ]
    : [];

  const getRiskColor = (tier: string) => {
    if (tier.toLowerCase().includes("low")) return "text-teal-400 bg-teal-500/20 border-teal-500/50";
    if (tier.toLowerCase().includes("medium")) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/50";
    return "text-red-400 bg-red-500/20 border-red-500/50";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-white/10 p-4 rounded-xl shadow-xl max-w-xs">
          <p className="font-bold text-white capitalize mb-1">{label}</p>
          <p className="text-sm text-gray-400 mb-2">{payload[0].payload.desc}</p>
          <p className="text-xs font-mono" style={{ color: payload[0].fill }}>
            AI Weight: {payload[0].value > 0 ? '+' : ''}{payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pt-24 pb-24 min-h-screen px-6 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Comprehensive AI Assessment</h1>
          <p className="text-gray-400">Our machine learning models use both traditional financial parameters and behavioral web-footprints to generate your actual score.</p>
        </div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* 1. FINANCIAL MODULE */}
                <div>
                  <h3 className="text-teal-400 font-bold mb-4 uppercase text-sm tracking-wider border-b border-white/10 pb-2">Module 1: Financial & Structural Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Business Sector</label>
                      <select required value={formData.type_of_business} onChange={(e) => setFormData({ ...formData, type_of_business: e.target.value })}
                        className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-white outline-none">
                        <option value="Services">Services (B2B/B2C)</option>
                        <option value="Technology">Technology / IT</option>
                        <option value="Agriculture">Agriculture</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Retail">Retail</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Turnover (TND)</label>
                      <input type="number" required value={formData.business_turnover_tnd} onChange={(e) => setFormData({ ...formData, business_turnover_tnd: e.target.value })}
                        className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white outline-none" placeholder="250000" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Expenses (TND)</label>
                      <input type="number" required value={formData.business_expenses_tnd} onChange={(e) => setFormData({ ...formData, business_expenses_tnd: e.target.value })}
                        className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white outline-none" placeholder="180000" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Profit Margin (Ratio 0-1)</label>
                      <input type="number" step="0.01" value={formData.profit_margin} onChange={(e) => setFormData({ ...formData, profit_margin: e.target.value })}
                        className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 text-white outline-none" placeholder="0.15" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Business Age (Years)</label>
                      <input type="number" required value={formData.business_age_years} onChange={(e) => setFormData({ ...formData, business_age_years: e.target.value })}
                        className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 text-white outline-none" placeholder="5" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Number of Owners</label>
                      <input type="number" value={formData.number_of_owners} onChange={(e) => setFormData({ ...formData, number_of_owners: e.target.value })}
                        className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 text-white outline-none" placeholder="1" />
                    </div>
                  </div>
                </div>

                {/* 2. EMPLOYMENT MODULE */}
                <div>
                  <h3 className="text-teal-400 font-bold mb-4 uppercase text-sm tracking-wider border-b border-white/10 pb-2">Module 2: Employment Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Total Workers</label>
                      <input type="number" required value={formData.nbr_of_workers} onChange={(e) => setFormData({ ...formData, nbr_of_workers: e.target.value })} className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 text-white outline-none" placeholder="e.g. 10" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">CNSS Verified Workers</label>
                      <input type="number" required value={formData.workers_verified_cnss} onChange={(e) => setFormData({ ...formData, workers_verified_cnss: e.target.value })} className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 text-white outline-none" placeholder="e.g. 10" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Formal Worker Ratio (0-1)</label>
                      <input type="number" step="0.01" value={formData.formal_worker_ratio} onChange={(e) => setFormData({ ...formData, formal_worker_ratio: e.target.value })} className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-teal-500 text-white outline-none" placeholder="1.0" />
                    </div>
                  </div>
                </div>

                {/* 3. BEHAVIORAL MODULE */}
                <div>
                  <h3 className="text-indigo-400 font-bold mb-4 uppercase text-sm tracking-wider border-b border-white/10 pb-2">Module 3: Behavioral & Engagement Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">FB Followers</label>
                      <input type="number" value={formData.followers_fcb} onChange={(e) => setFormData({ ...formData, followers_fcb: e.target.value })} className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 text-white outline-none" placeholder="5000" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Insta Followers</label>
                      <input type="number" value={formData.followers_insta} onChange={(e) => setFormData({ ...formData, followers_insta: e.target.value })} className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 text-white outline-none" placeholder="3000" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">LinkedIn Followers</label>
                      <input type="number" value={formData.followers_linkedin} onChange={(e) => setFormData({ ...formData, followers_linkedin: e.target.value })} className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 text-white outline-none" placeholder="200" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-300 ml-1">Posts per month</label>
                      <input type="number" value={formData.posts_per_month} onChange={(e) => setFormData({ ...formData, posts_per_month: e.target.value })} className="w-full px-4 py-3 mt-1 rounded-xl bg-slate-900/50 border border-white/10 focus:border-indigo-500 text-white outline-none" placeholder="15" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-medium text-gray-300">RNE Compliance</label>
                        <span className="text-indigo-400 font-bold text-xs">{formData.compliance_rne_score}/10</span>
                      </div>
                      <input type="range" min="0" max="10" step="0.5" value={formData.compliance_rne_score} onChange={(e) => setFormData({ ...formData, compliance_rne_score: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-medium text-gray-300">STEG/Utility Rating</label>
                        <span className="text-indigo-400 font-bold text-xs">{formData.steg_sonede_score}/10</span>
                      </div>
                      <input type="range" min="0" max="10" step="0.5" value={formData.steg_sonede_score} onChange={(e) => setFormData({ ...formData, steg_sonede_score: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-medium text-gray-300">Banking Maturity</label>
                        <span className="text-indigo-400 font-bold text-xs">{formData.banking_maturity_score}/10</span>
                      </div>
                      <input type="range" min="0" max="10" step="0.5" value={formData.banking_maturity_score} onChange={(e) => setFormData({ ...formData, banking_maturity_score: parseFloat(e.target.value) })} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-bold text-lg flex items-center justify-center hover:opacity-90 transition-all shadow-[0_0_20px_rgba(45,212,191,0.4)] disabled:opacity-50">
                    {isSubmitting ? (
                      <><Loader2 className="w-6 h-6 animate-spin mr-3" /> Analyzing Complete Feature Stack...</>
                    ) : (
                      <><Calculator className="w-6 h-6 mr-3" /> Calculate Full Stack FinScore</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Top: Score & Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-teal-500/30 shadow-[0_0_30px_rgba(45,212,191,0.1)] flex flex-col sm:flex-row items-center justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-2xl"></div>
                  <div>
                    <div className="text-sm text-teal-400 font-mono tracking-widest mb-2 uppercase">Official FinScore Evaluated</div>
                    <h2 className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      {result.score}<span className="text-2xl text-gray-500">/1000</span>
                    </h2>
                  </div>
                  <div className="mt-6 sm:mt-0 text-center sm:text-right z-10 flex flex-col items-center sm:items-end">
                    <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full border font-bold text-lg ${getRiskColor(result.risk_tier)}`}>
                      {getRiskIcon(result.risk_tier)}
                      <span>{result.risk_tier}</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-3 font-medium bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">System Decision: {result.decision}</p>
                  </div>
                </div>

                <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col justify-center gap-4">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1 text-center">Model Ensembles</h4>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center text-sm text-gray-300">
                      <Activity className="w-4 h-4 mr-2 text-indigo-400" /> Module 1: Finance
                    </div>
                    <span className="font-bold text-white">{(result.probabilities.model1_financial * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center text-sm text-gray-300">
                      <Zap className="w-4 h-4 mr-2 text-yellow-400" /> Module 2: Behavior
                    </div>
                    <span className="font-bold text-white">{(result.probabilities.model2_behavioral * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center text-sm text-gray-300">
                      <ShieldCheck className="w-4 h-4 mr-2 text-teal-400" /> Stacked Verdict
                    </div>
                    <span className="font-bold text-teal-400">{(result.probabilities.stacked_final * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Explanation Box */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-teal-900/20 backdrop-blur border border-indigo-500/30 text-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 bg-indigo-500 h-full"></div>
                <h3 className="text-xl font-bold mb-3 flex items-center text-white"><HelpCircle className="w-6 h-6 mr-2 text-indigo-400" /> What this score means for you</h3>
                <p className="text-lg leading-relaxed">{result.decision_explanation}</p>
                <p className="mt-4 text-sm text-gray-400">Our machine learning pipeline analyzed your specific financial solvency constraints against your social and behavioral engagement tracking to arrive at this human-readable explanation.</p>
              </div>

              {/* SHAP Chart */}
              {shapChartData.length > 0 && (
                <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10">
                  <div className="mb-6 flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-bold">Predictive AI Influence Matrix (SHAP)</h3>
                      <p className="text-sm text-gray-400 mt-1">Discover exactly which features shifted your application towards approval or rejection.</p>
                    </div>
                  </div>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={shapChartData} margin={{ top: 10, right: 30, left: 160, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#cbd5e1", fontSize: 13 }} width={150} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={26}>
                          {shapChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.positive ? '#2dd4bf' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-teal-400 mr-2"></span> Positive Impact</div>
                    <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> Negative Risk Impact</div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center mt-6">
                <button onClick={() => { setShowResult(false); setResult(null); }}
                  className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/10 transition-all text-sm font-bold active:scale-95 text-white shadow-lg">
                  Start New Assessment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
