import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Article } from '../types';
import { ArrowRight, BookOpen, Clock, Tag, Search, TrendingUp, Filter, Hash, Sparkles, ChevronRight, Cpu, ExternalLink, Image as ImageIcon, Flame, Newspaper } from 'lucide-react';

interface ArticleHubPageProps {
   onOpenArticle: (article: Article) => void;
}

export const ArticleHubPage: React.FC<ArticleHubPageProps> = ({ onOpenArticle }) => {
   const [activeCategory, setActiveCategory] = useState('All');
   const [storedArticles, setStoredArticles] = useState<Article[]>([]);
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
      const loadContent = async () => {
         const articles = await storageService.getArticles();
         setStoredArticles(articles);
      };
      loadContent();
   }, []);

   const categories = ['All', 'Strategy', 'Real Estate', 'Eco-Finance', 'Guide', 'Tech'];

   const filteredInsights = storedArticles.filter(insight => {
      const matchesCategory = activeCategory === 'All' || insight.category === activeCategory;
      const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         insight.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
   });

   const featured = storedArticles[0];

   return (
      <div className="pt-24 min-h-screen bg-[#050508] selection:bg-nova-500">

         {/* Editorial Header */}
         <section className="relative pt-20 pb-32 overflow-hidden border-b border-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-nova-500/5 rounded-full blur-[120px] -z-10"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               <div className="flex flex-col items-center text-center mb-24">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-nova-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-fade-in-up">
                     <Sparkles size={14} className="animate-pulse" />
                     The Intelligence Hub
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9] animate-fade-in-up">
                     Market <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-400 via-white to-purple-400">Insights.</span>
                  </h1>
                  <p className="text-gray-500 text-lg max-w-xl mx-auto mt-8 font-light leading-relaxed animate-fade-in-up">
                     Institutional-grade knowledge and strategic intel curated for competitive advantage.
                  </p>
               </div>

               {/* Featured Spread */}
               {featured && !searchQuery && activeCategory === 'All' && (
                  <div
                     onClick={() => onOpenArticle(featured)}
                     className="group relative cursor-pointer glass-panel rounded-[4rem] border border-white/10 overflow-hidden animate-fade-in-up hover:border-nova-500/40 transition-all duration-700 shadow-2xl"
                  >
                     <div className="grid lg:grid-cols-2">
                        <div className="p-12 md:p-20 flex flex-col justify-center relative z-10">
                           <div className="flex items-center gap-4 mb-8">
                              <span className="px-4 py-1 bg-nova-500/10 border border-nova-500/20 text-nova-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">Featured Analysis</span>
                              <div className="h-px w-12 bg-white/10"></div>
                           </div>
                           <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight group-hover:text-nova-400 transition-colors">
                              {featured.title}
                           </h2>
                           <p className="text-xl text-gray-400 leading-relaxed mb-12 font-light line-clamp-3">
                              {featured.excerpt}
                           </p>
                           <div className="flex items-center justify-between pt-10 border-t border-white/5">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-full bg-nova-500/20 border border-white/10 flex items-center justify-center text-nova-400">
                                    <Newspaper size={20} />
                                 </div>
                                 <div>
                                    <p className="text-white font-bold text-sm">By {featured.author}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">{featured.date} • {featured.readTime}</p>
                                 </div>
                              </div>
                              <div className="w-14 h-14 rounded-full bg-white text-nova-900 flex items-center justify-center group-hover:bg-nova-400 group-hover:text-white transition-all group-hover:scale-110">
                                 <ArrowRight size={24} />
                              </div>
                           </div>
                        </div>
                        <div className="relative h-[500px] lg:h-auto overflow-hidden">
                           {featured.imageUrl ? (
                              <img
                                 src={featured.imageUrl}
                                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                 alt={featured.title}
                                 loading="lazy"
                              />
                           ) : (
                              <div className={`absolute inset-0 bg-gradient-to-br ${featured.imageGradient} opacity-60`}></div>
                           )}
                           <div className="absolute inset-0 bg-gradient-to-l from-[#050508] via-transparent to-transparent hidden lg:block"></div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </section>

         {/* Main Journal Feed */}
         <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-20 sticky top-24 z-30 p-6 glass-panel rounded-[2rem] border border-white/10 bg-nova-900/80 backdrop-blur-xl">
               <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                  {categories.map(cat => (
                     <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-white text-nova-900' : 'text-gray-500 hover:text-white hover:bg-white/5'
                           }`}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
               <div className="relative w-full md:w-80 group">
                  <input
                     type="text"
                     placeholder="Search the archives..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-6 text-white text-xs font-bold focus:border-nova-500 transition-all focus:bg-white/[0.08]"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-nova-400 transition-colors" size={16} />
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
               {filteredInsights.map((insight, idx) => (
                  <div
                     key={insight.id}
                     onClick={() => onOpenArticle(insight)}
                     className="group flex flex-col glass-panel rounded-[3rem] border border-white/5 overflow-hidden hover:border-nova-500/40 transition-all duration-500 cursor-pointer animate-fade-in-up"
                     style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                     <div className="h-60 relative overflow-hidden">
                        {insight.imageUrl ? (
                           <img
                              src={insight.imageUrl}
                              className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                              alt={insight.title}
                              loading="lazy"
                           />
                        ) : (
                           <div className={`absolute inset-0 bg-gradient-to-br ${insight.imageGradient} opacity-40`}></div>
                        )}
                        <div className="absolute top-6 left-6 z-10">
                           <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest rounded-full">
                              {insight.category}
                           </span>
                        </div>
                     </div>
                     <div className="p-10 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">
                           <Clock size={12} /> {insight.date}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-nova-400 transition-colors line-clamp-2 tracking-tight">
                           {insight.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-light leading-relaxed line-clamp-3 mb-10">
                           {insight.excerpt}
                        </p>
                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">By {insight.author}</span>
                           <div className="p-2 rounded-full border border-white/5 text-gray-600 group-hover:text-white group-hover:border-white transition-all">
                              <ArrowRight size={18} />
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {filteredInsights.length === 0 && (
               <div className="py-40 text-center animate-fade-in-up">
                  <Cpu size={64} className="mx-auto text-gray-800 mb-8" />
                  <h3 className="text-2xl font-bold text-gray-500 uppercase tracking-widest">No matching insights found.</h3>
                  <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-6 text-nova-400 font-black uppercase text-xs tracking-[0.4em] hover:text-white transition-colors">Reset Terminal</button>
               </div>
            )}
         </section>
      </div>
   );
};