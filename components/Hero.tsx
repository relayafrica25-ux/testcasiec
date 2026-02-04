import React from 'react';
import { Shield, Building2, Briefcase } from 'lucide-react';
import { MarketChart } from './MarketChart';

interface HeroProps {
  onGetFundedClick: () => void;
  onViewMandatesClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetFundedClick, onViewMandatesClick }) => {
  return (
    <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-nova-950">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-nova-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-20 items-center">
          
          <div className="lg:col-span-7 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white mb-12 leading-[1.1] animate-fade-in-up uppercase italic">
              Bespoke Credit solutions <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-nova-500">
                & business support services to Nano, Micro, small and medium enterprises (NMSME).
              </span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <button 
                onClick={onGetFundedClick}
                className="px-10 py-4 rounded-xl bg-white text-nova-950 font-black uppercase tracking-widest text-[11px] hover:bg-nova-500 hover:text-white transition-all shadow-xl shadow-white/10 active:scale-95"
              >
                Access Solutions
              </button>
              <button 
                onClick={onViewMandatesClick}
                className="px-10 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all active:scale-95"
              >
                View Mandates
              </button>
            </div>
            
          </div>

        
        </div>
      </div>
    </div>
  );
};