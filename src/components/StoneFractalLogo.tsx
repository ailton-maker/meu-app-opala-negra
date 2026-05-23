import React from 'react';

interface StoneFractalLogoProps {
  className?: string;
  darkMode?: boolean;
}

export function StoneFractalLogo({ className = "w-6 h-6", darkMode = false }: StoneFractalLogoProps) {
  // Palette definition based on active theme-mode:
  // Light Mode: Rosa escuro (#D81B60), Azul-Petróleo (#0D5C75), Marfim/Ivory (#FFFDF5)
  // Dark Mode: Neon Blue (#00D2FF), Vermelho escuro (#9C1A2C), Deep Black reflections
  const colors = darkMode ? {
    f1: "#00D2FF", // Neon Blue
    f2: "#9C1A2C", // Dark Red
    f3: "#450A11", // Deep Dark Red / Crimson
    f4: "#0083B0", // Deepened Neon Blue facet
    f5: "#FFFFFF", // Clear neon reflection
    f6: "#B3001B", // Strong Crimson/Dark Red facet
    line: "rgba(0, 210, 255, 0.5)" // Neon blue outline
  } : {
    f1: "#D81B60", // Rosa escuro
    f2: "#0D5C75", // Azul-petróleo
    f3: "#F06292", // Lighter Rose facet
    f4: "#094153", // Deeper muted petroleum
    f5: "#FFFDF5", // Marfim / Warm White
    f6: "#D81B60", // Dark Pink facet
    line: "rgba(13, 92, 117, 0.4)" // Petroleum blue outline
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} overflow-visible`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Facet 1: Top Right */}
      <polygon points="50,5 85,30 50,40" fill={colors.f1} opacity="0.85" />
      
      {/* Facet 2: Top Left */}
      <polygon points="50,5 15,30 50,40" fill={colors.f2} opacity="0.9" />
      
      {/* Facet 3: Mid Right */}
      <polygon points="85,30 75,75 65,55" fill={colors.f3} opacity="0.95" />
      
      {/* Facet 4: Bottom Right */}
      <polygon points="75,75 50,95 65,55" fill={colors.f4} opacity="0.85" />
      
      {/* Facet 5: Bottom Left */}
      <polygon points="50,95 25,75 35,55" fill={colors.f1} opacity="0.9" />
      
      {/* Facet 6: Mid Left */}
      <polygon points="15,30 25,75 35,55" fill={colors.f3} opacity="0.8" />
      
      {/* Facet 7: Center Top */}
      <polygon points="50,40 65,55 35,55" fill={colors.f5} opacity="1" />
      
      {/* Facet 8: Center Bottom */}
      <polygon points="35,55 65,55 50,95" fill={colors.f6} opacity="0.75" />

      {/* Crystalline Fractal Edge Outlines */}
      <polygon 
        points="50,5 85,30 75,75 50,95 25,75 15,30" 
        stroke={colors.line} 
        strokeWidth="2.5" 
        strokeLinejoin="round" 
        fill="none" 
      />
      <line x1="50" y1="5" x2="50" y2="40" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="15" y1="30" x2="50" y2="40" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="85" y1="30" x2="50" y2="40" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="50" y1="40" x2="65" y2="55" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="50" y1="40" x2="35" y2="55" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="35" y1="55" x2="65" y2="55" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="35" y1="55" x2="25" y2="75" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="65" y1="55" x2="75" y2="75" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="35" y1="55" x2="50" y2="95" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="65" y1="55" x2="50" y2="95" stroke={colors.line} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
