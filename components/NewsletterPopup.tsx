
import React, { useState, useEffect } from 'react';
import { X, Mail, Zap, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { useToast } from './Toast';

export const NewsletterPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General Inquiry (Digital Terminal)',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Show after 2 seconds, every time the component mounts (page load)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      // Optional: keep session logic if desired in future, but currently always shows as per previous request
      sessionStorage.setItem('kc_newsletter_seen', 'true');
    }, 300);
  };

  const normalizePhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    let cleaned = ('' + phone).replace(/\D/g, '');

    // If it starts with 0, replace with +234
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = '+234' + cleaned.substring(1);
    }
    // If it starts with 234, add +
    else if (cleaned.startsWith('234') && cleaned.length === 13) {
      cleaned = '+' + cleaned;
    }
    // If it starts with +, assume it's already in a good format
    else if (cleaned.startsWith('+')) {
      // Do nothing, it's already good
    }
    // For other cases, just return the cleaned number
    else if (cleaned.length === 10) { // Assuming 10 digits for US/Canada style without country code
      cleaned = '+1' + cleaned; // Example: default to +1 if 10 digits
    }

    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.fullName.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const normalizedPhone = normalizePhoneNumber(formData.phone);

      const inquiry = {
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toLocaleString(),
        ...formData,
        phone: normalizedPhone, // Use normalized phone number
        status: 'Unread' as const
      };

      const result = await storageService.saveInquiry(inquiry);

      if (result.success) {
        setHasSubmitted(true);
        showToast('Your inquiry has been successfully transmitted!', 'success');
        setTimeout(() => {
          handleClose();
        }, 2500);
      } else {
        showToast(result.message || 'Transmission error. Please try again.', 'error');
      }
    } catch (error) {
      showToast('An unexpected uplink error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[2100] flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={handleClose}
      ></div>

      {/* Popup Content */}
      <div className={`relative w-full max-w-md bg-nova-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${isClosing ? 'scale-95' : 'scale-100 animate-fade-in-up'}`}>

        {/* Futuristic Glow Effects */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-nova-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-nova-accent/20 rounded-full blur-[80px]"></div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 hover:bg-white/5 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="p-8 relative z-0">
          {!hasSubmitted ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(79,70,229,0.3)] backdrop-blur-md">
                  <Mail className="text-white h-8 w-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter italic">Electronic Ingress</h2>
                <p className="text-gray-400 text-sm">
                  Initialize a secure communication link with our specialized advisors.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Ident Name"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-nova-400 transition-all text-xs font-bold"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Corporate Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-nova-400 transition-all text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="relative group">
                  <input
                    type="tel"
                    placeholder="Contact Number (+234...)"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-nova-400 transition-all text-xs font-bold"
                  />
                </div>

                <div className="relative group">
                  <textarea
                    placeholder="Detailed Brief / Message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full h-24 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-nova-400 transition-all resize-none text-xs font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-nova-500 to-nova-400 hover:from-nova-400 hover:to-nova-300 text-white font-black py-4 rounded-xl shadow-lg shadow-nova-500/25 hover:shadow-nova-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-[0.2em] text-[10px]"
                >
                  {isSubmitting ? 'Transmitting...' : 'Initiate Uplink'}
                </button>
              </form>

              <p className="text-[9px] text-gray-600 mt-4 text-center uppercase tracking-widest font-black">
                Institutional Privacy Protocol Protected
              </p>
            </>
          ) : (
            <div className="py-10 text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full mx-auto flex items-center justify-center mb-6 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 uppercase italic tracking-tight">Transmission Locked</h2>
              <p className="text-gray-400 font-medium">A specialist will reach out shortly.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
