"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, AlertTriangle, ShieldCheck, Loader2 } from "lucide-react";
import apiClient from "@/lib/api/axios";

const MOCK_SMES = [
  { id: "1", name: "TechMakers Tunis", sector: "Technology", turnover: "120,000 TND", cnssRatio: "98%", finScore: 780, riskTier: "Low" },
  { id: "2", name: "AgriSud Sfax", sector: "Agriculture", turnover: "450,000 TND", cnssRatio: "85%", finScore: 610, riskTier: "Medium" },
  { id: "3", name: "Carthage Logistics", sector: "Transport", turnover: "850,000 TND", cnssRatio: "92%", finScore: 710, riskTier: "Low" },
  { id: "4", name: "MedTex Bizerte", sector: "Textile", turnover: "320,000 TND", cnssRatio: "60%", finScore: 480, riskTier: "High" },
  { id: "5", name: "Sousse E-Commerce Hub", sector: "E-Commerce", turnover: "150,000 TND", cnssRatio: "100%", finScore: 810, riskTier: "Low" },
  { id: "6", name: "GreenEnergy Gabes", sector: "Clean Energy", turnover: "600,000 TND", cnssRatio: "80%", finScore: 650, riskTier: "Medium" },
  { id: "7", name: "La Marsa Culinary", sector: "Food & Beverage", turnover: "90,000 TND", cnssRatio: "100%", finScore: 740, riskTier: "Low" },
  { id: "8", name: "BuildCo Nabeul", sector: "Construction", turnover: "1,200,000 TND", cnssRatio: "45%", finScore: 420, riskTier: "High" },
  { id: "9", name: "Djerba Tourism Services", sector: "Tourism", turnover: "500,000 TND", cnssRatio: "75%", finScore: 590, riskTier: "Medium" },
  { id: "10", name: "Kairouan Artisans", sector: "Crafts", turnover: "60,000 TND", cnssRatio: "100%", finScore: 720, riskTier: "Low" },
  { id: "11", name: "Sfax MetalWorks", sector: "Manufacturing", turnover: "950,000 TND", cnssRatio: "65%", finScore: 510, riskTier: "High" },
  { id: "12", name: "Ariana Medical IT", sector: "Health Tech", turnover: "200,000 TND", cnssRatio: "100%", finScore: 820, riskTier: "Low" },
  { id: "13", name: "Gafsa Mining Support", sector: "Industrial", turnover: "1,500,000 TND", cnssRatio: "85%", finScore: 680, riskTier: "Medium" },
  { id: "14", name: "Tozeur Dates Export", sector: "Agriculture", turnover: "750,000 TND", cnssRatio: "90%", finScore: 760, riskTier: "Low" },
  { id: "15", name: "Le Kram Import/Export", sector: "Trade", turnover: "300,000 TND", cnssRatio: "50%", finScore: 450, riskTier: "High" },
];

interface SME {
  id: string;
  name: string;
  sector: string;
  turnover: string;
  cnssRatio: string;
  finScore: number;
  riskTier: string;
}

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [smeData, setSmeData] = useState<SME[]>(MOCK_SMES);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<"live" | "mock">("mock");

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const res = await apiClient.get("/marketplace/browse");
        const listings = res.data.listings;
        
        if (listings && listings.length > 0) {
          const mapped: SME[] = listings.map((item: any, index: number) => ({
            id: item.profile_id || String(index + 1),
            name: item.company_name || "Unknown SME",
            sector: item.sector || "N/A",
            turnover: "N/A",
            cnssRatio: "N/A",
            finScore: item.latest_fin_score ?? 0,
            riskTier: item.latest_risk_tier ?? "N/A",
          }));
          setSmeData(mapped);
          setDataSource("live");
        }
        // If listings is empty, keep mock data
      } catch (err) {
        console.warn("Marketplace API unavailable, using demo data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketplace();
  }, []);

  const filteredData = smeData.filter(
    (sme) =>
      sme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sme.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "Low": case "Low Risk": return <ShieldCheck className="w-4 h-4 mr-1.5" />;
      case "Medium": case "Medium Risk": return <TrendingUp className="w-4 h-4 mr-1.5" />;
      case "High": case "High Risk": return <AlertTriangle className="w-4 h-4 mr-1.5" />;
      default: return null;
    }
  };

  const getTierColor = (tier: string) => {
    if (tier.toLowerCase().includes("low")) return "text-teal-400 bg-teal-400/10 border-teal-400/20";
    if (tier.toLowerCase().includes("medium")) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
    if (tier.toLowerCase().includes("high")) return "text-red-400 bg-red-400/10 border-red-400/20";
    return "text-gray-400 bg-gray-400/10 border-gray-400/20";
  };

  const getScoreColor = (tier: string) => {
    if (tier.toLowerCase().includes("low")) return "text-teal-400";
    if (tier.toLowerCase().includes("medium")) return "text-yellow-400";
    if (tier.toLowerCase().includes("high")) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className="pt-32 pb-24 min-h-screen px-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Investor Marketplace</h1>
            <p className="text-gray-400">
              Discover and evaluate vetted Tunisian SMEs seeking capital.
              {dataSource === "mock" && !isLoading && (
                <span className="ml-2 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full border border-yellow-400/20">Demo Data</span>
              )}
              {dataSource === "live" && (
                <span className="ml-2 text-xs text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full border border-teal-400/20">Live Data</span>
              )}
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company or sector..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white outline-none" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-teal-400" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-5 text-sm font-bold text-gray-300 uppercase tracking-wider">Company Profile</th>
                    <th className="px-6 py-5 text-sm font-bold text-gray-300 uppercase tracking-wider">Sector</th>
                    <th className="px-6 py-5 text-sm font-bold text-gray-300 uppercase tracking-wider">Turnover</th>
                    <th className="px-6 py-5 text-sm font-bold text-gray-300 uppercase tracking-wider">CNSS Ratio</th>
                    <th className="px-6 py-5 text-sm font-bold text-gray-300 uppercase tracking-wider text-right">FinScore Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredData.length > 0 ? (
                    filteredData.map((sme, index) => (
                      <motion.tr key={sme.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-white/5 transition-colors group cursor-pointer">
                        <td className="px-6 py-5">
                          <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{sme.name}</div>
                          <div className="text-xs text-gray-500 mt-1 font-mono">ID: {sme.id.toString().padStart(5, '0')}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">{sme.sector}</span>
                        </td>
                        <td className="px-6 py-5 text-gray-300 font-mono text-sm">{sme.turnover}</td>
                        <td className="px-6 py-5 text-gray-300 font-mono text-sm">{sme.cnssRatio}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <span className={`text-xl font-bold ${getScoreColor(sme.riskTier)}`}>{sme.finScore}</span>
                            <div className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${getTierColor(sme.riskTier)}`}>
                              {getTierIcon(sme.riskTier)}
                              {sme.riskTier.includes("Risk") ? sme.riskTier : `${sme.riskTier} Risk`}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Filter className="w-12 h-12 mb-4 opacity-50" />
                          <p className="text-lg font-medium text-gray-400 mb-1">No SMEs found</p>
                          <p className="text-sm">Try adjusting your search filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
