import React, { useState, useEffect, useRef, useCallback } from 'react';

const GLITCH_GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*()_+-=~<>{}';

export interface CharacterGlitchTextProps {
  text: string;
  isTamil?: boolean;
  className?: string;
  useBrushFont?: boolean;
  showSwoosh?: boolean;
  periodicInterval?: number; // ms between periodic subtle glitch pulses, default 4500
}

export const CharacterGlitchText: React.FC<CharacterGlitchTextProps> = ({
  text,
  isTamil = false,
  className = '',
  useBrushFont = true,
  showSwoosh = true,
  periodicInterval = 4500,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [activeGlitchIndices, setActiveGlitchIndices] = useState<Set<number>>(new Set());
  const animFrameRef = useRef<number | null>(null);
  const isScramblingRef = useRef<boolean>(false);

  // Trigger character-by-character glitch scramble effect
  const triggerCharacterGlitch = useCallback(() => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;
    setIsGlitching(true);

    const originalChars = text.split('');
    const totalChars = originalChars.length;
    let iteration = 0;
    const maxIterations = 18;

    const scramble = () => {
      iteration++;

      // Compute how many characters are resolved
      const progress = iteration / maxIterations;
      const settledCount = Math.floor(progress * totalChars);

      const glitchedIndices = new Set<number>();

      const nextText = originalChars
        .map((char, index) => {
          if (char === ' ' || char === '–' || char === '-') {
            return char;
          }
          if (index < settledCount) {
            return char;
          }
          glitchedIndices.add(index);
          // Pick a random glitch glyph
          return GLITCH_GLYPHS[Math.floor(Math.random() * GLITCH_GLYPHS.length)];
        })
        .join('');

      setActiveGlitchIndices(glitchedIndices);
      setDisplayText(nextText);

      if (iteration < maxIterations) {
        animFrameRef.current = window.setTimeout(scramble, 35);
      } else {
        setDisplayText(text);
        setActiveGlitchIndices(new Set());
        isScramblingRef.current = false;
        // Keep CSS slice glitch for a split second longer then clear
        setTimeout(() => setIsGlitching(false), 200);
      }
    };

    scramble();
  }, [text]);

  // Run initial glitch scramble when text changes
  useEffect(() => {
    setDisplayText(text);
    const initialTimer = setTimeout(() => {
      triggerCharacterGlitch();
    }, 350);

    return () => {
      clearTimeout(initialTimer);
      if (animFrameRef.current) clearTimeout(animFrameRef.current);
    };
  }, [text, triggerCharacterGlitch]);

  // Periodic subtle glitch flicker
  useEffect(() => {
    if (periodicInterval <= 0) return;

    const interval = setInterval(() => {
      // Gentle micro glitch
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 350);
    }, periodicInterval);

    return () => clearInterval(interval);
  }, [periodicInterval]);

  // Font family determination
  // For English: use brush script font from Image 2 ("font-brush")
  // For Tamil: Mukta Malar ("font-tamil")
  const fontClass = isTamil
    ? 'font-tamil font-extrabold'
    : useBrushFont
    ? 'font-brush tracking-wide font-bold italic'
    : 'font-extrabold tracking-tight';

  return (
    <div
      className={`glitch-blue-wrapper group inline-flex flex-col items-center select-none cursor-pointer ${className}`}
      onMouseEnter={triggerCharacterGlitch}
      title="Hover for character glitch animation"
    >
      {/* Glitch Animated Text with Blue Character FX */}
      <span
        data-text={text}
        className={`glitch-blue-text ${isGlitching ? 'is-glitching' : ''} ${fontClass} transition-transform duration-200 group-hover:scale-[1.02]`}
      >
        {displayText.split('').map((char, idx) => {
          const isGlitchedChar = activeGlitchIndices.has(idx);
          return (
            <span
              key={`${idx}-${char}`}
              className={isGlitchedChar ? 'char-glitch-active' : undefined}
            >
              {char}
            </span>
          );
        })}
      </span>

      {/* Elegant Blue Brush Swoosh Underline matching Image 2 */}
      {showSwoosh && (
        <svg
          className="brush-swoop-underline w-[85%] max-w-[320px] sm:max-w-[420px] h-3.5 sm:h-5 text-blue-600 mt-0.5 overflow-visible transition-all duration-300 group-hover:scale-x-105 group-hover:brightness-125"
          viewBox="0 0 320 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 6 14 Q 90 22 170 12 Q 240 4 314 10 Q 240 8 165 17 Q 85 24 6 14 Z"
            fill="url(#blue-brush-grad)"
          />
          <defs>
            <linearGradient id="blue-brush-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#051329" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#0A2246" stopOpacity="1" />
              <stop offset="70%" stopColor="#154378" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.85" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
};
