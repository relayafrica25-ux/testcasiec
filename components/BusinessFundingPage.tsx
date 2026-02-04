import React from 'react';
import { Rocket, Zap, Clock, ArrowRight, ShieldCheck, PieChart, Landmark, Coins, TrendingUp, HandCoins, Building, Palette, Users, Layers, Briefcase, FileCheck, Leaf } from 'lucide-react';
import { Logo } from './Logo';

interface BusinessFundingPageProps {
  onApplyClick: () => void;
}

export const BusinessFundingPage: React.FC<BusinessFundingPageProps> = ({ onApplyClick }) => {
  const offerings = [
    {
      title: "Asset Finance",
      icon: <Building className="text-nova-400" />
    },
    {
      title: "Consumer Loan",
      icon: <Coins className="text-purple-400" />
    },
    {
      title: "Working Capital Loans",
      icon: <TrendingUp className="text-nova-accent" />
    },
    {
      title: "Group Loans",
      icon: <Users className="text-emerald-400" />
    },
    {
      title: "Gender Credit",
      icon: <Zap className="text-pink-400" />
    },
    {
      title: "Refinancing Credit",
      icon: <ShieldCheck className="text-orange-400" />
    },
    {
      title: "Creative Economy Loans",
      icon: <Palette className="text-indigo-400" />
    },
    {
      title: "TOP Onlending Loans",
      icon: <Layers className="text-amber-400" />
    },
    {
      title: "Clean Energy Credit",
      icon: <Leaf className="text-emerald-500" />
    },
    {
      title: "And more...",
      icon: <Rocket className="text-gray-400" />
    }
  ];

  return (
    <div className="pt-32 min-h-screen bg-nova-900">
      {/* Hero */}
      <div className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-nova-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-12 animate-fade-in-up">
            <Logo size="md" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter text-white animate-fade-in-up uppercase italic leading-[0.95]">
            Capital that <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nova-400 to-nova-500">Empowers Change.</span>
          </h1>

          <div className="max-w-5xl mx-auto px-4">
            <p className="text-2xl md:text-4xl text-white leading-[1.2] animate-fade-in-up font-black uppercase tracking-tighter italic">
              Casiec’s bespoke financing options + business support solutions in partnership with GSI Strategic Alliances (Broastreet DyDX) drives scalable business growth.
            </p>
          </div>

          <div className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={onApplyClick}
              className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-nova-500 hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Start Your Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid - Minimalist */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {offerings.map((item, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-nova-500/50 transition-all group flex flex-col items-center text-center justify-center min-h-[180px]">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Highlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-nova-900 to-indigo-900 border border-white/10 p-12 lg:p-20 text-center">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Inclusive Credit Mandate</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Our diverse credit products are designed to stimulate every sector of the market economy
            </p>
            <button onClick={onApplyClick} className="text-nova-400 font-bold flex items-center gap-2 mx-auto hover:text-white transition-colors">
              Consult a Specialist <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};