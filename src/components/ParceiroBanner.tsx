import React, { memo } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface ParceiroBannerProps {
  imageSource?: string;
  linkUrl?: string;
  title: string;
  description?: string;
  highlighted?: boolean;
}

export const ParceiroBanner = memo(function ParceiroBanner({
  imageSource,
  linkUrl = '#',
  title,
  description = 'Parceiro exclusivo selecionado para sua experiência premium.',
  highlighted = false,
}: ParceiroBannerProps) {
  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block w-full relative overflow-hidden rounded-[32px] p-5 border transition-all duration-300 select-none cursor-pointer ${
        highlighted
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-amber-500/40 shadow-[0_12px_30px_-5px_rgba(245,158,11,0.15)] hover:border-amber-500 hover:shadow-[0_16px_40px_-4px_rgba(245,158,11,0.25)]'
          : 'bg-slate-950 border-slate-800 hover:border-amber-500/40 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)]'
      }`}
    >
      {/* Background Decorative Gradient Radial Shine */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,rgba(245,158,11,0.08),transparent_50%)] transition-opacity duration-300 group-hover:opacity-100" />

      {/* Subtle Bottom Gold/Amber Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent scale-x-75 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

      <div className="flex items-center justify-between gap-4 relative z-10 w-full">
        <div className="flex items-center gap-4 min-w-0 flex-grow">
          {/* Partnership Image Segment */}
          {imageSource ? (
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800/80 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300">
              <img
                src={imageSource}
                alt={title}
                className="w-full h-full object-contain filter brightness-110 contrast-105"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
            </div>
          )}

          {/* Texts Segment */}
          <div className="min-w-0 flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500/90 leading-none">
                Parceiro Oficial/Citrino
              </span>
              {highlighted && (
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider select-none pointer-events-none">
                  Destaque
                </div>
              )}
            </div>
            <h3 className="text-sm font-black text-slate-100 truncate group-hover:text-amber-400 transition-colors leading-snug">
              {title}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 leading-normal line-clamp-1 group-hover:text-slate-300 transition-colors">
              {description}
            </p>
          </div>
        </div>

        {/* Call to Action Segment */}
        <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/30 group-hover:bg-amber-500/5 transition-all duration-300 shrink-0 shadow-sm relative">
          <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );
});
