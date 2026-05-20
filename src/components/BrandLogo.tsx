import { motion } from 'motion/react';

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-brand-secondary blur-3xl opacity-30 rounded-full animate-pulse" />
        <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-brand-primary/40 border border-brand-primary/10">
          <img 
            src="/src/assets/images/opala_negra_final_logo_1779119323115.png" 
            alt="Opala Negra Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
    </div>
  );
}
