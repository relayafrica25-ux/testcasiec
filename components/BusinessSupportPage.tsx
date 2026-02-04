import React from 'react';
import { ArrowRight, Check, Target, Award, Landmark, Rocket, Network, Compass, Briefcase, Globe } from 'lucide-react';
import { BroastreetLogo } from './BroastreetLogo';

interface BusinessSupportPageProps {
  onInquireClick: () => void;
}

export const BusinessSupportPage: React.FC<BusinessSupportPageProps> = ({ onInquireClick }) => {
  const products = [
    {
      title: "Business Development",
      description: "Amplifying market lead with winning strategies to strengthen market position.",
      icon: <Rocket size={32} className="text-orange-400" />
    },
    {
      title: "Strategic Outsourcing",
      description: "Unlocking efficiency and focusing on Core Strength.",
      icon: <Network size={32} className="text-orange-400" />
    },
    {
      title: "Expert Advisory",
      description: "Guided Insights. Connecting businesses with Value drivers.",
      icon: <Compass size={32} className="text-orange-400" />
    },
    {
      title: "Corporate Finance & Advisory",
      description: "Credit & Capital Raise: Scaling capital & Credit Access.",
      icon: <Landmark size={32} className="text-orange-400" />
    }
  ];

  return (
    <div className="pt-32 min-h-screen bg-nova-900 selection:bg-orange-500">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-8 transform hover:scale-105 transition-transform duration-500">
            <BroastreetLogo size="md" />
          </div>

          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white uppercase italic leading-[0.9]">
            Strategic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-white to-orange-200">
              Intervention.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            GSI STRATEGIC ALLIANCES (Broastreet DyDX) provides the corporate engineering required for enterprise sustainability through specialized advisory and research.
          </p>

          <button
            onClick={onInquireClick}
            className="px-12 py-5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-orange-600/30 active:scale-95"
          >
            Initiate Advisory
          </button>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="py-24 relative border-y border-white/5">
        <div className="absolute inset-0 bg-white/[0.01] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col items-center text-center p-8">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-8">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tight">Institutional Excellence</h3>
            </div>
            <div className="flex flex-col items-center text-center p-8">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-8">
                <Globe size={32} className="text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tight">Global Perspective</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Products Grid */}
      <section className="py-32 relative bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-xs font-black text-orange-500 uppercase tracking-[0.4em] mb-4">Core Competencies</h2>
            <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Advisory Mandates.</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <div key={idx} className="group p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/40 transition-all duration-500 flex flex-col">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  {product.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-orange-400 transition-colors uppercase italic tracking-tighter">
                  {product.title}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  {product.description}
                </p>
                <div className="mt-auto pt-8 flex justify-end">
                  <button onClick={onInquireClick} className="text-orange-500/50 group-hover:text-orange-500 transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
