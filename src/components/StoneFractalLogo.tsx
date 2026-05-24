import React from 'react';
// @ts-ignore
import opalaLogo from '../assets/images/opala_negra_final_logo_1779119323115.png';

interface StoneFractalLogoProps {
  className?: string;
  darkMode?: boolean;
}

export function StoneFractalLogo({ className = "w-6 h-6", darkMode = false }: StoneFractalLogoProps) {
  return (
    <img
      src={opalaLogo}
      alt="Opala Negra Logo"
      className={`${className} object-contain transition-all duration-300`}
      referrerPolicy="no-referrer"
    />
  );
}
