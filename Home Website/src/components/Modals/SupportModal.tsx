import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Check, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../context/LanguageContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { isTamil } = useLanguage();
  const [supportType, setSupportType] = useState<string>('education');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
          colors: ['#0EA5E9', '#3B82F6', '#0B1120', '#D4AF37'],
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
          className="relative w-full max-w-xl bg-theme-bg rounded-3xl shadow-card hover:shadow-hover overflow-hidden z-10 border border-theme-border my-8"
        >
          {/* Header Banner */}
          <div className="bg-theme-bg p-6 sm:p-7 border-b border-theme-border relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-theme-text hover:text-theme-text hover:bg-theme-bg transition-colors focus:outline-none"
              aria-label="Close"
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
                ? 'உங்கள் ஆதரவு விருப்பத்தை தெரிவியுங்கள்; எங்கள் நிர்வாக குழு உங்களை நேரடியாக தொடர்பு கொள்ளும்.'
                : 'Select your preferred way to help. Our administration team will connect with you directly.'}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {status === 'success' ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-theme-bg border-2 border-theme-border text-theme-text flex items-center justify-center mx-auto shadow-card hover:shadow-hover">
                  <Sparkles className="w-8 h-8 text-theme-text" />
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
                              ? 'border-theme-border bg-theme-bg text-theme-text shadow-xs'
                              : 'border-theme-border text-theme-text hover:border-theme-border/40'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-theme-bg text-theme-text' : 'border border-theme-border'
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-theme-border text-sm focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{isTamil ? 'தயவுசெய்து பெயர் மற்றும் தொலைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter your name and phone number.'}</span>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full border border-theme-border text-xs font-semibold text-theme-text hover:bg-theme-bg"
                  >
                    {isTamil ? 'ரத்து' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="px-7 py-2.5 rounded-full bg-theme-bg text-theme-text font-bold text-xs sm:text-sm hover:bg-theme-bg shadow-card hover:shadow-hover transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer border border-theme-border/40"
                  >
                    {status === 'submitting' ? (
                      <span>{isTamil ? 'பதிவாகிறது...' : 'Submitting...'}</span>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
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
