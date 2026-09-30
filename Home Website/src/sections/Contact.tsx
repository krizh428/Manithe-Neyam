import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SectionHeading } from '../components/Common/SectionHeading';
import { CONTACT_DATA } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import type { ContactFormData } from '../types';
import { gsap, EASING, prefersReducedMotion } from '../animations';
import { AnimatedButton } from '../components/Animated/AnimatedButton';

export const Contact: React.FC = () => {
  const { isTamil } = useLanguage();
  const { brand: SITE_BRAND } = useAdminData();
  const { form } = CONTACT_DATA;

  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useLayoutEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      if (leftColRef.current) {
        gsap.set(leftColRef.current, { opacity: 0, x: -30 });
        gsap.to(leftColRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.75,
          ease: EASING.cinematic,
          scrollTrigger: {
            trigger: leftColRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }

      if (rightColRef.current) {
        gsap.set(rightColRef.current, { opacity: 0, x: 30 });
        gsap.to(rightColRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.75,
          delay: 0.1,
          ease: EASING.cinematic,
          scrollTrigger: {
            trigger: rightColRef.current,
            start: 'top 82%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validate = (): boolean => {
    const errs: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      errs.name = isTamil ? 'உங்கள் பெயரை உள்ளிடவும்' : 'Name is required';
    }

    if (!formData.email.trim()) {
      errs.email = isTamil ? 'மின்னஞ்சலை உள்ளிடவும்' : 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = isTamil ? 'சரியான மின்னஞ்சலை உள்ளிடவும்' : 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      errs.phone = isTamil ? 'தொலைபேசி எண்ணை உள்ளிடவும்' : 'Phone is required';
    } else if (formData.phone.trim().length < 8) {
      errs.phone = isTamil ? 'சரியான தொலைபேசி எண்ணை உள்ளிடவும்' : 'Enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      errs.subject = isTamil ? 'பொருளை உள்ளிடவும்' : 'Subject is required';
    }

    if (!formData.message.trim()) {
      errs.message = isTamil ? 'உங்கள் செய்தியை உள்ளிடவும்' : 'Message is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0F172A', '#1E293B', '#334155', '#D4AF37'],
        });
      } catch {
        // Fallback
      }
    }, 1000);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setErrors({});
    setStatus('idle');
  };

  return (
    <section ref={sectionRef} id="contact" className="py-20 sm:py-28 bg-theme-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? CONTACT_DATA.badgeTa : CONTACT_DATA.badgeEn}
          title={isTamil ? CONTACT_DATA.titleTa : CONTACT_DATA.titleEn}
          subtitle={
            isTamil
              ? 'எங்கள் இல்லத்தை நேரில் பார்வையிடவோ அல்லது தொடர்புகொள்ளவோ எப்போது வேண்டுமானாலும் அழைக்கலாம்.'
              : 'Feel free to connect with our administrative team or plan a visit to our home in Kodangipatti, Theni.'
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Organization Details & Map */}
          <div ref={leftColRef} className="lg:col-span-5 space-y-6">
            {/* Contact Information Card */}
            <div className="bg-theme-card p-7 sm:p-8 rounded-3xl border border-theme-border shadow-soft space-y-6">
              <h3 className="text-xl font-extrabold text-card-heading font-tamil border-b border-theme-border pb-4">
                {isTamil ? 'தொடர்பு முகவரி & விவரங்கள்' : 'Address & Contact Details'}
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-bg border border-theme-border/40 text-brand-primary flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-card-text-secondary mb-1">
                    {isTamil ? 'முகவரி' : 'Location & Address'}
                  </h4>
                  <p className="text-sm sm:text-base font-semibold text-card-text leading-relaxed">
                    {isTamil ? SITE_BRAND.fullAddressTa : SITE_BRAND.fullAddressEn}
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-bg border border-theme-border/40 text-brand-primary flex items-center justify-center shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-card-text-secondary mb-1">
                    {isTamil ? 'தொலைபேசி' : 'Phone Numbers'}
                  </h4>
                  <div className="flex flex-col gap-1 text-sm sm:text-base font-bold text-card-text">
                    <a
                      href={`tel:${SITE_BRAND.phone1.replace(/\s+/g, '')}`}
                      className="hover:text-brand-primary transition-colors"
                    >
                      {SITE_BRAND.phone1}
                    </a>
                    <a
                      href={`tel:${SITE_BRAND.phone2.replace(/\s+/g, '')}`}
                      className="hover:text-brand-primary transition-colors"
                    >
                      {SITE_BRAND.phone2}
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-bg border border-theme-border/40 text-brand-primary flex items-center justify-center shrink-0 mt-1">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-card-text-secondary mb-1">
                    {isTamil ? 'மின்னஞ்சல்' : 'Email Address'}
                  </h4>
                  <a
                    href={`mailto:${SITE_BRAND.email}`}
                    className="text-sm sm:text-base font-bold text-card-text hover:text-brand-primary transition-colors"
                  >
                    {SITE_BRAND.email}
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-brand-bg border border-theme-border/40 text-brand-primary flex items-center justify-center shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-card-text-secondary mb-1">
                    {isTamil ? 'பார்வையாளர் நேரம்' : 'Visiting Hours'}
                  </h4>
                  <p className="text-sm font-semibold text-card-text">
                    {isTamil ? SITE_BRAND.timingsTa : SITE_BRAND.timingsEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Stylized Google Map Card */}
            <div className="bg-theme-card rounded-3xl border border-theme-border shadow-soft p-5 overflow-hidden">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-theme-bg flex items-center justify-center border border-theme-border">
                {/* Visual Map Layout Graphic */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#0F172A_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-brand-bg text-brand-primary flex items-center justify-center mx-auto mb-2 shadow-card hover:shadow-hover animate-bounce">
                    <MapPin className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h5 className="font-extrabold text-sm text-card-heading font-tamil">
                    {SITE_BRAND.fullNameTa}
                  </h5>
                  <p className="text-xs text-card-text-secondary font-medium">
                    {SITE_BRAND.locationBriefTa}
                  </p>

                  <a
                    href="https://maps.google.com/?q=Kodangipatti,Theni,Tamil+Nadu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-theme-bg text-theme-text font-bold text-xs shadow-card hover:shadow-hover hover:border-brand-primary border border-theme-border mt-3 transition-all hover:scale-105 active:scale-95"
                  >
                    <span>{isTamil ? 'மேப்பில் திறக்கவும்' : 'Open in Google Maps'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with Smooth Validation Feedback */}
          <div ref={rightColRef} className="lg:col-span-7">
            <div className="bg-theme-card rounded-3xl border border-theme-border shadow-soft p-8 sm:p-10">
              {status === 'success' ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-brand-bg border-2 border-brand-primary text-brand-primary flex items-center justify-center mx-auto shadow-card animate-bounce">
                    <CheckCircle2 className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h4 className="text-2xl font-extrabold text-card-heading font-tamil">
                    {isTamil ? 'செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!' : 'Message Sent Successfully!'}
                  </h4>
                  <p className="text-sm sm:text-base text-card-text max-w-md mx-auto leading-relaxed">
                    {isTamil ? form.successTa : form.successEn}
                  </p>
                  <AnimatedButton
                    onClick={handleReset}
                    variant="secondary"
                    className="mt-6 px-8 py-3"
                  >
                    {isTamil ? 'மற்றொரு செய்தியை அனுப்பவும்' : 'Send Another Message'}
                  </AnimatedButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <h3 className="text-2xl font-extrabold text-card-heading font-tamil mb-2">
                    {isTamil ? 'செய்தி அனுப்பவும்' : 'Send Us a Direct Message'}
                  </h3>
                  <p className="text-xs sm:text-sm text-card-text mb-6">
                    {isTamil
                      ? 'உங்கள் கேள்விகள் அல்லது எண்ணங்களை பகிருங்கள்; நாங்கள் விரைவில் பதிலளிப்போம்.'
                      : 'Share your questions or suggestions with us; we will get back to you promptly.'}
                  </p>

                  {/* Name & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-card-text uppercase tracking-wider mb-2">
                        {isTamil ? form.nameTa : form.nameEn} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        placeholder={isTamil ? form.namePlaceholderTa : form.namePlaceholderEn}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.name
                            ? 'border-red-400 bg-red-50/20 focus:ring-red-400 animate-shake'
                            : 'border-theme-border bg-theme-bg text-theme-text focus:ring-brand-primary focus:border-brand-primary'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 animate-fadeIn">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-card-text uppercase tracking-wider mb-2">
                        {isTamil ? form.emailTa : form.emailEn} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder={isTamil ? form.emailPlaceholderTa : form.emailPlaceholderEn}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-red-400 bg-red-50/20 focus:ring-red-400 animate-shake'
                            : 'border-theme-border bg-theme-bg text-theme-text focus:ring-brand-primary focus:border-brand-primary'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 animate-fadeIn">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone & Subject Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-card-text uppercase tracking-wider mb-2">
                        {isTamil ? form.phoneTa : form.phoneEn} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: undefined });
                        }}
                        placeholder={isTamil ? form.phonePlaceholderTa : form.phonePlaceholderEn}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.phone
                            ? 'border-red-400 bg-red-50/20 focus:ring-red-400 animate-shake'
                            : 'border-theme-border bg-theme-bg text-theme-text focus:ring-brand-primary focus:border-brand-primary'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 animate-fadeIn">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.phone}</span>
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-card-text uppercase tracking-wider mb-2">
                        {isTamil ? form.subjectTa : form.subjectEn} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => {
                          setFormData({ ...formData, subject: e.target.value });
                          if (errors.subject) setErrors({ ...errors, subject: undefined });
                        }}
                        placeholder={isTamil ? form.subjectPlaceholderTa : form.subjectPlaceholderEn}
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.subject
                            ? 'border-red-400 bg-red-50/20 focus:ring-red-400 animate-shake'
                            : 'border-theme-border bg-theme-bg text-theme-text focus:ring-brand-primary focus:border-brand-primary'
                        }`}
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1 animate-fadeIn">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.subject}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-card-text uppercase tracking-wider mb-2">
                      {isTamil ? form.messageTa : form.messageEn} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: undefined });
                      }}
                      placeholder={isTamil ? form.messagePlaceholderTa : form.messagePlaceholderEn}
                      className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 resize-none ${
                        errors.message
                          ? 'border-red-400 bg-red-50/20 focus:ring-red-400 animate-shake'
                          : 'border-theme-border bg-theme-bg text-theme-text focus:ring-brand-primary focus:border-brand-primary'
                      }`}
                    />
                    {errors.message && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1 animate-fadeIn">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <AnimatedButton
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full sm:w-auto px-10 py-3.5 bg-brand-primary text-on-primary font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 disabled:opacity-50"
                    >
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isTamil ? form.submittingTa : form.submittingEn}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>{isTamil ? form.submitBtnTa : form.submitBtnEn}</span>
                        </>
                      )}
                    </AnimatedButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
