
export const IconTranslate = ({ className = "w-6 h-6" }: { className?: string }) => {
  const idSuffix = Math.random().toString(36).substring(2, 7);
  
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="none"
      className={className}
    >
      <defs>
        {/* Mask for top-left circle: cuts out the 'அ' and the border of bottom-right circle */}
        <mask id={`mask-top-${idSuffix}`}>
          <rect width="24" height="24" fill="white" />
          <circle cx="14.5" cy="14.5" r="7.5" fill="black" />
          <text x="8.5" y="8.5" fontSize="7" textAnchor="middle" dominantBaseline="central" fill="black" fontFamily="sans-serif" fontWeight="bold">அ</text>
        </mask>
        
        {/* Mask for bottom-right circle: cuts out the 'A' */}
        <mask id={`mask-bottom-${idSuffix}`}>
          <rect width="24" height="24" fill="white" />
          <text x="14.5" y="14.5" fontSize="7" textAnchor="middle" dominantBaseline="central" fill="black" fontFamily="sans-serif" fontWeight="bold">A</text>
        </mask>
      </defs>

      {/* Top-left circle */}
      <circle cx="8.5" cy="8.5" r="7" fill="currentColor" mask={`url(#mask-top-${idSuffix})`} />

      {/* Bottom-right circle */}
      <circle cx="14.5" cy="14.5" r="7" fill="currentColor" mask={`url(#mask-bottom-${idSuffix})`} />

      {/* Arrows */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Top-right arrow pointing left */}
        <path d="M 21 9 A 9 9 0 0 0 13 3" />
        <path d="M 16 2 L 13 3 L 13.5 7" />

        {/* Bottom-left arrow pointing right */}
        <path d="M 2 14 A 9 9 0 0 0 10 21" />
        <path d="M 7 22 L 10 21 L 9.5 17" />
      </g>
    </svg>
  );
};
