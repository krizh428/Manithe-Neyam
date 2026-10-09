import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Stethoscope,
  BookOpen,
  Accessibility,
  Monitor,
  Utensils,
  Scissors,
  House,
  Users,
  X,
  type LucideProps,
} from 'lucide-react';
import { gsap, EASING, prefersReducedMotion } from '../../animations';
import { useLanguage } from '../../context/LanguageContext';
import { ORGANIZATIONS_DATA, type OrganizationBranch } from '../../data/organizationsData';
import { CharacterGlitchText } from './CharacterGlitchText';

interface OrganizationTreeIntroProps {
  isOpen: boolean;
  isReplay?: boolean;
  onComplete: () => void;
}

// ---------------------------------------------------------------------------
// Custom line icons (lucide has no shield-heart or elderly-with-cane glyph)
// ---------------------------------------------------------------------------
const ShieldHeartIcon: React.FC<LucideProps> = ({ style, className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="M9.6 10.2a1.7 1.7 0 0 1 2.4 0 1.7 1.7 0 0 1 2.4 0 1.8 1.8 0 0 1 0 2.5L12 15l-2.4-2.3a1.8 1.8 0 0 1 0-2.5z" />
  </svg>
);

const ElderIcon: React.FC<LucideProps> = ({ style, className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style} className={className}>
    <circle cx="10" cy="4" r="2" />
    <path d="M10.5 8 9 15l-2 6" />
    <path d="M9 15l3 2 1 4" />
    <path d="M10.5 8 8 10.5 7 14" />
    <path d="M10.5 9.5l2.5 2.5 2.5-.5" />
    <path d="M16 12v9" />
    <path d="M16 12c0-1.4 2-1.4 2 0" />
  </svg>
);

// Per-service visuals matching the design (icon + short tagline)
const SERVICE_META: Record<
  string,
  { Icon: React.FC<LucideProps>; taglineEn: string; taglineTa: string }
> = {
  clinic: { Icon: Stethoscope, taglineEn: 'Quality Healthcare for All', taglineTa: 'அனைவருக்கும் தரமான மருத்துவம்' },
  adoption: { Icon: ShieldHeartIcon, taglineEn: 'Kindness Grows – Families Care', taglineTa: 'அன்பு வளரும் – குடும்பம் காக்கும்' },
  school: { Icon: BookOpen, taglineEn: 'Knowledge for a Brighter Tomorrow', taglineTa: 'ஒளிமயமான நாளைக்கான கல்வி' },
  rstc: { Icon: Accessibility, taglineEn: 'Skills for an Independent Life', taglineTa: 'சுயசார்பு வாழ்க்கைக்கான திறன்கள்' },
  computer: { Icon: Monitor, taglineEn: 'Digital Skills – Better Opportunities', taglineTa: 'டிஜிட்டல் திறன் – சிறந்த வாய்ப்புகள்' },
  food: { Icon: Utensils, taglineEn: 'Nutritious Meals for All', taglineTa: 'அனைவருக்கும் சத்தான உணவு' },
  sewing: { Icon: Scissors, taglineEn: 'Skilled Hands – Brighter Futures', taglineTa: 'திறமையான கைகள் – ஒளிமயமான எதிர்காலம்' },
  'old-age': { Icon: ElderIcon, taglineEn: 'Respect – Care – Comfort', taglineTa: 'மரியாதை – அக்கறை – ஆறுதல்' },
  'children-theni': { Icon: House, taglineEn: 'A Home – A Safe Life', taglineTa: 'ஒரு இல்லம் – பாதுகாப்பான வாழ்க்கை' },
  'children-kodangipatti': { Icon: Users, taglineEn: 'Kids Support – Brighter Future', taglineTa: 'குழந்தைகள் நலன் – ஒளிமயமான எதிர்காலம்' },
};

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------
type Pt = { x: number; y: number };
type Cubic = [Pt, Pt, Pt, Pt];
type Side = 'top' | 'bottom' | 'left' | 'right';

const bezierPoint = ([p0, p1, p2, p3]: Cubic, t: number): Pt => {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const b = 3 * mt * mt * t;
  const c = 3 * mt * t * t;
  const d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
};

const bezierTangent = ([p0, p1, p2, p3]: Cubic, t: number): Pt => {
  const mt = 1 - t;
  const x = 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const y = 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  const len = Math.hypot(x, y) || 1;
  return { x: x / len, y: y / len };
};

const cubicPath = ([p0, p1, p2, p3]: Cubic) =>
  `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

// Organic S-curve between two points
const sCurve = (from: Pt, to: Pt, bend: number): Cubic => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  return [
    from,
    { x: from.x + dx * 0.35 + nx * bend, y: from.y + dy * 0.35 + ny * bend },
    { x: from.x + dx * 0.7 - nx * bend * 0.6, y: from.y + dy * 0.7 - ny * bend * 0.6 },
    to,
  ];
};

// Filled outline of a vine that tapers from wStart to wEnd
const taperedOutline = (curve: Cubic, wStart: number, wEnd: number) => {
  const N = 40;
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = bezierPoint(curve, t);
    const tan = bezierTangent(curve, t);
    const hw = (wStart + (wEnd - wStart) * t) / 2;
    left.push(`${(p.x - tan.y * hw).toFixed(1)} ${(p.y + tan.x * hw).toFixed(1)}`);
    right.push(`${(p.x + tan.y * hw).toFixed(1)} ${(p.y - tan.x * hw).toFixed(1)}`);
  }
  return `M ${left.join(' L ')} L ${right.reverse().join(' L ')} Z`;
};

interface Leaf {
  t: number;
  x: number;
  y: number;
  rot: number;
  scale: number;
  tone: 0 | 1;
}

const leavesAlong = (
  curve: Cubic,
  count: number,
  wStart: number,
  wEnd: number,
  scale: number,
  tFrom = 0.18,
  tTo = 0.86
): Leaf[] =>
  Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? (tFrom + tTo) / 2 : tFrom + ((tTo - tFrom) * i) / (count - 1);
    const side = i % 2 === 0 ? 1 : -1;
    const p = bezierPoint(curve, t);
    const tan = bezierTangent(curve, t);
    const hw = ((wStart + (wEnd - wStart) * t) / 2) * 0.5;
    const angle = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
    return {
      t,
      x: p.x - tan.y * hw * side,
      y: p.y + tan.x * hw * side,
      rot: angle + side * 52,
      scale: scale * (1 - t * 0.25),
      tone: (i % 2) as 0 | 1,
    };
  });

interface VineNode {
  data: OrganizationBranch;
  curve: Cubic;
  outline: string;
  leaves: Leaf[];
  dot: Pt;
  card: { x: number; y: number; w: number; h: number };
  delay: number;
}

interface Layout {
  W: number;
  H: number;
  logo: { cx: number; cy: number; r: number };
  dotR: number;
  trunk: { curve: Cubic; outline: string; leaves: Leaf[] } | null;
  nodes: VineNode[];
}

const byId = (id: string) => ORGANIZATIONS_DATA.find((o) => o.id === id)!;

// Clockwise from 12 o'clock, exactly as in the design
const DESKTOP_SPEC: Array<{ id: string; side: Side; dot: Pt; bend: number }> = [
  { id: 'clinic', side: 'top', dot: { x: 500, y: 84 }, bend: 12 },
  { id: 'adoption', side: 'right', dot: { x: 690, y: 78 }, bend: -22 },
  { id: 'school', side: 'right', dot: { x: 746, y: 176 }, bend: -18 },
  { id: 'rstc', side: 'right', dot: { x: 746, y: 274 }, bend: 20 },
  { id: 'computer', side: 'right', dot: { x: 676, y: 372 }, bend: 26 },
  { id: 'food', side: 'bottom', dot: { x: 500, y: 372 }, bend: -12 },
  { id: 'sewing', side: 'left', dot: { x: 324, y: 372 }, bend: -26 },
  { id: 'old-age', side: 'left', dot: { x: 254, y: 274 }, bend: -20 },
  { id: 'children-theni', side: 'left', dot: { x: 254, y: 176 }, bend: 18 },
  { id: 'children-kodangipatti', side: 'left', dot: { x: 310, y: 78 }, bend: 22 },
];

const buildDesktopLayout = (): Layout => {
  const W = 1000;
  const H = 450;
  const logo = { cx: 500, cy: 212, r: 54 };
  const gap = 7;

  const nodes = DESKTOP_SPEC.map(({ id, side, dot, bend }, i): VineNode => {
    const dx = dot.x - logo.cx;
    const dy = dot.y - logo.cy;
    const len = Math.hypot(dx, dy);
    const start = { x: logo.cx + (dx / len) * (logo.r - 6), y: logo.cy + (dy / len) * (logo.r - 6) };
    const curve = sCurve(start, dot, bend);
    const leafCount = Math.min(6, Math.max(2, Math.round(len / 42)));

    const vertical = side === 'top' || side === 'bottom';
    const w = vertical ? 232 : 240;
    const h = 68;
    const card =
      side === 'left'
        ? { x: dot.x - gap - w, y: dot.y - h / 2, w, h }
        : side === 'right'
          ? { x: dot.x + gap, y: dot.y - h / 2, w, h }
          : side === 'top'
            ? { x: dot.x - w / 2, y: dot.y - gap - h, w, h }
            : { x: dot.x - w / 2, y: dot.y + gap, w, h };

    return {
      data: byId(id),
      curve,
      outline: taperedOutline(curve, 8, 3),
      leaves: leavesAlong(curve, leafCount, 8, 3, 1),
      dot,
      card,
      delay: i * 0.15,
    };
  });

  return { W, H, logo, dotR: 6, trunk: null, nodes };
};

const buildMobileLayout = (): Layout => {
  const W = 400;
  const H = 990;
  const logo = { cx: 200, cy: 70, r: 46 };
  // Control points equally spaced in y, so y(t) is linear: y = 110 + 850t
  const trunkCurve: Cubic = [
    { x: 200, y: 110 },
    { x: 210, y: 393 },
    { x: 190, y: 677 },
    { x: 200, y: 960 },
  ];
  const trunkDuration = 1.6;
  const cardW = 158;
  const cardH = 72;

  const nodes = DESKTOP_SPEC.map(({ id }, i): VineNode => {
    const cy = 186 + i * 84;
    const isLeft = i % 2 === 0;
    const startY = cy - 40;
    const tTrunk = (startY - 110) / 850;
    const start = { x: bezierPoint(trunkCurve, tTrunk).x, y: startY };
    const dot = { x: isLeft ? 168 : 232, y: cy };
    const curve = sCurve(start, dot, isLeft ? -8 : 8);
    return {
      data: byId(id),
      curve,
      outline: taperedOutline(curve, 5, 2.4),
      leaves: leavesAlong(curve, 1, 5, 2.4, 0.8),
      dot,
      card: { x: isLeft ? dot.x - 6 - cardW : dot.x + 6, y: cy - cardH / 2, w: cardW, h: cardH },
      delay: tTrunk * trunkDuration,
    };
  });

  return {
    W,
    H,
    logo,
    dotR: 4.5,
    trunk: {
      curve: trunkCurve,
      outline: taperedOutline(trunkCurve, 9, 5),
      leaves: leavesAlong(trunkCurve, 12, 9, 5, 0.95, 0.06, 0.94),
    },
    nodes,
  };
};

const LEAF_PATH = 'M0 0 L3 0 C7 -7 17 -8 24 0 C17 8 7 7 3 0 Z';
const LEAF_RIB = 'M3 0 L20 0';
const LEAF_FILLS = ['#5DAA35', '#79C24A'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export const OrganizationTreeIntro: React.FC<OrganizationTreeIntroProps> = ({
  isOpen,
  isReplay: _isReplay = false,
  onComplete,
}) => {
  const { isTamil } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleGroupRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const layout = useMemo(() => (isMobile ? buildMobileLayout() : buildDesktopLayout()), [isMobile]);
  const { W, H, logo, dotR, trunk, nodes } = layout;

  // Stage units -> container-query width units, so cards scale with the tree
  const u = (n: number) => `${((n * 100) / W).toFixed(3)}cqw`;
  const pctX = (n: number) => `${(n * 100) / W}%`;
  const pctY = (n: number) => `${(n * 100) / H}%`;

  // Master GSAP timeline
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
      const q = <T extends Element>(sel: string) => container.querySelectorAll<T>(sel);
      const logoEl = container.querySelector('.org-logo');
      const halo = q('.org-logo-halo');
      const allLeaves = q('.org-leaf');
      const allDots = q('.org-dot');
      const allCards = q('.org-card');
      const glows = q('.org-glow');

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // 1. Initial states
      gsap.set(container, { opacity: 0 });
      if (titleGroupRef.current) gsap.set(titleGroupRef.current, { opacity: 0, y: -14 });
      if (logoEl) gsap.set(logoEl, { scale: 0.4, opacity: 0, rotation: -25 });
      gsap.set(halo, { scale: 0.5, opacity: 0, transformOrigin: '50% 50%' });
      gsap.set(q('.org-reveal'), { strokeDasharray: '1 2', strokeDashoffset: 1 });
      gsap.set(allLeaves, { scale: 0, opacity: 0, transformOrigin: '0% 50%' });
      gsap.set(allDots, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(glows, { opacity: 0 });
      gsap.set(allCards, { opacity: 0, scale: 0.82, y: 8 });

      // 2. Backdrop, title, logo blossom
      tl.to(container, { opacity: 1, duration: 0.35, ease: 'power1.out' })
        .to(logoEl, { scale: 1, opacity: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)' }, 0.15)
        .to(halo, { scale: 1, opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.3);
      if (titleGroupRef.current) {
        tl.to(titleGroupRef.current, { opacity: 1, y: 0, duration: 0.6, ease: EASING.smooth }, 0.35);
      }

      // Grows a vine: reveal mask, light pulse travelling along it, leaves sprout as it passes
      const growVine = (key: string, at: number, duration: number) => {
        const reveal = container.querySelector<SVGPathElement>(`.org-reveal-${key}`);
        const glow = container.querySelector<SVGCircleElement>(`.org-glow-${key}`);
        if (!reveal) return;

        tl.to(reveal, { strokeDashoffset: 0, duration, ease: 'power1.inOut' }, at);

        if (glow) {
          const total = reveal.getTotalLength();
          const proxy = { p: 0 };
          tl.set(glow, { opacity: 1 }, at)
            .to(
              proxy,
              {
                p: 1,
                duration,
                ease: 'power1.inOut',
                onUpdate: () => {
                  const pt = reveal.getPointAtLength(proxy.p * total);
                  glow.setAttribute('cx', pt.x.toFixed(1));
                  glow.setAttribute('cy', pt.y.toFixed(1));
                },
              },
              at
            )
            .to(glow, { opacity: 0, duration: 0.25 }, at + duration - 0.1);
        }

        q<SVGPathElement>(`.org-leaf-${key}`).forEach((leaf) => {
          const t = Number(leaf.dataset.t ?? 0.5);
          tl.to(leaf, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2.4)' }, at + t * duration);
        });
      };

      const vinesStart = 0.95;
      let branchesStart = vinesStart;
      if (trunk) {
        growVine('trunk', vinesStart, 1.6);
        branchesStart = vinesStart + 0.05;
      }

      // 3. Each branch grows, ends in a dot, then its card blooms
      const vineDuration = isMobile ? 0.55 : 1.0;
      nodes.forEach((node, i) => {
        const at = branchesStart + node.delay;
        growVine(String(i), at, vineDuration);
        tl.to(`.org-dot-${i}`, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, at + vineDuration - 0.08);
        tl.to(
          `.org-card-${i}`,
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.5)' },
          at + vineDuration - 0.02
        );
      });

      // 4. Gentle idle life once everything is in place
      tl.call(() => {
        ctx.add(() => {
          gsap.to(halo, { scale: 1.08, opacity: 0.75, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
          gsap.to(allLeaves, {
            rotation: () => gsap.utils.random(-8, 8),
            duration: () => gsap.utils.random(2.2, 3.6),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: { each: 0.05, from: 'random' },
          });
          gsap.to(q('.org-card-glow'), {
            opacity: 1,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: { each: 0.22, from: 'random' },
          });
          gsap.to(q('.org-card-heart'), {
            scale: 1.25,
            transformOrigin: '50% 60%',
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: { each: 0.15, from: 'random' },
          });
          gsap.to(q('.org-dot-ring'), {
            scale: 2.2,
            opacity: 0,
            duration: 1.8,
            ease: 'power1.out',
            transformOrigin: '50% 50%',
            stagger: { each: 0.18, repeat: -1 },
          });
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile]);

  const handleSkip = () => {
    if (timelineRef.current) timelineRef.current.pause();

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
      if (e.key === 'Escape' && isOpen) handleSkip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const renderLeaves = (leaves: Leaf[], key: string, highlighted = false) =>
    leaves.map((leaf, li) => (
      <g key={`leaf-${key}-${li}`} transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.rot.toFixed(1)}) scale(${leaf.scale.toFixed(2)})`}>
        <g className={`org-leaf org-leaf-${key}`} data-t={leaf.t.toFixed(3)}>
          <path d={LEAF_PATH} fill={highlighted ? '#8BD45A' : LEAF_FILLS[leaf.tone]} />
          <path d={LEAF_RIB} stroke="#3F8424" strokeOpacity="0.45" strokeWidth="0.9" strokeLinecap="round" />
        </g>
      </g>
    ));

  const renderVine = (key: string, curve: Cubic, outline: string, revealWidth: number, highlighted = false) => (
    <>
      <mask id={`org-mask-${key}`} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
        <path
          className={`org-reveal org-reveal-${key}`}
          d={cubicPath(curve)}
          pathLength={1}
          stroke="#fff"
          strokeWidth={revealWidth}
          strokeLinecap="round"
          fill="none"
        />
      </mask>
      <g mask={`url(#org-mask-${key})`} filter={highlighted ? 'url(#org-vine-glow)' : undefined}>
        <path d={outline} fill="url(#org-vine-fill)" />
        <path d={cubicPath(curve)} stroke="#A9DC7E" strokeOpacity="0.55" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[120] flex flex-col items-center select-none ${isMobile ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 52%, #FFFFFF 0%, #F6F9F5 45%, #ECF2EA 100%)',
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={handleSkip}
        className="fixed top-4 right-4 sm:top-5 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-md border border-[#DCE7DA] text-[#2E5E3E] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:scale-105 active:scale-95 group"
        aria-label={isTamil ? 'மூடு' : 'Close'}
        title={isTamil ? 'மூடு' : 'Close'}
      >
        <X className="w-4 h-4 sm:w-[18px] sm:h-[18px] stroke-[2.2] transition-transform duration-300 group-hover:rotate-90" />
      </button>

      {/* Heading */}
      <div ref={titleGroupRef} className="text-center z-20 pt-3 sm:pt-4 max-w-4xl px-4 shrink-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight flex justify-center">
          <CharacterGlitchText
            text={isTamil ? 'மனிதநேயம் – எங்கள் சேவைகள்' : 'Manitheneyam – Our Services'}
            isTamil={isTamil}
            useBrushFont={!isTamil}
            showSwoosh={true}
          />
        </h2>
      </div>

      {/* Tree stage */}
      <div className={`w-full flex-1 flex justify-center px-2 sm:px-6 ${isMobile ? 'items-start py-4' : 'items-center min-h-0 pb-4'}`}>
        <div
          className="relative"
          style={{
            aspectRatio: `${W} / ${H}`,
            width: isMobile ? 'min(100%, 440px)' : `min(100%, 1600px, calc((100dvh - 130px) * ${W / H}))`,
            containerType: 'inline-size',
          }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="org-vine-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#3E8E24" />
                <stop offset="100%" stopColor="#5BAA33" />
              </linearGradient>
              <radialGradient id="org-halo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#CDEBBE" stopOpacity="0.95" />
                <stop offset="55%" stopColor="#E3F3DA" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F6F9F5" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="org-dot-fill" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#8DD45E" />
                <stop offset="100%" stopColor="#3B8A22" />
              </radialGradient>
              <filter id="org-vine-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="org-pulse-glow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>

            {/* Soft light behind the logo */}
            <circle className="org-logo-halo" cx={logo.cx} cy={logo.cy} r={logo.r * 2.4} fill="url(#org-halo)" />

            {/* Trunk (mobile) */}
            {trunk && (
              <g>
                {renderVine('trunk', trunk.curve, trunk.outline, 14)}
                {renderLeaves(trunk.leaves, 'trunk')}
              </g>
            )}

            {/* Branch vines + leaves */}
            {nodes.map((node, i) => {
              const hl = hoveredId === node.data.id;
              return (
                <g key={`vine-${node.data.id}`}>
                  {renderVine(String(i), node.curve, node.outline, isMobile ? 9 : 12, hl)}
                  {renderLeaves(node.leaves, String(i), hl)}
                </g>
              );
            })}

            {/* Travelling light pulses */}
            {trunk && <circle className="org-glow org-glow-trunk" cx={trunk.curve[0].x} cy={trunk.curve[0].y} r={dotR * 1.6} fill="#DFFFC4" filter="url(#org-pulse-glow)" />}
            {nodes.map((node, i) => (
              <circle
                key={`glow-${node.data.id}`}
                className={`org-glow org-glow-${i}`}
                cx={node.curve[0].x}
                cy={node.curve[0].y}
                r={dotR * 1.6}
                fill="#DFFFC4"
                filter="url(#org-pulse-glow)"
              />
            ))}

            {/* End dots */}
            {nodes.map((node, i) => (
              <g key={`dot-${node.data.id}`} className={`org-dot org-dot-${i}`}>
                <circle className="org-dot-ring" cx={node.dot.x} cy={node.dot.y} r={dotR} fill="none" stroke="#5BAA33" strokeWidth="1.2" />
                <circle cx={node.dot.x} cy={node.dot.y} r={dotR} fill="url(#org-dot-fill)" stroke="#2F7419" strokeWidth="0.8" />
              </g>
            ))}
          </svg>

          {/* Central logo */}
          <div
            className="org-logo absolute rounded-full bg-white"
            style={{
              left: pctX(logo.cx - logo.r),
              top: pctY(logo.cy - logo.r),
              width: pctX(logo.r * 2),
              height: pctY(logo.r * 2),
              padding: u(3),
              boxShadow: '0 0 0 1px rgba(61,140,36,0.25), 0 10px 30px -6px rgba(30,77,59,0.35)',
            }}
          >
            <img src="/tree-logo.png" alt="Manithaneyam Official Seal" className="w-full h-full object-contain rounded-full" draggable={false} />
          </div>

          {/* Service cards – glowing banner style */}
          {nodes.map((node, i) => {
            const meta = SERVICE_META[node.data.id];
            const Icon = meta?.Icon;
            const title = isTamil ? node.data.shortTa : node.data.shortEn;
            const tagline = meta ? (isTamil ? meta.taglineTa : meta.taglineEn) : isTamil ? node.data.descriptionTa : node.data.descriptionEn;
            const words = title.trim().split(/\s+/);
            const titleLead = words.length > 1 ? words.slice(0, -1).join(' ') : '';
            const titleAccent = words[words.length - 1];
            const m = isMobile;
            // Shrink long titles/taglines to fit the card instead of cutting them off
            const textWidth = node.card.w - (m ? 5 + 6 + 34 + 5 : 7 + 10 + 50 + 8);
            const fit = (text: string, max: number, perChar: number, reserve = 0) =>
              Math.min(max, (textWidth - reserve) / (text.length * perChar));
            const titleSize = m ? (isTamil ? 11 : 13) : fit(title, isTamil ? 12.5 : 16.5, isTamil ? 0.72 : 0.54);
            const taglineSize = m ? (isTamil ? 8.5 : 9.5) : isTamil ? 9 : fit(tagline, 10.5, 0.46, 26);

            return (
              <div
                key={`card-${node.data.id}`}
                className={`org-card org-card-${i} absolute`}
                style={{ left: pctX(node.card.x), top: pctY(node.card.y), width: pctX(node.card.w), height: pctY(node.card.h) }}
              >
                <button
                  type="button"
                  onClick={handleSkip}
                  onMouseEnter={() => setHoveredId(node.data.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(node.data.id)}
                  onBlur={() => setHoveredId(null)}
                  className="group relative w-full h-full flex items-center cursor-pointer transition-transform duration-300 hover:-translate-y-[3px] focus-visible:outline-2 focus-visible:outline-[#F2B705]"
                  style={{
                    borderRadius: u(m ? 18 : 22),
                    padding: `0 ${u(m ? 6 : 10)} 0 ${u(m ? 5 : 7)}`,
                    gap: u(m ? 5 : 8),
                    background: 'linear-gradient(115deg, #FFFDF3 0%, #F6FBEE 55%, #FFF8E4 100%)',
                    border: `${u(1.3)} solid #FFE28F`,
                    boxShadow: `0 0 ${u(7)} ${u(0.5)} rgba(255, 196, 60, 0.45), inset 0 0 ${u(6)} rgba(255, 226, 143, 0.65), 0 ${u(4)} ${u(12)} -${u(5)} rgba(170, 110, 10, 0.3)`,
                  }}
                >
                  {/* Pulsing outer glow */}
                  <span
                    className="org-card-glow absolute pointer-events-none opacity-50 group-hover:!opacity-100 transition-opacity duration-300"
                    style={{
                      inset: `-${u(2)}`,
                      borderRadius: u(m ? 20 : 24),
                      boxShadow: `0 0 ${u(12)} ${u(2)} rgba(255, 200, 50, 0.6)`,
                    }}
                  />

                  {/* Leaf sprig on the left edge */}
                  <svg
                    viewBox="0 0 30 50"
                    className="absolute pointer-events-none"
                    style={{ left: `-${u(m ? 6 : 9)}`, top: '8%', width: u(m ? 11 : 16) }}
                    aria-hidden="true"
                  >
                    <path d="M24 48 C 18 36, 12 22, 10 4" stroke="#4E9F2F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    <path d="M10 6 C 2 10, 0 20, 4 26 C 12 22, 14 12, 10 6 Z" fill="#6DBE45" />
                    <path d="M14 22 C 6 26, 4 36, 8 42 C 16 38, 18 28, 14 22 Z" fill="#58AE36" />
                    <path d="M17 28 C 26 26, 30 34, 28 40 C 20 40, 16 34, 17 28 Z" fill="#7CCB52" />
                  </svg>

                  {/* Leaf + heart at the bottom-right corner */}
                  <svg
                    viewBox="0 0 40 30"
                    className="absolute pointer-events-none"
                    style={{ right: `-${u(m ? 3 : 5)}`, bottom: `-${u(m ? 3 : 4)}`, width: u(m ? 16 : 24) }}
                    aria-hidden="true"
                  >
                    <path d="M2 28 C 14 26, 26 20, 34 6" stroke="#5BAA33" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    <path d="M34 4 C 26 6, 22 14, 24 20 C 32 18, 36 10, 34 4 Z" fill="#6DBE45" />
                    <path
                      className="org-card-heart"
                      d="M16 24 C 10 20, 8 16, 10 13.5 C 12 11, 15 12, 16 14 C 17 12, 20 11, 22 13.5 C 24 16, 22 20, 16 24 Z"
                      fill="#FFC21A"
                    />
                  </svg>

                  {/* Glowing emblem */}
                  <span
                    className="relative shrink-0 rounded-full flex items-center justify-center text-[#127045] transition-transform duration-300 group-hover:scale-105"
                    style={{
                      width: u(m ? 34 : 50),
                      height: u(m ? 34 : 50),
                      background: 'radial-gradient(circle at 50% 38%, #FFFFFF 0%, #FFF7D9 55%, #E6F4DD 100%)',
                      border: `${u(1.5)} solid #FFD45C`,
                      boxShadow: `0 0 ${u(7)} rgba(255, 196, 50, 0.75), inset 0 0 ${u(5)} rgba(255, 214, 102, 0.7)`,
                    }}
                  >
                    {Icon && <Icon style={{ width: u(m ? 18 : 26), height: u(m ? 18 : 26) }} strokeWidth={2.4} />}
                    <svg
                      viewBox="0 0 24 24"
                      className="org-card-heart absolute"
                      style={{ right: `-${u(1)}`, bottom: `-${u(1)}`, width: u(m ? 10 : 14), filter: 'drop-shadow(0 0 2px rgba(255,190,30,0.9))' }}
                      aria-hidden="true"
                    >
                      <path d="M12 21 C 4 15, 2 11, 3.5 7.5 C 5 4, 9.5 4, 12 7.5 C 14.5 4, 19 4, 20.5 7.5 C 22 11, 20 15, 12 21 Z" fill="#FFC21A" stroke="#fff" strokeWidth="1.5" />
                    </svg>
                  </span>

                  {/* Title + tagline */}
                  <span className="relative min-w-0 flex-1 flex flex-col items-center text-center" style={{ gap: u(m ? 1 : 1.5) }}>
                    {!m && (
                      <svg viewBox="0 0 60 16" className="absolute pointer-events-none" style={{ top: `-${u(12)}`, width: u(30) }} aria-hidden="true">
                        <path d="M6 13 C 14 6, 22 5, 26 6" stroke="#F2B705" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        <path d="M54 13 C 46 6, 38 5, 34 6" stroke="#F2B705" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                        <path
                          d="M30 13 C 26 10, 24.5 8, 25.3 6 C 26.1 4, 28.5 4, 30 6 C 31.5 4, 33.9 4, 34.7 6 C 35.5 8, 34 10, 30 13 Z"
                          fill="none"
                          stroke="#F2A30F"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <span
                      className={`block w-full leading-[1.1] ${m ? 'line-clamp-2' : 'truncate'} ${isTamil ? 'font-tamil font-extrabold' : 'font-semibold'}`}
                      style={{
                        fontFamily: isTamil ? undefined : "'Fredoka', 'Baloo 2', system-ui, sans-serif",
                        fontSize: u(titleSize),
                        textShadow: `0 0 ${u(4)} rgba(255, 232, 150, 0.95)`,
                      }}
                    >
                      {titleLead && <span className="text-[#127045]">{titleLead} </span>}
                      <span className="text-[#F09A0C]">{titleAccent}</span>
                    </span>
                    <span className="flex items-center w-full justify-center min-w-0" style={{ gap: u(3) }}>
                      {!m && <span className="shrink-0 rounded-full bg-[#F2B705]" style={{ width: u(9), height: u(1.1) }} />}
                      <span
                        className={`min-w-0 text-[#1B6B44] leading-snug ${m || isTamil ? 'line-clamp-2' : 'truncate'} ${isTamil ? 'font-tamil font-semibold' : ''}`}
                        style={{
                          fontFamily: isTamil ? undefined : "'Kalam', 'Patrick Hand', cursive",
                          fontSize: u(taglineSize),
                        }}
                      >
                        {tagline}
                      </span>
                      {!m && <span className="shrink-0 rounded-full bg-[#F2B705]" style={{ width: u(9), height: u(1.1) }} />}
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
