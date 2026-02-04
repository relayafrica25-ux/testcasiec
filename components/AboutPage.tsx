import React from 'react';
import { Target, Compass, Zap, Landmark, Network, Gem, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { BroastreetLogo } from './BroastreetLogo';

export const AboutPage: React.FC = () => {
  return (
    <article className="pt-24 min-h-screen bg-nova-900 selection:bg-nova-500">
      {/* Hero Section */}
      <header className="relative py-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-nova-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-12 tracking-tighter text-white animate-fade-in-up uppercase italic leading-[0.85]">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nova-400 to-nova-500">story.</span>
          </h1>

          <div className="max-w-4xl mx-auto px-4">
            <p className="text-2xl md:text-5xl text-white leading-[1.2] animate-fade-in-up font-black uppercase tracking-tighter italic">
              At <span className="text-nova-400">Casiec</span>, we align finance with <br className="hidden md:block" />
              <span className="text-nova-accent bg-nova-accent/10 px-3 py-0.5 rounded-xl border border-nova-accent/20">impact development goals</span>, <br className="hidden md:block" />
              advancing economic empowerment <br className="hidden md:block" />
              through <span className="text-nova-emerald border-b-4 border-nova-emerald/30">inclusive finance.</span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Narrative */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-10 md:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nova-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-nova-500/10 transition-colors"></div>

            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-nova-500 pl-6 uppercase tracking-tighter italic">Corporate Narrative</h2>
                <div className="space-y-8 text-gray-100 font-medium">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-white tracking-tight">CASIEC Financials: Empowering Growth through Innovative Credit Solutions</h3>
                    <p className="text-lg leading-relaxed text-gray-300">
                      CASIEC Financials is a dynamic financial services company specializing in providing tailored credit solutions to Nano, Micro, Small, and Medium-sized Enterprises (NMSMEs) and consumer lending, driving financial inclusion. Our comprehensive offerings include, but not limited to;
                    </p>

                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                      {[
                        "Asset financing",
                        "Working capital credit",
                        "Gender-focused credit",
                        "Top-of-the-pyramid loans",
                        "Clean energy credit",
                        "Creative economy loans etc"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm font-bold text-white uppercase tracking-wide bg-white/5 p-4 rounded-2xl border border-white/5">
                          <CheckCircle2 size={18} className="text-nova-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-lg leading-relaxed text-gray-300">
                    In strategic partnership with <span className="text-orange-400 font-black">GSI Strategic Alliances (proprietors of BROASTREET DyDX)</span>, we deliver integrated business support services to drive enterprise innovation, growth & sustainability.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-72 flex-shrink-0 space-y-6 sticky top-32">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                  <Logo size="sm" className="mb-4 transform group-hover:scale-105 transition-transform" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">Financial Intermediation</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                  <BroastreetLogo size="sm" className="mb-4 transform group-hover:scale-105 transition-transform" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black">Strategic Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Mandate & Words Grid */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-6">
            <article className="p-8 rounded-[2.5rem] bg-nova-800/60 border border-nova-500/20 hover:border-nova-500 transition-all group hover:translate-y-[-10px] shadow-2xl flex flex-col">
              <div className="w-14 h-14 bg-nova-500/20 rounded-2xl flex items-center justify-center text-nova-400 mb-8 group-hover:scale-110 transition-transform">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Our Vision</h3>
              <p className="text-white leading-relaxed text-lg font-bold">
                To be the leading story and benchmark in finance & business support, setting the standard for excellence.
              </p>
            </article>

            <article className="p-8 rounded-[2.5rem] bg-nova-800/60 border border-purple-500/20 hover:border-purple-500 transition-all group hover:translate-y-[-10px] shadow-2xl flex flex-col">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 transition-transform">
                <Compass size={28} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Our Mission</h3>
              <p className="text-white leading-relaxed text-lg font-bold">
                Delivering credit, capital and enterprise support to stimulate business growth and drive sustainable impact.
              </p>
            </article>

            <article className="p-8 rounded-[2.5rem] bg-nova-800/60 border border-nova-accent/20 hover:border-nova-accent transition-all group hover:translate-y-[-10px] shadow-2xl flex flex-col">
              <div className="w-14 h-14 bg-nova-accent/20 rounded-2xl flex items-center justify-center text-nova-accent mb-8 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Our Mandate</h3>
              <p className="text-white leading-relaxed text-lg font-bold">
                Fostering economic advancement through financial inclusion.
              </p>
            </article>

            <article className="p-8 rounded-[2.5rem] bg-nova-900 border border-emerald-500/20 hover:border-emerald-500 transition-all group hover:translate-y-[-10px] shadow-2xl flex flex-col">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">The GOI Factor</h3>
              <p className="text-emerald-400 leading-tight text-2xl font-black italic tracking-tight">
                God’s Own Institution <br />
                <span className="text-white/60 text-lg font-bold not-italic">(GOI factor)</span>
              </p>
              <p className="text-emerald-400 leading-tight text-2xl font-black italic tracking-tight">
                Words On The Marble<br />
                <span className="text-white/60 text-lg font-bold not-italic">(GOI factor)</span>
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter italic">Core Values</h2>
            <div className="h-1.5 w-24 bg-nova-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Growth & Professionalism", icon: <Gem className="text-nova-400" size={40} /> },
              { title: "Opportunities & Resourcefulness", icon: <Target className="text-purple-400" size={40} /> },
              { title: "Innovation & Integrity", icon: <ShieldCheck className="text-nova-accent" size={40} /> }
            ].map((val, i) => (
              <div key={i} className="flex flex-col items-center p-12 rounded-[3rem] bg-nova-800/40 border border-white/10 text-center group hover:bg-nova-950 transition-all duration-500 hover:shadow-[0_0_60px_rgba(37,99,235,0.15)] hover:border-white/20">
                <div className="mb-8 group-hover:scale-125 transition-transform duration-500">{val.icon}</div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight italic">{val.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};