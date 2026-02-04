import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '10:00', value: 4000 },
  { name: '11:00', value: 4020 },
  { name: '12:00', value: 3980 },
  { name: '13:00', value: 4050 },
  { name: '14:00', value: 4090 },
  { name: '15:00', value: 4120 },
  { name: '16:00', value: 4150 },
];

export const MarketChart: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Recharts ResponsiveContainer often fails to find dimensions on immediate mount
    // especially in StrictMode. A setTimeout(0) ensures the component is in the DOM
    // and layout has been calculated.
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[220px] relative">
      {isMounted ? (
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} 
            />
            <YAxis 
              hide
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: 'rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-800 text-[10px] font-black uppercase tracking-widest">
          Syncing...
        </div>
      )}
    </div>
  );
};