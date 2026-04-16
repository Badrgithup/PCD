"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, TrendingUp, Cpu } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
            <span>AI-Powered Alternative Credit Scoring</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Redefining Credit for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-neon-blue">
              Tunisian SMEs
            </span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Connect your alternative data to unlock instant, fair, and transparent
            financing. Our dual-model AI gives you the score investors trust.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/register" 
              className="px-8 py-4 rounded-full bg-neon-green text-black font-semibold hover:bg-[#00e6b8] transition-all flex items-center shadow-[0_0_20px_rgba(0,255,204,0.3)] hover:shadow-[0_0_30px_rgba(0,255,204,0.5)]"
            >
              Get Your FinScore <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/dashboard/investor" 
              className="px-8 py-4 rounded-full glass-panel hover:bg-white/5 transition-all flex items-center"
            >
              Browse Marketplace
            </Link>
          </div>
        </motion.div>

        {/* 3D Dashboard Preview (Simulated with Framer Motion) */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-20 relative mx-auto w-full max-w-4xl"
          style={{ perspective: "1000px" }}
        >
          <div className="relative rounded-xl glass-panel p-2 overflow-hidden border border-white/10 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent z-0"></div>
            <div className="bg-[#0f172a] rounded-lg h-64 md:h-96 w-full relative z-10 flex flex-col p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="h-4 w-32 bg-white/10 rounded"></div>
                <div className="h-8 w-24 bg-neon-green/20 border border-neon-green rounded-full"></div>
              </div>
              <div className="grid grid-cols-3 gap-4 flex-1">
                <div className="col-span-2 glass-panel rounded-lg flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border-b border-l border-white/20 relative">
                     <div className="absolute bottom-0 left-0 w-full h-[60%] bg-gradient-to-t from-neon-green/20 to-transparent"></div>
                  </div>
                </div>
                <div className="col-span-1 flex flex-col gap-4">
                  <div className="flex-1 glass-panel rounded-lg"></div>
                  <div className="flex-1 glass-panel rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Box */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced Financial Modeling</h2>
          <p className="text-gray-400">Not just another score. Deep insights driven by Dual-Model Stacking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 glass-panel p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-neon-blue/20 rounded-full blur-3xl group-hover:bg-neon-blue/30 transition-all"></div>
            <Cpu className="h-10 w-10 text-neon-blue mb-4" />
            <h3 className="text-2xl font-bold mb-2">Dual-Model Stacking Architecture</h3>
            <p className="text-gray-400 max-w-md">Our algorithm pairs Gradient Boosting for strict financial metrics with Random Forest for behavioral and compliance data, managed by a Logistic Regression meta-model for unparalleled accuracy.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 glass-panel p-8 rounded-3xl relative overflow-hidden group"
          >
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-neon-green/20 rounded-full blur-3xl group-hover:bg-neon-green/30 transition-all"></div>
            <ShieldCheck className="h-10 w-10 text-neon-green mb-4" />
            <h3 className="text-2xl font-bold mb-2">SHAP Explainability</h3>
            <p className="text-gray-400">Total transparency. Instantly know which exact features positively or negatively impact your score using SHAP theory.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-1 glass-panel p-8 rounded-3xl"
          >
            <TrendingUp className="h-10 w-10 text-neon-orange mb-4" />
            <h3 className="text-2xl font-bold mb-2">"What-If" Simulator</h3>
            <p className="text-gray-400">Test different financial scenarios in real-time without committing the data to your permanent record.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-2 glass-panel p-8 rounded-3xl flex flex-col justify-center items-center text-center bg-gradient-to-br from-glass-light to-white/5"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to unlock capital?</h3>
            <Link 
              href="/register" 
              className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
            >
              Join the Platform Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
