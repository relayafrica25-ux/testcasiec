import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock, Calendar, User, Share2, ChevronRight, Newspaper, Sparkles, Facebook, Twitter, Linkedin, CheckCircle2, Send, Bookmark, Quote } from 'lucide-react';
import { Article } from '../types';
import { storageService } from '../services/storageService';

interface ArticleDetailPageProps {
  article: Article;
  onBack: () => void;
  onOpenArticle: (article: Article) => void;
  onNavigate: (view: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ article, onBack, onOpenArticle, onNavigate }) => {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Filter related articles (same category, excluding current)
  const relatedArticles = useMemo(() => {
    const related = allArticles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 3);

    // Fill with others if category is empty
    if (related.length < 3) {
      const others = allArticles.filter(a => a.id !== article.id && a.category !== article.category);
      related.push(...others.slice(0, 3 - related.length));
    }
    return related;
  }, [article.id, allArticles]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadAllArticles = async () => {
      const articles = await storageService.getArticles();
      setAllArticles(articles);
    };
    loadAllArticles();
  }, [article.id]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      await storageService.saveNewsletterSubscription(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-[#020617] selection:bg-nova-500">
      {/* Editorial Header */}
      <header className="relative pt-20 pb-12 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] mb-12"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Insights
          </button>

          <div className="flex items-center gap-4 mb-8 animate-fade-in-up">
            <span className="px-4 py-1.5 bg-nova-500/10 border border-nova-500/20 text-nova-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
              {article.category}
            </span>
            <div className="h-px w-12 bg-white/10"></div>
            <span className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
              <Clock size={12} /> {article.readTime}
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight uppercase italic animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 py-8 border-y border-white/5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 overflow-hidden">
                <User size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">By {article.author}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-2">
                  <Calendar size={10} /> {article.date}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {[Twitter, Linkedin].map((Icon, idx) => (
                <button key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-colors">
                  <Icon size={16} />
                </button>
              ))}
              <button className="p-3 bg-nova-500/10 border border-nova-500/20 rounded-xl text-nova-400 hover:text-white hover:bg-nova-500 transition-all">
                <Bookmark size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Article Image */}
      <section className="max-w-6xl mx-auto px-4 mb-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              className="w-full h-full object-cover"
              alt={article.title}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${article.imageGradient}`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Newspaper size={120} className="text-white" />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-nova-950/40 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Article Body Content */}
      <main className="pb-24 max-w-4xl mx-auto px-4 flex flex-col md:flex-row gap-16 relative">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:block w-48 shrink-0 sticky top-40 h-fit space-y-12">
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Reading Progress</h4>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-nova-500 w-1/3"></div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Expert Support</h4>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[11px] text-gray-400 leading-relaxed italic mb-4">"Need strategic advisory for your next asset acquisition?"</p>
              <button
                onClick={() => onNavigate('business-support')}
                className="w-full py-2 bg-nova-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-nova-400 transition-all"
              >
                Consult GSI
              </button>
            </div>
          </div>
        </aside>

        <article className="flex-grow prose prose-invert prose-p:text-gray-300 prose-p:text-xl prose-p:leading-relaxed prose-p:font-light prose-p:mb-10 max-w-none">
          {/* Executive Summary / Lead Paragraph */}
          <div className="relative mb-16 p-8 md:p-12 bg-white/[0.02] border border-nova-500/20 rounded-[2.5rem] overflow-hidden">
            <div className="absolute -top-4 -left-4 opacity-10">
              <Quote size={80} className="text-nova-500" />
            </div>
            <p className="text-2xl md:text-3xl text-white font-bold leading-tight tracking-tight italic relative z-10">
              {article.excerpt}
            </p>
          </div>

          <div className="space-y-10 text-xl text-gray-300 leading-relaxed font-light first-letter:text-7xl first-letter:font-black first-letter:text-nova-400 first-letter:mr-3 first-letter:float-left first-letter:mt-3">
            {!article.content ? (
              <>
                <p>
                  In the rapidly shifting landscape of continental finance, the ability to architect structured capital remains the primary differentiator for sustainable growth. As we move into the current fiscal cycle, the integration of institutional-grade intermediation is no longer just an advantage—it is a mandatory requirement for NMSE scaling.
                </p>

                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mt-16 mb-8 border-b border-white/5 pb-4">The Infrastructure of Inclusion</h2>
                <p>
                  True economic empowerment is built on the foundation of accessible liquidity. At CASIEC, our mandate focuses on bridging the gap between local enterprise potential and the global institutional capital required to realize that vision. Through specialized asset finance and working capital facilities, we are redefining the standards of financial inclusion.
                </p>

                <div className="my-16 flex flex-col md:flex-row gap-8 items-center bg-nova-500/5 p-10 rounded-[2.5rem] border border-nova-500/10">
                  <div className="w-20 h-20 shrink-0 bg-nova-500/20 rounded-2xl flex items-center justify-center text-nova-400">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">Institutional Insight</h4>
                    <p className="text-sm text-gray-400 leading-relaxed italic">
                      "Growth is the byproduct of strategic precision and ethical integrity. We don't just provide funding; we build the corporate backbone for the next generation of African giants."
                    </p>
                  </div>
                </div>

                <p>
                  Looking ahead, our strategic alliances with partners like Broastreet DyDX will continue to provide the logistics and research backbone necessary for enterprise sustainability. The future of finance is collaborative, data-driven, and radically committed to excellence. By aligning our credit mandates with regional development goals, we ensure that every naira deployed contributes to the broader narrative of African prosperity.
                </p>
              </>
            ) : (
              article.content.split('\n').map((para, i) => (
                <p key={i} className="mb-8">{para}</p>
              ))
            )}
          </div>

          {/* Share Footnote */}
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-gray-500">
              <Share2 size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Transmit Knowledge</span>
            </div>
            <div className="flex gap-4">
              <button className="px-5 py-2 rounded-full border border-white/5 text-[10px] font-black uppercase text-gray-400 hover:text-white hover:border-white/20 transition-all">Report Error</button>
              <button className="px-5 py-2 rounded-full border border-white/5 text-[10px] font-black uppercase text-gray-400 hover:text-white hover:border-white/20 transition-all">Archive Article</button>
            </div>
          </div>
        </article>
      </main>

      {/* Subscription Footer */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="p-12 md:p-20 bg-gradient-to-br from-nova-900 to-[#020617] border border-white/10 rounded-[4rem] text-center relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-10"></div>
          <Newspaper size={48} className="text-nova-500 mx-auto mb-8 animate-float" />
          <h3 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase italic tracking-tighter">The Intelligence Feed.</h3>
          <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto font-medium leading-relaxed">Receive institutional-grade market briefs, rate shifts, and private deal flow alerts directly in your terminal.</p>

          {subscribed ? (
            <div className="flex flex-col items-center animate-fade-in-up">
              <CheckCircle2 size={56} className="text-emerald-500 mb-4" />
              <p className="text-white font-black uppercase tracking-widest text-base">Transmission Confirmed. You're synchronized.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto relative z-10">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Corporate Email"
                  className="w-full bg-black/40 border border-white/10 rounded-full py-5 px-8 text-white text-sm font-bold focus:outline-none focus:border-nova-500 transition-all placeholder:text-gray-600"
                />
                <button
                  type="submit"
                  className="px-12 py-5 bg-white text-nova-900 font-black uppercase tracking-widest text-xs rounded-full hover:bg-nova-500 hover:text-white transition-all shadow-2xl flex items-center gap-2 active:scale-95 flex-shrink-0"
                >
                  Subscribe <Send size={14} />
                </button>
              </div>
              <p className="text-[9px] text-gray-600 mt-6 uppercase tracking-[0.3em] font-black">Powered by CASIEC Intelligence Division</p>
            </form>
          )}
        </div>
      </section>

      {/* Related Insights Section */}
      <section className="py-24 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-[10px] font-black text-nova-500 uppercase tracking-[0.5em] mb-4">Discovery Engine</h2>
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Institutional Reading.</h3>
            </div>
            <button
              onClick={onBack}
              className="hidden md:flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all"
            >
              The Archives <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onOpenArticle(rel)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="h-64 rounded-[2.5rem] overflow-hidden mb-8 relative">
                  {rel.imageUrl ? (
                    <img
                      src={rel.imageUrl}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      alt={rel.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${rel.imageGradient} opacity-30`}></div>
                  )}
                  <div className="absolute top-6 left-6">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest rounded-full">{rel.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                  <Calendar size={12} /> {rel.date}
                </div>
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-nova-400 transition-colors leading-tight line-clamp-2 tracking-tight">{rel.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light">{rel.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
