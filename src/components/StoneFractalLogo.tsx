import React from 'react';

interface StoneFractalLogoProps {
  className?: string;
  darkMode?: boolean;
}

export function StoneFractalLogo({ className = "w-6 h-6", darkMode = false }: StoneFractalLogoProps) {
  // Palette definition based on active theme-mode:
  // Light Mode: Indigo Profundo (#4B0082), Violeta Intenso (#8A2BE2), Lavanda (#DA70D6), Branco nítido (#F5F5F5)
  // Dark Mode: Azul-Celeste (#00BFFF), Carmesim (#D63031), Cinza Suave (#A0A0A0), Preto Profundo (#1C1C1C)
  const colors = darkMode ? {
    f1: "#00BFFF", // Azul-celeste
    f2: "#D63031", // Carmesim
    f3: "#A0A0A0", // Cinza suave
    f4: "#1C1C1C", // Preto profundo
    f5: "#FFFFFF", // Bright shine highlight
    f6: "#B51B2A", // Rich crimson facet
    line: "rgba(0, 191, 255, 0.4)" // Azul-celeste line outline
  } : {
    f1: "#4B0082", // Índigo profundo
    f2: "#8A2BE2", // Violeta intenso
    f3: "#DA70D6", // Lavanda suave
    f4: "#5C00A3", // Indigo-violet secondary
    f5: "#FFFFFF", // Pure white facet highlight
    f6: "#AA40B5", // Warm purple/lavender facet
    line: "rgba(75, 0, 130, 0.35)" // Índigo profundo line outline
  };

  // Coordinates mapping for an elegant oval brilliant cut
  // Outer Ring Vertices (P0 to P11)
  const P0 = "50,5";
  const P1 = "68,11";
  const P2 = "81,27.5";
  const P3 = "86,50";
  const P4 = "81,72.5";
  const P5 = "68,89";
  const P6 = "50,95";
  const P7 = "32,89";
  const P8 = "19,72.5";
  const P9 = "14,50";
  const P10 = "19,27.5";
  const P11 = "32,11";

  // Inner Ring Vertices (I0 to I7)
  const I0 = "50,24";
  const I1 = "65,33";
  const I2 = "70,50";
  const I3 = "65,67";
  const I4 = "50,76";
  const I5 = "35,67";
  const I6 = "30,50";
  const I7 = "35,33";

  // Core Split Vertices
  const C1 = "50,42";
  const C2 = "50,58";

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${className} overflow-visible`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* --- CROWN SECTOR POLYGONS --- */}
      {/* Upper-right Sector */}
      <polygon points={`${P0} ${P1} ${I0}`} fill={colors.f1} opacity="0.85" />
      <polygon points={`${P1} ${I1} ${I0}`} fill={colors.f3} opacity="0.95" />
      <polygon points={`${P1} ${P2} ${I1}`} fill={colors.f2} opacity="0.9" />
      <polygon points={`${P2} ${I2} ${I1}`} fill={colors.f6} opacity="0.85" />
      
      {/* Mid-right Sector */}
      <polygon points={`${P2} ${P3} ${I2}`} fill={colors.f1} opacity="0.9" />
      <polygon points={`${P3} ${P4} ${I2}`} fill={colors.f4} opacity="0.95" />
      <polygon points={`${P4} ${I3} ${I2}`} fill={colors.f5} opacity="1" />
      
      {/* Lower-right Sector */}
      <polygon points={`${P4} ${P5} ${I3}`} fill={colors.f1} opacity="0.85" />
      <polygon points={`${P5} ${I4} ${I3}`} fill={colors.f6} opacity="0.9" />
      <polygon points={`${P5} ${P6} ${I4}`} fill={colors.f2} opacity="0.9" />
      
      {/* Lower-left Sector */}
      <polygon points={`${P6} ${P7} ${I4}`} fill={colors.f3} opacity="0.95" />
      <polygon points={`${P7} ${I5} ${I4}`} fill={colors.f1} opacity="0.9" />
      <polygon points={`${P7} ${P8} ${I5}`} fill={colors.f2} opacity="0.85" />
      
      {/* Mid-left Sector */}
      <polygon points={`${P8} ${I6} ${I5}`} fill={colors.f4} opacity="0.9" />
      <polygon points={`${P8} ${P9} ${I6}`} fill={colors.f3} opacity="0.85" />
      <polygon points={`${P9} ${P10} ${I6}`} fill={colors.f2} opacity="0.9" />
      
      {/* Upper-left Sector */}
      <polygon points={`${P10} ${I7} ${I6}`} fill={colors.f5} opacity="1" />
      <polygon points={`${P10} ${P11} ${I7}`} fill={colors.f4} opacity="0.9" />
      <polygon points={`${P11} ${I0} ${I7}`} fill={colors.f6} opacity="0.85" />
      <polygon points={`${P11} ${P0} ${I0}`} fill={colors.f2} opacity="0.95" />

      {/* --- CORE TABLE POLYGONS --- */}
      <polygon points={`${I0} ${I7} ${I6} ${C1}`} fill={colors.f1} opacity="0.9" />
      <polygon points={`${I0} ${C1} ${I2} ${I1}`} fill={colors.f2} opacity="0.95" />
      <polygon points={`${I6} ${C1} ${C2}`} fill={colors.f5} opacity="0.9" />
      <polygon points={`${I2} ${C2} ${C1}`} fill={colors.f6} opacity="0.85" />
      <polygon points={`${I6} ${I5} ${I4} ${C2}`} fill={colors.f4} opacity="0.9" />
      <polygon points={`${C2} ${I4} ${I3} ${I2}`} fill={colors.f3} opacity="0.95" />

      {/* --- LAPIDATION CUT LINE OUTLINES --- */}
      {/* Outer Faceted Girdle Outline */}
      <polygon 
        points={`${P0} ${P1} ${P2} ${P3} ${P4} ${P5} ${P6} ${P7} ${P8} ${P9} ${P10} ${P11}`} 
        stroke={colors.line} 
        strokeWidth="2.2" 
        strokeLinejoin="round" 
        fill="none" 
      />
      
      {/* Inner Star/Table Ring Outline */}
      <polygon 
        points={`${I0} ${I1} ${I2} ${I3} ${I4} ${I5} ${I6} ${I7}`} 
        stroke={colors.line} 
        strokeWidth="1.8" 
        strokeLinejoin="round" 
        fill="none" 
      />

      {/* Radiant Facet Connector Lines */}
      <line x1="50" y1="5" x2="50" y2="24" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="68" y1="11" x2="65" y2="33" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="81" y1="27.5" x2="65" y2="33" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="81" y1="27.5" x2="70" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="86" y1="50" x2="70" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="81" y1="72.5" x2="70" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="81" y1="72.5" x2="65" y2="67" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="68" y1="89" x2="65" y2="67" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="95" x2="50" y2="76" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="32" y1="89" x2="35" y2="67" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="19" y1="72.5" x2="35" y2="67" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="19" y1="72.5" x2="30" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="14" y1="50" x2="30" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="19" y1="27.5" x2="30" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="19" y1="27.5" x2="35" y2="33" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="32" y1="11" x2="35" y2="33" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />

      {/* Internal Table Star Lines */}
      <line x1="50" y1="24" x2="65" y2="33" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="24" x2="50" y2="42" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="42" x2="30" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="42" x2="70" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="42" x2="50" y2="58" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="58" x2="30" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="58" x2="70" y2="50" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="58" x2="50" y2="76" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="76" x2="35" y2="67" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="50" y1="76" x2="65" y2="67" stroke={colors.line} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
