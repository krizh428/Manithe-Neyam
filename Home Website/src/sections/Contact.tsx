import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  MapPin,
  Mail,
  Clock,
  Copy,
  Check,
  Landmark,
  User,
  CreditCard,
  LayoutGrid,
  Smartphone,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/Common/WhatsAppIcon';
import { SectionHeading } from '../components/Common/SectionHeading';
import { HandsHeartIllustration, ScriptNote } from '../components/Common/Illustrations';
import { CONTACT_DATA, DONATION_DETAILS } from '../data/siteData';
import { useLanguage } from '../context/LanguageContext';
import { useAdminData } from '../context/AdminDataContext';
import { gsap, EASING, prefersReducedMotion } from '../animations';

const NAVY = '#14215E';
const ICON_GRADIENT = 'linear-gradient(135deg, #4F46E5 0%, #2563EB 35%, #0EA5E9 62%, #14B8A6 82%, #22C55E 100%)';
const BAR_GRADIENT = 'linear-gradient(90deg, #4F46E5 0%, #2563EB 35%, #14B8A6 75%, #22C55E 100%)';
const UPI_GRADIENT = 'linear-gradient(100deg, #2563EB 0%, #0EA5E9 38%, #14B8A6 70%, #4ADE80 100%)';

// ---------------------------------------------------------------------------
// Small decorative pieces
// ---------------------------------------------------------------------------

// Rounded diamond badge holding a white icon
const DiamondIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="ct-badge relative shrink-0 w-[76px] h-[76px] sm:w-[92px] sm:h-[92px] flex items-center justify-center">
    <div className="absolute inset-0 rotate-45 rounded-[24px] sm:rounded-[28px] bg-[#EEF2FF] translate-x-1.5 translate-y-1.5" />
    <div
      className="absolute inset-[6px] rotate-45 rounded-[20px] sm:rounded-[24px] shadow-[0_14px_30px_-10px_rgba(37,99,235,0.6)]"
      style={{ background: ICON_GRADIENT }}
    />
    <div className="relative text-white">{children}</div>
  </div>
);

const GradientTitle: React.FC<{ parts: [string, string, string]; gradient: string; isTamil: boolean; breakAfterFirst?: boolean }> = ({
  parts,
  gradient,
  isTamil,
  breakAfterFirst,
}) => (
  <h3
    className={`font-extrabold tracking-tight leading-[1.1] ${isTamil ? 'font-tamil text-[22px] sm:text-[26px]' : 'text-[27px] sm:text-[32px] xl:text-[33px]'}`}
    style={{ color: NAVY }}
  >
    {parts[0]}
    {breakAfterFirst && <br />}
    <span className="bg-clip-text text-transparent" style={{ backgroundImage: gradient }}>
      {parts[1]}
    </span>
    {parts[2]}
  </h3>
);

const ShieldBadge: React.FC = () => (
  <svg viewBox="0 0 64 72" className="w-12 h-14 sm:w-14 sm:h-16 shrink-0" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="ct-shield" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    <path d="M32 2 L60 12 V34 C60 52 48 64 32 70 C16 64 4 52 4 34 V12 Z" fill="url(#ct-shield)" />
    <path d="M32 9 L53 16.5 V34 C53 48 44 57.5 32 62.5 C20 57.5 11 48 11 34 V16.5 Z" fill="#fff" fillOpacity="0.18" />
    <circle cx="32" cy="36" r="13" fill="#fff" />
    <path d="M25.5 36.5 L30 41 L38.5 31.5" stroke="#059669" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MapIllus: React.FC = () => (
  <svg viewBox="0 0 96 80" className="w-20 h-16" fill="none" aria-hidden="true">
    <ellipse cx="50" cy="44" rx="44" ry="32" fill="#F1F5FF" />
    <path d="M12 52 L32 44 L32 72 L12 78 Z" fill="#34D399" />
    <path d="M32 44 L56 52 L56 78 L32 72 Z" fill="#60A5FA" />
    <path d="M56 52 L80 44 L80 72 L56 78 Z" fill="#10B981" />
    <path d="M32 44 L56 52 L56 78 L32 72 Z" fill="#fff" fillOpacity="0.15" />
    <path d="M18 62 C 30 58, 40 66, 52 62 S 70 56, 76 60" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" strokeLinecap="round" />
    <path d="M52 46 C 42 34, 38 28, 38 21 A 14 14 0 0 1 66 21 C 66 28, 62 34, 52 46 Z" fill="#EF4444" />
    <circle cx="52" cy="21" r="5.5" fill="#fff" />
  </svg>
);

const PhoneIllus: React.FC = () => (
  <svg viewBox="0 0 96 80" className="w-20 h-16" fill="none" aria-hidden="true">
    <ellipse cx="50" cy="42" rx="40" ry="34" fill="#ECFDF5" />
    <g transform="rotate(12 50 40)">
      <rect x="34" y="6" width="32" height="62" rx="7" fill="#fff" stroke="#16A34A" strokeWidth="4" />
      <rect x="44" y="11" width="12" height="2.5" rx="1.25" fill="#16A34A" />
      <circle cx="50" cy="38" r="10" fill="#22C55E" />
      <path d="M45.5 41.5 L44.5 45 L48 44 A 7 7 0 1 0 45.5 41.5 Z" fill="#fff" />
    </g>
    <path d="M16 36 H 24" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M78 18 L 84 14" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M80 56 H 88" stroke="#86EFAC" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const MailIllus: React.FC = () => (
  <svg viewBox="0 0 96 80" className="w-20 h-16" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="ct-mail" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <ellipse cx="54" cy="48" rx="38" ry="28" fill="#F1F3FF" />
    <rect x="26" y="40" width="52" height="34" rx="5" fill="url(#ct-mail)" />
    <path d="M27 42 L52 60 L77 42" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
    <path d="M58 26 L88 10 L80 40 L70 32 Z" fill="#3B82F6" />
    <path d="M58 26 L70 32 L66 38 Z" fill="#1D4ED8" />
    <path d="M8 34 H 18 M 12 44 H 20" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
  </svg>
);

const ClockIllus: React.FC = () => (
  <svg viewBox="0 0 96 80" className="w-20 h-16" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="ct-clock" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="40" r="36" fill="#FFF7ED" />
    <circle cx="50" cy="40" r="25" fill="#fff" stroke="url(#ct-clock)" strokeWidth="5" />
    <path d="M50 26 V 40 L 60 46" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="40" r="2.5" fill="#F97316" />
  </svg>
);

const LeafCluster: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 120 140" className={className} fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="ct-leaf-a" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#22D3EE" />
      </linearGradient>
      <linearGradient id="ct-leaf-b" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#4ADE80" />
      </linearGradient>
    </defs>
    <path d="M58 136 C 54 100, 40 70, 14 52" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
    <path d="M14 52 C 4 30, 10 10, 22 4 C 32 26, 30 44, 14 52 Z" fill="url(#ct-leaf-a)" />
    <path d="M42 82 C 50 54, 70 36, 90 32 C 88 58, 70 78, 42 82 Z" fill="url(#ct-leaf-b)" />
    <path d="M52 112 C 72 96, 96 92, 116 98 C 100 116, 76 122, 52 112 Z" fill="url(#ct-leaf-a)" opacity="0.9" />
    <path d="M34 96 C 18 86, 6 70, 4 56 C 24 62, 36 76, 34 96 Z" fill="url(#ct-leaf-b)" opacity="0.85" />
  </svg>
);

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export const Contact: React.FC = () => {
  const { isTamil } = useLanguage();
  const { brand: SITE_BRAND } = useAdminData();

  const sectionRef = useRef<HTMLElement | null>(null);
  const bankCardRef = useRef<HTMLDivElement | null>(null);
  const contactCardRef = useRef<HTMLDivElement | null>(null);

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
      [bankCardRef.current, contactCardRef.current].forEach((card, idx) => {
        if (!card) return;
        const q = gsap.utils.selector(card);

        gsap.set(card, { opacity: 0, y: 50, x: idx === 0 ? -20 : 20 });
        gsap.set(q('.ct-badge'), { scale: 0.4, opacity: 0, rotation: -45 });
        gsap.set(q('.ct-bar'), { scaleX: 0 });
        gsap.set(q('.ct-script'), { opacity: 0, y: 10 });
        gsap.set(q('.ct-row'), { opacity: 0, y: 16 });
        gsap.set(q('.ct-pill'), { opacity: 0, scale: 0.85 });
        gsap.set(q('.ct-upi'), { opacity: 0, y: 24 });
        gsap.set(q('.ct-illus'), { opacity: 0, y: 24, scale: 0.92 });

        const tl = gsap.timeline({
          delay: idx * 0.15,
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        });

        tl.to(card, { opacity: 1, y: 0, x: 0, duration: 0.85, ease: EASING.cinematic })
          .to(q('.ct-badge'), { scale: 1, opacity: 1, rotation: 0, duration: 0.75, ease: 'back.out(1.7)' }, 0.2)
          .to(q('.ct-bar'), { scaleX: 1, duration: 0.8, ease: 'power3.out' }, 0.45)
          .to(q('.ct-script'), { opacity: 1, y: 0, duration: 0.7, ease: EASING.smooth }, 0.5)
          .to(q('.ct-row'), { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: EASING.smooth }, 0.5)
          .to(q('.ct-pill'), { opacity: 1, scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(2)' }, 0.7)
          .to(q('.ct-upi'), { opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)' }, 0.95)
          .to(q('.ct-illus'), { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08, ease: 'back.out(1.4)' }, 0.8)
          .call(() => {
            ctx.add(() => {
              gsap.to(q('.ct-float'), { y: -6, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
              gsap.to(q('.illus-heart'), {
                scale: 1.07,
                transformOrigin: '50% 60%',
                duration: 0.9,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
              gsap.fromTo(
                q('.ct-shine'),
                { xPercent: -120 },
                { xPercent: 320, duration: 1.6, repeat: -1, repeatDelay: 2.6, ease: 'power2.inOut' }
              );
            });
          });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const waText = encodeURIComponent(
    isTamil
      ? 'வணக்கம், மனிதநேய ஆதரவற்றோர் காப்பகம் பற்றிய தகவல்களை அறிய விரும்புகிறேன்.'
      : 'Hello, I would like to get more information about Manithaneyam Orphanage Home.'
  );

  const bankRows: Array<{
    key: string;
    label: string;
    value: string;
    icon: React.ReactNode;
    tint: string;
    accent: string;
    copyValue?: string;
  }> = [
    {
      key: 'name',
      label: isTamil ? 'கணக்கு பெயர் (A/C Name):' : 'A/C Name:',
      value: DONATION_DETAILS.accountName,
      icon: <User className="w-6 h-6" />,
      tint: 'bg-[#E0ECFF] text-[#2563EB]',
      accent: '#6C8CFF',
    },
    {
      key: 'bank',
      label: isTamil ? 'வங்கி பெயர் (Bank Name):' : 'Bank Name:',
      value: DONATION_DETAILS.bankName,
      icon: <Landmark className="w-6 h-6" />,
      tint: 'bg-[#DDF7EC] text-[#059669]',
      accent: '#34D399',
    },
    {
      key: 'branch',
      label: isTamil ? 'கிளை (Branch):' : 'Branch:',
      value: DONATION_DETAILS.branch,
      icon: <MapPin className="w-6 h-6" />,
      tint: 'bg-[#EEE8FF] text-[#7C3AED]',
      accent: '#A78BFA',
    },
    {
      key: 'ac',
      label: isTamil ? 'வங்கி கணக்கு எண் (A/c No.):' : 'A/c No.:',
      value: DONATION_DETAILS.accountNumber,
      icon: <CreditCard className="w-6 h-6" />,
      tint: 'bg-[#FFF1D6] text-[#EA8A0C]',
      accent: '#FCC54D',
      copyValue: DONATION_DETAILS.accountNumber,
    },
    {
      key: 'ifsc',
      label: isTamil ? 'ஐ.எப்.எஸ்.சி (IFSC Code):' : 'IFSC Code:',
      value: DONATION_DETAILS.ifscCode,
      icon: <LayoutGrid className="w-6 h-6" />,
      tint: 'bg-[#FFE4E8] text-[#E11D48]',
      accent: '#FB7185',
      copyValue: DONATION_DETAILS.ifscCode,
    },
  ];

  const taxPills = [
    { label: '12AA Registered', pill: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E3A8A]', check: 'bg-[#2563EB]' },
    { label: '80G Tax Benefit', pill: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#064E3B]', check: 'bg-[#10B981]' },
    { label: 'CSR Facility', pill: 'bg-[#F5F3FF] border-[#DDD6FE] text-[#4C1D95]', check: 'bg-[#8B5CF6]' },
  ];

  const labelClass = `text-[11px] sm:text-xs font-bold uppercase tracking-[0.08em] ${isTamil ? 'font-tamil' : ''}`;
  const valueClass = `font-bold text-[15px] sm:text-[17px] leading-snug ${isTamil ? 'font-tamil' : ''}`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="theme-light py-20 sm:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FD 55%, #FFFFFF 100%)' }}
    >
      <div className="absolute top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#EEF2FF] blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-0 -right-32 w-[460px] h-[460px] rounded-full bg-[#ECFDF5] blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? CONTACT_DATA.badgeTa : CONTACT_DATA.badgeEn}
          title={isTamil ? CONTACT_DATA.titleTa : CONTACT_DATA.titleEn}
          subtitle={
            isTamil
              ? 'எங்கள் இல்லத்தை நேரில் பார்வையிடவோ அல்லது தொடர்புகொள்ளவோ எப்போது வேண்டுமானாலும் அழைக்கலாம்.'
              : 'Feel free to connect with our administrative team or plan a visit to our home in Kodangipatti, Theni.'
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_1fr] gap-10 lg:gap-7 items-start max-w-[1400px] mx-auto">
          {/* ============ Bank Donation Details ============ */}
          <div ref={bankCardRef} className="relative">
            <LeafCluster className="ct-illus ct-float absolute -left-7 -bottom-8 w-20 sm:w-24 z-20 pointer-events-none" />

            <div className="relative overflow-hidden rounded-[28px] bg-white border border-[#EDF1F7] shadow-[0_24px_60px_-24px_rgba(37,99,235,0.22),0_6px_18px_-8px_rgba(15,23,42,0.08)] p-5 sm:p-8">
              {/* Header */}
              <div className="flex items-start gap-4 sm:gap-6">
                <DiamondIcon>
                  <Landmark className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2.2} />
                </DiamondIcon>
                <div className="min-w-0 pt-1 flex-1 md:pr-[130px] lg:pr-0 xl:pr-[130px]">
                  <GradientTitle
                    isTamil={isTamil}
                    gradient="linear-gradient(90deg, #2563EB 0%, #0EA5E9 50%, #14B8A6 100%)"
                    parts={isTamil ? ['நன்கொடை & ', 'வங்கி', ' விவரங்கள்'] : ['Bank ', 'Donation', ' Details']}
                  />
                  <p className={`mt-2 text-xs sm:text-[15px] font-semibold uppercase tracking-[0.14em] text-[#5B6B95] ${isTamil ? 'font-tamil tracking-normal' : ''}`}>
                    {isTamil ? 'நேரடி வங்கி பரிவர்த்தனை / UPI' : 'Direct Bank Transfer / UPI'}
                  </p>
                  <div className="ct-bar mt-3 h-1 w-24 rounded-full origin-left" style={{ background: BAR_GRADIENT }} />
                </div>
                <div className="ct-script hidden md:block lg:hidden xl:block absolute top-5 right-5 pointer-events-none">
                  <ScriptNote
                    className="-rotate-[12deg]"
                    textClassName="text-[16px] xl:text-[17px]"
                    lines={isTamil ? ['உங்கள் ஆதரவு', 'நல்ல நாளையை', 'உருவாக்கும்'] : ['Your Support', 'Creates a', 'Better Tomorrow']}
                  />
                </div>
              </div>

              {/* Tax exemption banner */}
              <div
                className="ct-row mt-7 rounded-2xl border border-[#DCEBF3] p-5 sm:p-6"
                style={{ background: 'linear-gradient(120deg, #EEF6FF 0%, #F0FAF8 55%, #F1FBF4 100%)' }}
              >
                <div className="flex items-start gap-4">
                  <ShieldBadge />
                  <div className="min-w-0">
                    <h4 className={`text-[17px] sm:text-[21px] font-bold leading-snug ${isTamil ? 'font-tamil' : ''}`} style={{ color: NAVY }}>
                      {isTamil ? 'வருமான வரி விலக்கு & CSR வசதி' : 'Tax Exemption & CSR Facility Available'}
                    </h4>
                    <p className={`mt-1.5 text-sm sm:text-base text-[#4A5878] leading-relaxed ${isTamil ? 'font-tamil' : ''}`}>
                      {isTamil ? DONATION_DETAILS.taxExemptionTa : DONATION_DETAILS.taxExemptionEn}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {taxPills.map((p) => (
                    <span
                      key={p.label}
                      className={`ct-pill inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full border text-[13px] font-semibold whitespace-nowrap ${p.pill}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${p.check}`}>
                        <Check className="w-3.5 h-3.5" strokeWidth={3.2} />
                      </span>
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Account rows */}
              <div className="mt-4 space-y-3">
                {bankRows.map((row) => (
                  <div
                    key={row.key}
                    className="ct-row group relative overflow-hidden flex items-center gap-4 sm:gap-5 rounded-2xl bg-white border border-[#E8EDF5] px-4 sm:px-5 py-3 shadow-[0_4px_14px_-8px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-[0_10px_24px_-10px_rgba(37,99,235,0.3)]"
                  >
                    {/* Coloured corner accent */}
                    <span
                      className="absolute top-0 right-0 w-14 h-14 rounded-tr-2xl pointer-events-none"
                      style={{
                        borderTop: `5px solid ${row.accent}`,
                        borderRight: `5px solid ${row.accent}`,
                        WebkitMaskImage: 'linear-gradient(225deg, #000 22%, transparent 62%)',
                        maskImage: 'linear-gradient(225deg, #000 22%, transparent 62%)',
                      }}
                    />
                    <span className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 ${row.tint}`}>
                      {row.icon}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className={`block text-[13px] sm:text-sm font-medium text-[#4F5F86] ${isTamil ? 'font-tamil' : ''}`}>{row.label}</span>
                      <span className="block font-english text-[17px] sm:text-[20px] font-bold tracking-wide break-all" style={{ color: NAVY }}>
                        {row.value}
                      </span>
                    </div>
                    {row.copyValue && (
                      <button
                        type="button"
                        onClick={() => handleCopy(row.copyValue!, row.key)}
                        className="mr-5 p-2 rounded-xl border border-[#E3E9F4] bg-white text-[#64749A] hover:text-[#2563EB] hover:border-[#BFD3FF] transition-colors shrink-0 cursor-pointer"
                        title={isTamil ? 'நகலெடு' : `Copy ${row.key === 'ac' ? 'Account Number' : 'IFSC Code'}`}
                        aria-label={isTamil ? 'நகலெடு' : `Copy ${row.key === 'ac' ? 'Account Number' : 'IFSC Code'}`}
                      >
                        {copiedField === row.key ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* UPI bar */}
              <div
                className="ct-upi relative overflow-hidden mt-4 sm:mx-5 rounded-2xl px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-5 text-white shadow-[0_16px_30px_-12px_rgba(14,165,233,0.6)]"
                style={{ background: UPI_GRADIENT }}
              >
                <span className="ct-shine absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
                <span className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shrink-0 text-[#2563EB] shadow-md">
                  <Smartphone className="w-6 h-6" />
                </span>
                <div className="relative min-w-0 flex-1">
                  <span className="block text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.08em] text-white/90">GPay / PhonePe / UPI</span>
                  <span className="block font-english text-[18px] sm:text-[24px] xl:text-[27px] font-bold tracking-wide leading-tight whitespace-nowrap">{DONATION_DETAILS.gpayNumber}</span>
                </div>
                <span className="relative hidden sm:block w-px self-stretch my-1 bg-white/40" />
                <button
                  type="button"
                  onClick={() => handleCopy(DONATION_DETAILS.gpayNumber.replace(/\s+/g, ''), 'gpay')}
                  className="relative shrink-0 inline-flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-xl bg-white text-[#1D4ED8] text-sm sm:text-base font-semibold shadow-md hover:scale-[1.04] active:scale-95 transition-transform cursor-pointer"
                  title={isTamil ? 'GPay எண் நகலெடு' : 'Copy GPay Number'}
                  aria-label={isTamil ? 'GPay எண் நகலெடு' : 'Copy GPay Number'}
                >
                  {copiedField === 'gpay' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span className={`hidden sm:inline ${isTamil ? 'font-tamil' : ''}`}>
                    {copiedField === 'gpay' ? (isTamil ? 'நகலெடுக்கப்பட்டது' : 'Copied') : isTamil ? 'நகலெடு' : 'Copy'}
                  </span>
                </button>
                <svg viewBox="0 0 20 30" className="relative hidden sm:block w-4 h-6 -ml-2 shrink-0" fill="none" aria-hidden="true">
                  <path d="M4 6 L10 2 M6 15 H16 M4 24 L10 28" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* ============ Address & Contact Details ============ */}
          <div ref={contactCardRef} className="relative lg:mt-12">
            <div className="relative overflow-hidden rounded-[28px] bg-white border border-[#EDF1F7] shadow-[0_24px_60px_-24px_rgba(37,99,235,0.22),0_6px_18px_-8px_rgba(15,23,42,0.08)]">
              <div className="relative z-10 p-5 sm:p-8 pb-0 sm:pb-0">
                {/* Header */}
                <div className="flex items-start gap-4 sm:gap-6">
                  <DiamondIcon>
                    <MapPin className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={2.2} />
                  </DiamondIcon>
                  <div className="min-w-0 pt-1 flex-1 md:pr-[130px] lg:pr-0 xl:pr-[130px]">
                    <GradientTitle
                      isTamil={isTamil}
                      breakAfterFirst={!isTamil}
                      gradient="linear-gradient(90deg, #6D28D9 0%, #4F46E5 45%, #2563EB 100%)"
                      parts={isTamil ? ['தொடர்பு ', 'முகவரி', ' & விவரங்கள்'] : ['Address &', 'Contact', ' Details']}
                    />
                    <div className="ct-bar mt-4 h-1 w-24 rounded-full origin-left" style={{ background: BAR_GRADIENT }} />
                  </div>
                  <div className="ct-script hidden md:block lg:hidden xl:block absolute top-6 right-5 pointer-events-none">
                    <ScriptNote
                      className="-rotate-[14deg]"
                      textClassName="text-[16px] xl:text-[17px]"
                      lines={isTamil ? ['ஒன்றிணைந்து', 'மாற்றத்தை', 'உருவாக்குவோம்'] : ['Together', 'We Can Make', 'a Difference']}
                    />
                  </div>
                </div>

                {/* Contact list */}
                <div className="mt-7 rounded-2xl border border-[#E8EDF5] bg-white divide-y divide-[#EDF1F7] shadow-[0_6px_20px_-12px_rgba(15,23,42,0.12)]">
                  {/* Address */}
                  <div className="ct-row flex items-center gap-4 sm:gap-5 px-4 sm:px-5 py-5">
                    <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E0ECFF] text-[#2563EB] flex items-center justify-center shrink-0 self-start">
                      <MapPin className="w-6 h-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className={`${labelClass} text-[#2563EB]`}>{isTamil ? 'முகவரி' : 'Location & Address'}</h4>
                      <p className={`${valueClass} mt-1.5`} style={{ color: NAVY }}>
                        {isTamil ? SITE_BRAND.fullAddressTa : SITE_BRAND.fullAddressEn}
                      </p>
                    </div>
                    <span className="ct-illus hidden sm:block shrink-0"><MapIllus /></span>
                  </div>

                  {/* Phones */}
                  <div className="ct-row flex items-center gap-4 sm:gap-5 px-4 sm:px-5 py-5">
                    <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#DDF7EC] text-[#16A34A] flex items-center justify-center shrink-0 self-start">
                      <WhatsAppIcon className="w-6 h-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className={`${labelClass} text-[#0F766E]`}>
                        {isTamil ? 'தொலைபேசி / வாட்ஸ்அப்' : 'Phone Numbers (Click for WhatsApp)'}
                      </h4>
                      <div className="mt-1.5 flex flex-col gap-1.5">
                        {[SITE_BRAND.phone1, SITE_BRAND.phone2].map((phone) => (
                          <a
                            key={phone}
                            href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${valueClass} inline-flex items-center gap-2 w-fit hover:text-[#16A34A] transition-colors group`}
                            style={{ color: NAVY }}
                            title={isTamil ? 'வாட்ஸ்அப் மூலம் தொடர்புகொள்ள கிளிக் செய்க' : 'Click to chat directly on WhatsApp'}
                          >
                            <span className="group-hover:text-[#16A34A] transition-colors">{phone}</span>
                            <WhatsAppIcon className="w-4.5 h-4.5 text-[#22C55E] group-hover:scale-125 transition-transform" />
                          </a>
                        ))}
                      </div>
                    </div>
                    <span className="ct-illus hidden sm:block shrink-0"><PhoneIllus /></span>
                  </div>

                  {/* Email */}
                  <div className="ct-row flex items-center gap-4 sm:gap-5 px-4 sm:px-5 py-5">
                    <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EEE8FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className={`${labelClass} text-[#4F5F86]`}>{isTamil ? 'மின்னஞ்சல்' : 'Email Address'}</h4>
                      <a
                        href={`mailto:${SITE_BRAND.email}`}
                        className="mt-1.5 block font-bold text-[14px] sm:text-[15px] xl:text-[16px] [overflow-wrap:anywhere] hover:text-[#2563EB] transition-colors"
                        style={{ color: NAVY }}
                      >
                        {SITE_BRAND.email}
                      </a>
                    </div>
                    <span className="ct-illus hidden sm:block shrink-0"><MailIllus /></span>
                  </div>

                  {/* Hours */}
                  <div className="ct-row flex items-center gap-4 sm:gap-5 px-4 sm:px-5 py-5">
                    <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFF1D6] text-[#EA8A0C] flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className={`${labelClass} text-[#4F5F86]`}>{isTamil ? 'பார்வையாளர் நேரம்' : 'Visiting Hours'}</h4>
                      <p className={`${valueClass} mt-1.5`} style={{ color: NAVY }}>
                        {isTamil ? SITE_BRAND.timingsTa : SITE_BRAND.timingsEn}
                      </p>
                    </div>
                    <span className="ct-illus hidden sm:block shrink-0"><ClockIllus /></span>
                  </div>
                </div>
              </div>

              {/* Bottom wave + note + illustration */}
              <div className="relative h-[170px] sm:h-[190px] mt-4">
                <svg viewBox="0 0 600 190" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="ct-wave-a" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="45%" stopColor="#22D3EE" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="ct-wave-b" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ECFDF5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0 40 C 90 20, 150 90, 250 130 S 420 170, 600 160 V190 H0 Z" fill="url(#ct-wave-b)" />
                  <path d="M0 70 C 70 50, 120 100, 190 140 S 330 180, 470 190 H0 Z" fill="url(#ct-wave-a)" />
                </svg>
                <div className="ct-script absolute left-[34%] sm:left-[30%] top-6">
                  <ScriptNote
                    className="-rotate-[14deg]"
                    textClassName="text-[16px] sm:text-[19px]"
                    lines={isTamil ? ['அன்பே', 'ஒளிமயமான', 'எதிர்காலம்'] : ['Kindness', 'Builds a Brighter', 'Future']}
                  />
                </div>
                <div className="ct-illus absolute right-2 sm:right-4 bottom-1 w-36 sm:w-44">
                  <HandsHeartIllustration className="ct-float w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
