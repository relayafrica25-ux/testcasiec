import React from 'react';
import { Menu, X, ChevronRight, Wallet, Briefcase, BookOpen, Info, Users, LineChart } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onApplyClick: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick, currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'about', label: 'Company', icon: <Info size={14} /> },
    { id: 'team', label: 'Our Team', icon: <Users size={14} /> },
    { id: 'financial-support', label: 'Capital Solutions', icon: <Wallet size={14} /> },
    { id: 'business-support', label: 'Advisory', icon: <Briefcase size={14} /> },
    { id: 'investment', label: 'Investment', icon: <LineChart size={14} /> },
    { id: 'insights', label: 'Insights', icon: <BookOpen size={14} /> },
  ];

  const handleMobileNavigate = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 left-0 z-[1000]">
      <div className="bg-nova-950/95 backdrop-blur-xl border-b border-white/10 h-20 flex items-center relative z-[1010]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer group pointer-events-auto" 
                onClick={() => handleMobileNavigate('home')}
              >
                <Logo size="sm" className="group-hover:opacity-80 transition-opacity" />
              </div>
              
              <div className="hidden lg:block ml-10">
                <div className="flex items-center space-x-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      className={`text-[10px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-lg flex items-center gap-2 pointer-events-auto ${
                        currentView === item.id 
                          ? 'text-white bg-white/10 border border-white/20' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                type="button"
                onClick={onApplyClick}
                className="bg-nova-500 text-white px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-nova-400 transition-all duration-300 flex items-center gap-2 shadow-xl shadow-nova-500/30 pointer-events-auto"
              >
                Inquiry <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>

            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-3 rounded-xl text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none transition-all pointer-events-auto relative z-[1020]"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div 
        className={`lg:hidden fixed inset-0 z-[1005] bg-nova-950 transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full pt-28 pb-10 px-6">
          <div className="flex flex-col space-y-2 overflow-y-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMobileNavigate(item.id)}
                className={`flex items-center gap-4 w-full p-5 rounded-2xl text-sm font-black uppercase tracking-widest border transition-all pointer-events-auto ${
                   currentView === item.id 
                    ? 'bg-nova-500 text-white border-nova-500 shadow-xl' 
                    : 'text-gray-200 border-white/10 bg-white/5'
                }`}
              >
                <span className={currentView === item.id ? 'text-white' : 'text-nova-500'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-8 border-t border-white/10">
              <button 
                type="button"
                onClick={() => { setIsOpen(false); onApplyClick(); }}
                className="w-full py-5 bg-white text-nova-950 font-black text-xs uppercase tracking-[0.3em] rounded-2xl text-center shadow-2xl pointer-events-auto"
              >
                Initiate Inquiry
              </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
