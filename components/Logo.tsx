import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'light', size = 'md' }) => {
  const sizes = {
    sm: { container: 'scale-[0.6]', text: 'text-xl', subtext: 'text-[8px]', icon: 'w-4 h-4' },
    md: { container: 'scale-[0.8]', text: 'text-3xl', subtext: 'text-[10px]', icon: 'w-6 h-6' },
    lg: { container: 'scale-100', text: 'text-4xl', subtext: 'text-[12px]', icon: 'w-8 h-8' },
    xl: { container: 'scale-125', text: 'text-5xl', subtext: 'text-[14px]', icon: 'w-10 h-10' },
  };

  const currentSize = sizes[size];
  const textColor = variant === 'light' ? 'text-white' : 'text-[#222222]';

  return (
    <div className={`flex flex-col items-start leading-none select-none ${className}`}>
      <div className="flex items-center gap-1.5">
        <span className={`${currentSize.text} font-black tracking-tighter ${textColor} lowercase`}>
          casiec
        </span>
        <div className="flex flex-col relative translate-y-[-2px]">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`${currentSize.icon} text-nova-accent transform -rotate-45`}
          >
            <path d="M7 17L12 12L7 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 17L18 12L13 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <span className={`${currentSize.subtext} font-black text-nova-accent tracking-[0.35em] lowercase -mt-1.5 ml-0.5`}>
        financials
      </span>
    </div>
  );
};
