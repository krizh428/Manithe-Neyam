import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  MapPin,
  Mail,
  Clock,
  Building2,
  Copy,
  Check,
  Heart,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/Common/WhatsAppIcon';
import { SectionHeading } from '../components/Common/SectionHeading';
import { CONTACT_DATA, DONATION_DETAILS } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { gsap, EASING, prefersReducedMotion } from '../animations';

export const Contact: React.FC = () => {
  const { isTamil } = useLanguage();
  const { brand: SITE_BRAND } = useAdminData();

  const sectionRef = useRef<HTMLElement | null>(null);
  const leftColRef = useRef<HTMLDivElement | null>(null);
  const rightColRef = useRef<HTMLDivElement | null>(null);

  const [copiedField, setCopiedField] = useState<string | null>(null);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-6xl mx-auto">
          {/* Card 1: Contact Information Card */}
          <div ref={leftColRef} className="h-full">
            <div className="bg-theme-card p-7 sm:p-8 rounded-3xl border border-theme-border shadow-soft space-y-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-card-heading font-tamil border-b border-theme-border pb-4">
                  {isTamil ? 'தொடர்பு முகவரி & விவரங்கள்' : 'Address & Contact Details'}
                </h3>

                <div className="space-y-6 pt-5">
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

                  {/* Phone Numbers with Direct WhatsApp Links */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-1">
                      <WhatsAppIcon className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-card-text-secondary mb-1">
                        {isTamil ? 'தொலைபேசி / வாட்ஸ்அப்' : 'Phone Numbers (Click for WhatsApp)'}
                      </h4>
                      <div className="flex flex-col gap-1.5 text-sm sm:text-base font-bold text-card-text">
                        <a
                          href={`https://wa.me/${SITE_BRAND.phone1.replace(/\D/g, '')}?text=${encodeURIComponent(
                            isTamil
                              ? 'வணக்கம், மனிதநேய ஆதரவற்றோர் காப்பகம் பற்றிய தகவல்களை அறிய விரும்புகிறேன்.'
                              : 'Hello, I would like to get more information about Manithaneyam Orphanage Home.'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer"
                          title={isTamil ? 'வாட்ஸ்அப் மூலம் தொடர்புகொள்ள கிளிக் செய்க' : 'Click to chat directly on WhatsApp'}
                        >
                          <span>{SITE_BRAND.phone1}</span>
                          <WhatsAppIcon className="w-4 h-4 text-emerald-500 group-hover:scale-125 transition-transform" />
                        </a>
                        <a
                          href={`https://wa.me/${SITE_BRAND.phone2.replace(/\D/g, '')}?text=${encodeURIComponent(
                            isTamil
                              ? 'வணக்கம், மனிதநேய ஆதரவற்றோர் காப்பகம் பற்றிய தகவல்களை அறிய விரும்புகிறேன்.'
                              : 'Hello, I would like to get more information about Manithaneyam Orphanage Home.'
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group cursor-pointer"
                          title={isTamil ? 'வாட்ஸ்அப் மூலம் தொடர்புகொள்ள கிளிக் செய்க' : 'Click to chat directly on WhatsApp'}
                        >
                          <span>{SITE_BRAND.phone2}</span>
                          <WhatsAppIcon className="w-4 h-4 text-emerald-500 group-hover:scale-125 transition-transform" />
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
                        className="text-sm sm:text-base font-bold text-card-text hover:text-brand-primary transition-colors break-all"
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
              </div>

              {/* Sub-note */}
              <div className="pt-4 border-t border-theme-border text-xs text-card-text-secondary font-medium">
                {isTamil
                  ? 'காப்பகத்தைப் பார்வையிட அல்லது குழந்தைகளுக்கான உதவிகளுக்கு முன்கூட்டியே தொடர்பு கொள்ளவும்.'
                  : 'Feel free to schedule a visit or call in advance to coordinate care support.'}
              </div>
            </div>
          </div>

          {/* Card 2: Bank Details & Tax Exemption Card */}
          <div ref={rightColRef} className="h-full">
            <div className="bg-theme-card rounded-3xl border border-theme-border shadow-soft p-7 sm:p-8 space-y-5 h-full flex flex-col justify-between">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-theme-border pb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-bg text-brand-primary flex items-center justify-center shrink-0 shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-card-heading font-tamil leading-tight">
                        {isTamil ? 'நன்கொடை & வங்கி விவரங்கள்' : 'Bank Donation Details'}
                      </h3>
                      <p className="text-[11px] font-semibold text-card-text-secondary uppercase tracking-wider">
                        {isTamil ? 'நேரடி வங்கி பரிவர்த்தனை' : 'Direct Bank Transfer / UPI'}
                      </p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold border border-red-500/20">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{isTamil ? 'ஆதரவு' : 'Donation'}</span>
                  </div>
                </div>

                {/* Tax Exemption & CSR facility banner */}
                <div className="p-4 rounded-2xl bg-brand-bg/60 border border-brand-primary/25 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-brand-primary">
                    <ShieldCheck className="w-4 h-4 shrink-0 text-brand-primary" />
                    <span>
                      {isTamil
                        ? 'வருமான வரி விலக்கு & CSR அங்கீகாரம்'
                        : 'Tax Exemption & CSR Facility Available'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-card-text leading-relaxed">
                    {isTamil ? DONATION_DETAILS.taxExemptionTa : DONATION_DETAILS.taxExemptionEn}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-theme-bg border border-theme-border text-[11px] font-bold text-card-heading">
                      12AA Registered
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-theme-bg border border-theme-border text-[11px] font-bold text-card-heading">
                      80G Tax Benefit
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-theme-bg border border-theme-border text-[11px] font-bold text-card-heading">
                      CSR Facility
                    </span>
                  </div>
                </div>

                {/* Bank Account Details Grid */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border/70 gap-1">
                    <span className="text-card-text-secondary font-medium">
                      {isTamil ? 'கணக்கு பெயர் (A/C Name):' : 'A/C Name:'}
                    </span>
                    <span className="font-extrabold text-card-heading uppercase">
                      {DONATION_DETAILS.accountName}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border/70 gap-1">
                    <span className="text-card-text-secondary font-medium">
                      {isTamil ? 'வங்கி பெயர் (Bank Name):' : 'Bank Name:'}
                    </span>
                    <span className="font-bold text-card-heading">
                      {DONATION_DETAILS.bankName}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border/70 gap-1">
                    <span className="text-card-text-secondary font-medium">
                      {isTamil ? 'கிளை (Branch):' : 'Branch:'}
                    </span>
                    <span className="font-bold text-card-heading">
                      {DONATION_DETAILS.branch}
                    </span>
                  </div>

                  {/* A/c No with copy button */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border/70 gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-card-text-secondary font-medium">
                        {isTamil ? 'வங்கி கணக்கு எண் (A/c No.):' : 'A/c No.:'}
                      </span>
                      <span className="font-extrabold text-card-heading font-mono text-sm tracking-wide">
                        {DONATION_DETAILS.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(DONATION_DETAILS.accountNumber, 'ac')}
                      className="p-1.5 rounded-lg bg-theme-card hover:bg-brand-bg border border-theme-border text-card-text-secondary hover:text-brand-primary transition-all shrink-0 cursor-pointer"
                      title={isTamil ? 'நகலெடு' : 'Copy Account Number'}
                    >
                      {copiedField === 'ac' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* IFSC Code with copy button */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-theme-bg border border-theme-border/70 gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="text-card-text-secondary font-medium">
                        {isTamil ? 'ஐ.எப்.எஸ்.சி (IFSC Code):' : 'IFSC Code:'}
                      </span>
                      <span className="font-extrabold text-card-heading font-mono text-sm tracking-wide">
                        {DONATION_DETAILS.ifscCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(DONATION_DETAILS.ifscCode, 'ifsc')}
                      className="p-1.5 rounded-lg bg-theme-card hover:bg-brand-bg border border-theme-border text-card-text-secondary hover:text-brand-primary transition-all shrink-0 cursor-pointer"
                      title={isTamil ? 'நகலெடு' : 'Copy IFSC Code'}
                    >
                      {copiedField === 'ifsc' ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* GPay Number with direct copy button */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/30 gap-2 mt-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                          GPay / PhonePe / UPI
                        </span>
                        <span className="font-extrabold text-card-heading font-mono text-sm">
                          {DONATION_DETAILS.gpayNumber}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(DONATION_DETAILS.gpayNumber.replace(/\s+/g, ''), 'gpay')}
                      className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer shadow-2xs"
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
              </div>

              {/* Sub-note */}
              <div className="pt-3 border-t border-theme-border text-xs text-card-text-secondary font-medium">
                {isTamil
                  ? 'நன்கொடை செலுத்திய பிறகு ரசீது பெற தொலைபேசி அல்லது வாட்ஸ்அப் வழியாக தொடர்பு கொள்ளவும்.'
                  : 'Please connect via phone or WhatsApp after making your transfer to receive an official receipt.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
