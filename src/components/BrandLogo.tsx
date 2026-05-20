import { motion } from 'motion/react';
import { Gem } from 'lucide-react';

export function BrandLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-brand-mango blur-3xl opacity-20 rounded-full animate-pulse" />
        <div className="relative w-24 h-24 rounded-[32px] bg-brand-primary flex items-center justify-center shadow-2xl shadow-brand-primary/40 border border-white/10 group overflow-hidden">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 bg-linear-to-br from-brand-primary via-slate-900 to-black opacity-100" />
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1/2 bg-linear-to-tr from-brand-mango/30 to-transparent blur-2xl"
          />
          
          <Gem className="w-12 h-12 text-brand-mango relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
        </div>
      </motion.div>

      {showText && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-4xl font-black text-brand-primary tracking-[-0.05em] uppercase">
            Opala <span className="text-brand-mango">Negra</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-[1px] w-4 bg-brand-mango/30" />
            <p className="text-[10px] font-black text-brand-primary/30 tracking-[0.4em] uppercase">Exclusividade Ética</p>
            <div className="h-[1px] w-4 bg-brand-mango/30" />
          </div>
        </motion.div>
      )}
    </div>
  );
}
