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

            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
              <div>
                <h4 className="text-3xl font-black text-white">₦750B+</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-2">Capital Deployed</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-white">48hr</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-2">Typical Approval</p>
              </div>
              <div>
                <h4 className="text-3xl font-black text-white">12+</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mt-2">African Markets</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 mt-20 lg:mt-0 relative">
            <div className="relative p-1 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-[3rem]">
              <div className="bg-nova-900 rounded-[2.8rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-nova-500/5 rounded-full blur-2xl"></div>
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Active Pipeline</h3>
                    <div className="text-4xl font-black text-white mt-1 tracking-tighter">₦4.2B</div>
                  </div>
                  <div className="w-12 h-12 bg-nova-500/20 rounded-2xl flex items-center justify-center text-nova-400 shadow-inner">
                    <Shield size={24} />
                  </div>
                </div>
                
                <div className="h-[220px]">
                  <MarketChart />
                </div>

                <div className="space-y-4 mt-8">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><Building2 size={18} /></div>
                       <span className="text-xs font-bold text-gray-100">CRE Bridge Funding</span>
                    </div>
                    <span className="text-[10px] font-black font-mono text-emerald-400">APPROVED</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-nova-500/20 flex items-center justify-center text-nova-400"><Briefcase size={18} /></div>
                       <span className="text-xs font-bold text-gray-100">Working Capital Facility</span>
                    </div>
                    <span className="text-[10px] font-black font-mono text-nova-400">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};