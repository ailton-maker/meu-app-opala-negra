import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  X, 
  UserRound, 
  Verified, 
  Info,
  Shield,
  MapPin,
  Clock,
  SlidersHorizontal,
  CheckCircle2,
  Ghost
} from 'lucide-react';
import { Gender, UserProfile } from '../types';
import { ProfileDetail } from './ProfileDetail';
import { QuickMessage } from './QuickMessage';
import { firebaseDb } from '../services/db';

const ALL_INTERESTS = [
  'Design', 'Tecnologia', 'IA', 'Psicologia', 'Arquitetura', 
  'Café', 'Minimalismo', 'Sustentabilidade', 'Trilhas', 
  'Yoga', 'Meditação', 'Conexões Reais', 'Música', 'Arte'
];

export function Discovery({ userProfile }: { userProfile: UserProfile | null }) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showQuickMessage, setShowQuickMessage] = useState(false);
  const [explorerCity, setExplorerCity] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [ageRange, setAgeRange] = useState({ min: 18, max: 50 });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Load profiles from Firebase
  useEffect(() => {
    const fetchProfiles = async () => {
      const available = await firebaseDb.getAvailableProfiles(userProfile);
      setProfiles(available);
    };
    fetchProfiles();
  }, [userProfile]);

  const filteredProfiles = useMemo(() => {
    const userGender = userProfile?.gender;
    const targetGender = userGender === 'male' ? 'female' : 'male';
    
    const cityParts = userProfile?.location?.split(',') || [];
    const userCity = cityParts[0]?.trim() || 'São Paulo';
    const cityToFilter = explorerCity || userCity;

    const filtered = profiles.filter(p => {
      const isCorrectGender = p.gender === targetGender;
      const profileCity = (p.location || '').split(',')[0].trim().toLowerCase();
      const isMatchCity = profileCity === cityToFilter.toLowerCase();
      
      const isMatchAge = p.age >= ageRange.min && p.age <= ageRange.max;
      
      const isMatchInterests = selectedInterests.length === 0 || 
        (p.interests && selectedInterests.some(interest => p.interests?.includes(interest)));

      return isCorrectGender && isMatchCity && isMatchAge && isMatchInterests;
    });

    return filtered;
  }, [profiles, userProfile, explorerCity, ageRange, selectedInterests]);

  const safeIndex = filteredProfiles.length > 0 ? currentIndex % filteredProfiles.length : 0;
  const currentProfile = filteredProfiles.length > 0 ? filteredProfiles[safeIndex] : null;

  const handleNext = (dir: number) => {
    setDirection(dir);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setDirection(null);
    }, 500);
  };

  const handleLike = async () => {
    if (currentProfile && userProfile) {
      await firebaseDb.likeProfile(userProfile.id, currentProfile.id);
      setShowQuickMessage(true);
    }
  };

  const handleSendQuickMessage = async (message: string) => {
    if (currentProfile && userProfile) {
      // In a real app, logic would find the generated conversation
      setShowQuickMessage(false);
      handleNext(1);
      const available = await firebaseDb.getAvailableProfiles(userProfile);
      setProfiles(available);
    }
  };

  const handlePass = async () => {
    if (currentProfile && userProfile) {
      await firebaseDb.passProfile(userProfile.id, currentProfile.id);
      handleNext(-1);
      const available = await firebaseDb.getAvailableProfiles(userProfile);
      setProfiles(available);
    }
  };

  if (filteredProfiles.length === 0) {
    return (
      <div className="pt-16 pb-24 px-5 max-w-lg mx-auto h-full flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-brand-mango/10 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-brand-mango" />
        </div>
        <h2 className="text-xl font-black text-brand-primary tracking-tight">Nenhum perfil na sua região</h2>
        <p className="text-sm text-brand-primary/50 mt-2 leading-relaxed">
          O Opala Negra prioriza conexões locais e seguras. Em breve traremos novos usuários verificados próximos a você em {(userProfile?.location || '').split(',')[0]}.
        </p>
        <button 
          onClick={() => setExplorerCity(null)}
          className="mt-8 px-8 py-3 bg-brand-primary text-white rounded-full text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
        >
          Voltar para minha cidade
        </button>
      </div>
    );
  }

  return (
    <div className="pt-16 pb-24 px-5 max-w-lg mx-auto h-full flex flex-col relative bg-linear-to-b from-white via-brand-surface to-brand-highlight/30">
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[60] bg-brand-primary/95 backdrop-blur-md flex justify-center pt-12"
          >
            <div className="w-full max-w-lg flex flex-col h-full bg-brand-primary">
            <div className="flex justify-between items-center px-8 mb-8">
              <h3 className="text-2xl font-black text-white tracking-tighter">Filtros de Busca</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto px-8 space-y-10 pb-12">
              <section className="space-y-4">
                <div className="flex justify-between items-end">
                  <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Faixa Etária</h4>
                  <span className="text-brand-mango font-black text-sm">{ageRange.min} - {ageRange.max} anos</span>
                </div>
                <div className="space-y-6 px-2">
                  <input 
                    type="range" 
                    min="18" 
                    max="60" 
                    value={ageRange.min}
                    onChange={(e) => setAgeRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-full accent-brand-mango h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                  <input 
                    type="range" 
                    min="18" 
                    max="60" 
                    value={ageRange.max}
                    onChange={(e) => setAgeRange(prev => ({ ...prev, max: Math.max(ageRange.min, parseInt(e.target.value)) }))}
                    className="w-full accent-brand-mango h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Interesses e Afinidades</h4>
                <div className="flex flex-wrap gap-2">
                  {ALL_INTERESTS.map(interest => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => {
                          setSelectedInterests(prev => 
                            isSelected ? prev.filter(i => i !== interest) : [...prev, interest]
                          );
                        }}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          isSelected 
                            ? 'bg-brand-mango text-white shadow-lg shadow-brand-mango/20 border border-brand-mango' 
                            : 'bg-white/5 border border-white/10 text-white/40 hover:text-white/60'
                        }`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="p-8 bg-brand-primary border-t border-white/5">
              <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-4 bg-white text-brand-primary rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
              >
                Aplicar Filtros
              </button>
              <button 
                onClick={() => {
                  setAgeRange({ min: 18, max: 50 });
                  setSelectedInterests([]);
                }}
                className="w-full mt-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-white/50"
              >
                Limpar Todos
              </button>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDetail && (
          <ProfileDetail 
            profile={currentProfile} 
            onClose={() => setShowDetail(false)} 
            onLike={handleLike}
            onPass={handlePass}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showQuickMessage && (
          <QuickMessage 
            recipientName={currentProfile.name}
            onClose={() => setShowQuickMessage(false)}
            onSend={handleSendQuickMessage}
          />
        )}
      </AnimatePresence>

      {/* Security Context Banner */}
      <div className="mt-6 mb-4 space-y-3">
        <div className="bg-white/50 backdrop-blur-sm border border-brand-primary/5 rounded-[32px] p-5 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-2xl bg-brand-mango flex items-center justify-center shrink-0 shadow-lg shadow-brand-mango/20">
            <Verified className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1">Conexão Segura</span>
            <p className="text-xs text-brand-primary/60 leading-relaxed font-medium">
              Sua privacidade é nossa prioridade. Todos os perfis neste ecossistema são <span className="text-brand-mango font-bold">Bio-Verificados</span>.
            </p>
          </div>
        </div>

        {userProfile?.plan === 'gold' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide py-1">
            <button 
              onClick={() => setShowFilters(true)}
              className="bg-brand-mango/10 border border-brand-mango/20 text-brand-mango p-3 rounded-2xl shrink-0 hover:bg-brand-mango hover:text-white transition-all shadow-lg shadow-brand-mango/5"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            {['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre'].map(city => (
              <button 
                key={city}
                onClick={() => setExplorerCity(city)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  (explorerCity || userProfile.location.split(',')[0].trim()) === city 
                    ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105' 
                    : 'bg-white border border-brand-primary/5 text-brand-primary/40 hover:text-brand-primary/60'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex-grow flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!direction ? (
            <motion.div 
              key={currentProfile.id}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ 
                x: direction === 1 ? 500 : (direction === -1 ? -500 : 0), 
                opacity: 0,
                rotate: direction === 1 ? 20 : (direction === -1 ? -20 : 0),
                scale: 0.8
              }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="relative w-full aspect-[3/4.2] rounded-[48px] overflow-hidden bg-white shadow-2xl shadow-brand-primary/10 border-4 border-white"
            >
              <img 
                src={currentProfile.imageUrl} 
                alt={currentProfile.name} 
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-brand-mango/20 backdrop-blur-md border border-brand-mango/30 text-brand-mango px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-mango rounded-full animate-pulse" />
                    Bio-Verificado
                  </div>
                </div>
                <h2 className="text-4xl font-black leading-tight mb-2 tracking-tighter">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <div className="flex items-center gap-2 text-white/70 font-bold mb-4 bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-2xl border border-white/10">
                  <span className="text-xs uppercase tracking-widest">{currentProfile.role}</span>
                  <span className="w-1 h-1 bg-white/30 rounded-full" />
                  <span className="text-xs uppercase tracking-widest">{currentProfile.location.split(',')[0]}</span>
                </div>
                <p className="text-sm text-white/80 font-medium line-clamp-2 leading-relaxed">
                  {currentProfile.bio}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="w-full aspect-[3/4.2]" />
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center items-center gap-6 mb-4">
        <button 
          onClick={handlePass}
          disabled={!!direction}
          className="w-16 h-16 rounded-[24px] bg-white border border-brand-primary/5 flex items-center justify-center text-brand-primary/30 hover:text-rose-500 hover:bg-rose-50 active:scale-90 transition-all shadow-lg shadow-brand-primary/5 disabled:opacity-30"
        >
          <X className="w-8 h-8" />
        </button>
        <button 
          onClick={() => setShowDetail(true)}
          className="w-20 h-20 rounded-[32px] bg-brand-primary text-white flex items-center justify-center hover:bg-brand-secondary active:scale-95 transition-all shadow-2xl shadow-brand-primary/20 relative group"
        >
          <div className="absolute inset-0 bg-white/20 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <UserRound className="w-10 h-10" />
        </button>
        <button 
          onClick={handleLike}
          disabled={!!direction}
          className="w-14 h-14 rounded-2xl bg-brand-mango/10 border border-brand-mango/20 text-brand-mango flex items-center justify-center hover:bg-brand-mango hover:text-white active:scale-90 transition-all shadow-xl shadow-brand-mango/5 disabled:opacity-30 group"
        >
          <Heart className="w-7 h-7 fill-current group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="text-center pb-4 space-y-1">
        {userProfile?.isGhostMode && (
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-mango flex items-center justify-center gap-2 animate-pulse">
            <Ghost className="w-3 h-3" />
            Modo Fantasma Ativado
          </p>
        )}
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/20 flex items-center justify-center gap-2">
          <Shield className="w-3 h-3" />
          Privacidade Ética Ativada
        </p>
      </div>
    </div>
  );
}
