import { motion } from 'motion/react';
import { StoneFractalLogo } from './StoneFractalLogo';

export function BrandLogo({ className = "", showText = true, darkMode = false }: { className?: string, showText?: boolean, darkMode?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        {darkMode ? (
          /* Transparent background shape for Dark Mode as requested */
          <div className="relative w-24 h-24 flex items-center justify-center group overflow-visible">
            <div className="absolute inset-0 bg-[#D63031] blur-3xl opacity-25 rounded-full animate-pulse pointer-events-none" />
            <StoneFractalLogo className="w-20 h-20 relative z-10 transition-transform duration-300 group-hover:scale-105" darkMode={true} />
          </div>
        ) : (
          /* Transparent background shape for Light Mode as requested: "fundo transparente" */
          <div className="relative w-24 h-24 flex items-center justify-center group overflow-visible">
            <StoneFractalLogo className="w-20 h-20 relative z-10 transition-transform duration-300 group-hover:scale-105" darkMode={false} />
          </div>
        )}
      </motion.div>
 
      {showText && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black tracking-[-0.05em] uppercase transition-all duration-300">
            {darkMode ? (
              <span className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] relative inline-block">
                Opala Negra
                <span className="absolute left-0 bottom-0.5 w-full h-[2.5px] bg-[#D63031] rounded-full opacity-85" />
              </span>
            ) : (
              <>
                <span className="text-[#4B0082]">Opala </span>
                <span className="text-[#8A2BE2] font-extrabold relative inline-block">
                  Negra
                  <span className="absolute left-0 bottom-0.5 w-full h-[3px] bg-[#DA70D6] rounded-full opacity-65" />
                </span>
              </>
            )}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className={`h-[1px] w-4 ${darkMode ? 'bg-brand-secondary/30' : 'bg-[#4B0082]/20'}`} />
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${
              darkMode ? 'text-brand-primary/60' : 'text-[#8A2BE2]/55'
            }`}>
              Exclusividade Ética
            </p>
            <div className={`h-[1px] w-4 ${darkMode ? 'bg-brand-secondary/30' : 'bg-[#4B0082]/20'}`} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

