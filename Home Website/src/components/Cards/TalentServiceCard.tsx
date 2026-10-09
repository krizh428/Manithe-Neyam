import React from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  GraduationCap,
  Utensils,
  HeartPulse,
  Shirt,
  HeartHandshake,
  Users,
  Dumbbell,
  Flower2,
  Palette,
  Droplets,
  Compass,
  Star,
  Sparkles,
  Target,
} from 'lucide-react';
import type { ServiceItem } from '../../types';

interface TalentServiceCardProps {
  service: ServiceItem;
  isTamil: boolean;
  index: number;
}

export const TalentServiceCard: React.FC<TalentServiceCardProps> = ({
  service,
  isTamil,
  index,
}) => {
  // Map service icon dynamically
  const getIcon = (name: string) => {
    const iconClass = 'w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[8deg] group-hover:scale-105';
    switch (name) {
      case 'Star':
        return <Star className={iconClass} />;
      case 'GraduationCap':
        return <GraduationCap className={iconClass} />;
      case 'Utensils':
        return <Utensils className={iconClass} />;
      case 'HeartPulse':
        return <HeartPulse className={iconClass} />;
      case 'Shirt':
        return <Shirt className={iconClass} />;
      case 'HeartHandshake':
        return <HeartHandshake className={iconClass} />;
      case 'Users':
        return <Users className={iconClass} />;
      case 'Dumbbell':
        return <Dumbbell className={iconClass} />;
      case 'Flower2':
        return <Flower2 className={iconClass} />;
      case 'Palette':
        return <Palette className={iconClass} />;
      case 'Droplets':
        return <Droplets className={iconClass} />;
      case 'Compass':
        return <Compass className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  // Staggered Entrance Variants
  // 1. Card smoothly fades in while moving upward 30px, duration 700ms
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (customIndex: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const, // cubic-bezier easing
        delay: (customIndex % 3) * 0.1,
        when: 'beforeChildren' as const,
        staggerChildren: 0.08,
      },
    }),
  };

  // 2. Icon gently scales from 0.8 to 1.0 with a soft glow
  const iconVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0, filter: 'drop-shadow(0px 0px 0px rgba(18,60,74,0))' },
    visible: {
      scale: 1,
      opacity: 1,
      filter: 'drop-shadow(0px 0px 14px rgba(18,60,74,0.38))',
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // 3. Heading slides in from the left
  const headingVariants: Variants = {
    hidden: { x: -25, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // 4. Description text fades in with subtle stagger
  const descVariants: Variants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // 5. Divider smoothly expands from left to right
  const dividerVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0, originX: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      originX: 0,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // 6. Goal information pill slides upward and fades in
  const goalPillVariants: Variants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // 7. “Ongoing” badge scales in with subtle spring/bounce effect
  const badgeVariants: Variants = {
    hidden: { scale: 0.6, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 380,
        damping: 22,
      },
    },
  };

  // 8. Italic supporting text fades in
  const supportingTextVariants: Variants = {
    hidden: { y: 8, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // 9. “Ongoing Program” slides in from the right
  const programVariants: Variants = {
    hidden: { x: 20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="group relative bg-white dark:bg-[#0D263D] rounded-[28px] border border-[#DCE5EC] dark:border-[#1E405C] p-7 sm:p-8 flex flex-col justify-between overflow-hidden cursor-pointer shadow-[0_4px_24px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_22px_45px_-10px_rgba(15,23,42,0.14)] dark:hover:shadow-[0_22px_45px_-10px_rgba(0,0,0,0.65)] hover:border-[#0F172A]/40 dark:hover:border-[#D4AF37]/50 hover:ring-1 hover:ring-[#0F172A]/15 dark:hover:ring-[#D4AF37]/20 select-none"
    >
      {/* 10. Decorative navy/teal corner shapes slowly move 4-6px with subtle floating animation */}
      {/* Top-Right Decorative Waves */}
      <div className="absolute -top-1 -right-1 w-36 h-32 pointer-events-none overflow-hidden rounded-tr-[28px] z-0">
        <svg
          viewBox="0 0 170 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full animate-corner-tr transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:translate-x-1 group-hover:-translate-y-1"
        >
          {/* Dark Teal / Navy Outer Layer */}
          <path
            d="M25 0 C40 32, 70 48, 110 32 C135 22, 152 38, 170 65 V0 H25 Z"
            className="fill-[#123C4A] dark:fill-[#123B5A]"
          />
          {/* Subtle White / Gold Contour Trace */}
          <path
            d="M25 0 C40 32, 70 48, 110 32 C135 22, 152 38, 170 65"
            className="stroke-white dark:stroke-[#D4AF37]"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
          {/* Deep Navy / Midnight Inner Main Shape */}
          <path
            d="M58 0 C75 30, 98 42, 132 26 C150 18, 162 25, 170 38 V0 H58 Z"
            className="fill-[#0F172A] dark:fill-[#071A2B]"
          />
          <path
            d="M58 0 C75 30, 98 42, 132 26 C150 18, 162 25, 170 38"
            className="stroke-white dark:stroke-[#D4AF37]"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
        </svg>
      </div>

      {/* Bottom-Left Decorative Waves */}
      <div className="absolute -bottom-1 -left-1 w-36 h-32 pointer-events-none overflow-hidden rounded-bl-[28px] z-0">
        <svg
          viewBox="0 0 170 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full animate-corner-bl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:-translate-x-1 group-hover:translate-y-1"
        >
          {/* Dark Teal / Navy Outer Layer */}
          <path
            d="M0 75 C18 98, 35 118, 60 108 C100 92, 130 108, 145 140 H0 V75 Z"
            className="fill-[#123C4A] dark:fill-[#123B5A]"
          />
          {/* Subtle White / Gold Contour Trace */}
          <path
            d="M0 75 C18 98, 35 118, 60 108 C100 92, 130 108, 145 140"
            className="stroke-white dark:stroke-[#D4AF37]"
            strokeWidth="1.5"
            strokeOpacity="0.45"
          />
          {/* Deep Navy / Midnight Inner Main Shape */}
          <path
            d="M0 102 C10 115, 22 124, 42 116 C74 102, 102 112, 112 140 H0 V102 Z"
            className="fill-[#0F172A] dark:fill-[#071A2B]"
          />
          <path
            d="M0 102 C10 115, 22 124, 42 116 C74 102, 102 112, 112 140"
            className="stroke-white dark:stroke-[#D4AF37]"
            strokeWidth="1.2"
            strokeOpacity="0.3"
          />
        </svg>
      </div>

      {/* Main Card Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          {/* Step 2: Icon Container with gentle scale and soft glow */}
          <motion.div
            variants={iconVariants}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] bg-[#0F172A] dark:bg-[#071A2B] dark:border dark:border-[#1E405C] flex items-center justify-center shadow-xs transition-all duration-400 group-hover:shadow-[0_0_24px_rgba(18,60,74,0.45)] dark:group-hover:shadow-[0_0_24px_rgba(212,175,55,0.35)] group-hover:border group-hover:border-[#EAB308]/40"
          >
            {getIcon(service.iconName)}
          </motion.div>

          {/* Step 3: Heading slides in from left */}
          <motion.h3
            variants={headingVariants}
            className={`text-2xl sm:text-[26px] font-black text-[#0F172A] dark:text-[#D4AF37] tracking-tight leading-tight mt-5 mb-3 group-hover:text-[#123C4A] dark:group-hover:text-[#F4D35E] transition-colors ${
              isTamil ? 'font-tamil' : ''
            }`}
          >
            {isTamil ? service.titleTa : service.titleEn}
          </motion.h3>

          {/* Step 4: Description text fades in */}
          <motion.p
            variants={descVariants}
            className={`text-[#334155] dark:text-[#E2E8F0] text-[15px] sm:text-base leading-relaxed font-normal mb-6 ${
              isTamil ? 'font-tamil' : ''
            }`}
          >
            {isTamil ? service.descTa : service.descEn}
          </motion.p>
        </div>

        <div>
          {/* Step 5: Divider expands from left to right */}
          <motion.div
            variants={dividerVariants}
            className="w-full h-[1px] bg-[#DCE5EC] dark:bg-[#1E405C] my-5"
          />

          {/* Steps 6 & 7: Goal Pill and Ongoing Badge */}
          <div className="flex items-center gap-3">
            {/* Step 6: Goal Information Pill */}
            <motion.div
              variants={goalPillVariants}
              className="flex-1 min-w-0 bg-[#EEF4F8] dark:bg-[#102D46] group-hover:bg-[#E2E8F0] dark:group-hover:bg-[#163857] transition-colors duration-300 rounded-2xl py-2 px-3 sm:px-3.5 flex items-center gap-2.5 border border-[#DCE5EC]/60 dark:border-[#1E405C]"
            >
              <Target className="w-5 h-5 text-[#0F172A] dark:text-[#D4AF37] shrink-0 stroke-[2.2]" />
              <div className="w-[1px] h-5 bg-[#CBD5E1] dark:bg-[#1E405C] shrink-0" />
              <span
                className={`text-xs sm:text-[13px] font-bold text-[#0F172A] dark:text-[#E2E8F0] leading-tight line-clamp-2 ${
                  isTamil ? 'font-tamil' : ''
                }`}
              >
                {isTamil ? service.whyTa : service.whyEn}
              </span>
            </motion.div>

            {/* Step 7: Ongoing Badge */}
            <motion.div
              variants={badgeVariants}
              className="bg-[#0F172A] dark:bg-[#D4AF37] group-hover:bg-[#123C4A] dark:group-hover:bg-[#F4D35E] text-white dark:text-[#071A2B] text-xs sm:text-[13px] font-bold px-4 sm:px-5 py-2.5 rounded-full shrink-0 shadow-xs flex items-center justify-center transition-all duration-300 group-hover:scale-[1.04]"
            >
              <span className={isTamil ? 'font-tamil' : ''}>
                {isTamil ? service.whenTa : service.whenEn}
              </span>
            </motion.div>
          </div>

          {/* Steps 8 & 9: Supporting Text & Ongoing Program Status */}
          <div className="flex items-center justify-between pt-3 text-xs sm:text-[13px]">
            {/* Step 8: Italic Supporting Text */}
            <motion.p
              variants={supportingTextVariants}
              className={`italic text-[#64748B] dark:text-[#CBD5E1] text-xs sm:text-[13px] leading-relaxed pr-3 line-clamp-2 ${
                isTamil ? 'font-tamil' : ''
              }`}
            >
              {isTamil ? service.longDescTa : service.longDescEn}
            </motion.p>

            {/* Step 9: Ongoing Program text */}
            <motion.div
              variants={programVariants}
              className="flex items-center gap-2 shrink-0 pl-3 border-l border-[#DCE5EC] dark:border-[#1E405C]"
            >
              <span
                className={`text-xs font-semibold text-[#0F172A] dark:text-[#CBD5E1] leading-tight text-right whitespace-nowrap ${
                  isTamil ? 'font-tamil' : ''
                }`}
              >
                {isTamil ? service.dateTa : service.dateEn}
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
