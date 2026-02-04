import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { NewsTicker } from './components/NewsTicker';
import { LoanApplicationModal } from './components/LoanApplicationModal';
import { NewsletterPopup } from './components/NewsletterPopup';
import { ChatWidget } from './components/ChatWidget';
import { HomePage } from './components/HomePage';
import { BusinessFundingPage } from './components/BusinessFundingPage';
import { BusinessSupportPage } from './components/BusinessSupportPage';
import { InvestmentPage } from './components/InvestmentPage';
import { ArticleHubPage } from './components/ArticleHubPage';
import { AdminDashboard } from './components/AdminDashboard';
import { RealEstatePage } from './components/RealEstatePage';
import { TeamPage } from './components/TeamPage';
import { AboutPage } from './components/AboutPage';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { Article } from './types';
import { Globe, Linkedin, Twitter, ChevronRight, Lock } from 'lucide-react';
import { Logo } from './components/Logo';

import { ToastProvider } from './components/Toast';

// Main Application Component for CASIEC Financials
const App: React.FC = () => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'financial' | 'business_support' | null>(null);
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentView(hash);
      } else {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openLoanModal = (type?: 'financial' | 'business_support') => {
    setModalType(type || null);
    setIsLoanModalOpen(true);
  };

  const closeLoanModal = () => {
    setIsLoanModalOpen(false);
    setModalType(null);
  };

  const handleNavigate = (view: string) => {
    window.location.hash = view;
    // State will be updated by hashchange listener
    if (view !== 'article-detail') {
      setSelectedArticle(null);
    }
    window.scrollTo(0, 0);
  };

  const handleOpenArticle = (article: Article) => {
    setSelectedArticle(article);
    handleNavigate('article-detail');
  };

  // Router logic to render different views based on state
  const renderView = () => {
    if (currentView === 'admin') {
      return <AdminDashboard onBack={() => handleNavigate('home')} />;
    }

    if (currentView === 'article-detail' && selectedArticle) {
      return (
        <ArticleDetailPage
          article={selectedArticle}
          onBack={() => handleNavigate('insights')}
          onOpenArticle={handleOpenArticle}
          onNavigate={handleNavigate}
        />
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onApplyClick={() => openLoanModal()}
            onNavigate={handleNavigate}
            onOpenArticle={handleOpenArticle}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'team':
        return <TeamPage />;
      case 'financial-support':
      case 'real-estate':
        return <BusinessFundingPage onApplyClick={() => openLoanModal('financial')} />;
      case 'business-support':
        return <BusinessSupportPage onInquireClick={() => openLoanModal('business_support')} />;
      case 'investment':
        return <InvestmentPage />;
      case 'insights':
        return <ArticleHubPage onOpenArticle={handleOpenArticle} />;
      default:
        return (
          <HomePage
            onApplyClick={() => openLoanModal()}
            onNavigate={handleNavigate}
            onOpenArticle={handleOpenArticle}
          />
        );
    }
  };

  const isDashboard = currentView === 'admin';

  return (
    <ToastProvider>
      <div className="min-h-screen bg-nova-950 text-white selection:bg-nova-500 selection:text-white flex flex-col">
        {!isDashboard && (
          <>
            <Navbar
              onApplyClick={() => openLoanModal()}
              currentView={currentView}
              onNavigate={handleNavigate}
            />
            <NewsTicker />
            <LoanApplicationModal isOpen={isLoanModalOpen} onClose={closeLoanModal} initialType={modalType} />
            <NewsletterPopup />
          </>
        )}

        <main className="flex-grow">
          {renderView()}
        </main>

        {!isDashboard && (
          <footer className="bg-nova-950 pt-32 pb-16 border-t border-white/5 mt-auto relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-nova-500/5 to-transparent -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">

                <div className="lg:col-span-5">
                  <div className="flex flex-col items-start mb-10">
                    <div
                      className="cursor-pointer group"
                      onClick={() => handleNavigate('home')}
                    >
                      <Logo size="lg" className="group-hover:opacity-80 transition-opacity" />
                    </div>

                    <div className="mt-8">
                      <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        Casiec Financials provides credit solutions through lending, while GSI deliver business support solutions, and in partnership the two firms promote the concept of sustainable enterprise.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                  <div>
                    <h4 className="text-white font-black mb-8 uppercase tracking-[0.4em] text-[10px] opacity-30">Quick Links</h4>
                    <ul className="space-y-4">
                      <li><button onClick={() => handleNavigate('home')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Homepage</button></li>
                      <li><button onClick={() => handleNavigate('insights')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Insights</button></li>
                      <li><button onClick={() => handleNavigate('team')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Our Team</button></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-black mb-8 uppercase tracking-[0.4em] text-[10px] opacity-30">Our Pillars</h4>
                    <ul className="space-y-4">
                      <li><button onClick={() => handleNavigate('financial-support')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Capital Solution</button></li>
                      <li><button onClick={() => handleNavigate('business-support')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Strategic Advisory</button></li>
                      <li><button onClick={() => handleNavigate('investment')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Investment</button></li>
                      <li>
                        <button
                          onClick={() => handleNavigate('admin')}
                          className="flex items-center gap-2 text-nova-accent hover:text-white transition-all text-sm font-bold mt-4"
                        >
                          <Lock size={14} /> Staff Terminal
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-black mb-8 uppercase tracking-[0.4em] text-[10px] opacity-30">Electronic Uplink</h4>
                    <ul className="space-y-6 text-sm text-gray-400">
                      <li className="flex items-start gap-3 group">
                        <Globe size={18} className="text-nova-500 mt-0.5" />
                        <div className="flex flex-col gap-1">
                          <a href="mailto:info@casiecfinancials.com" className="text-sm font-medium hover:text-white transition-colors">info@casiecfinancials.com</a>
                          <a href="mailto:customercare@casiecfinancials.com" className="text-sm font-medium hover:text-white transition-colors">customercare@casiecfinancials.com</a>
                          <span className="text-xs text-gray-600">Lagos, Nigeria</span>
                        </div>
                      </li>
                      <li className="font-mono text-[11px] space-y-2">
                        <span className="block text-white">+234 818-398-7171</span>
                        <span className="block">+234 810-326-0048</span>
                        <span className="block">+234 810-537-5394</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex flex-col gap-2">
                  <div className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-black">
                    © 2026 CASIEC FINANCIALS & GSI. ALL RIGHTS RESERVED.
                  </div>
                  <div className="text-gray-500 text-[9px] uppercase tracking-[0.3em] font-bold">
                    Affiliate Member of ANMFIN.
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-nova-500 hover:border-nova-500 transition-all cursor-pointer">
                      <Linkedin size={16} />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-nova-500 hover:border-nova-500 transition-all cursor-pointer">
                      <Twitter size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        )}

        {!isDashboard &&
          <ChatWidget />
        }
      </div>
    </ToastProvider>
  );
};

// Fixed error in index.tsx by providing a default export for the App component
export default App;

