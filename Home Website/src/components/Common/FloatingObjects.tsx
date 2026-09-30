import React from 'react';

const FloatingObjects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-theme-bg">
      {/* Background Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 23, 42, 0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Large Neon Blue Aura */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-theme-bg/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />

      {/* Large Cyan Aura Bottom */}
      <div className="absolute -bottom-48 -left-24 w-[50rem] h-[50rem] bg-theme-bg/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Floating Cyber Droplets */}
      <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full border border-theme-border/50 bg-theme-bg/10 backdrop-blur-md shadow-glow-cyan animate-bounce" style={{ animationDuration: '6s' }} />
      
      <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full border border-theme-border/50 bg-theme-bg/10 backdrop-blur-xl shadow-glow-ochre animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }} />
    </div>
  );
};

export default FloatingObjects;
