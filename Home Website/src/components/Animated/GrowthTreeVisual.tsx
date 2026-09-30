import React, { useLayoutEffect, useRef } from 'react';
import { Heart, GraduationCap, Users, Utensils, HeartPulse } from 'lucide-react';
import { gsap, animateGrowthTree } from '../../animations';
import { useLanguage } from '../../context/LanguageContext';

export const GrowthTreeVisual: React.FC = () => {
  const { isTamil } = useLanguage();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      animateGrowthTree(containerRef.current!);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const nodes = [
    {
      id: 'children',
      icon: Users,
      titleTa: 'குழந்தைகள் இல்லம்',
      titleEn: 'Children’s Haven',
      cx: 125,
      cy: 165,
      branchPath: 'M 360 265 C 265 240, 175 210, 125 187',
    },
    {
      id: 'education',
      icon: GraduationCap,
      titleTa: 'கல்வி & எதிர்காலம்',
      titleEn: 'Education & Future',
      cx: 260,
      cy: 120,
      branchPath: 'M 375 250 C 335 195, 290 160, 260 142',
    },
    {
      id: 'meals',
      icon: Utensils,
      titleTa: 'சத்தான உணவு',
      titleEn: 'Nutritious Meals',
      cx: 400,
      cy: 100,
      branchPath: 'M 400 242 L 400 122',
    },
    {
      id: 'healthcare',
      icon: HeartPulse,
      titleTa: 'மருத்துவ நலம்',
      titleEn: 'Healthcare & Aid',
      cx: 540,
      cy: 120,
      branchPath: 'M 425 250 C 465 195, 510 160, 540 142',
    },
    {
      id: 'elders',
      icon: Heart,
      titleTa: 'முதியோர் பாதுகாப்பு',
      titleEn: 'Elderly Dignity',
      cx: 675,
      cy: 165,
      branchPath: 'M 440 265 C 535 240, 625 210, 675 187',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-4xl mx-auto py-8 sm:py-10 px-2 sm:px-4 flex flex-col items-center select-none"
    >
      <div className="w-full aspect-[800/350] relative">
        <svg
          viewBox="0 0 800 350"
          className="w-full h-full overflow-visible drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle connecting organic branches */}
          {nodes.map((node) => (
            <path
              key={`branch-${node.id}`}
              d={node.branchPath}
              className="tree-branch stroke-brand-primary"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.45"
            />
          ))}

          {/* Center Logo Trunk Node */}
          <g className="tree-center-node cursor-pointer">
            <circle
              cx="400"
              cy="280"
              r="38"
              className="fill-theme-card stroke-brand-primary"
              strokeWidth="2.5"
            />
            <circle
              cx="400"
              cy="280"
              r="46"
              className="stroke-brand-primary/30"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Center emblem */}
            <foreignObject x="372" y="252" width="56" height="56">
              <div className="w-full h-full flex items-center justify-center pointer-events-none">
                <img
                  src="/logo.png"
                  alt="Manithaneyam Emblem"
                  className="w-11 h-11 object-contain"
                />
              </div>
            </foreignObject>
          </g>

          {/* 5 Symmetrically Aligned Leaf Nodes */}
          {nodes.map((node) => {
            const Icon = node.icon;
            return (
              <g key={`node-${node.id}`} className="tree-leaf-node group cursor-pointer">
                {/* Connecting Dotted Stem between Circle and Pill */}
                <line
                  x1={node.cx}
                  y1={node.cy - 22}
                  x2={node.cx}
                  y2={node.cy - 30}
                  className="stroke-brand-primary/40 group-hover:stroke-brand-primary transition-colors"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />

                {/* Pill Badge sitting cleanly above the circle */}
                <foreignObject
                  x={node.cx - 95}
                  y={node.cy - 68}
                  width="190"
                  height="38"
                  className="overflow-visible pointer-events-auto"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="px-3.5 py-1.5 rounded-full bg-theme-card/95 backdrop-blur-md border border-theme-border shadow-soft group-hover:border-brand-primary group-hover:shadow-card-hover group-hover:-translate-y-0.5 transition-all duration-300">
                      <span className="text-[11px] sm:text-xs font-bold text-card-heading whitespace-nowrap font-tamil block leading-tight">
                        {isTamil ? node.titleTa : node.titleEn}
                      </span>
                    </div>
                  </div>
                </foreignObject>

                {/* Circular Node with Icon */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="22"
                  className="fill-theme-card stroke-brand-primary group-hover:fill-brand-bg group-hover:scale-105 transition-all duration-300"
                  strokeWidth="2.5"
                />

                {/* Icon inside circle */}
                <foreignObject
                  x={node.cx - 14}
                  y={node.cy - 14}
                  width="28"
                  height="28"
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Caption under tree */}
      <p className="text-center text-xs font-semibold text-theme-text/70 mt-3 font-tamil">
        {isTamil
          ? 'ஒரே அடித்தளத்தில் மலரும் ஐந்து மனிதநேய கிளைகள் — அன்பு, கல்வி, உணவு, மருத்துவம், பாதுகாப்பு'
          : 'Five branches of compassion blossoming from one shared root: love, education, nutrition, healthcare, shelter'}
      </p>
    </div>
  );
};
