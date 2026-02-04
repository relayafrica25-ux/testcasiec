
import React from 'react';
import { Building2, Home, Hammer, ArrowRight, Check } from 'lucide-react';

interface RealEstatePageProps {
  onApplyClick: () => void;
}

export const RealEstatePage: React.FC<RealEstatePageProps> = ({ onApplyClick }) => {
  const programs = [
    {
      title: "Fix & Flip",
      rate: "Starting at 9.5%",
      term: "12 - 24 Months",
      ltv: "Up to 90% LTC",
      desc: "Rapid capital for residential rehab projects. No income verification required.",
      icon: <Hammer className="text-orange-400" size={32} />
    },
    {
      title: "DSCR Rental Loans",
      rate: "Starting at 6.875%",
      term: "30-Year Fixed",
      ltv: "Up to 80% LTV",
      desc: "Long-term financing based on property cash flow, not personal income.",
      icon: <Home className="text-nova-400" size={32} />
    },
    {
      title: "Ground Up Construction",
      rate: "Starting at 10.5%",
      term: "18 - 36 Months",
      ltv: "Up to 85% LTC",
      desc: "Flexible draws and terms for infill, multi-unit, and spec home builders.",
      icon: <Building2 className="text-blue-400" size={32} />
    },
    {
      title: "Multifamily Bridge",
      rate: "Starting at 8.99%",
      term: "12 - 36 Months",
      ltv: "Up to 75% LTV",
      desc: "Value-add financing for apartment complexes with 5+ units. Non-recourse available.",
      icon: <Building2 className="text-purple-400" size={32} />
    }
  ];

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/10 skew-y-3 transform origin-top-left -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:w-2/3">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              Constructing <br/> The Future.
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed border-l-4 border-blue-500 pl-6">
              Institutional-grade capital for real estate investors. <br/>
              Whether you are flipping a single family home or stabilizing a 100-unit complex, we have the liquidity you need.
            </p>
            <button 
              onClick={onApplyClick}
              className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              Get Rates & Terms <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          {programs.map((prog, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-blue-400/50 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700"></div>
              
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-white/5 rounded-2xl">
                  {prog.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{prog.rate}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Interest Rate</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-3">{prog.title}</h3>
              <p className="text-gray-400 mb-6 h-12">{prog.desc}</p>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                <div>
                  <div className="text-sm text-gray-500">Term Length</div>
                  <div className="font-semibold text-blue-200">{prog.term}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Leverage</div>
                  <div className="font-semibold text-blue-200">{prog.ltv}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <section className="bg-nova-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <h2 className="text-4xl font-bold mb-6">Why Investors Choose CASIEC</h2>
                    <ul className="space-y-4">
                        {[
                            "Close in as little as 5 business days",
                            "No personal income verification (DSCR)",
                            "Foreign nationals eligible",
                            "Portfolio blanket loans available",
                            "In-house construction management"
                        ].map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                                <div className="bg-green-500/20 p-1 rounded-full text-green-400">
                                    <Check size={16} />
                                </div>
                                <span className="text-lg text-gray-300">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1 bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-3xl">
                    <div className="bg-nova-900 rounded-[22px] p-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Recent Closing</h3>
                            <p className="text-gray-400 mb-6">Multifamily Value-Add</p>
                            <div className="text-5xl font-bold text-white mb-2">$8.5M</div>
                            <div className="text-blue-400 font-mono mb-8">Austin, TX</div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <div className="text-gray-500">LTV</div>
                                    <div className="font-bold">75%</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <div className="text-gray-500">Rate</div>
                                    <div className="font-bold">8.25%</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <div className="text-gray-500">Days</div>
                                    <div className="font-bold">21</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};
