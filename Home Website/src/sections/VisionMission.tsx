import React, { useLayoutEffect, useRef } from 'react';
import { Eye, Target, Check, Heart } from 'lucide-react';
import { SectionHeading } from '../components/Common/SectionHeading';
import { useAdminData } from '../context/AdminDataContext';
import { useLanguage } from '../context/LanguageContext';
import { gsap, EASING, prefersReducedMotion } from '../animations';
import { HandsHeartIllustration, HandHeartIllustration } from '../components/Common/Illustrations';

// Brand gradients used across both cards
const ICON_GRADIENT = 'linear-gradient(135deg, #4F46E5 0%, #2563EB 35%, #0EA5E9 62%, #14B8A6 82%, #22C55E 100%)';
const TEXT_GRADIENT = 'linear-gradient(90deg, #2563EB 0%, #0EA5E9 40%, #10B981 78%, #22C55E 100%)';
const BAR_GRADIENT = 'linear-gradient(90deg, #4F46E5 0%, #2563EB 35%, #14B8A6 75%, #22C55E 100%)';
const CHECK_GRADIENT = 'linear-gradient(135deg, #2563EB 0%, #0EA5E9 50%, #14B8A6 100%)';

// "A Society Anchored in" + "Dignity and Love" -> second part gets the gradient
const splitTitle = (title: string): [string, string] => {
  const m = title.match(/^(.*\s(?:in|through|of|for))\s+(.+)$/i);
  if (m) return [m[1], m[2]];
  const words = title.trim().split(/\s+/);
  const n = words.length > 3 ? 2 : 1;
  return [words.slice(0, -n).join(' '), words.slice(-n).join(' ')];
};

interface CardProps {
  icon: React.ReactNode;
  badge: string;
  title: string;
  text: string;
  points: string[];
  isTamil: boolean;
  variant: 'vision' | 'mission';
  footer: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
}

const VisionMissionCard: React.FC<CardProps> = ({ icon, badge, title, text, points, isTamil, variant, footer, cardRef }) => {
  const [titleStart, titleEnd] = splitTitle(title);
  const isVision = variant === 'vision';

  return (
    <div
      ref={cardRef}
      className="vm-card relative overflow-hidden rounded-[28px] bg-white border border-[#EDF1F7] shadow-[0_24px_60px_-24px_rgba(37,99,235,0.22),0_6px_18px_-8px_rgba(15,23,42,0.08)] flex flex-col transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_32px_70px_-24px_rgba(37,99,235,0.3),0_8px_20px_-8px_rgba(15,23,42,0.1)]"
    >
      {/* Corner gradient blobs */}
      <div
        className="absolute -top-16 -right-14 w-44 h-44 rounded-[42%] rotate-12 pointer-events-none"
        style={{
          background: isVision
            ? 'linear-gradient(140deg, #A5F3FC 0%, #7DD3FC 40%, #A5B4FC 100%)'
            : 'linear-gradient(140deg, #99F6E4 0%, #7DD3FC 55%, #BAE6FD 100%)',
          opacity: 0.85,
        }}
      />
      <div className="absolute -top-6 right-16 w-28 h-28 rounded-full bg-[#EEF0FF] blur-xl pointer-events-none" />
      {isVision ? (
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'linear-gradient(45deg, #99F6E4 0%, #BAE6FD 60%, #DDD6FE 100%)', opacity: 0.75 }}
        />
      ) : (
        <div className="absolute -bottom-14 right-10 w-56 h-40 rounded-full bg-[#EEF4FF] blur-md pointer-events-none" />
      )}

      <div className="relative z-10 p-7 sm:p-10 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start gap-5 sm:gap-6">
          <div className="vm-icon relative shrink-0">
            <div className="absolute -inset-2.5 rounded-[30px] bg-gradient-to-br from-[#EEF2FF] to-[#ECFDF5] rotate-[-8deg]" />
            <div
              className="relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full flex items-center justify-center text-white shadow-[0_12px_28px_-8px_rgba(37,99,235,0.55)]"
              style={{ background: ICON_GRADIENT }}
            >
              {icon}
            </div>
          </div>

          <div className="min-w-0 pt-0.5">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.08em]">
              {badge}
            </span>
            <h3
              className={`mt-3 font-extrabold tracking-tight leading-[1.15] text-[#14215E] ${isTamil ? 'font-tamil text-xl sm:text-2xl' : 'text-[24px] sm:text-[28px]'}`}
            >
              <span className="block">{titleStart}</span>
              <span className="block bg-clip-text text-transparent" style={{ backgroundImage: TEXT_GRADIENT }}>
                {titleEnd}
              </span>
            </h3>
            <div className="vm-bar mt-4 h-1 w-28 rounded-full origin-left" style={{ background: BAR_GRADIENT }} />
          </div>
        </div>

        {/* Description */}
        <p
          className={`mt-8 text-[#3D4C6E] leading-relaxed ${isTamil ? 'font-tamil text-base sm:text-[17px]' : 'text-base sm:text-[19px]'}`}
        >
          {text}
        </p>

        {/* Checklist panel */}
        <ul
          className={`mt-7 rounded-2xl border border-[#E6EDF8] px-5 sm:px-7 ${isVision ? 'py-6 space-y-5' : 'py-5 space-y-3.5'}`}
          style={{ background: 'linear-gradient(135deg, #F7F9FF 0%, #F3FAFB 55%, #F2FBF6 100%)' }}
        >
          {points.map((point, i) => (
            <li key={i} className="vm-point flex items-start gap-3.5">
              <span
                className="mt-[1px] w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 text-white shadow-[0_4px_10px_-3px_rgba(14,165,233,0.6)]"
                style={{ background: CHECK_GRADIENT }}
              >
                <Check className="w-4 h-4" strokeWidth={3} />
              </span>
              <span
                className={`text-[#334366] leading-snug pt-[3px] ${isTamil ? 'font-tamil text-sm sm:text-[15px]' : isVision ? 'text-[15px] sm:text-base' : 'text-sm sm:text-[15px]'}`}
              >
                {point}
              </span>
            </li>
          ))}
        </ul>

        {/* Bottom decoration */}
        {isVision ? (
          <div className="relative mt-auto pt-10 flex items-end justify-between min-h-[190px]">
            <div className="vm-script relative pl-1 pb-6 -rotate-[14deg] origin-bottom-left">
              <p
                className="font-brush text-[26px] sm:text-[32px] leading-[1.15] bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(120deg, #1D4ED8 0%, #2563EB 45%, #0EA5E9 100%)' }}
              >
                {isTamil ? (
                  <>ஒன்றாக<br />&nbsp;&nbsp;ஒளிமயமான<br />&nbsp;&nbsp;&nbsp;&nbsp;எதிர்காலம்</>
                ) : (
                  <>Together<br />&nbsp;&nbsp;for a Brighter<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Future</>
                )}
              </p>
              <svg viewBox="0 0 70 40" className="absolute -bottom-1 left-[45%] w-16 h-9" fill="none" aria-hidden="true">
                <path d="M4 34 L16 30" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" />
                <path
                  d="M36 36 C 22 26, 18 16, 22 10 C 26 4, 34 6, 36 13 C 38 6, 46 4, 50 10 C 54 16, 50 26, 36 36 Z"
                  stroke="#14B8A6"
                  strokeWidth="2.6"
                  strokeLinejoin="round"
                />
                <path d="M56 32 L66 30" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <HandsHeartIllustration className="vm-illustration w-[60%] max-w-[340px] -mb-10 -mr-4 shrink-0" />
          </div>
        ) : (
          <div className="relative mt-auto pt-8 flex items-end justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0 pb-3">
              <Heart className="w-4 h-4 shrink-0 text-[#2563EB] fill-[#2563EB]" />
              <span className={`text-sm font-semibold text-[#2563EB] whitespace-nowrap ${isTamil ? 'font-tamil' : ''}`}>
                {footer}
              </span>
              <span className="h-px flex-1 max-w-[160px] bg-gradient-to-r from-[#93C5FD] to-transparent" />
            </div>
            <HandHeartIllustration className="vm-illustration w-28 sm:w-32 -mb-6 -mr-3 shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
};

export const VisionMission: React.FC = () => {
  const { isTamil } = useLanguage();
  const { vision: { vision, mission } } = useAdminData();

  const sectionRef = useRef<HTMLElement | null>(null);
  const visionCardRef = useRef<HTMLDivElement | null>(null);
  const missionCardRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      [visionCardRef.current, missionCardRef.current].forEach((card, idx) => {
        if (!card) return;
        const q = gsap.utils.selector(card);

        gsap.set(card, { opacity: 0, y: 44, scale: 0.98 });
        gsap.set(q('.vm-icon'), { scale: 0.8, opacity: 0, y: 12 });
        gsap.set(q('.vm-bar'), { scaleX: 0 });
        gsap.set(q('.vm-point'), { opacity: 0, x: -12 });
        gsap.set(q('.vm-script'), { opacity: 0, y: 12 });
        gsap.set(q('.vm-illustration'), { opacity: 0, y: 24, scale: 0.94 });

        const tl = gsap.timeline({
          delay: idx * 0.18,
          scrollTrigger: { trigger: card, start: 'top 84%', once: true },
        });

        tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: EASING.cinematic })
          .to(q('.vm-icon'), { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' }, 0.2)
          .to(q('.vm-bar'), { scaleX: 1, duration: 0.75, ease: 'power3.out' }, 0.4)
          .to(q('.vm-point'), { opacity: 1, x: 0, duration: 0.45, stagger: 0.08, ease: EASING.smooth }, 0.5)
          .to(q('.vm-illustration'), { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.3)' }, 0.65)
          .to(q('.vm-script'), { opacity: 1, y: 0, duration: 0.7, ease: EASING.smooth }, 0.8)
          .call(() => {
            // Gentle idle motion once revealed
            ctx.add(() => {
              gsap.to(q('.vm-illustration'), { y: -6, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
              gsap.to(q('.illus-heart'), {
                scale: 1.06,
                transformOrigin: '50% 60%',
                duration: 1.0,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
            });
          });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [vision, mission]);

  return (
    <section
      ref={sectionRef}
      id="vision"
      className="theme-light py-20 sm:py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F9FD 50%, #FFFFFF 100%)' }}
    >
      {/* Ambient background washes */}
      <div className="absolute top-24 -left-32 w-[420px] h-[420px] rounded-full bg-[#EEF2FF] blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-[420px] h-[420px] rounded-full bg-[#ECFDF5] blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge={isTamil ? 'எங்கள் திசைவழி' : 'Guiding Principles'}
          title={isTamil ? 'தொலைநோக்கு & செயல் திட்டம்' : 'Vision & Mission'}
          subtitle={
            isTamil
              ? 'அன்பான சமூகத்தை உருவாக்கும் எங்கள் தொலைநோக்கும், அதை சாத்தியமாக்கும் செயல் திட்டமும்.'
              : 'Our clear aspiration for tomorrow and our everyday roadmap for humanitarian action.'
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          <VisionMissionCard
            cardRef={visionCardRef}
            variant="vision"
            icon={<Eye className="w-9 h-9 sm:w-10 sm:h-10" strokeWidth={2.2} />}
            badge={isTamil ? vision.badgeTa : vision.badgeEn}
            title={isTamil ? vision.titleTa : vision.titleEn}
            text={isTamil ? vision.textTa : vision.textEn}
            points={isTamil ? vision.pointsTa : vision.pointsEn}
            footer={isTamil ? 'அன்பால் வளரும் சமூகம்' : 'A Society Built on Love'}
            isTamil={isTamil}
          />
          <VisionMissionCard
            cardRef={missionCardRef}
            variant="mission"
            icon={<Target className="w-9 h-9 sm:w-10 sm:h-10" strokeWidth={2.2} />}
            badge={isTamil ? mission.badgeTa : mission.badgeEn}
            title={isTamil ? mission.titleTa : mission.titleEn}
            text={isTamil ? mission.textTa : mission.textEn}
            points={isTamil ? mission.pointsTa : mission.pointsEn}
            footer={isTamil ? 'நேரடி மக்கள் சேவை' : 'Direct Humanitarian Upliftment'}
            isTamil={isTamil}
          />
        </div>
      </div>
    </section>
  );
};
