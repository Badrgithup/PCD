"use client";

import { useState, useEffect } from "react";
import { Filter, Search, Download, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

export default function InvestorMarketplace() {
  const [smes, setSmes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSector, setFilterSector] = useState("");

  const fetchSMEs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/marketplace/browse", {
        params: { limit: 20 }
      });
      setSmes(res.data.items);
    } catch (err) {
      console.error(err);
      // MOCK DATA FALLBACK for UI testing without Backend
      setSmes([
        { id: "1", company_name: "TunisTech Innovations", sector: "Tech", latest_score: 80, latest_risk_tier: "Low Risk", verified: true },
        { id: "2", company_name: "AgriNord", sector: "Agriculture", latest_score: 55, latest_risk_tier: "Medium Risk", verified: true },
        { id: "3", company_name: "Sfax Manufacturers", sector: "Manufacturing", latest_score: 30, latest_risk_tier: "High Risk", verified: false },
        { id: "4", company_name: "HealthConnect TN", sector: "Tech", latest_score: 72, latest_risk_tier: "Low Risk", verified: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSMEs();
  }, []);

  const filteredSMEs = filterSector ? smes.filter(s => s.sector === filterSector) : smes;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 flex gap-8">
      
      {/* Sticky Filtering Sidebar */}
      <aside className="w-64 shrink-0">
        <div className="sticky top-24 glass-panel p-6 rounded-2xl">
          <h2 className="text-lg font-bold mb-6 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-neon-blue" /> Filters
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Sector</label>
              <select 
                value={filterSector} 
                onChange={e => setFilterSector(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/10 rounded-lg p-2 text-white text-sm"
              >
                <option value="">All Sectors</option>
                <option value="Tech">Tech</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Agriculture">Agriculture</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Risk Appetite</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="accent-neon-green" defaultChecked />
                  <span>Low Risk (Scores &ge; 67)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="accent-[#ffcc00]" defaultChecked />
                  <span>Medium Risk (Scores 45-66)</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="accent-neon-orange" />
                  <span>High Risk (Scores &lt; 45)</span>
                </label>
              </div>
            </div>

            <hr className="border-white/10" />

            <button className="w-full flex items-center justify-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </button>
          </div>
        </div>
      </aside>

      {/* Main Data Table Area */}
      <div className="flex-1">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold">Deal Flow Marketplace</h1>
            <p className="text-gray-400">Discover AI-vetted Tunisian SMEs seeking financing.</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search companies..." className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:border-neon-blue focus:outline-none focus:ring-1 focus:ring-neon-blue w-64" />
          </div>
        </div>

        <div className="glass-panel overflow-hidden rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-4 text-sm font-semibold text-gray-300">Company Name</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Sector</th>
                <th className="p-4 text-sm font-semibold text-gray-300">FinScore</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Risk Tier</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">Loading marketplace data...</td>
                </tr>
              ) : filteredSMEs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No SMEs match your filters.</td>
                </tr>
              ) : (
                filteredSMEs.map((sme, idx) => {
                  let badgeColors = "bg-gray-500/20 text-gray-400 border-gray-500";
                  if (sme.latest_risk_tier === "Low Risk") badgeColors = "bg-neon-green/10 text-neon-green border-neon-green/30";
                  if (sme.latest_risk_tier === "Medium Risk") badgeColors = "bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/30";
                  if (sme.latest_risk_tier === "High Risk") badgeColors = "bg-neon-orange/10 text-neon-orange border-neon-orange/30";

                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={sme.id} 
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                    >
                      <td className="p-4 font-medium flex items-center">
                        {sme.company_name}
                        {sme.verified && <span className="ml-2 w-2 h-2 rounded-full bg-neon-blue" title="Verified Data"></span>}
                      </td>
                      <td className="p-4 text-sm text-gray-400">{sme.sector}</td>
                      <td className="p-4 font-bold text-white">{sme.latest_score !== null ? 300 + (sme.latest_score/100)*550 : "N/A"}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeColors}`}>
                          {sme.latest_risk_tier || "Unscored"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-neon-blue group-hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5 ml-auto" />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
