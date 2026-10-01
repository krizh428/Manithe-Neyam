import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Check, Sparkles, AlertCircle, Building2, Copy, ShieldCheck, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';
import { DONATION_DETAILS } from '../../data/siteData';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { isTamil } = useLanguage();
  const [activeTab, setActiveTab] = useState<'form' | 'bank'>('form');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [supportType, setSupportType] = useState<string>('education');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleCopy = (text: string, field: string) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setStatus('idle');
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const supportOptions = [
    { id: 'education', labelTa: 'குழந்தை கல்வி ஆதரவு', labelEn: 'Child Education Sponsorship' },
    { id: 'food', labelTa: 'சத்தான உணவு / அன்னதானம்', labelEn: 'Nutritious Meal Sponsorship' },
    { id: 'senior', labelTa: 'முதியோர் பராமரிப்பு', labelEn: 'Senior Citizen Care' },
    { id: 'medical', labelTa: 'மருத்துவ உதவி', labelEn: 'Medical Aid & Checkups' },
    { id: 'volunteer', labelTa: 'தன்னார்வலராக இணைதல்', labelEn: 'Join as a Volunteer' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0F172A', '#1E293B', '#334155', '#D4AF37'],
        });
      } catch {
        // Confetti fallback
      }
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-theme-card rounded-3xl shadow-card hover:shadow-hover overflow-hidden z-10 border border-theme-border my-8"
        >
          {/* Header Banner */}
          <div className="bg-theme-bg p-6 sm:p-7 border-b border-theme-border relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-theme-text hover:text-theme-text hover:bg-theme-bg transition-colors focus:outline-none"
              aria-label={isTamil ? 'மூடவும்' : 'Close'}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-theme-bg/10 text-theme-text text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>{isTamil ? 'மனிதநேய ஆதரவு' : 'Humanitarian Support'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-theme-text leading-tight">
              {isTamil ? 'ஆதரிக்க விரும்புகிறேன்' : 'I Want to Support'}
            </h3>
            <p className="text-xs sm:text-sm text-theme-text mt-1">
              {isTamil
                ? 'உங்கள் ஆதரவு விருப்பத்தை தெரிவியுங்கள் அல்லது நேரடியாக வங்கி மூலம் நன்கொடை அளியுங்கள்.'
                : 'Share your support preference or make a direct donation through bank transfer.'}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-theme-border bg-theme-bg/40">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'form'
                  ? 'border-brand-primary text-brand-primary bg-theme-card'
                  : 'border-transparent text-theme-text/70 hover:text-theme-text'
              }`}
            >
              {isTamil ? 'ஆதரவு படிவம்' : 'Support Inquiry Form'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bank')}
              className={`flex-1 py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'bank'
                  ? 'border-brand-primary text-brand-primary bg-theme-card'
                  : 'border-transparent text-theme-text/70 hover:text-theme-text'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isTamil ? 'வங்கி & வரிவிலக்கு விவரங்கள்' : 'Bank & 80G Details'}</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'bank' ? (
              <div className="space-y-4">
                {/* Tax Exemption Banner */}
                <div className="p-3.5 rounded-2xl bg-brand-bg/60 border border-brand-primary/25 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-brand-primary">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-brand-primary" />
                    <span>
                      {isTamil
                        ? 'வருமான வரி விலக்கு & CSR அங்கீகாரம்'
                        : 'Income Tax Exemption & CSR Facility'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-theme-text leading-relaxed">
                    {isTamil ? DONATION_DETAILS.taxExemptionTa : DONATION_DETAILS.taxExemptionEn}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-theme-bg border border-theme-border text-[11px] font-bold text-theme-text">
                      12AA
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-theme-bg border border-theme-border text-[11px] font-bold text-theme-text">
                      80G
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-theme-bg border border-theme-border text-[11px] font-bold text-theme-text">
                      CSR Facility
                    </span>
                  </div>
                </div>

                {/* Bank Account Details */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border gap-1">
                    <span className="text-theme-text/70 font-medium">
                      {isTamil ? 'கணக்கு பெயர் (A/C Name):' : 'A/C Name:'}
                    </span>
                    <span className="font-extrabold text-theme-text uppercase">
                      {DONATION_DETAILS.accountName}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border gap-1">
                    <span className="text-theme-text/70 font-medium">
                      {isTamil ? 'வங்கி பெயர் (Bank Name):' : 'Bank Name:'}
                    </span>
                    <span className="font-bold text-theme-text">
                      {DONATION_DETAILS.bankName}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border gap-1">
                    <span className="text-theme-text/70 font-medium">
                      {isTamil ? 'கிளை (Branch):' : 'Branch:'}
                    </span>
                    <span className="font-bold text-theme-text">
                      {DONATION_DETAILS.branch}
                    </span>
                  </div>

                  {/* A/c No */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-theme-text/70 font-medium">
                        {isTamil ? 'கணக்கு எண் (A/c No.):' : 'A/c No.:'}
                      </span>
                      <span className="font-extrabold text-theme-text font-mono text-sm tracking-wide">
                        {DONATION_DETAILS.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(DONATION_DETAILS.accountNumber, 'ac')}
                      className="p-1.5 rounded-lg bg-theme-card hover:bg-brand-bg border border-theme-border text-theme-text/70 hover:text-brand-primary transition-all shrink-0 cursor-pointer"
                      title={isTamil ? 'நகலெடு' : 'Copy Account Number'}
                    >
                      {copiedField === 'ac' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* IFSC */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-theme-text/70 font-medium">
                        {isTamil ? 'ஐ.எப்.எஸ்.சி (IFSC):' : 'IFSC Code:'}
                      </span>
                      <span className="font-extrabold text-theme-text font-mono text-sm tracking-wide">
                        {DONATION_DETAILS.ifscCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(DONATION_DETAILS.ifscCode, 'ifsc')}
                      className="p-1.5 rounded-lg bg-theme-card hover:bg-brand-bg border border-theme-border text-theme-text/70 hover:text-brand-primary transition-all shrink-0 cursor-pointer"
                      title={isTamil ? 'நகலெடு' : 'Copy IFSC Code'}
                    >
                      {copiedField === 'ifsc' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* GPay */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/30 gap-2 mt-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                          GPay / PhonePe / UPI
                        </span>
                        <span className="font-extrabold text-theme-text font-mono text-sm">
                          {DONATION_DETAILS.gpayNumber}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(DONATION_DETAILS.gpayNumber.replace(/\s+/g, ''), 'gpay')}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                      title={isTamil ? 'GPay எண் நகலெடு' : 'Copy GPay Number'}
                    >
                      {copiedField === 'gpay' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{isTamil ? 'நகலெடுக்கப்பட்டது' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isTamil ? 'நகலெடு' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-brand-primary text-on-primary font-bold text-xs hover:bg-brand-hover transition-colors cursor-pointer"
                  >
                    {isTamil ? 'நன்றி / முடிந்தது' : 'Done'}
                  </button>
                </div>
              </div>
            ) : status === 'success' ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-bg border-2 border-brand-primary text-brand-primary flex items-center justify-center mx-auto shadow-card hover:shadow-hover">
                  <Sparkles className="w-8 h-8 text-brand-primary" />
                </div>
                <h4 className="text-2xl font-extrabold text-theme-text">
                  {isTamil ? 'மனிதநேயத்துடன் இணைந்ததற்கு நன்றி!' : 'Thank You for Your Generous Heart!'}
                </h4>
                <p className="text-sm text-theme-text max-w-md mx-auto leading-relaxed">
                  {isTamil
                    ? 'உங்கள் ஆதரவு கோரிக்கை வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது. எங்கள் நிர்வாகி விரைவில் உங்களை தொடர்பு கொண்டு விவரங்களை பகிர்வார்.'
                    : 'Your support inquiry has been recorded. Our coordinator will get in touch with you shortly.'}
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-8 py-2.5 rounded-full bg-theme-bg text-theme-text font-bold text-sm hover:bg-theme-bg transition-colors"
                >
                  {isTamil ? 'நன்றி' : 'Done'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Select Support Type */}
                <div>
                  <label className="block text-xs font-bold text-theme-text uppercase tracking-wider mb-2">
                    {isTamil ? 'ஆதரவு வகை' : 'Select Type of Support'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {supportOptions.map((opt) => {
                      const isSelected = supportType === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSupportType(opt.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-brand-primary bg-brand-bg text-brand-primary shadow-xs'
                              : 'border-theme-border text-theme-text hover:border-brand-primary/40'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-brand-primary text-on-primary' : 'border border-theme-border'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span>{isTamil ? opt.labelTa : opt.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-theme-text mb-1">
                      {isTamil ? 'உங்கள் பெயர் *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isTamil ? 'பெயர்' : 'Full Name'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-theme-text mb-1">
                      {isTamil ? 'தொலைபேசி எண் *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-theme-text mb-1">
                    {isTamil ? 'மின்னஞ்சல் (விருப்பத்தேர்வு)' : 'Email (Optional)'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-theme-text mb-1">
                    {isTamil ? 'கூடுதல் குறிப்புகள் / விருப்பம்' : 'Additional Message'}
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      isTamil
                        ? 'உதாரணமாக: பிறந்தநாள் அன்னதானம், கல்வி கட்டணம்...'
                        : 'e.g. Sponsoring a meal for a birthday, educational supplies...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{isTamil ? 'தயவுசெய்து பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter your name and phone number.'}</span>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full border border-theme-border text-xs font-semibold text-theme-text hover:bg-theme-secondary transition-colors cursor-pointer"
                  >
                    {isTamil ? 'ரத்து' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-7 py-2.5 rounded-full bg-brand-primary text-on-primary font-bold text-xs sm:text-sm hover:bg-brand-hover shadow-card hover:shadow-hover transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98"
                  >
                    {status === 'submitting' ? (
                      <span>{isTamil ? 'பதிவாகிறது...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
                        <span>{isTamil ? 'விருப்பத்தை சமர்ப்பிக்கவும்' : 'Submit Support Inquiry'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
