import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Verified, 
  ShieldCheck,
  Info,
  Heart,
  ChevronLeft
} from 'lucide-react';
import { Gender } from '../types';
import { MapComponent } from './MapComponent';
import { firebaseDb } from '../services/db';
import { auth } from '../services/firebase';

interface ProfileDetailProps {
  profile: {
    id: string;
    name: string;
    age: number;
    role: string;
    location: string;
    bio: string;
    interests?: string[];
    imageUrl: string;
    gender: string;
  };
  onClose: () => void;
  onLike: () => void;
  onPass: () => void;
}

export function ProfileDetail({ profile, onClose, onLike, onPass }: ProfileDetailProps) {
  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (profile.id && userId) {
      firebaseDb.trackProfileView(userId, profile.id);
    }
  }, [profile.id]);

  return (
    <motion.div 
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-brand-surface overflow-y-auto"
    >
      {/* Header / Cover */}
      <div className="relative h-[65vh] w-full">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          src={profile.imageUrl} 
          alt={profile.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-surface via-brand-surface/40 to-transparent"></div>
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-8 left-8 p-4 bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/20 hover:bg-white/40 transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-8 right-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="bg-brand-mango/20 backdrop-blur-md border border-brand-mango/30 text-brand-mango px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-brand-mango rounded-full animate-pulse" />
              Identidade Bio-Validada
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl font-black tracking-tighter text-brand-primary"
          >
            {profile.name}, {profile.age}
          </motion.h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-4 space-y-12 max-w-2xl mx-auto">
        {/* Info Tags */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2.5 bg-white px-5 py-3 rounded-2xl border border-brand-primary/5 text-brand-primary/60 text-[11px] font-black uppercase tracking-widest shadow-sm">
            <Briefcase className="w-4 h-4 text-brand-primary" />
            {profile.role}
          </div>
          <div className="flex items-center gap-2.5 bg-white px-5 py-3 rounded-2xl border border-brand-primary/5 text-brand-primary/60 text-[11px] font-black uppercase tracking-widest shadow-sm">
            <MapPin className="w-4 h-4 text-brand-primary" />
            {profile.location}
          </div>
        </div>

        {/* Bio Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.3em]">Story & Essence</h3>
          <p className="text-xl text-brand-primary font-bold leading-relaxed opacity-80">
            {profile.bio}
          </p>
          {profile.interests && profile.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {profile.interests.map(interest => (
                <span 
                  key={interest}
                  className="px-4 py-2 bg-brand-highlight/50 border border-brand-primary/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-primary/60"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Map Section */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.3em]">Localização Aproximada</h3>
          <MapComponent location={profile.location} className="h-48" />
          <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-wide text-center">
            {profile.location} • Localização exata protegida por privacidade
          </p>
        </section>

        {/* Ethical Badges */}
        <div className="p-8 rounded-[32px] bg-brand-highlight/50 border border-brand-secondary/10 flex items-start gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/10">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-2">Protocolo Ético Opala Negra</p>
            <p className="text-sm font-bold text-brand-primary/60 leading-relaxed">
              Este perfil passou por todas as verificações de identidade e segue nossos protocolos de interação respeitosa de alto nível.
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-center items-center gap-10 py-12 border-t border-brand-primary/5">
          <motion.button 
            whileTap={{ scale: 0.8, rotate: -20 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => { onPass(); onClose(); }}
            className="w-16 h-16 rounded-[24px] bg-white border border-brand-primary/5 flex items-center justify-center text-brand-primary/30 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-xl shadow-brand-primary/5"
          >
            <X className="w-8 h-8" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9, rotate: 15 }}
            onClick={() => { onLike(); onClose(); }}
            className="w-20 h-20 rounded-[32px] bg-brand-mango text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-2xl shadow-brand-mango/20 relative group"
          >
            <motion.div
              initial={false}
              whileTap={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 0.4 }}
            >
              <Heart className="w-10 h-10 fill-current group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            </motion.div>
            
            {/* Sutil radial glow effect on hover */}
            <div className="absolute inset-0 rounded-[32px] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </motion.button>
        </div>

        <div className="text-center pb-20">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary/20 flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            Ecossistema Seguro & Monitorado
          </p>
        </div>
      </div>
    </motion.div>
  );
}
