import React, { memo, useState, useRef } from 'react';
import { ExternalLink, Tag, Sparkles, Crown, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlanTier } from '../types';
import { firebaseDb } from '../services/db';

interface AdSpaceProps {
  variant?: 'banner' | 'card' | 'inline';
  userPlan?: PlanTier;
  userId?: string;
  adId?: string;
}

export const AdSpace = memo(({ variant = 'banner', userPlan, userId, adId = 'premium_gold_ad' }: AdSpaceProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const hoverStartTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const [shared, setShared] = useState(false);

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const shareData = {
      title: 'Opala Negra - Plano Gold',
      text: 'Acesse eventos exclusivos e experiências de elite reservadas para membros Gold no ecossistema Opala Negra.',
      url: window.location.origin + '?tab=premium'
    };

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Erro ao compartilhar:', error);
      }
    }
  };

  if (userPlan === 'gold') return null;

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.5;
      
      const newRipple = {
        id: Date.now() + Math.random(),
        x,
        y,
        size
      };
      setRipples(prev => [...prev, newRipple]);
    }

    let hoverDurationMs: number | undefined = undefined;
    if (hoverStartTimeRef.current) {
      hoverDurationMs = Date.now() - hoverStartTimeRef.current;
    }
    if (userId) {
      firebaseDb.trackAdClick(userId, adId, variant, hoverDurationMs);
    }
    // Simulation of opening the ad link
    console.log(`Ad ${adId} clicked in variant ${variant} (hover duration before click: ${hoverDurationMs}ms)`);
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
    hoverStartTimeRef.current = Date.now();
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    hoverStartTimeRef.current = null;
  };

  return (
    <div 
      className="relative w-full ad-space-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-zinc-950/95 text-white backdrop-blur-md border border-white/10 shadow-2xl p-4 rounded-2xl w-64 text-left pointer-events-none z-50"
          >
            <div className="flex items-center gap-1.5 mb-2 border-b border-white/10 pb-1.5">
              <Sparkles className="w-4 h-4 text-brand-mango animate-pulse text-white fill-current" />
              <span className="text-xs font-black text-white uppercase tracking-wider">Destaques do Plano Gold</span>
            </div>
            <ul className="space-y-1.5 text-[10px] font-semibold text-white/95">
              <li className="flex items-start gap-2">
                <span className="text-brand-mango font-black text-sm leading-none">•</span>
                <span>Conexões e conversas ilimitadas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mango font-black text-sm leading-none">•</span>
                <span>Selo de verificação Gold exclusivo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mango font-black text-sm leading-none">•</span>
                <span>Acesso a eventos e experiências de elite</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-mango font-black text-sm leading-none">•</span>
                <span>Modo Fantasma e navegação invisível</span>
              </li>
            </ul>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[5px] border-x-[6px] border-x-transparent border-t-[6px] border-t-zinc-950/95" />
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        ref={containerRef}
        onClick={handleClick}
        className={`AdSpace relative overflow-hidden rounded-3xl transition-shadow duration-300 cursor-pointer
          ${variant === 'banner' ? 'w-full py-4 px-6 mb-6 border border-brand-mango/20 bg-brand-primary/[0.02]' : ''}
          ${variant === 'card' ? 'w-full py-8 px-8 flex flex-col items-center justify-center text-center bg-linear-to-br from-brand-secondary to-brand-primary border border-white/10 mb-6 text-white' : ''}
          ${variant === 'inline' ? 'w-full py-3 px-4 my-4 border border-brand-mango/20 bg-brand-primary/[0.02]' : ''}
        `}
      >
        {/* Subtle coordinate-based ripple effects */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className={`absolute rounded-full pointer-events-none z-0 ${
                variant === 'card' ? 'bg-white/25' : 'bg-brand-primary/20'
              }`}
              style={{
                left: 0,
                top: 0,
              }}
              initial={{
                width: 0,
                height: 0,
                x: ripple.x,
                y: ripple.y,
                opacity: 0.5,
              }}
              animate={{
                width: ripple.size,
                height: ripple.size,
                x: ripple.x - ripple.size / 2,
                y: ripple.y - ripple.size / 2,
                opacity: 0,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.55,
                ease: "easeOut",
              }}
              onAnimationComplete={() => {
                setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
              }}
            />
          ))}
        </AnimatePresence>
 
        {/* Animated Neon Glowing Border Outer Frame */}
        <motion.div 
          className="absolute inset-0 rounded-[inherit] border border-transparent pointer-events-none z-10"
          style={{ boxSizing: 'border-box' }}
          animate={{
            borderColor: [
              "var(--glow-1)",
              "var(--glow-2)",
              "var(--glow-1)"
            ],
            boxShadow: [
              "var(--glow-shadow-1a)",
              "var(--glow-shadow-2a)",
              "var(--glow-shadow-1a)"
            ]
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut"
          }}
        />
      <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
        <button
          onClick={handleShare}
          className={`p-1.5 rounded-full transition-all flex items-center justify-center hover:scale-110 active:scale-95 cursor-pointer ${
            variant === 'card' 
              ? 'bg-white/20 text-white hover:bg-white/30 border border-white/10' 
              : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 border border-brand-primary/15'
          }`}
          title={shared ? "Link copiado!" : "Compartilhar Plano Gold"}
        >
          {shared ? (
            <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />
          ) : (
            <Share2 className="w-3 h-3" />
          )}
        </button>

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-extrabold text-[8px] tracking-widest uppercase px-2.5 py-1 rounded-full shadow-lg shadow-amber-500/20 border border-amber-300/40 select-none">
          <Crown className="w-2.5 h-2.5 fill-black" strokeWidth={2.5} />
          <span>Plano Gold</span>
        </div>
      </div>
 
      <div className={`flex ${variant === 'card' ? 'flex-col items-center gap-6' : 'flex-row items-center gap-4'}`}>
        <div className={`rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
          variant === 'card' 
          ? 'w-20 h-20 bg-white/20 p-5 shadow-white/10' 
          : 'w-12 h-12 bg-brand-mango/10 p-3'
        }`}>
          <BrandPlaceholder className={variant === 'card' ? 'text-white' : 'text-brand-mango'} />
        </div>
        <div className={`flex-1 ${variant === 'card' ? 'max-w-[200px]' : ''}`}>
          <h4 className={`text-[10px] font-black tracking-widest uppercase mb-1 ${
            variant === 'card' ? 'text-white' : 'text-brand-primary'
          }`}>Luxo & Conexão</h4>
          <p className={`text-[9px] font-bold leading-relaxed ${
            variant === 'card' ? 'text-white/80' : 'text-brand-primary/40'
          }`}>Acesse eventos exclusivos e experiências de elite reservadas para membros Gold no ecossistema Opala Negra.</p>
        </div>
        <button 
          onClick={handleClick}
          className={`h-9 px-6 rounded-xl transition-all flex items-center gap-2 group ${
            variant === 'card' 
              ? 'bg-white text-brand-secondary font-black hover:bg-white/90 shadow-md' 
              : 'bg-brand-mango/10 hover:bg-brand-mango/20 text-brand-mango'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Descobrir</span>
          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {variant === 'card' && (
        <>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-[60px]" />
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/20 rounded-full blur-[60px]" />
        </>
      )}
      </div>
    </div>
  );
});

AdSpace.displayName = 'AdSpace';

function BrandPlaceholder({ className = "text-brand-mango" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`w-full h-full ${className}`} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
