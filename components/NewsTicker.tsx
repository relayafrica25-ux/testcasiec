import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { TickerItem } from '../types';
import { Flame, Radio, Zap } from 'lucide-react';

export const NewsTicker: React.FC = () => {
  const [tickerContent, setTickerContent] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickerData = async () => {
      try {
        const manualItems = await storageService.getManualTickerItems();
        // Loop for seamless marquee
        setTickerContent([...manualItems, ...manualItems]);
      } catch (err) {
        setTickerContent([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickerData();
    const interval = setInterval(loadTickerData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Urgent': return 'text-red-500';
      case 'Market': return 'text-orange-500';
      case 'Corporate': return 'text-nova-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed top-20 left-0 w-full z-40 bg-[#050508]/95 backdrop-blur-xl border-b border-white/5 h-10 flex items-center overflow-hidden">
      <div className="flex items-center gap-2 px-6 bg-[#050508] z-20 h-full border-r border-white/10">
        <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></div>
        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] whitespace-nowrap italic">Breaking</span>
      </div>

      <div className="flex animate-marquee whitespace-nowrap items-center py-2">
        {tickerContent.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center mx-12 gap-4 group">
            <Radio size={12} className="text-red-600 animate-pulse" />
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-white/5 bg-white/5 ${getCategoryColor(item.category)}`}>
              {item.category}
            </span>
            <span className="text-[11px] text-white font-bold tracking-tight group-hover:text-nova-400 transition-colors">
              {item.text}
            </span>
            <span className="text-white/10 mx-2 font-light">///</span>
          </div>
        ))}
      </div>
    </div>
  );
};