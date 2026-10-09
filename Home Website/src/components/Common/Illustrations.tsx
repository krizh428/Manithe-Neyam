import React, { useId } from 'react';

// Soft gradient illustrations shared by the white-theme sections.
// Each instance gets its own gradient ids so several can render on one page.

interface IllustrationProps {
  className?: string;
}

const useIds = () => {
  const base = useId().replace(/:/g, '');
  return (name: string) => `${base}-${name}`;
};

// Two cupped hands holding a heart, with leaves and light rays
export const HandsHeartIllustration: React.FC<IllustrationProps> = ({ className }) => {
  const id = useIds();
  return (
    <svg viewBox="0 0 320 230" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id('heart')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id={id('hand-l')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id={id('hand-r')} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id={id('leaf-g')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id={id('leaf-b')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* soft cloud backdrop */}
      <ellipse cx="160" cy="200" rx="120" ry="34" fill="#EEF0FF" />
      <ellipse cx="225" cy="150" rx="70" ry="60" fill="#F1F2FF" />
      <ellipse cx="110" cy="170" rx="60" ry="40" fill="#F4F6FF" />

      {/* light rays */}
      <g strokeLinecap="round" strokeWidth="5">
        <line x1="160" y1="14" x2="160" y2="32" stroke="#22C55E" />
        <line x1="122" y1="24" x2="130" y2="40" stroke="#2563EB" />
        <line x1="198" y1="24" x2="190" y2="40" stroke="#22C55E" />
        <line x1="94" y1="48" x2="108" y2="58" stroke="#2563EB" />
        <line x1="226" y1="48" x2="212" y2="58" stroke="#14B8A6" />
      </g>
      <circle cx="80" cy="76" r="3" fill="#FCA5A5" opacity="0.7" />
      <circle cx="246" cy="88" r="3" fill="#FCD34D" opacity="0.8" />

      {/* leaves */}
      <path d="M58 150 C 40 120, 52 92, 70 84 C 78 110, 74 134, 58 150 Z" fill={`url(#${id('leaf-b')})`} opacity="0.85" />
      <path d="M48 196 C 62 176, 92 172, 110 182 C 94 198, 68 204, 48 196 Z" fill={`url(#${id('leaf-g')})`} />
      <path d="M262 112 C 282 92, 300 92, 308 100 C 298 124, 280 132, 262 112 Z" fill={`url(#${id('leaf-g')})`} />
      <path d="M250 196 C 262 168, 288 150, 304 150 C 300 176, 280 194, 250 196 Z" fill={`url(#${id('leaf-b')})`} opacity="0.9" />

      {/* heart */}
      <path
        className="illus-heart"
        d="M160 128 C 126 104, 112 84, 120 66 C 128 48, 152 48, 160 66 C 168 48, 192 48, 200 66 C 208 84, 194 104, 160 128 Z"
        fill={`url(#${id('heart')})`}
      />

      {/* left hand */}
      <path
        d="M76 206 C 70 170, 72 126, 82 100 C 86 90, 98 92, 98 104 L 100 136 C 112 158, 132 168, 150 170 C 158 172, 158 186, 150 192 C 134 204, 110 210, 96 222 Z"
        fill={`url(#${id('hand-l')})`}
      />
      <path d="M100 136 C 104 116, 106 104, 112 98" stroke="#BFDBFE" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

      {/* right hand */}
      <path
        d="M244 206 C 250 170, 248 126, 238 100 C 234 90, 222 92, 222 104 L 220 136 C 208 158, 188 168, 170 170 C 162 172, 162 186, 170 192 C 186 204, 210 210, 224 222 Z"
        fill={`url(#${id('hand-r')})`}
      />
      <path d="M220 136 C 216 116, 214 104, 208 98" stroke="#BBF7D0" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};

// Single open hand holding a heart
export const HandHeartIllustration: React.FC<IllustrationProps> = ({ className }) => {
  const id = useIds();
  return (
    <svg viewBox="0 0 160 130" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id('hand')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id={id('heart')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <linearGradient id={id('leaf-g')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
        <linearGradient id={id('leaf-b')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <ellipse cx="90" cy="110" rx="62" ry="18" fill="#EEF0FF" />
      <path d="M30 92 C 14 74, 16 52, 28 42 C 40 60, 42 78, 30 92 Z" fill={`url(#${id('leaf-g')})`} />
      <path d="M128 60 C 132 36, 146 20, 158 16 C 160 38, 148 56, 128 60 Z" fill={`url(#${id('leaf-b')})`} opacity="0.9" />
      <path d="M118 62 C 120 44, 128 32, 136 28" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
      <path
        className="illus-heart"
        d="M80 64 C 62 52, 54 40, 58 30 C 62 20, 76 20, 80 30 C 84 20, 98 20, 102 30 C 106 40, 98 52, 80 64 Z"
        fill={`url(#${id('heart')})`}
      />
      <path
        d="M40 112 C 52 96, 66 82, 82 78 C 96 74, 114 70, 132 66 C 142 64, 146 74, 138 80 C 124 92, 104 106, 82 114 C 70 118, 56 120, 40 112 Z"
        fill={`url(#${id('hand')})`}
      />
      <path d="M70 92 C 84 90, 98 86, 112 80" stroke="#BFDBFE" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
};

// Handwritten note with a small outlined heart, e.g. "Together for a Brighter Future ♡"
export const ScriptNote: React.FC<{ lines: string[]; className?: string; textClassName?: string }> = ({
  lines,
  className = '',
  textClassName = 'text-[22px] sm:text-[26px]',
}) => (
  <div className={`relative ${className}`}>
    <p
      className={`font-brush leading-[1.15] bg-clip-text text-transparent ${textClassName}`}
      style={{ backgroundImage: 'linear-gradient(120deg, #1D4ED8 0%, #2563EB 45%, #0EA5E9 100%)' }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block" style={{ paddingLeft: `${i * 0.6}em` }}>
          {line}
        </span>
      ))}
    </p>
    <svg viewBox="0 0 70 40" className="absolute -bottom-7 right-2 w-14 h-8" fill="none" aria-hidden="true">
      <path d="M4 34 L16 30" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" />
      <path
        className="illus-heart"
        d="M36 36 C 22 26, 18 16, 22 10 C 26 4, 34 6, 36 13 C 38 6, 46 4, 50 10 C 54 16, 50 26, 36 36 Z"
        stroke="#14B8A6"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path d="M56 32 L66 30" stroke="#22C55E" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  </div>
);
