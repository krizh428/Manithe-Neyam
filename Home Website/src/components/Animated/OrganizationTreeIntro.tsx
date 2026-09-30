import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import {
  HeartHandshake,
  Users,
  Sparkles,
  BookOpen,
  Home,
  HeartPulse,
  Scissors,
  Monitor,
  MapPin,
  X,
} from 'lucide-react';
import { gsap, EASING, prefersReducedMotion } from '../../animations';
import { useLanguage } from '../../context/LanguageContext';
import { ORGANIZATIONS_DATA, type OrganizationBranch } from '../../data/organizationsData';

interface OrganizationTreeIntroProps {
  isOpen: boolean;
  isReplay?: boolean;
  onComplete: () => void;
}

export const OrganizationTreeIntro: React.FC<OrganizationTreeIntroProps> = ({
  isOpen,
  isReplay: _isReplay = false,
  onComplete,
}) => {
  const { isTamil } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleGroupRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const breathingTweenRef = useRef<gsap.core.Tween | null>(null);

  // Responsive device check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Icon Resolver with large icon styling
  const getIcon = (name: OrganizationBranch['iconName'], isHovered: boolean) => {
    const iconClass = `w-6 h-6 sm:w-6.5 sm:h-6.5 transition-transform duration-300 ${
      isHovered ? 'scale-110 text-white' : 'text-[#1B4332]'
    }`;

    switch (name) {
      case 'HeartHandshake':
        return <HeartHandshake className={iconClass} />;
      case 'Users':
        return <Users className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'BookOpen':
        return <BookOpen className={iconClass} />;
      case 'Home':
        return <Home className={iconClass} />;
      case 'HeartPulse':
        return <HeartPulse className={iconClass} />;
      case 'Scissors':
        return <Scissors className={iconClass} />;
      case 'Monitor':
        return <Monitor className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  // DESKTOP: Tight, high-fill 1100 x 540 coordinate space
  // Fills the screen with large visible cards and a prominent central logo core.
  // Zero empty voids: cards span from x=18 to x=1082 and y=15 to y=526.
  const desktopNodes = [
    {
      ...ORGANIZATIONS_DATA[0], // Specialised Adoption Centre
      index: 0,
      categoryTa: 'குழந்தை தத்தெடுப்பு',
      categoryEn: 'ADOPTION CARE',
      cardX: 18,
      cardY: 40,
      cardW: 245,
      cardH: 76,
      branchPath: 'M 500 245 C 410 190, 260 145, 140 116',
      leaf1: { x: 380, y: 190, rot: -30, scale: 1 },
      leaf2: { x: 240, y: 145, rot: -20, scale: 1.1 },
    },
    {
      ...ORGANIZATIONS_DATA[1], // Children's Home (Kodangipatti)
      index: 1,
      categoryTa: 'பாதுகாப்பு இல்லம்',
      categoryEn: 'SHELTER & CARE',
      cardX: 285,
      cardY: 15,
      cardW: 245,
      cardH: 76,
      branchPath: 'M 525 218 C 490 155, 450 120, 407 91',
      leaf1: { x: 490, y: 165, rot: -50, scale: 1 },
      leaf2: { x: 440, y: 120, rot: -40, scale: 1.1 },
    },
    {
      ...ORGANIZATIONS_DATA[2], // Special Training Centre (RSTC)
      index: 2,
      categoryTa: 'சிறப்பு கல்வி மையம்',
      categoryEn: 'SPECIAL EDUCATION',
      cardX: 570,
      cardY: 15,
      cardW: 245,
      cardH: 76,
      branchPath: 'M 575 218 C 610 155, 650 120, 693 91',
      leaf1: { x: 610, y: 165, rot: 50, scale: 1 },
      leaf2: { x: 660, y: 120, rot: 40, scale: 1.1 },
    },
    {
      ...ORGANIZATIONS_DATA[3], // Dream Nursery & Primary School
      index: 3,
      categoryTa: 'தொடக்கப்பள்ளி',
      categoryEn: 'PRIMARY EDUCATION',
      cardX: 837,
      cardY: 40,
      cardW: 245,
      cardH: 76,
      branchPath: 'M 600 245 C 690 190, 840 145, 960 116',
      leaf1: { x: 720, y: 190, rot: 30, scale: 1 },
      leaf2: { x: 860, y: 145, rot: 20, scale: 1.1 },
    },
    {
      ...ORGANIZATIONS_DATA[4], // Children's Home (Theni)
      index: 4,
      categoryTa: 'குழந்தைகள் இல்லம்',
      categoryEn: "CHILDREN'S SANCTUARY",
      cardX: 18,
      cardY: 425,
      cardW: 245,
      cardH: 76,
      branchPath: 'M 500 295 C 410 350, 260 395, 140 425',
      leaf1: { x: 380, y: 350, rot: 30, scale: 1 },
      leaf2: { x: 240, y: 395, rot: 20, scale: 1.1 },
    },
    {
      ...ORGANIZATIONS_DATA[5], // Old Age Home
      index: 5,
      categoryTa: 'முதியோர் நல்வாழ்வு',
      categoryEn: 'ELDERLY SANCTUARY',
      cardX: 285,
      cardY: 450,
      cardW: 245,
      cardH: 76,
      branchPath: 'M 525 322 C 490 385, 450 420, 407 450',
      leaf1: { x: 490, y: 375, rot: 50, scale: 1 },
      leaf2: { x: 440, y: 420, rot: 40, scale: 1.1 },
    },
    {
      ...ORGANIZATIONS_DATA[6], // Sewing Training Centre
      index: 6,
      categoryTa: 'தையல் பயிற்சி மையம்',
      categoryEn: 'WOMEN EMPOWERMENT',
      cardX: 570,
      cardY: 450,
      cardW: 245,
      cardH: 76,
      branchPath: 'M 575 322 C 610 385, 650 420, 693 450',
      leaf1: { x: 610, y: 375, rot: -50, scale: 1 },
      leaf2: { x: 660, y: 420, rot: -40, scale: 1.1 },
    },
    {
      ...ORGANIZATIONS_DATA[7], // Computer Training Centre
      index: 7,
      categoryTa: 'கணினி தொழிற்பயிற்சி',
      categoryEn: 'DIGITAL SKILLS',
      cardX: 837,
      cardY: 425,
      cardW: 245,
      cardH: 76,
      branchPath: 'M 600 295 C 690 350, 840 395, 960 425',
      leaf1: { x: 720, y: 350, rot: -30, scale: 1 },
      leaf2: { x: 860, y: 395, rot: -20, scale: 1.1 },
    },
  ];

  // MOBILE: 380 x 860 Canvas Coordinates with balanced alternating layout
  const mobileNodes = [
    {
      ...ORGANIZATIONS_DATA[0],
      index: 0,
      categoryTa: 'தத்தெடுப்பு மையம்',
      categoryEn: 'ADOPTION CARE',
      cardX: 10,
      cardY: 110,
      cardW: 175,
      cardH: 70,
      branchPath: 'M 190 95 C 190 120, 140 145, 97 145',
      leaf1: { x: 145, y: 130, rot: -30, scale: 0.9 },
      leaf2: { x: 115, y: 142, rot: -15, scale: 0.95 },
    },
    {
      ...ORGANIZATIONS_DATA[1],
      index: 1,
      categoryTa: 'பாதுகாப்பு இல்லம்',
      categoryEn: 'SHELTER & CARE',
      cardX: 195,
      cardY: 195,
      cardW: 175,
      cardH: 70,
      branchPath: 'M 190 160 C 190 200, 240 230, 282 230',
      leaf1: { x: 235, y: 215, rot: 30, scale: 0.9 },
      leaf2: { x: 265, y: 227, rot: 15, scale: 0.95 },
    },
    {
      ...ORGANIZATIONS_DATA[2],
      index: 2,
      categoryTa: 'சிறப்பு கல்வி',
      categoryEn: 'SPECIAL EDUCATION',
      cardX: 10,
      cardY: 280,
      cardW: 175,
      cardH: 70,
      branchPath: 'M 190 245 C 190 285, 140 315, 97 315',
      leaf1: { x: 145, y: 300, rot: -30, scale: 0.9 },
      leaf2: { x: 115, y: 312, rot: -15, scale: 0.95 },
    },
    {
      ...ORGANIZATIONS_DATA[3],
      index: 3,
      categoryTa: 'தொடக்கப்பள்ளி',
      categoryEn: 'PRIMARY EDUCATION',
      cardX: 195,
      cardY: 365,
      cardW: 175,
      cardH: 70,
      branchPath: 'M 190 330 C 190 370, 240 400, 282 400',
      leaf1: { x: 235, y: 385, rot: 30, scale: 0.9 },
      leaf2: { x: 265, y: 397, rot: 15, scale: 0.95 },
    },
    {
      ...ORGANIZATIONS_DATA[4],
      index: 4,
      categoryTa: 'குழந்தைகள் இல்லம்',
      categoryEn: "CHILDREN'S HOME",
      cardX: 10,
      cardY: 450,
      cardW: 175,
      cardH: 70,
      branchPath: 'M 190 415 C 190 455, 140 485, 97 485',
      leaf1: { x: 145, y: 470, rot: -30, scale: 0.9 },
      leaf2: { x: 115, y: 482, rot: -15, scale: 0.95 },
    },
    {
      ...ORGANIZATIONS_DATA[5],
      index: 5,
      categoryTa: 'முதியோர் நல்வாழ்வு',
      categoryEn: 'ELDERLY CARE',
      cardX: 195,
      cardY: 535,
      cardW: 175,
      cardH: 70,
      branchPath: 'M 190 500 C 190 540, 240 570, 282 570',
      leaf1: { x: 235, y: 555, rot: 30, scale: 0.9 },
      leaf2: { x: 265, y: 567, rot: 15, scale: 0.95 },
    },
    {
      ...ORGANIZATIONS_DATA[6],
      index: 6,
      categoryTa: 'தையல் பயிற்சி',
      categoryEn: 'WOMEN EMPOWERMENT',
      cardX: 10,
      cardY: 620,
      cardW: 175,
      cardH: 70,
      branchPath: 'M 190 585 C 190 625, 140 655, 97 655',
      leaf1: { x: 145, y: 640, rot: -30, scale: 0.9 },
      leaf2: { x: 115, y: 652, rot: -15, scale: 0.95 },
    },
    {
      ...ORGANIZATIONS_DATA[7],
      index: 7,
      categoryTa: 'கணினி பயிற்சி',
      categoryEn: 'DIGITAL SKILLS',
      cardX: 195,
      cardY: 705,
      cardW: 175,
      cardH: 70,
      branchPath: 'M 190 670 C 190 710, 240 740, 282 740',
      leaf1: { x: 235, y: 725, rot: 30, scale: 0.9 },
      leaf2: { x: 265, y: 737, rot: 15, scale: 0.95 },
    },
  ];

  const currentNodes = isMobile ? mobileNodes : desktopNodes;

  // Master GSAP Timeline & Continuous Breathing Animation
  useLayoutEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    if (prefersReducedMotion()) {
      const timer = setTimeout(() => {
        document.body.style.overflow = 'auto';
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const container = containerRef.current!;
      const titleGroup = titleGroupRef.current;
      const logoGroup = container.querySelector('.central-logo-group');
      const rippleRings = container.querySelectorAll('.ripple-ring');
      const branches = container.querySelectorAll<SVGPathElement>('.tree-branch-path');
      const branchTrails = container.querySelectorAll<SVGPathElement>('.tree-branch-trail');
      const travelPoints = container.querySelectorAll<SVGCircleElement>('.travel-point');
      const travelSparkles = container.querySelectorAll<SVGCircleElement>('.travel-sparkle');
      const leaves = container.querySelectorAll<SVGPathElement>('.tree-leaf');
      const serviceCards = container.querySelectorAll('.service-card-wrapper');

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // 1. Initial State Setup
      gsap.set(container, { opacity: 1 });
      if (titleGroup) gsap.set(titleGroup, { opacity: 0, y: -15 });

      // Central logo core starts with a soft breathing scale
      if (logoGroup) {
        gsap.set(logoGroup, {
          scale: 0.65,
          opacity: 0,
          transformOrigin: isMobile ? '190px 65px' : '550px 270px',
        });
      }

      // Hide ripple rings initially
      gsap.set(rippleRings, {
        scale: 0.7,
        opacity: 0,
        transformOrigin: isMobile ? '190px 65px' : '550px 270px',
      });

      // Prepare branches for stroke animation
      branches.forEach((b) => {
        const len = b.getTotalLength ? b.getTotalLength() : 300;
        gsap.set(b, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.85 });
      });

      // Prepare branch trails
      branchTrails.forEach((bt) => {
        const len = bt.getTotalLength ? bt.getTotalLength() : 300;
        gsap.set(bt, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.6 });
      });

      // Leaves start hidden
      gsap.set(leaves, { scale: 0, opacity: 0, transformOrigin: 'center center' });

      // Service cards start softly shifted with 0 opacity
      gsap.set(serviceCards, { opacity: 0, y: 16, scale: 0.92 });

      // Points and sparkles start hidden
      gsap.set(travelPoints, { opacity: 0, scale: 0.8 });
      gsap.set(travelSparkles, { opacity: 0, scale: 0.6 });

      // 2. Central Logo Core Enters & Blossoms
      if (logoGroup) {
        tl.to(logoGroup, {
          scale: 1,
          opacity: 1,
          duration: 0.85,
          ease: 'back.out(1.4)',
        });
      }

      // Ripple rings pulse outward from core
      tl.to(
        rippleRings,
        {
          scale: 1,
          opacity: (i) => 0.5 - i * 0.12,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.55'
      );

      // 3. Top Heading & Subtitle Fade In
      if (titleGroup) {
        tl.to(
          titleGroup,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: EASING.smooth,
          },
          '-=0.45'
        );
      }

      // 4. Sequential Branch Growth + Light Energy Flow + Leaves + Large Cards Reveal
      branches.forEach((branch, index) => {
        const point = travelPoints[index];
        const sparkle = travelSparkles[index];
        const card = serviceCards[index];
        const branchLeaves = container.querySelectorAll<SVGPathElement>(`.leaf-branch-${index}`);
        const branchLen = branch.getTotalLength ? branch.getTotalLength() : 300;

        const startTime = (tl.duration() - 0.28) > 0 ? (tl.duration() - 0.28) : 1.0;

        // A. Branch curves smoothly outward like wood grain
        tl.to(
          branch,
          {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: 'power2.inOut',
          },
          startTime
        );

        // B. Light energy pulse flows through the branch
        if (point) {
          const proxy = { progress: 0 };
          tl.to(
            point,
            {
              opacity: 1,
              duration: 0.08,
            },
            startTime
          ).to(
            proxy,
            {
              progress: 1,
              duration: 0.7,
              ease: 'power2.inOut',
              onUpdate: () => {
                if (branch.getPointAtLength) {
                  const pt = branch.getPointAtLength(proxy.progress * branchLen);
                  point.setAttribute('cx', pt.x.toString());
                  point.setAttribute('cy', pt.y.toString());
                }
              },
            },
            startTime
          );

          tl.to(
            point,
            {
              scale: 2.2,
              opacity: 0,
              duration: 0.25,
              ease: 'power2.out',
            },
            startTime + 0.62
          );
        }

        // C. Trailing sparkle follows the main beam
        if (sparkle) {
          const sparkleProxy = { progress: 0 };
          tl.to(
            sparkle,
            {
              opacity: 0.85,
              duration: 0.08,
            },
            startTime + 0.12
          ).to(
            sparkleProxy,
            {
              progress: 1,
              duration: 0.65,
              ease: 'power2.inOut',
              onUpdate: () => {
                if (branch.getPointAtLength) {
                  const pt = branch.getPointAtLength(sparkleProxy.progress * branchLen);
                  sparkle.setAttribute('cx', pt.x.toString());
                  sparkle.setAttribute('cy', pt.y.toString());
                }
              },
            },
            startTime + 0.12
          ).to(
            sparkle,
            {
              scale: 1.8,
              opacity: 0,
              duration: 0.2,
              ease: 'power2.out',
            },
            startTime + 0.72
          );
        }

        // D. Gentle leaves unfurl along the branch
        if (branchLeaves.length > 0) {
          tl.to(
            branchLeaves,
            {
              scale: 1,
              opacity: 0.9,
              duration: 0.5,
              stagger: 0.1,
              ease: 'back.out(2)',
            },
            startTime + 0.35
          );
        }

        // E. Large Service Card Softly Reveals
        if (card) {
          tl.to(
            card,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              ease: 'power2.out',
            },
            startTime + 0.5
          );
        }
      });

      // 5. Subtle Continuous Breathing & Ripple Loop after entrance completes
      tl.add(() => {
        breathingTweenRef.current = gsap.to(rippleRings, {
          scale: 1.15,
          opacity: (i) => 0.65 - i * 0.14,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: 0.25,
        });

        gsap.to(leaves, {
          rotation: '+=8',
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: {
            each: 0.15,
            from: 'random',
          },
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (breathingTweenRef.current) breathingTweenRef.current.kill();
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile]);

  // Handle User Skip or Continue
  const handleSkip = () => {
    if (timelineRef.current) timelineRef.current.pause();
    if (breathingTweenRef.current) breathingTweenRef.current.kill();

    const container = containerRef.current;
    if (container) {
      gsap.to(container, {
        opacity: 0,
        scale: 0.98,
        duration: 0.45,
        ease: EASING.smooth,
        onComplete: () => {
          document.body.style.overflow = 'auto';
          onComplete();
        },
      });
    } else {
      document.body.style.overflow = 'auto';
      onComplete();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[120] overflow-hidden flex flex-col items-center justify-between p-2 sm:p-4 select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 48%, #FDFBF7 0%, #F5EFEB 55%, #EDE4D8 100%)',
      }}
    >
      {/* Subtle organic ambient backdrop glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[750px] rounded-full bg-gradient-to-tr from-[#1B4332]/6 via-[#D4AF37]/10 to-[#5C3A21]/6 blur-3xl pointer-events-none" />
      </div>

      {/* Top Header Controls: Skip Button */}
      <div className="w-full max-w-7xl flex items-center justify-end z-30 shrink-0 px-2 sm:px-4">
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#E5DDD2] text-xs sm:text-sm font-black text-[#5C3A21] hover:text-[#1B4332] hover:border-[#1B4332]/60 hover:bg-white transition-all cursor-pointer shadow-xs active:scale-95"
          title={isTamil ? 'அறிமுகத்தை தவிர்க்க' : 'Skip Introduction'}
        >
          <span>{isTamil ? 'தவிர்க்க' : 'Skip'}</span>
          <X className="w-3 h-3 stroke-[2.5]" />
        </button>
      </div>

      {/* Top Heading in Rich Warm Brown Color (#5C3A21), Noticeably Larger & More Premium */}
      <div ref={titleGroupRef} className="text-center z-20 -mt-1 max-w-4xl px-4 shrink-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#5C3A21] font-tamil tracking-tight leading-tight">
          {isTamil ? 'மனிதநேயம் – எங்கள் சேவைகள்' : 'MANITHANEYA – OUR SERVICES'}
        </h2>
        <p className="text-xs sm:text-sm md:text-base font-bold text-[#7A614D] mt-1 font-tamil">
          {isTamil
            ? 'ஒரே அன்பிலிருந்து மலரும் எட்டு மனிதநேயக் கிளைகள்'
            : 'From One Shared Love, Eight Flourishing Branches of Humanity'}
        </p>
      </div>

      {/* Main Humanity Tree Canvas Area with Tight Screen-Filling Geometry */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden my-auto">
        <svg
          viewBox={isMobile ? '0 0 380 860' : '0 0 1100 540'}
          className="w-full h-full max-h-[calc(100vh-95px)] max-w-[1380px] pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="gold-flow-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="emerald-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5C3A21" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#2D6A4F" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#1B4332" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="activeBranchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
              <stop offset="60%" stopColor="#2D6A4F" stopOpacity="1" />
              <stop offset="100%" stopColor="#1B4332" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* 1. Organic Tree Trunk Base Anchor */}
          {!isMobile && (
            <g className="tree-trunk-base opacity-45">
              <path
                d="M 540 330 Q 535 380, 520 430"
                stroke="#5C3A21"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 560 330 Q 565 380, 580 430"
                stroke="#5C3A21"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M 550 330 L 550 410"
                stroke="#5C3A21"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* 2. Organic Service Branches */}
          {currentNodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            return (
              <g key={`branch-group-${node.id}`}>
                {/* Secondary Soft Ambient Trail */}
                <path
                  d={node.branchPath}
                  className="tree-branch-trail"
                  stroke={isHovered ? '#D4AF37' : '#1B4332'}
                  strokeWidth={isMobile ? (isHovered ? '7' : '4') : (isHovered ? '8' : '4.5')}
                  strokeLinecap="round"
                  strokeOpacity={isHovered ? '0.55' : '0.15'}
                  filter={isHovered ? 'url(#gold-flow-glow)' : undefined}
                />

                {/* Primary Organic Branch Path */}
                <path
                  d={node.branchPath}
                  className="tree-branch-path"
                  stroke={isHovered ? 'url(#activeBranchGradient)' : 'url(#branchGradient)'}
                  strokeWidth={isMobile ? (isHovered ? '4' : '3') : (isHovered ? '5' : '3.8')}
                  strokeLinecap="round"
                />

                {/* Gentle Leaves Sprouting along the Branch */}
                {node.leaf1 && (
                  <path
                    d="M 0,0 C -7,-12 7,-16 14,-12 C 12,-4 5,0 0,0"
                    transform={`translate(${node.leaf1.x}, ${node.leaf1.y}) rotate(${node.leaf1.rot}) scale(${node.leaf1.scale})`}
                    className={`tree-leaf leaf-branch-${node.index}`}
                    fill={isHovered ? '#D4AF37' : '#2D6A4F'}
                    stroke="#1B4332"
                    strokeWidth="1"
                  />
                )}
                {node.leaf2 && (
                  <path
                    d="M 0,0 C -6,-11 6,-15 13,-11 C 11,-4 4,0 0,0"
                    transform={`translate(${node.leaf2.x}, ${node.leaf2.y}) rotate(${node.leaf2.rot}) scale(${node.leaf2.scale})`}
                    className={`tree-leaf leaf-branch-${node.index}`}
                    fill={isHovered ? '#E5A93C' : '#235D43'}
                    stroke="#1B4332"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}

          {/* 3. Flowing Light Energy Particles */}
          {currentNodes.map((node) => (
            <g key={`energy-${node.id}`}>
              <circle
                className="travel-point fill-[#D4AF37]"
                r={isMobile ? '6' : '7.5'}
                cx={isMobile ? 190 : 550}
                cy={isMobile ? 65 : 270}
                filter="url(#gold-flow-glow)"
              />
              <circle
                className="travel-sparkle fill-[#2D6A4F]"
                r={isMobile ? '4' : '5'}
                cx={isMobile ? 190 : 550}
                cy={isMobile ? 65 : 270}
                filter="url(#emerald-glow)"
              />
            </g>
          ))}

          {/* 4. Large Bold Central Logo Trunk / Core (Diameter: 124px) */}
          <g className="central-logo-group pointer-events-auto">
            {/* Outer Ripple Ring 3 */}
            <circle
              cx={isMobile ? 190 : 550}
              cy={isMobile ? 65 : 270}
              r={isMobile ? 58 : 126}
              className="ripple-ring stroke-[#D4AF37]/35 fill-none"
              strokeWidth="2"
              strokeDasharray="8 8"
            />

            {/* Middle Ripple Ring 2 */}
            <circle
              cx={isMobile ? 190 : 550}
              cy={isMobile ? 65 : 270}
              r={isMobile ? 46 : 100}
              className="ripple-ring stroke-[#2D6A4F]/40 fill-[#2D6A4F]/5"
              strokeWidth="2.5"
            />

            {/* Inner Shield Ring 1 */}
            <circle
              cx={isMobile ? 190 : 550}
              cy={isMobile ? 65 : 270}
              r={isMobile ? 36 : 78}
              className="ripple-ring stroke-[#5C3A21]/45 fill-[#FAF7F2]"
              strokeWidth="3"
            />

            {/* Solid Center Shield */}
            <circle
              cx={isMobile ? 190 : 550}
              cy={isMobile ? 65 : 270}
              r={isMobile ? 32 : 64}
              className="fill-white stroke-[#5C3A21] shadow-xl"
              strokeWidth="3.5"
            />

            {/* Official Manithaneyam Seal Emblem */}
            <foreignObject
              x={isMobile ? 190 - 32 : 550 - 64}
              y={isMobile ? 65 - 32 : 270 - 64}
              width={isMobile ? 64 : 128}
              height={isMobile ? 64 : 128}
              className="pointer-events-none"
            >
              <div className="w-full h-full flex items-center justify-center p-0.5">
                <img
                  src="/tree-logo.png"
                  alt="Manithaneyam Official Seal"
                  className="w-full h-full object-contain filter drop-shadow-md rounded-full"
                />
              </div>
            </foreignObject>
          </g>

          {/* 5. Big, Highly Visible Service Cards with Clear Hierarchy and Zero Truncation */}
          {currentNodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;

            return (
              <g key={`service-card-${node.id}`} className="service-card-wrapper">
                <foreignObject
                  x={node.cardX}
                  y={node.cardY}
                  width={node.cardW}
                  height={node.cardH}
                  className="overflow-visible pointer-events-auto"
                >
                  <div
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={handleSkip}
                    className={`w-full h-full px-3 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border transition-all duration-300 flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none ${
                      isHovered
                        ? 'border-[#2D6A4F] shadow-2xl ring-2 ring-[#2D6A4F]/30 -translate-y-1.5 bg-white'
                        : 'border-[#E7DFD5] shadow-md hover:shadow-xl hover:border-[#2D6A4F]/70'
                    }`}
                  >
                    {/* Big Icon Pill with Forest Green & Gold Glow */}
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isHovered
                          ? 'bg-[#1B4332] text-white shadow-lg scale-105'
                          : 'bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20'
                      }`}
                    >
                      {getIcon(node.iconName, isHovered)}
                    </div>

                    {/* Rich Typographic Hierarchy - Full Uncut Text */}
                    <div className="flex-1 min-w-0 pr-0.5">
                      {/* Micro Badge / Category Tag */}
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#1E3A8A] font-english">
                          {isTamil ? node.categoryTa : node.categoryEn}
                        </span>
                      </div>

                      {/* Main Service Title - Clear, Bold, NO TRUNCATION */}
                      <h4 className="text-xs sm:text-[13px] md:text-[14px] font-black text-[#3B2314] leading-snug line-clamp-1 font-tamil">
                        {isTamil ? node.shortTa : node.shortEn}
                      </h4>

                      {/* Location with Pin */}
                      <p className="text-[10px] sm:text-[11px] font-bold text-[#7A6E63] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#2D6A4F] shrink-0" />
                        <span>{isTamil ? node.locationTa : node.locationEn}</span>
                      </p>
                    </div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
