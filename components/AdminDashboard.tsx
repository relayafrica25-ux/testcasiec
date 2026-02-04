import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Users,
  Plus,
  Trash2,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Lock,
  Mail,
  User,
  Activity,
  Zap,
  Radio,
  MessageSquare,
  Edit3,
  Image as ImageIcon,
  Megaphone,
  Loader2,
  Bell,
  LogOut,
  Info,
  Check,
  AlertCircle,
  Linkedin,
  Twitter,
  Upload,
  ShieldCheck,
  Flame,
  ExternalLink,
  Phone,
  Calendar,
  Layers,
  Globe,
  Briefcase,
  X,
  Landmark,
  CheckCircle2,
  Inbox,
  Eye,
  CheckCircle,
  BrainCircuit
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { generateArticleImage } from '../services/geminiService';
import { Article, LoanApplication, ContactInquiry, TickerItem, CarouselItem, TeamMember, Campaign } from '../types';
import { useToast } from './Toast';
import { Logo } from './Logo';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { showToast } = useToast();


  // States
  const [staffId, setStaffId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loginPhase, setLoginPhase] = useState<'credentials' | 'otp'>('credentials');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'applications' | 'inquiries' | 'ticker' | 'carousel' | 'team'>('overview');

  // Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Modal States
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isTickerModalOpen, setIsTickerModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Edit States
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [teamFile, setTeamFile] = useState<File | null>(null);
  const [campaignFile, setCampaignFile] = useState<File | null>(null);

  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    category: 'Strategy',
    author: 'Admin',
    imageGradient: 'from-nova-500 to-purple-600',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    imageUrl: ''
  });

  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    bio: '',
    specialization: '',
    imageGradient: 'from-blue-600 to-indigo-900',
    imageUrl: '',
    linkedin: '',
    twitter: '',
    email: ''
  });

  const [newTicker, setNewTicker] = useState<Partial<TickerItem>>({
    text: '',
    category: 'Market'
  });

  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    headline: '',
    summary: '',
    contextType: 'advert',
    tag: 'Active',
    url: ''
  });

  // Session recovery
  useEffect(() => {
    const token = localStorage.getItem('casiec_token');
    if (token) {
      // In a real app, you might want to verify the token here
      setIsAuthenticated(true);
    }
  }, []);

  // Auto-refresh logic
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      const interval = setInterval(refreshData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const refreshData = async () => {
    const [arts, apps, inqs, tks, cars, cams, team] = await Promise.all([
      storageService.getArticles(),
      storageService.getApplications(),
      storageService.getInquiries(),
      storageService.getManualTickerItems(),
      storageService.getCarouselItems(),
      storageService.getCampaigns(),
      storageService.getTeamMembers()
    ]);
    setArticles(arts);
    setApplications(apps);
    setInquiries(inqs);
    setTickerItems(tks);
    setCarouselItems(cars);
    setCampaigns(cams);
    setTeamMembers(team);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError(null);

    try {
      // Open Access Simulation: Bypassing mandatory credential validation for terminal entry
      // but ensuring we obtain a valid operational token for the session
      const response = await storageService.loginStep1(staffId, loginPass);

      if (response.success) {
        if (response.requiresOTP) {
          setLoginPhase('otp');
          showToast('Verification code transmitted to authorized terminal.', 'info');
        } else {
          await new Promise(resolve => setTimeout(resolve, 800)); // Maintain the UX delay
          setIsAuthenticated(true);
          showToast('Session Synchronized. Welcome to Staff Terminal.', 'success');
        }
      } else {
        setError("SYSTEM REJECTION: Unauthorized Terminal Entry.");
        showToast('Authentication Link Failure.', 'error');
      }
    } catch (err) {
      setError("CRITICAL: Authentication Server Unreachable.");
      showToast('System Link Error.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError(null);
    try {
      // Use the authorized email for 2FA verification
      const email = staffId;
      const response = await storageService.verify2FA(email, otpCode);
      if (response.success) {
        setIsAuthenticated(true);
        showToast('System Authenticated. Welcome, Administrator.', 'success');
      } else {
        setError(response.message || "INVALID VERIFICATION CODE.");
        showToast(response.message || 'Verification Failed.', 'error');
      }
    } catch (error) {
      showToast('Verification Link Failure.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  // Helper function to extract error message from server response
  const getErrorMessage = (error: any, fallbackMessage: string = 'An error occurred'): string => {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      const message = error.response.data.message;
      if (Array.isArray(message)) {
        return message.join(', ');
      }
      return message;
    }
    return fallbackMessage;
  };

  const handleLogout = async () => {
    try {
      await storageService.logout();
      showToast('Logged out successfully.', 'info');
      onBack();
    } catch (error) {
      console.error('Logout error:', error);
      // Still log out locally even if backend call fails
      onBack();
    }
  };

  const handleGenerateAIImage = async (context: 'article' | 'campaign' | 'team') => {
    const promptMap = {
      article: newArticle.title,
      campaign: newCampaign.headline,
      team: newTeamMember.name ? `Professional headshot of ${newTeamMember.name}, ${newTeamMember.role}` : null
    };

    const titleToUse = promptMap[context];
    if (!titleToUse) {
      showToast("Please provide the required name/headline first.", 'info');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const generatedUrl = await generateArticleImage(titleToUse);
      if (generatedUrl) {
        if (context === 'campaign') {
          setNewCampaign(prev => ({ ...prev, image: generatedUrl }));
        } else if (context === 'team') {
          setNewTeamMember(prev => ({ ...prev, imageUrl: generatedUrl }));
        } else {
          setNewArticle(prev => ({ ...prev, imageUrl: generatedUrl }));
        }
        showToast('Visual generated successfully.', 'success');
      } else {
        showToast("Visual synchronization failed. Using fallback.", 'error');
      }
    } catch (err) {
      showToast("AI Generation error.", 'error');
    }
    setIsGeneratingImage(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: any, type: 'campaign' | 'article' | 'team', fileSetter?: (f: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileSetter) fileSetter(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setter((prev: any) => {
          if (type === 'campaign') {
            return { ...prev, image: reader.result as string };
          }
          return { ...prev, imageUrl: reader.result as string };
        });
      };
      reader.readAsDataURL(file);
    }
  };


  const handleEditArticle = (article: Article) => {
    setArticleFile(null);
    setIsEditingArticle(true);
    setEditingArticleId(article.id);
    setNewArticle({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      imageGradient: article.imageGradient,
      date: article.date,
      readTime: article.readTime,
      imageUrl: article.imageUrl
    });
    setIsArticleModalOpen(true);
  };

  const handleEditTeam = (member: TeamMember) => {
    setIsEditingTeam(true);
    setEditingTeamId(member.id);
    setNewTeamMember({
      name: member.name,
      role: member.role,
      bio: member.bio,
      specialization: member.specialization,
      imageGradient: member.imageGradient,
      imageUrl: member.imageUrl,
      linkedin: member.linkedin,
      twitter: member.twitter,
      email: member.email
    });
    setIsTeamModalOpen(true);
  };

  const handlePostArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const article: Article = {
        ...(newArticle as Article),
        id: isEditingArticle && editingArticleId ? editingArticleId : `temp-${Math.random().toString(36).substr(2, 9)}`,
        date: newArticle.date || new Date().toISOString().split('T')[0],
        readTime: newArticle.readTime || '5 min read',
        imageGradient: newArticle.imageGradient || 'from-nova-500 to-purple-600'
      };
      await storageService.saveArticle(article, articleFile);
      refreshData();
      setIsArticleModalOpen(false);
      setIsEditingArticle(false);
      setEditingArticleId(null);
      setArticleFile(null);
      showToast(isEditingArticle ? 'Insight updated.' : 'Insight deployed to hub.', 'success');
      setNewArticle({ title: '', excerpt: '', category: 'Strategy', author: 'Admin', imageUrl: '' });
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save insight.'), 'error');
    }
  };

  const handlePostTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const member: TeamMember = {
        ...(newTeamMember as TeamMember),
        id: isEditingTeam && editingTeamId ? editingTeamId : `temp-${Math.random().toString(36).substr(2, 9)}`,
        imageGradient: newTeamMember.imageGradient || 'from-blue-600 to-indigo-900'
      };
      await storageService.saveTeamMember(member, teamFile);
      refreshData();
      setIsTeamModalOpen(false);
      setIsEditingTeam(false);
      setEditingTeamId(null);
      setTeamFile(null);
      showToast(isEditingTeam ? 'Leadership record updated.' : 'New leader added to records.', 'success');
      setNewTeamMember({ name: '', role: '', bio: '', specialization: '', linkedin: '', twitter: '', email: '', imageUrl: '', imageGradient: 'from-blue-600 to-indigo-900' });
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to save leadership record.'), 'error');
    }
  };

  const handlePostCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await storageService.saveCampaign(newCampaign, campaignFile);
      refreshData();
      setIsCampaignModalOpen(false);
      setCampaignFile(null);
      showToast('Campaign successfully initialized.', 'success');
      setNewCampaign({ headline: '', summary: '', contextType: 'advert', tag: 'Active', url: '' });
    } catch (err) {
      showToast(getErrorMessage(err, 'Failed to broadcast campaign.'), 'error');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    console.log('Attempting to erase insight with ID:', id);
    if (window.confirm('Erase this insight?')) {
      try {
        await storageService.deleteArticle(id);
        refreshData();
        showToast('Insight erased.', 'info');
      } catch (err) {
        console.error('Delete article error:', err);
        showToast(getErrorMessage(err, 'Erase operation rejected.'), 'error');
      }
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (window.confirm('Remove this member from leadership records?')) {
      try {
        await storageService.deleteTeamMember(id);
        refreshData();
        showToast('Leadership record purged.', 'info');
      } catch (err) {
        showToast(getErrorMessage(err, 'System rejected purge operation.'), 'error');
      }
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (window.confirm('Erase this campaign interactive?')) {
      try {
        await storageService.deleteCampaign(id);
        refreshData();
        showToast('Campaign record purged.', 'info');
      } catch (err) {
        showToast(getErrorMessage(err, 'Erase operation rejected.'), 'error');
      }
    }
  };

  const handlePostTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item: TickerItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: newTicker.text || '',
        category: (newTicker.category as any) || 'Market',
        isManual: true
      };
      await storageService.saveTickerItem(item);
      refreshData();
      setIsTickerModalOpen(false);
      showToast('Headline broadcast success.', 'success');
      setNewTicker({ text: '', category: 'Market' });
    } catch (err) {
      showToast(getErrorMessage(err, 'Broadcast transmission failed.'), 'error');
    }
  };

  const handleDeleteTicker = async (id: string) => {
    await storageService.deleteTickerItem(id);
    refreshData();
  };

  const handleDeleteInquiry = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Erase this inquiry from logs?')) {
      try {
        await storageService.deleteInquiry(id);
        refreshData();
        showToast('Inquiry purged from logs.', 'info');
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } catch (err) {
        showToast(getErrorMessage(err, 'System rejected log purge.'), 'error');
      }
    }
  };

  const handleDeleteApplication = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Erase this application from records?')) {
      try {
        await storageService.deleteApplication(id);
        refreshData();
        showToast('Record purged successfully.', 'info');
        if (selectedApplication?.id === id) setSelectedApplication(null);
      } catch (err) {
        showToast(getErrorMessage(err, 'Record purge failed.'), 'error');
      }
    }
  };

  const updateAppStatus = async (id: string, status: any) => {
    try {
      await storageService.updateApplicationStatus(id, status);
      refreshData();
      if (selectedApplication?.id === id) {
        setSelectedApplication({ ...selectedApplication, status });
      }
      showToast(`Status updated to ${status}.`, 'info');
    } catch (err) {
      showToast(getErrorMessage(err, 'Status sync protocol failed.'), 'error');
    }
  };

  const updateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    try {
      await storageService.updateInquiryStatus(id, status);
      refreshData();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
      showToast(`Inquiry marked as ${status}.`, 'info');
    } catch (err) {
      showToast(getErrorMessage(err, 'Synchronization error.'), 'error');
    }
  };

  const unreadInquiries = inquiries.filter(i => i.status === 'Unread' && !i.opened).length;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nova-500/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        </div>
        <div className="w-full max-w-lg relative z-10">
          <div className="glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-12 text-center">
              <div className="flex flex-col items-center mb-8">
                <Logo size="lg" />
                <span className="text-[12px] font-black text-nova-accent tracking-[0.4em] lowercase mt-2 opacity-80">staff terminal</span>
              </div>
              {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl">{error}</div>}
              {loginPhase === 'credentials' ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <input type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="Authorized ID" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none placeholder:text-gray-600 transition-all" />
                    <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Access Key" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none placeholder:text-gray-600 transition-all" />
                  </div>
                  <button type="submit" disabled={isScanning} className="w-full py-5 bg-nova-500 hover:bg-nova-400 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl transition-all shadow-xl shadow-nova-500/20 active:scale-95">
                    {isScanning ? 'Synchronizing Node...' : 'Initiate Open Access'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="text-sm text-gray-400 mb-4 uppercase tracking-widest">Enter Secure Link Code</div>
                  <input required type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="6-DIGIT CODE" maxLength={6} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-3xl font-black tracking-[0.5em] text-center focus:border-nova-500 outline-none" />
                  <button type="submit" disabled={isScanning} className="w-full py-5 bg-nova-accent hover:bg-nova-400 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl transition-all shadow-lg shadow-nova-accent/20">
                    {isScanning ? 'Verifying...' : 'Finalize Uplink'}
                  </button>
                  <button type="button" onClick={() => setLoginPhase('credentials')} className="text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition-colors mt-4">Back to Identity Entry</button>
                </form>
              )}
              <button onClick={onBack} className="mt-8 flex items-center gap-2 mx-auto text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"><ArrowLeft size={14} /> Back to Gateway</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-72 bg-nova-900 border-r border-white/10 flex flex-col p-8 z-50">
        <div className="flex flex-col items-start mb-10 cursor-pointer group" onClick={() => onBack()}>
          <Logo size="sm" className="group-hover:opacity-80 transition-opacity" />
        </div>
        <nav className="space-y-2 flex-grow overflow-y-auto no-scrollbar">
          {[
            { id: 'overview', icon: <TrendingUp size={20} />, label: 'Overview' },
            { id: 'applications', icon: <Users size={20} />, label: 'Applications', badge: pendingApps },
            { id: 'inquiries', icon: <MessageSquare size={20} />, label: 'Inquiries', badge: unreadInquiries },
            { id: 'team', icon: <ShieldCheck size={20} />, label: 'Our Team' },
            { id: 'ticker', icon: <Flame size={20} />, label: 'Breaking News' },
            { id: 'articles', icon: <FileText size={20} />, label: 'Insights Hub' },
            { id: 'carousel', icon: <Megaphone size={20} />, label: 'Campaigns' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id ? 'bg-nova-500 text-white shadow-lg shadow-nova-500/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
              <div className="flex items-center gap-4">{tab.icon} {tab.label}</div>
              {tab.badge ? <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{tab.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="mt-8 pt-8 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-4 text-gray-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest group"><LogOut size={16} /> Exit Terminal</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-12 w-full max-w-7xl mx-auto">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Terminal Analytics</h1>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Institutional Operations Interface</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                <Users className="text-nova-400 mb-6" size={32} />
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Loan Applications</p>
                <div className="flex items-end gap-3">
                  <p className="text-6xl font-black">{applications.length}</p>
                  {pendingApps > 0 && <span className="text-amber-500 text-xs font-black mb-2 tracking-widest">{pendingApps} PENDING</span>}
                </div>
              </div>
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                <MessageSquare className="text-purple-400 mb-6" size={32} />
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Active Inquiries</p>
                <div className="flex items-end gap-3">
                  <p className="text-6xl font-black">{inquiries.length}</p>
                  {unreadInquiries > 0 && <span className="text-red-500 text-xs font-black mb-2 tracking-widest">{unreadInquiries} NEW</span>}
                </div>
              </div>
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                <ShieldCheck className="text-emerald-400 mb-6" size={32} />
                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Our Team</p>
                <p className="text-6xl font-black">{teamMembers.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Loan Inquiries</h1>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Credit Pipeline</p>
              </div>
            </div>
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-white/10 text-[10px] font-black uppercase tracking-widest text-gray-300">
                  <tr>
                    <th className="px-8 py-6">Reference</th>
                    <th className="px-8 py-6">Entity</th>
                    <th className="px-8 py-6">Product</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.length > 0 ? applications.map(app => (
                    <tr key={app.id} className="hover:bg-white/[0.04] cursor-pointer group transition-colors" onClick={() => setSelectedApplication(app)}>
                      <td className="px-8 py-6 font-mono text-xs text-gray-400">{app.id}</td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-white">{app.businessName}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-black tracking-tight">{app.fullName}</div>
                      </td>
                      <td className="px-8 py-6 text-xs text-nova-400 font-black uppercase">{app.loanType || app.serviceType}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          app.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={(e) => handleDeleteApplication(app.id, e)} className="text-gray-500 hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">No Active Applications</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Support Inquiries</h1>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">General Uplink Channel</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiries.length > 0 ? inquiries.map(inq => (
                <div
                  key={inq.id}
                  onClick={async () => { setSelectedInquiry(inq); if (storageService.updateContactOpened) await storageService.updateContactOpened(inq.id); refreshData(); }}
                  className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all hover:translate-y-[-5px] ${inq.status === 'Unread' ? 'bg-white/10 border-nova-500 shadow-lg shadow-nova-500/10' : 'bg-white/5 border-white/10'
                    }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${inq.status === 'Unread' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      }`}>
                      {inq.status}
                    </span>
                    <button onClick={(e) => handleDeleteInquiry(inq.id, e)} className="text-gray-600 hover:text-red-500 transition-colors p-1"><Trash2 size={14} /></button>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{inq.subject}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 italic">"{inq.message}"</p>
                  <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-nova-500/20 flex items-center justify-center text-nova-400"><User size={14} /></div>
                    <div>
                      <p className="text-xs font-bold text-white">{inq.fullName}</p>
                      <p className="text-[9px] text-nova-400 font-mono lower">{inq.email}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{inq.date}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-40 text-center glass-panel rounded-[3rem] border border-white/5">
                  <Inbox className="mx-auto text-gray-800 mb-6" size={48} />
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">No Incoming Inquiries</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: TEAM */}
        {activeTab === 'team' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Our Team</h1>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Leadership & Experts</p>
              </div>
              <button onClick={() => { setIsEditingTeam(false); setIsTeamModalOpen(true); }} className="bg-nova-500 hover:bg-nova-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-nova-500/20">
                <Plus size={16} /> New Member
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map(member => (
                <div key={member.id} className="group glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col hover:border-nova-500/30 transition-all">
                  <div className={`h-48 relative bg-gradient-to-br ${member.imageGradient} opacity-60 group-hover:opacity-100 transition-all`}>
                    {member.imageUrl && <img src={member.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt={member.name} />}
                  </div>
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-6">{member.role}</p>
                    <div className="flex gap-4">
                      <button onClick={() => handleEditTeam(member)} className="text-nova-400 hover:text-white transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => handleDeleteTeam(member.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TICKER */}
        {activeTab === 'ticker' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Breaking News</h1>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Global & Local Market Ticker</p>
              </div>
              <button onClick={() => setIsTickerModalOpen(true)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-red-600/20">
                <Radio size={16} /> Add Alert
              </button>
            </div>
            <div className="space-y-4">
              {tickerItems.map(item => (
                <div key={item.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-all">
                  <div className="flex items-center gap-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${item.category === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      item.category === 'Market' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        'bg-nova-500/10 text-nova-400 border-nova-500/20'
                      }`}>
                      {item.category}
                    </span>
                    <p className="text-white font-bold tracking-tight">{item.text}</p>
                  </div>
                  <button onClick={() => handleDeleteTicker(item.id)} className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Insights Hub</h1>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Strategic Archives Management</p>
              </div>
              <button onClick={() => { setIsEditingArticle(false); setIsArticleModalOpen(true); }} className="bg-nova-500 hover:bg-nova-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-nova-500/20">
                <FileText size={16} /> Create Insight
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(art => (
                <div key={art.id} className="group glass-panel rounded-[3rem] border border-white/5 overflow-hidden flex flex-col hover:border-nova-500/30 transition-all">
                  <div className="h-56 relative overflow-hidden bg-nova-800">
                    {art.imageUrl ? (
                      <img src={art.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={art.title} />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${art.imageGradient} opacity-30`}></div>
                    )}
                    <div className="absolute top-6 left-6"><span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[8px] font-black text-white uppercase tracking-widest rounded-full">{art.category}</span></div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">{art.title}</h3>
                    <p className="text-gray-400 text-xs mb-8 line-clamp-2 italic">"{art.excerpt}"</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                      <div className="flex gap-4">
                        <button onClick={() => handleEditArticle(art)} className="text-nova-400 hover:text-white transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteArticle(art.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{art.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CAMPAIGNS */}
        {activeTab === 'carousel' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Strategic Campaigns</h1>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Marketing & Client Success</p>
              </div>
              <button onClick={() => setIsCampaignModalOpen(true)} className="bg-nova-500 hover:bg-nova-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-nova-500/20">
                <Megaphone size={16} /> New Campaign
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {campaigns.map(item => (
                <div key={item.id} className="group glass-panel rounded-[3rem] border border-white/10 overflow-hidden flex flex-col h-[300px] hover:border-nova-500/30 transition-all">
                  <div className="absolute inset-0 z-0">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover opacity-20" alt={item.headline} />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-nova-500 to-purple-600 opacity-20"></div>
                    )}
                  </div>
                  <div className="relative z-10 p-10 flex flex-col h-full">
                    <span className="px-3 py-1 bg-nova-500/20 border border-nova-500/30 text-[9px] font-black text-white uppercase tracking-widest rounded-full w-fit mb-6">{item.tag}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.headline}</h3>
                    <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-8">{item.summary}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{item.contextType} module active</span>
                      <div className="flex gap-3">
                        {item.url && <a href={item.url} target="_blank" rel="noreferrer" className="p-3 bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all"><ExternalLink size={16} /></a>}
                        <button onClick={() => handleDeleteCampaign(item.id)} className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {isTickerModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsTickerModalOpen(false)}></div>
          <div className="relative w-full max-w-md glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Alert Broadcast</h2>
              <button onClick={() => setIsTickerModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10">
              <form onSubmit={handlePostTicker} className="space-y-6">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Alert Level*</label>
                  <select value={newTicker.category} onChange={(e) => setNewTicker({ ...newTicker, category: e.target.value as any })} className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none font-bold">
                    <option value="Urgent">Urgent Alert</option>
                    <option value="Market">Market Alert</option>
                    <option value="Corporate">Corporate Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Broadcast Text*</label>
                  <textarea required maxLength={120} value={newTicker.text} onChange={(e) => setNewTicker({ ...newTicker, text: e.target.value })} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-red-500 outline-none resize-none font-bold uppercase tracking-tight italic" placeholder="MAX 120 CHARS FOR OPTIMAL SCROLL" />
                </div>
                <button type="submit" className="w-full py-5 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-red-500 transition-all shadow-xl active:scale-95">Initiate Broadcast</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsArticleModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{isEditingArticle ? 'Refine Insight' : 'Manifest Insight'}</h2>
              <button onClick={() => setIsArticleModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <form onSubmit={handlePostArticle} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Intel Title*</label>
                    <input required type="text" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" placeholder="e.g. Asset Finance Trends Q3" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Section*</label>
                    <select value={newArticle.category} onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })} className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none font-bold">
                      <option value="Strategy">Strategy</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Eco-Finance">Eco-Finance</option>
                      <option value="Guide">Guide</option>
                      <option value="Tech">Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Author Terminal*</label>
                    <input required type="text" value={newArticle.author} onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Executive Summary*</label>
                  <textarea required value={newArticle.excerpt} onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none resize-none italic font-medium" />
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Visual Synchronization</label>
                  <div className="flex gap-4">
                    <div className="w-40 h-24 bg-nova-800 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                      {newArticle.imageUrl ? (
                        <img src={newArticle.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <ImageIcon className="text-gray-700" size={32} />
                      )}
                      {isGeneratingImage && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-nova-400" size={24} /></div>}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                      <button type="button" onClick={() => handleGenerateAIImage('article')} disabled={isGeneratingImage} className="flex-1 bg-nova-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-nova-400 transition-all flex items-center justify-center gap-2">
                        <BrainCircuit size={16} /> {isGeneratingImage ? 'Syncing...' : 'Gemini AI Vision Sync'}
                      </button>
                      <label className="flex-1 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <Upload size={16} /> Manual Upload
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setNewArticle, 'article', setArticleFile)} className="hidden" />
                      </label>
                      <p className="text-[9px] text-gray-500 italic mt-1 ml-1 font-medium">Recommended: 1200x800px (3:2 ratio)</p>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-white text-nova-900 font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-nova-500 hover:text-white transition-all shadow-xl active:scale-95">
                  {isEditingArticle ? 'Update Intel' : 'Initialize Transmit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAMPAIGN ENTRY */}
      {
        isCampaignModalOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCampaignModalOpen(false)}></div>
            <div className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Campaign Builder</h2>
                <button onClick={() => setIsCampaignModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
              </div>
              <div className="p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <form onSubmit={handlePostCampaign} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Context Type*</label>
                      <select value={newCampaign.contextType} onChange={(e) => setNewCampaign({ ...newCampaign, contextType: e.target.value })} className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none font-bold">
                        <option value="advert">Institutional Advert</option>
                        <option value="product">Product Campaign</option>
                        <option value="customer">Client Success</option>
                        <option value="news">Market Intelligence</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Short Tag*</label>
                      <input required type="text" value={newCampaign.tag} onChange={(e) => setNewCampaign({ ...newCampaign, tag: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold" placeholder="e.g. Active Campaign" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Headline*</label>
                    <input required type="text" value={newCampaign.headline} onChange={(e) => setNewCampaign({ ...newCampaign, headline: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-lg" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Redirection URL</label>
                    <input type="url" value={newCampaign.url} onChange={(e) => setNewCampaign({ ...newCampaign, url: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold" placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Summary*</label>
                    <textarea required value={newCampaign.summary} onChange={(e) => setNewCampaign({ ...newCampaign, summary: e.target.value })} className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none resize-none font-medium italic" />
                  </div>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex gap-4">
                      <div className="w-32 h-20 bg-nova-800 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                        {newCampaign.image ? <img src={newCampaign.image} className="w-full h-full object-cover" alt="Campaign" /> : <ImageIcon className="text-gray-700" size={24} />}
                        {isGeneratingImage && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-nova-400" size={16} /></div>}
                      </div>
                      <div className="flex flex-col gap-2 flex-grow">
                        <button type="button" onClick={() => handleGenerateAIImage('campaign')} disabled={isGeneratingImage} className="flex-1 bg-nova-500 text-white font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"><BrainCircuit size={14} /> AI Visualization Sync</button>
                        <label className="flex-1 bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer"><Upload size={14} /> Campaign Asset Upload <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setNewCampaign, 'campaign', setCampaignFile)} className="hidden" /></label>
                        <p className="text-[9px] text-gray-500 italic mt-1 ml-1 font-medium">Recommended: 1600x800px (2:1 aspect ratio)</p>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-white text-nova-900 font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-nova-500 hover:text-white transition-all shadow-xl active:scale-95">Initiate Campaign</button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsTeamModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{isEditingTeam ? 'Refine Leader Profile' : 'Initialize New Leader'}</h2>
              <button onClick={() => setIsTeamModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <form onSubmit={handlePostTeam} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Ident Name*</label>
                    <input required type="text" value={newTeamMember.name} onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Official Designation*</label>
                    <input required type="text" value={newTeamMember.role} onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Specialized Domain*</label>
                  <input required type="text" value={newTeamMember.specialization} onChange={(e) => setNewTeamMember({ ...newTeamMember, specialization: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" placeholder="e.g. Asset Engineering" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Leader Intel / Bio*</label>
                  <textarea required value={newTeamMember.bio} onChange={(e) => setNewTeamMember({ ...newTeamMember, bio: e.target.value })} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none resize-none font-medium italic" />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <input type="text" value={newTeamMember.linkedin} onChange={(e) => setNewTeamMember({ ...newTeamMember, linkedin: e.target.value })} placeholder="LinkedIn URI" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold" />
                  <input type="text" value={newTeamMember.twitter} onChange={(e) => setNewTeamMember({ ...newTeamMember, twitter: e.target.value })} placeholder="Twitter URI" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold" />
                  <input type="email" value={newTeamMember.email} onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })} placeholder="Terminal Email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold" />
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-nova-800 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                      {newTeamMember.imageUrl ? <img src={newTeamMember.imageUrl} className="w-full h-full object-cover" alt="Headshot" /> : <User className="text-gray-700" size={32} />}
                      {isGeneratingImage && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-nova-400" size={16} /></div>}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                      <button type="button" onClick={() => handleGenerateAIImage('team')} disabled={isGeneratingImage} className="flex-1 bg-nova-500 text-white font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"><BrainCircuit size={14} /> Gemini Portrait Sync</button>
                      <label className="flex-1 bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer"><Upload size={14} /> Headshot Upload <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setNewTeamMember, 'team', setTeamFile)} className="hidden" /></label>
                      <p className="text-[9px] text-gray-500 italic mt-1 ml-1 font-medium">Recommended: 800x800px (Square)</p>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-white text-nova-900 font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-nova-500 hover:text-white transition-all shadow-xl active:scale-95">
                  {isEditingTeam ? 'Refine Records' : 'Initialize Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {
        selectedApplication && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedApplication(null)}></div>
            <div className="relative w-full max-w-2xl glass-panel rounded-[2.5rem] border border-white/10 p-10 animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black uppercase text-nova-400 tracking-[0.2em] mb-2 block">{selectedApplication.type === 'financial' ? 'Loan Application' : 'Business Support Request'}</span>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{selectedApplication.businessName}</h2>
                </div>
                <button onClick={() => setSelectedApplication(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500"><X size={20} /></button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Contact Person</label>
                    <p className="text-white font-bold">{selectedApplication.fullName}</p>
                    <p className="text-sm text-gray-400">{selectedApplication.role}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Communication</label>
                    <p className="text-sm text-white font-mono">{selectedApplication.email}</p>
                    <p className="text-sm text-white font-mono">{selectedApplication.phone}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Entity Details</label>
                    <p className="text-sm text-white">CAC: {selectedApplication.cacNumber}</p>
                    <p className="text-sm text-white">Industry: {selectedApplication.industry}</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Specific Request</label>
                    <p className="text-nova-400 font-bold uppercase">{selectedApplication.type === 'financial' ? selectedApplication.loanType : selectedApplication.serviceType}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Detailed Brief</label>
                    <p className="text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto pr-2">{selectedApplication.description}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-2">
                  {(['Reviewed', 'Approved', 'Declined'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => updateAppStatus(selectedApplication.id, status)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedApplication.status === status ? 'bg-nova-500 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <button
                  onClick={(e) => { handleDeleteApplication(selectedApplication.id, e); setSelectedApplication(null); }}
                  className="flex items-center gap-2 text-red-500/50 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                  <Trash2 size={14} /> Purge Record
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Inquiry Detail Modal */}
      {
        selectedInquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)}></div>
            <div className="relative w-full max-w-lg glass-panel rounded-[2.5rem] border border-white/10 p-10 animate-fade-in-up">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-400 tracking-[0.2em] mb-2 block">Electronic Inquiry Uplink</span>
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">{selectedInquiry.subject}</h2>
                </div>
                <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500"><X size={20} /></button>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Transmission From</label>
                    <p className="text-white font-bold">{selectedInquiry.fullName}</p>
                    <p className="text-sm text-gray-400 font-mono">{selectedInquiry.email}</p>
                  </div>
                  <div className="text-right">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Timestamp</label>
                    <p className="text-xs text-gray-400">{selectedInquiry.date}</p>
                  </div>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Message Brief</label>
                  <p className="text-sm text-gray-200 leading-relaxed italic">"{selectedInquiry.message}"</p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'Replied')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedInquiry.status === 'Replied' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                  >
                    Mark as Replied
                  </button>
                  <button
                    onClick={() => updateInquiryStatus(selectedInquiry.id, 'Archived')}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedInquiry.status === 'Archived' ? 'bg-gray-700 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                  >
                    Archive
                  </button>
                </div>
                <button
                  onClick={(e) => { handleDeleteInquiry(selectedInquiry.id, e); setSelectedInquiry(null); }}
                  className="p-2 text-red-500/30 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};
