import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Building2, Wallet, User, Calculator, CheckCircle2, Briefcase, MapPin, UploadCloud, FileText, Trash2, Scale, BrainCircuit, Globe, Landmark, TrendingUp, Network, AlertCircle, ShieldCheck, CheckSquare, Info } from 'lucide-react';
import { storageService } from '../services/storageService';
import { LoanApplication } from '../types';
import { useToast } from './Toast';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'financial' | 'business_support' | null;
}

type ApplicationType = 'financial' | 'business_support' | null;

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({ isOpen, onClose, initialType }) => {
  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState<ApplicationType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();


  const [formData, setFormData] = useState({
    loanType: '',
    serviceType: '',
    amount: '',
    revenue: '',
    bankStatementName: '',
    description: '',
    businessName: '',
    cacNumber: '',
    isCacRegistered: false,
    industry: 'General',
    state: 'Lagos',
    fullName: '',
    role: '',
    email: '',
    phone: '',
    bvn: '',
    isAcknowledged: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialType) {
        setAppType(initialType);
        setStep(2);
      } else {
        setStep(1);
        setAppType(null);
      }
      setIsSubmitting(false);
      setFormData({
        loanType: '',
        serviceType: '',
        amount: '',
        revenue: '',
        bankStatementName: '',
        description: '',
        businessName: '',
        cacNumber: '',
        isCacRegistered: false,
        industry: 'General',
        state: 'Lagos',
        fullName: '',
        role: '',
        email: '',
        phone: '',
        bvn: '',
        isAcknowledged: false,
      });
    }
  }, [isOpen, initialType]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleSelectAppType = (type: ApplicationType) => {
    setAppType(type);
    setStep(2);
  };

  const isStepValid = () => {
    switch (step) {
      case 2:
        return appType === 'financial' ? !!formData.loanType : !!formData.serviceType;
      case 3:
        return !!formData.businessName && !!formData.cacNumber && !!formData.description && !!formData.industry;
      case 4:
        return formData.isAcknowledged;
      case 5:
        const baseContactValid = !!formData.fullName && !!formData.role && !!formData.email && !!formData.phone;
        if (appType === 'financial') {
          return baseContactValid && formData.bvn.length === 11;
        }
        return baseContactValid;
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const application: LoanApplication = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleDateString(),
        type: appType!,
        ...formData,
        status: 'Pending'
      };

      await storageService.saveApplication(application);

      await new Promise(resolve => setTimeout(resolve, 1500));
      setStep(6);
      showToast('Application submitted successfully!', 'success');
    } catch (error) {
      showToast('Failed to submit application. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  const nextStep = () => {
    if (isStepValid()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);
  const isFinancial = appType === 'financial';

  // Total steps: 1: Path, 2: Product, 3: Profile, 4: Checklist, 5: Contact, 6: Success
  const totalSteps = 5;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-nova-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up font-sans">

        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {step === 1 ? 'Initiate Inquiry' :
                isFinancial ? 'CASIEC Financial Solutions' : 'GSI STRATEGIC ALLIANCES (Broastreet DyDX) Inquiry'}
            </h2>
            <p className="text-sm text-gray-400">Step {step > totalSteps ? totalSteps : step} of {totalSteps}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={20} /></button>
        </div>

        <div className="h-1 w-full bg-nova-800">
          <div className="h-full bg-gradient-to-r from-nova-500 to-purple-500 transition-all duration-500" style={{ width: step === 6 ? '100%' : `${((step - 1) / totalSteps) * 100}%` }}></div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-8 py-4">
              <h3 className="text-3xl font-bold text-white text-center mb-8 tracking-tighter uppercase italic">Select Your Path</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => handleSelectAppType('financial')} className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 p-8 border border-white/10 hover:border-nova-500 transition-all duration-300">
                  <div className="w-14 h-14 bg-nova-500/20 rounded-xl flex items-center justify-center text-nova-400 mb-6 group-hover:scale-110 transition-transform"><Landmark size={32} /></div>
                  <h3 className="text-2xl font-bold text-white mb-2">Financial Solutions</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Asset Finance, Working Capital, Gender Credit, and specialized lending via CASIEC.</p>
                </div>
                <div onClick={() => handleSelectAppType('business_support')} className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 p-8 border border-white/10 hover:border-purple-500 transition-all duration-300">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform"><Network size={32} /></div>
                  <h3 className="text-2xl font-bold text-white mb-2">Business Support</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Advisory, Corporate Finance (CFRA), and Supply Chain Distribution via GSI STRATEGIC ALLIANCES (Broastreet DyDX).</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">{isFinancial ? 'Select Financial Product' : 'Select Advisory Pillar'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isFinancial ? (
                  ['Asset Finance', 'Consumer Loan', 'Working Capital Loans', 'Group Loans', 'Gender Credit', 'Refinancing Credit', 'Creative Economy Loans', 'TOP Onlending Loans', 'Clean Energy Credit'].map((label) => (
                    <div key={label} onClick={() => { setFormData({ ...formData, loanType: label }); setTimeout(nextStep, 200); }} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${formData.loanType === label ? 'bg-nova-500/20 border-nova-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                      <span className="font-bold text-sm tracking-tight">{label}</span>
                    </div>
                  ))
                ) : (
                  ['Business Support Services', 'Corporate Finance, Research & Advisory', 'Supply Chain, Commodity Trading & Distribution'].map((label) => (
                    <div key={label} onClick={() => { setFormData({ ...formData, serviceType: label }); setTimeout(nextStep, 200); }} className={`p-6 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${formData.serviceType === label ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                      <span className="font-bold text-base tracking-tight">{label}</span>
                    </div>
                  ))
                )}
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest text-center mt-4">Required: Selection required to proceed.</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Entity Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                    <input
                      type="checkbox"
                      name="isCacRegistered"
                      checked={formData.isCacRegistered}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-white/20 bg-nova-800 text-nova-500 focus:ring-nova-500"
                    />
                    <span className="text-sm font-medium text-gray-200">My business is CAC Registered</span>
                  </label>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Business Name*</label>
                  <input required type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-nova-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">CAC / Registration No.*</label>
                  <input required type="text" name="cacNumber" value={formData.cacNumber} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-nova-500 outline-none transition-all" placeholder={formData.isCacRegistered ? "Enter RC Number" : "Enter BN Number (if any)"} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Industry Focus*</label>
                <select name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-nova-800 border border-white/10 rounded-lg py-3 px-4 text-white outline-none">
                  <option value="General">General</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Creative">Creative Arts & Media</option>
                  <option value="Tech">Technology</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Trade">Commodity Trade</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Detailed Requirements*</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full h-32 bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white resize-none focus:border-nova-500 outline-none transition-all" placeholder="How can we help you succeed?" />
              </div>
              <p className="text-[9px] text-gray-600 uppercase tracking-[0.2em] italic">* All fields in this section are mandatory.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="text-nova-400" size={28} />
                <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Documentation Checklist</h3>
              </div>

              <div className="p-4 bg-white/5 border-l-4 border-nova-500 rounded-r-2xl mb-6">
                <p className="text-sm text-gray-300 leading-relaxed italic">
                  To ensure a seamless processing experience, please acknowledge that you have or can provide the following documentation upon request.
                </p>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <h4 className="text-[10px] font-black text-nova-400 uppercase tracking-[0.2em] mb-4">Lending Requirements</h4>
                  <ul className="grid gap-3">
                    {[
                      "Completed Application letter (Form & Search Report)",
                      "Bank Statement (6/12 months) or Financials (1 year)",
                      "Valid ID (Passport/National ID/Driver's License) & Passport Photograph",
                      "BVN and NIM (National Identification Number)",
                      "Payment evidence of Search fee",
                      "Guarantor(s) Form & Documentation",
                      "Valid Cheque leaves (Guarantor and Borrower)",
                      "Asset Debenture & Movable Stocks details",
                      "Confirmed Address & Pledged Assets Verification",
                      ...(formData.isCacRegistered ? [
                        "CAC Registration Documents (Certificates/Status Reports)",
                        "Valid Statutory Regulatory Certifications",
                        "Transaction Brief / Business Plan (Recommended)"
                      ] : [
                        "Personal/Staff Support introduction letter (if applicable)",
                        "Photocopy of valid Company ID card"
                      ])
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-400 items-start group">
                        <CheckSquare size={16} className="text-nova-500 mt-0.5 flex-shrink-0" />
                        <span className="group-hover:text-white transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-4 p-5 bg-white/5 border border-nova-500/30 rounded-2xl cursor-pointer hover:bg-nova-500/10 transition-all">
                  <input
                    required
                    type="checkbox"
                    name="isAcknowledged"
                    checked={formData.isAcknowledged}
                    onChange={handleInputChange}
                    className="w-6 h-6 rounded border-white/20 bg-nova-800 text-nova-500 focus:ring-nova-500 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-white">I acknowledge the documentation requirements and fee structure.</span>
                </label>
              </div>
            </div>
          )}

          {step === 5 && (
            <form id="application-form" onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Uplink Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Full Name*</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-nova-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Designated Role*</label>
                  <input required type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="Designated Role" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-nova-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Corporate Email*</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-nova-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Phone Number*</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-nova-500 outline-none transition-all" />
                </div>
                {isFinancial && (
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-2">Bank Verification Number (11 Digits)*</label>
                    <input required type="text" name="bvn" value={formData.bvn} onChange={handleInputChange} placeholder="BVN (11 Digits)" maxLength={11} pattern="\d{11}" title="Please enter an 11-digit BVN" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:border-nova-500 outline-none transition-all" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-600 text-center uppercase tracking-widest">By submitting, you agree to our privacy protocol and terms.</p>

              {/* Added submit button inside form for better initiation reliability */}
              <div className="pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !isStepValid()}
                  className={`text-white px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all ${!isStepValid() || isSubmitting ? 'bg-gray-700 cursor-not-allowed opacity-50' : (isFinancial ? 'bg-nova-500 shadow-nova-500/30' : 'bg-purple-600 shadow-purple-600/30')
                    }`}
                >
                  {isSubmitting ? 'Live Syncing...' : 'Initiate Inquiry'} <Check size={16} />
                </button>
              </div>
            </form>
          )}

          {step === 6 && (
            <div className="text-center py-10 animate-fade-in-up">
              <CheckCircle2 size={60} className="mx-auto text-green-400 mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4 tracking-tighter">Live Feed Updated</h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">Our specialists will review your inquiry and initiate contact within 24-48 hours.</p>
              <button onClick={onClose} className="bg-white text-nova-900 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-nova-400 hover:text-white transition-all">Exit Terminal</button>
            </div>
          )}
        </div>

        {step > 1 && step < 5 && (
          <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center">
            <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className={`text-white px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all ${!isStepValid() ? 'bg-gray-700 cursor-not-allowed opacity-50' : (isFinancial ? 'bg-nova-500 shadow-nova-500/20' : 'bg-purple-600 shadow-purple-600/20')
                }`}
            >
              Next Step <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="p-6 border-t border-white/10 bg-white/5 flex justify-start items-center">
            <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"><ChevronLeft size={16} /> Back</button>
          </div>
        )}
      </div>
    </div>
  );
};