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
  Stethoscope,
  UtensilsCrossed,
  MapPin,
  Leaf,
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

  // Icon Resolver with clean line styling
  const getIcon = (name: OrganizationBranch['iconName'], isHovered: boolean) => {
    const iconClass = `w-5.5 h-5.5 sm:w-6 sm:h-6 transition-transform duration-300 ${
      isHovered ? 'scale-110 text-inherit' : 'text-[#1B4332]'
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
      case 'Stethoscope':
        return <Stethoscope className={iconClass} />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  // FULL SCREEN WIDESCREEN 360° RADIAL TREE GEOMETRY (Canvas: 1520 x 820)
  // Designed so every card is clearly viewable, spacious, and 100% visible with zero truncation
  // Center Core at (760, 410)
  // Large Cards: 260px x 82px
  const DESKTOP_CANVAS = {
    cx: 760,
    cy: 410,
    rx: 540, // Horizontal radius to span full screen width
    ry: 295, // Vertical radius fitted to full screen height
    cardW: 260,
    cardH: 82,
  };

  // Harmonious radial distribution (10 positions at 36° intervals):
  // 0° (Top Center, 12 o'clock): Free Clinic
  // 180° (Bottom Center, 6 o'clock): Free Food
  const RADIAL_SERVICE_ORDER: Array<{ dataIndex: number; deg: number }> = [
    { dataIndex: 2, deg: 0 },    // 0° (Top 12 o'clock): Free Clinic
    { dataIndex: 0, deg: 36 },   // 36°: Specialised Adoption Centre
    { dataIndex: 4, deg: 72 },   // 72°: Dream Nursery & Primary School
    { dataIndex: 3, deg: 108 },  // 108°: Special Training Centre (RSTC)
    { dataIndex: 9, deg: 144 },  // 144°: Computer Training Centre
    { dataIndex: 7, deg: 180 },  // 180° (Bottom 6 o'clock): Free Food
    { dataIndex: 8, deg: 216 },  // 216°: Sewing Training Centre
    { dataIndex: 6, deg: 252 },  // 252°: Old Age Home
    { dataIndex: 5, deg: 288 },  // 288°: Children's Home (Theni)
    { dataIndex: 1, deg: 324 },  // 324°: Children's Home (Kodangipatti)
  ];

  const desktopNodes = RADIAL_SERVICE_ORDER.map(({ dataIndex, deg }, index) => {
    const data = ORGANIZATIONS_DATA[dataIndex];
    const rad = (deg * Math.PI) / 180;
    const { cx, cy, rx, ry, cardW, cardH } = DESKTOP_CANVAS;

    // Card Center & Top-Left Anchor
    const cardCenterX = cx + rx * Math.sin(rad);
    const cardCenterY = cy - ry * Math.cos(rad);
    const cardX = Math.round(cardCenterX - cardW / 2);
    const cardY = Math.round(cardCenterY - cardH / 2);

    // Branch Start (perimeter of central circular shield at r = 68)
    const sx = Math.round(cx + 68 * Math.sin(rad));
    const sy = Math.round(cy - 68 * Math.cos(rad));

    // Branch End (inner perimeter of card at distance)
    const ex = Math.round(cx + (rx - 85) * Math.sin(rad));
    const ey = Math.round(cy - (ry - 48) * Math.cos(rad));

    // Organic curved boughs: control points gently sweep with tangential angle offsets
    const cp1Rad = ((deg + 14) * Math.PI) / 180;
    const cp1x = Math.round(cx + (rx * 0.38) * Math.sin(cp1Rad));
    const cp1y = Math.round(cy - (ry * 0.38) * Math.cos(cp1Rad));

    const cp2Rad = ((deg + 6) * Math.PI) / 180;
    const cp2x = Math.round(cx + (rx * 0.70) * Math.sin(cp2Rad));
    const cp2y = Math.round(cy - (ry * 0.70) * Math.cos(cp2Rad));

    const branchPath = `M ${sx} ${sy} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${ex} ${ey}`;

    // Sprouting Leaves along the curved branch
    const l1Rad = ((deg + 10) * Math.PI) / 180;
    const l1x = Math.round(cx + (rx * 0.44) * Math.sin(l1Rad));
    const l1y = Math.round(cy - (ry * 0.44) * Math.cos(l1Rad));

    const l2Rad = ((deg + 4) * Math.PI) / 180;
    const l2x = Math.round(cx + (rx * 0.74) * Math.sin(l2Rad));
    const l2y = Math.round(cy - (ry * 0.74) * Math.cos(l2Rad));

    return {
      ...data,
      index,
      cardX,
      cardY,
      cardW,
      cardH,
      branchPath,
      leaf1: { x: l1x, y: l1y, rot: deg - 25, scale: 1.15 },
      leaf2: { x: l2x, y: l2y, rot: deg + 30, scale: 1.25 },
    };
  });

  // MOBILE: 420 x 1080 Canvas Coordinates with spacious cards
  const mobileNodes = [
    {
      ...ORGANIZATIONS_DATA[2], // Free Clinic
      index: 0,
      cardX: 10,
      cardY: 110,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 120 C 190 150, 140 150, 107 150',
      leaf1: { x: 165, y: 135, rot: -30, scale: 1 },
      leaf2: { x: 130, y: 145, rot: -15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[0], // Adoption
      index: 1,
      cardX: 216,
      cardY: 195,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 210 C 230 235, 280 235, 313 235',
      leaf1: { x: 255, y: 220, rot: 30, scale: 1 },
      leaf2: { x: 290, y: 230, rot: 15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[4], // School
      index: 2,
      cardX: 10,
      cardY: 280,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 295 C 190 320, 140 320, 107 320',
      leaf1: { x: 165, y: 305, rot: -30, scale: 1 },
      leaf2: { x: 130, y: 315, rot: -15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[3], // RSTC
      index: 3,
      cardX: 216,
      cardY: 365,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 380 C 230 405, 280 405, 313 405',
      leaf1: { x: 255, y: 390, rot: 30, scale: 1 },
      leaf2: { x: 290, y: 400, rot: 15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[9], // Computer
      index: 4,
      cardX: 10,
      cardY: 450,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 465 C 190 490, 140 490, 107 490',
      leaf1: { x: 165, y: 475, rot: -30, scale: 1 },
      leaf2: { x: 130, y: 485, rot: -15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[7], // Free Food
      index: 5,
      cardX: 216,
      cardY: 535,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 550 C 230 575, 280 575, 313 575',
      leaf1: { x: 255, y: 560, rot: 30, scale: 1 },
      leaf2: { x: 290, y: 570, rot: 15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[8], // Sewing
      index: 6,
      cardX: 10,
      cardY: 620,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 635 C 190 660, 140 660, 107 660',
      leaf1: { x: 165, y: 645, rot: -30, scale: 1 },
      leaf2: { x: 130, y: 655, rot: -15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[6], // Old Age
      index: 7,
      cardX: 216,
      cardY: 705,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 720 C 230 745, 280 745, 313 745',
      leaf1: { x: 255, y: 730, rot: 30, scale: 1 },
      leaf2: { x: 290, y: 740, rot: 15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[5], // Theni
      index: 8,
      cardX: 10,
      cardY: 790,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 805 C 190 830, 140 830, 107 830',
      leaf1: { x: 165, y: 815, rot: -30, scale: 1 },
      leaf2: { x: 130, y: 825, rot: -15, scale: 1.05 },
    },
    {
      ...ORGANIZATIONS_DATA[1], // Kodangipatti Children
      index: 9,
      cardX: 216,
      cardY: 875,
      cardW: 194,
      cardH: 80,
      branchPath: 'M 210 890 C 230 915, 280 915, 313 915',
      leaf1: { x: 255, y: 900, rot: 30, scale: 1 },
      leaf2: { x: 290, y: 910, rot: 15, scale: 1.05 },
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
          transformOrigin: isMobile ? '210px 65px' : '760px 410px',
        });
      }

      // Hide ripple rings initially
      gsap.set(rippleRings, {
        scale: 0.7,
        opacity: 0,
        transformOrigin: isMobile ? '210px 65px' : '760px 410px',
      });

      // Prepare branches for stroke animation
      branches.forEach((b) => {
        const len = b.getTotalLength ? b.getTotalLength() : 350;
        gsap.set(b, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.85 });
      });

      // Prepare branch trails
      branchTrails.forEach((bt) => {
        const len = bt.getTotalLength ? bt.getTotalLength() : 350;
        gsap.set(bt, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.6 });
      });

      // Leaves start hidden
      gsap.set(leaves, { scale: 0, opacity: 0, transformOrigin: 'center center' });

      // Service cards start softly shifted with 0 opacity
      gsap.set(serviceCards, { opacity: 0, scale: 0.88 });

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
          opacity: (i) => 0.55 - i * 0.1,
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
        const branchLen = branch.getTotalLength ? branch.getTotalLength() : 350;

        const startTime = (tl.duration() - 0.28) > 0 ? (tl.duration() - 0.28) : 1.0;

        // A. Branch curves smoothly outward like natural boughs
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

        // E. Large Service Card Softly Blooms In
        if (card) {
          tl.to(
            card,
            {
              opacity: 1,
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
          opacity: (i) => 0.65 - i * 0.12,
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
      className="fixed inset-0 z-[120] overflow-hidden flex flex-col items-center justify-between p-1 sm:p-2.5 select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 50%, #FDFBF7 0%, #F6EFE8 55%, #ECE2D4 100%)',
      }}
    >
      {/* Subtle organic ambient backdrop glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[900px] rounded-full bg-gradient-to-tr from-[#1B4332]/6 via-[#D4AF37]/10 to-[#5C3A21]/6 blur-3xl pointer-events-none" />
      </div>

      {/* Top Header Controls: Skip Button */}
      <div className="w-full max-w-7xl flex items-center justify-end z-30 shrink-0 px-2 sm:px-4 pt-0.5">
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#E5DDD2] text-xs sm:text-sm font-black text-[#5C3A21] hover:text-[#1B4332] hover:border-[#1B4332]/60 hover:bg-white transition-all cursor-pointer shadow-xs active:scale-95"
          title={isTamil ? 'அறிமுகத்தை தவிர்க்க' : 'Skip Introduction'}
        >
          <span>{isTamil ? 'தவிர்க்க' : 'Skip'}</span>
          <X className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Top Heading in Rich Warm Brown Color (#5C3A21) */}
      <div ref={titleGroupRef} className="text-center z-20 -mt-1 max-w-4xl px-4 shrink-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#5C3A21] font-tamil tracking-tight leading-tight">
          {isTamil ? 'மனிதநேயம் – எங்கள் சேவைகள்' : 'MANITHANEYA – OUR SERVICES'}
        </h2>
        <p className="text-xs sm:text-sm md:text-base font-bold text-[#7A614D] mt-0.5 font-tamil">
          {isTamil
            ? 'ஒரே அன்பிலிருந்து மலரும் பத்து மனிதநேயக் கிளைகள்'
            : 'From One Shared Love, Ten Flourishing Branches of Humanity'}
        </p>
      </div>

      {/* Main Full-Screen Radial Tree Canvas Area */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden my-auto">
        <svg
          viewBox={isMobile ? '0 0 420 1080' : '0 0 1520 820'}
          className="w-full h-full max-h-[calc(100vh-80px)] max-w-[1720px] pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="gold-flow-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="emerald-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="branchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5C3A21" stopOpacity="0.88" />
              <stop offset="55%" stopColor="#2D6A4F" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#1B4332" stopOpacity="0.92" />
            </linearGradient>

            <linearGradient id="activeBranchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
              <stop offset="60%" stopColor="#2D6A4F" stopOpacity="1" />
              <stop offset="100%" stopColor="#1B4332" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* 1. Organic Tree Canopy Rings / Tree Trunk Roots */}
          {!isMobile && (
            <g className="tree-mandala-background opacity-45">
              {/* Outer Canopy Ring connecting branches */}
              <ellipse
                cx={760}
                cy={410}
                rx={270}
                ry={150}
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeDasharray="6 12"
                strokeOpacity="0.35"
              />
              {/* Ground Anchor Roots extending gently downward */}
              <path
                d="M 750 470 Q 740 540, 715 615"
                stroke="#5C3A21"
                strokeWidth="5"
                strokeLinecap="round"
                strokeOpacity="0.35"
              />
              <path
                d="M 770 470 Q 780 540, 805 615"
                stroke="#5C3A21"
                strokeWidth="5"
                strokeLinecap="round"
                strokeOpacity="0.35"
              />
              <path
                d="M 760 470 L 760 595"
                stroke="#5C3A21"
                strokeWidth="6"
                strokeLinecap="round"
                strokeOpacity="0.35"
              />
            </g>
          )}

          {/* 2. Organic Radial Service Branches for All 10 Services */}
          {currentNodes.map((node) => {
            const isHovered = hoveredNodeId === node.id;
            return (
              <g key={`branch-group-${node.id}`}>
                {/* Secondary Soft Ambient Trail */}
                <path
                  d={node.branchPath}
                  className="tree-branch-trail"
                  stroke={isHovered ? '#D4AF37' : '#1B4332'}
                  strokeWidth={isMobile ? (isHovered ? '7' : '4') : (isHovered ? '8' : '4.8')}
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
                r={isMobile ? '6' : '8'}
                cx={isMobile ? 210 : 760}
                cy={isMobile ? 65 : 410}
                filter="url(#gold-flow-glow)"
              />
              <circle
                className="travel-sparkle fill-[#2D6A4F]"
                r={isMobile ? '4' : '5.5'}
                cx={isMobile ? 210 : 760}
                cy={isMobile ? 65 : 410}
                filter="url(#emerald-glow)"
              />
            </g>
          ))}

          {/* 4. Large Bold Central Logo Root / Core at Exact Center (760, 410) */}
          <g className="central-logo-group pointer-events-auto">
            {/* Outer Ripple Ring 3 */}
            <circle
              cx={isMobile ? 210 : 760}
              cy={isMobile ? 65 : 410}
              r={isMobile ? 60 : 155}
              className="ripple-ring stroke-[#D4AF37]/35 fill-none"
              strokeWidth="2"
              strokeDasharray="8 8"
            />

            {/* Middle Ripple Ring 2 */}
            <circle
              cx={isMobile ? 210 : 760}
              cy={isMobile ? 65 : 410}
              r={isMobile ? 48 : 116}
              className="ripple-ring stroke-[#2D6A4F]/40 fill-[#2D6A4F]/5"
              strokeWidth="2.5"
            />

            {/* Inner Shield Ring 1 */}
            <circle
              cx={isMobile ? 210 : 760}
              cy={isMobile ? 65 : 410}
              r={isMobile ? 38 : 86}
              className="ripple-ring stroke-[#5C3A21]/45 fill-[#FAF7F2]"
              strokeWidth="3"
            />

            {/* Solid Center Shield */}
            <circle
              cx={isMobile ? 210 : 760}
              cy={isMobile ? 65 : 410}
              r={isMobile ? 32 : 68}
              className="fill-white stroke-[#5C3A21] shadow-xl"
              strokeWidth="4"
            />

            {/* Official Manithaneyam Seal Emblem */}
            <foreignObject
              x={isMobile ? 210 - 32 : 760 - 68}
              y={isMobile ? 65 - 32 : 410 - 68}
              width={isMobile ? 64 : 136}
              height={isMobile ? 64 : 136}
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

          {/* 5. 10 Service Cards - Exactly fitted like the Free Clinic reference card */}
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
                    className={`relative w-full h-full px-3 sm:px-3.5 py-2.5 rounded-2xl transition-all duration-300 flex items-center gap-3 cursor-pointer select-none group ${
                      isHovered
                        ? 'bg-white border-[#2D6A4F] shadow-[0_20px_42px_-8px_rgba(27,67,50,0.25)] ring-2 ring-[#2D6A4F]/40 -translate-y-1'
                        : 'bg-white/96 backdrop-blur-md border border-[#E5DDD2] shadow-[0_6px_20px_-3px_rgba(92,58,33,0.08),0_2px_8px_-1px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:border-[#2D6A4F]/70'
                    }`}
                  >
                    {/* Small Decorative Corner Leaf Accent */}
                    <div
                      className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-none ${
                        isHovered
                          ? 'bg-[#1B4332] text-[#F4D35E] scale-110 shadow-sm'
                          : 'bg-[#EBF4EE] text-[#2D6A4F]/80 border border-[#2D6A4F]/20'
                      }`}
                    >
                      <Leaf className="w-2.5 h-2.5" />
                    </div>

                    {/* Icon Pill with Soft Tint & Nature Green Line Icon */}
                    <div
                      className={`w-11 h-11 sm:w-11.5 sm:h-11.5 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isHovered
                          ? 'bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-[#F4D35E] shadow-md shadow-[#1B4332]/30 scale-105'
                          : 'bg-[#EBF3ED] text-[#1B4332] border border-[#1B4332]/15 group-hover:bg-[#1B4332]/12'
                      }`}
                    >
                      {getIcon(node.iconName, isHovered)}
                    </div>

                    {/* Direct Clean Two-Line Service Information - Zero Truncation */}
                    <div className="flex-1 min-w-0 pr-1">
                      {/* Line 1: Service Name in Bold, Large Font */}
                      <h4 className="text-[13px] sm:text-[14px] font-bold text-[#3B2314] leading-snug tracking-tight font-tamil truncate">
                        {isTamil ? node.shortTa : node.shortEn}
                      </h4>

                      {/* Line 2: Supporting Description / Location in Crisp Readable Font */}
                      <p className="text-[10.5px] sm:text-[11.5px] font-medium text-[#7A614D] flex items-center gap-1.5 mt-0.5 font-tamil whitespace-nowrap">
                        <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                        <span className="truncate">{isTamil ? node.descriptionTa : node.descriptionEn}</span>
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
