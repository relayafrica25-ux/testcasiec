import React, { useState, useEffect } from 'react';
import { Hero } from './Hero';
import { FuturisticCarousel } from './FuturisticCarousel';
import { FAQSection } from './FAQSection';
import { Wallet, Network, CheckCircle, Target, Compass, Zap, Gem, ShieldCheck, Mail, Globe, Phone, Send, Clock, ChevronRight, ArrowRight, Database, Landmark, Briefcase, ChevronsRight, Check, Sparkles, BookOpen, Calendar } from 'lucide-react';
import { storageService } from '../services/storageService';
import { ContactInquiry, Article } from '../types';
import { useToast } from './Toast';
import { Logo } from './Logo';
import { BroastreetLogo } from './BroastreetLogo';

interface HomePageProps {
  onApplyClick: () => void;
  onNavigate: (view: string) => void;
  onOpenArticle: (article: Article) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onApplyClick, onNavigate, onOpenArticle }) => {
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const loadLatestArticles = async () => {
      const stored = await storageService.getArticles();
      setLatestArticles(stored.slice(0, 3));
    };
    loadLatestArticles();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inquiry: ContactInquiry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleString(),
        ...contactForm,
        status: 'Unread'
      };

      const result = await storageService.saveInquiry(inquiry);

      if (result.success) {
        setIsSubmitting(false);
        setSubmitted(true);
        showToast('Inquiry sent successfully! We will get back to you soon.', 'success');
        setContactForm({ fullName: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setIsSubmitting(false);
        showToast(result.message || 'Failed to send inquiry. Please try again later.', 'error');
      }
    } catch (error) {
      setIsSubmitting(false);
      showToast('An unexpected error occurred. Please check your connection.', 'error');
    }
  };


  return (
    <article className="bg-nova-950 overflow-hidden">
      <Hero
        onGetFundedClick={onApplyClick}
        onViewMandatesClick={() => onNavigate('about')}
      />

      {/* Strategic Alliances Banner */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-32 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <div className="flex flex-col items-center">
              <Logo size="md" />
              <span className="text-[10px] font-black text-nova-accent tracking-[0.3em] lowercase -mt-1">financials</span>
            </div>

            <div className="h-10 w-px bg-white/20 hidden md:block"></div>

            <div className="flex flex-col items-center">
              <BroastreetLogo size="md" />
              <span className="text-[10px] font-black text-orange-500 tracking-[0.3em] uppercase -mt-1 italic">DyDX alliance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Curated Insights Section */}
      <section className="py-32 relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Market Insights.</h2>
            </div>
            <button
              onClick={() => onNavigate('insights')}
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all text-white"
            >
              Explore Hub <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article, idx) => (
              <div
                key={article.id}
                onClick={() => onOpenArticle(article)}
                className="group flex flex-col glass-panel rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-nova-500/50 transition-all duration-500 cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="h-56 relative overflow-hidden">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-70 group-hover:opacity-100"
                      alt={article.title}
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${article.imageGradient} opacity-30`}></div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest rounded-full border border-white/10">{article.category}</span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <Calendar size={12} className="text-nova-400" /> {article.date}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight group-hover:text-nova-400 transition-colors line-clamp-2 tracking-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 text-sm font-medium leading-relaxed line-clamp-2 mb-8">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">By {article.author}</span>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-nova-400 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            <div className="group relative bg-white/[0.04] border border-white/10 p-10 md:p-14 rounded-[3rem] hover:border-nova-500/50 transition-all duration-500 flex flex-col shadow-2xl">
              <div className="w-16 h-16 bg-nova-500/20 rounded-2xl flex items-center justify-center text-nova-400 mb-10 group-hover:scale-110 transition-transform shadow-inner">
                <Wallet size={32} />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">Casiec Financials</h2>
              <p className="text-gray-200 mb-8 leading-relaxed font-medium">Lending solutions managed by CASIEC Financials, focused on financial intermediation and NMSE stimulation.</p>
              <ul className="space-y-4 mb-12 flex-grow">
                {["Wealth Management", "NMSE Development Credit", "Wealth Management Advisory", "Supply Chain Liquidity"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-nova-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => onNavigate('financial-support')} className="w-full py-5 bg-nova-500 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-nova-400 transition-all shadow-xl shadow-nova-500/20">
                Access Portfolio
              </button>
            </div>

            <div className="group relative bg-white/[0.04] border border-white/10 p-10 md:p-14 rounded-[3rem] hover:border-orange-500/50 transition-all duration-500 flex flex-col shadow-2xl">
              <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400 mb-10 group-hover:scale-110 transition-transform shadow-inner">
                <Briefcase size={32} />
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase italic">GSI Alliances</h2>
              <p className="text-gray-200 mb-8 leading-relaxed font-medium">Global Strategic Alliances powered by Broastreet DyDX, delivering corporate research and logistics architecture.</p>
              <ul className="space-y-4 mb-12 flex-grow">
                {["Business Development", "Strategic Outsourcing", "Coperate finance & Advisory"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-sm font-bold text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => onNavigate('business-support')} className="w-full py-5 bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/20">
                Explore Advisory
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Campaign Showcase */}
      <section className="py-32 relative border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-[10px] font-black text-nova-400 uppercase tracking-[0.5em] mb-6">Strategic Focus</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Institutional Showcase.</h3>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-300 uppercase font-black tracking-widest border border-white/20 px-6 py-3 rounded-full bg-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span> Live Update Stream
            </div>
          </div>
          <FuturisticCarousel />
        </div>
      </section>

      <FAQSection />

      {/* Global Uplink / Contact */}
      <section className="py-32 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic mb-8">Consultancy Uplink.</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-12 font-medium">
                Direct communication lines for institutional partners and enterprise clients. Professional responses within 24 hours.
              </p>
              <div className="space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white"><Mail size={24} /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Electronic Mail</p>
                    <a href="mailto:info@casiecfinancials.com" className="text-lg font-bold text-white hover:text-nova-500 transition-colors">info@casiecfinancials.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white"><Globe size={24} /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Global Presence</p>
                    <div className="flex gap-4">
                      <a href="http://www.casiecfinancials.com" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-200 hover:text-white transition-colors">casiecfinancials.com</a>
                      <span className="text-gray-700">|</span>
                      <a href="http://www.broastreet.africa" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-200 hover:text-white transition-colors">broastreet.africa</a>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white"><Phone size={24} /></div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Secure Lines</p>
                    <div className="flex flex-col text-sm text-gray-200 font-mono font-bold">
                      <span>+234 818-398-7171</span>
                      <span>+234 810-326-0048</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-1 bg-gradient-to-br from-white/20 via-transparent to-white/10 rounded-[3rem]">
              <div className="bg-nova-900 rounded-[2.8rem] p-10 md:p-14 shadow-2xl border border-white/5">
                {submitted ? (
                  <div className="text-center py-16 animate-fade-in-up">
                    <CheckCircle size={64} className="mx-auto text-orange-500 mb-6" />
                    <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase italic">Transmission Complete</h3>
                    <p className="text-gray-200 font-medium">Your inquiry has been logged in our secure system.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-3 ml-2">Identity</label>
                        <input required type="text" value={contactForm.fullName} onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-bold placeholder:text-gray-600" placeholder="Full Name" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-3 ml-2">Email Address</label>
                        <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-bold placeholder:text-gray-600" placeholder="Corporate Email" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-3 ml-2">Contact Number</label>
                      <input required type="tel" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-bold placeholder:text-gray-600" placeholder="+234..." />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-3 ml-2">Subject of Inquiry</label>
                      <input required type="text" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-bold placeholder:text-gray-600" placeholder="e.g. Asset Finance Inquiry" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 uppercase font-black tracking-widest mb-3 ml-2">Detailed Brief</label>
                      <textarea required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full h-32 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all resize-none text-sm font-medium placeholder:text-gray-600" placeholder="Describe your requirements..." />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-white text-nova-950 font-black py-5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] hover:bg-nova-500 hover:text-white active:scale-95">
                      {isSubmitting ? 'Transmitting...' : 'Send Inquiry'} <Send size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};
