import React from 'react';
import { Crown, TrendingUp, Shield, ArrowRight, Lock, PieChart, Network } from 'lucide-react';

export const InvestmentPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-[#050508]">
      {/* Luxury Header */}
      <div className="relative py-24 text-center px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-600/10 rounded-full blur-[100px] -z-10"></div>
        <Crown className="mx-auto text-yellow-500 h-12 w-12 mb-6" />
        <h1 className="text-4xl md:text-7xl font-serif font-medium text-white mb-6 leading-tight">
          Investment & <span className="text-yellow-500 italic">Partnership Opportunities</span>
        </h1>
      </div>

      {/* Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-500 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-8 group-hover:scale-110 transition-transform">
              <Network size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tighter">Professional Linkages</h3>
          </div>
          
          <div className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-500 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-8 group-hover:scale-110 transition-transform">
              <PieChart size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tighter">Equity Stakes</h3>
          </div>

          <div className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-500 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-8 group-hover:scale-110 transition-transform">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tighter">Investment</h3>
          </div>
        </div>
      </section>

      {/* Action Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex justify-center">
          <a href="mailto:info@casiecfinancials.com" className="inline-flex items-center gap-6 text-yellow-500 hover:text-white transition-all group cursor-pointer bg-white/5 px-8 py-5 rounded-2xl border border-white/5 hover:border-yellow-500/40">
            <span className="text-sm font-black uppercase tracking-[0.3em]">Contact Us</span>
            <div className="bg-yellow-500 text-black p-2 rounded-full group-hover:scale-110 transition-all">
              <ArrowRight size={20} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};