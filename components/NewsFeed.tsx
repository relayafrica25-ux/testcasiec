import React, { useEffect, useState } from 'react';
import { fetchFinancialNews } from '../services/geminiService';
import { NewsItem } from '../types';
// Add missing ChevronRight import
import { TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw, Globe, Flame, Zap, ChevronRight } from 'lucide-react';

export const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  const loadNews = async () => {
    setLoading(true);
    const data = await fetchFinancialNews();
    setNews(data);
    setLastUpdated(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
    const interval = setInterval(loadNews, 300000); // 5 mins auto-refresh
    return () => clearInterval(interval);
  }, []);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Bullish': return <TrendingUp className="text-nova-accent" size={16} />;
      case 'Bearish': return <TrendingDown className="text-rose-500" size={16} />;
      default: return <Minus className="text-gray-400" size={16} />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Bullish': return 'text-nova-accent border-nova-accent/20 bg-nova-accent/10';
      case 'Bearish': return 'text-rose-500 border-rose-500/20 bg-rose-500/10';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/20 text-orange-500 animate-pulse">
               <Flame size={20} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Hot Feed.</h2>
          </div>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> 
            Live Market Intelligence • Last Sync: {lastUpdated}
          </p>
        </div>
        <button 
          onClick={loadNews}
          disabled={loading}
          className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`text-nova-400 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} size={14} />
          Manual Resync
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-[2.5rem] p-8 h-[320px] flex flex-col justify-between animate-pulse border border-white/5">
              <div className="space-y-6">
                <div className="h-6 bg-white/5 rounded-full w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-white/5 rounded-lg w-full"></div>
                  <div className="h-5 bg-white/5 rounded-lg w-4/5"></div>
                </div>
                <div className="h-4 bg-white/5 rounded-lg w-full"></div>
              </div>
            </div>
          ))
        ) : (
          news.map((item, idx) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col justify-between glass-card rounded-[2.5rem] p-10 border border-white/5 hover:border-nova-500/30 transition-all duration-500 hover:translate-y-[-8px] animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {idx < 2 && (
                <div className="absolute top-6 right-8 flex items-center gap-1 text-[9px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                  <Zap size={10} /> Hot
                </div>
              )}
              
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest border ${getImpactColor(item.impact)} mb-8`}>
                  {getImpactIcon(item.impact)}
                  {item.impact.toUpperCase()}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-nova-400 transition-colors leading-tight tracking-tight">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light line-clamp-3">
                  {item.summary}
                </p>
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
                 <div className="flex flex-wrap gap-3">
                    {item.sources && item.sources.slice(0, 1).map((source, sIdx) => (
                      <a 
                        key={sIdx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={10} className="text-nova-500" />
                        Intelligence Source
                      </a>
                    ))}
                 </div>
                 <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-600 group-hover:text-nova-500 group-hover:border-nova-500 transition-all">
                    <ChevronRight size={14} />
                 </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};