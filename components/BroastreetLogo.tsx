import React from 'react';

interface BroastreetLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BroastreetLogo: React.FC<BroastreetLogoProps> = ({ className = '', variant = 'light', size = 'md' }) => {
  const sizes = {
    sm: { container: 'gap-0.5', mainText: 'text-xl', subText: 'text-[6px]', icon: 'w-4 h-4', tm: 'text-[6px]' },
    md: { container: 'gap-1', mainText: 'text-3xl', subText: 'text-[8px]', icon: 'w-6 h-6', tm: 'text-[8px]' },
    lg: { container: 'gap-1.5', mainText: 'text-4xl', subText: 'text-[10px]', icon: 'w-8 h-8', tm: 'text-[10px]' },
    xl: { container: 'gap-2', mainText: 'text-5xl', subText: 'text-[12px]', icon: 'w-10 h-10', tm: 'text-[12px]' },
  };

  const currentSize = sizes[size];
  const textColor = variant === 'light' ? 'text-white' : 'text-nova-950';

  return (
    <div className={`flex flex-col items-center leading-none select-none relative ${className}`}>
      <div className="flex items-center relative">
        <span className={`${currentSize.mainText} font-black italic tracking-tighter ${textColor} lowercase flex items-center`}>
          broastreet
          <span className={`${currentSize.tm} align-top font-bold opacity-40 ml-0.5 -mt-2`}>TM</span>
        </span>
        
        {/* Overlaid Orange Swoosh Checkmark */}
        <div className="absolute left-[38%] -top-1 pointer-events-none">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`${currentSize.icon} text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]`}
          >
            <path 
              d="M4 14L9 19L20 5" 
              stroke="currentColor" 
              strokeWidth="5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
      {/* DyDX Sub-badge */}
      <div className="flex items-center justify-center border border-white/20 bg-white/5 backdrop-blur-sm rounded px-1.5 py-0.5 mt-0.5 ml-12">
        <span className={`${currentSize.subText} font-black text-white/90 tracking-widest uppercase italic`}>
          DyDX
        </span>
      </div>
    </div>
  );
};
