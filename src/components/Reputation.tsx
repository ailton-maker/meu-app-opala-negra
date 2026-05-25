import { 
  Verified, 
  TrendingUp, 
  Timer, 
  Star, 
  Settings, 
  ShieldCheck, 
  Info,
  ChevronRight,
  LogOut,
  History,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { UserProfile, View } from '../types';
import { logout } from '../services/firebase';
import { AdSpace } from './AdSpace';
import { ParceiroBanner } from './ParceiroBanner';
// @ts-ignore
import citrinoLogo from '../assets/images/citrino_logo_1779562873994.png';

interface ReputationProps {
  userProfile: UserProfile | null;
  onNavigate: (view: View) => void;
}

export function Reputation({ userProfile, onNavigate }: ReputationProps) {
  const [iaFiltering, setIaFiltering] = useState(true);
  const [linkVerification, setLinkVerification] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);

  if (!userProfile) return null;

  const handleShareInvite = () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?invite=${userProfile.invitationCode || ''}`;
    const text = `Venha para o OPALA NEGRA! Use meu código ${userProfile.invitationCode} e ganhe 1 semana de Premium grátis.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Opala Negra Invite',
        text: text,
        url: inviteUrl
      }).catch(err => {
        if ((err as Error).name !== 'AbortError') console.error(err);
      });
    } else {
      navigator.clipboard.writeText(`${text} Acesse: ${inviteUrl}`)
        .then(() => alert('Link de convite copiado para a área de transferência!'))
        .catch(err => {
          console.error('Falha ao copiar:', err);
          alert(`Copie seu código manualmente: ${userProfile.invitationCode}`);
        });
    }
  };

  return (
    <div className="pt-[140px] pb-32 px-5 max-w-lg mx-auto h-full overflow-y-auto font-sans bg-brand-surface">
      <AnimatePresence>
        {showInviteModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-primary/90 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[48px] p-8 max-w-sm w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-mango" />
              <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute top-6 right-6 text-brand-primary/20 hover:text-brand-primary transition-colors font-black uppercase text-[10px]"
              >
                Fechar
              </button>

              <div className="w-20 h-20 bg-brand-mango/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserPlus className="w-10 h-10 text-brand-mango" />
              </div>

              <h2 className="text-2xl font-black text-brand-primary mb-4 tracking-tight">Convide Amigos</h2>
              <p className="text-sm text-brand-primary/60 font-medium leading-relaxed mb-8">
                Para cada amigo que ativar o app com seu código, você ganha <span className="text-brand-mango font-black">1 SEMANA</span> de Premium Gold.
              </p>

              <div className="bg-brand-highlight/30 border-2 border-dashed border-brand-primary/10 p-6 rounded-[32px] mb-8">
                <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em] mb-2">Seu Código Único</p>
                <p className="text-3xl font-black text-brand-primary tracking-tighter">{userProfile.invitationCode || 'GERANDO...'}</p>
              </div>

              <button 
                onClick={handleShareInvite}
                className="w-full py-5 bg-brand-primary text-white rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl hover:bg-brand-secondary transition-all active:scale-95"
              >
                Compartilhar Convite
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mt-4 bg-white border border-brand-primary/5 rounded-[48px] p-8 shadow-2xl shadow-brand-primary/5 mb-8 relative overflow-hidden">
        {/* ... */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-highlight rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
        
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-36 h-36 rounded-[40px] p-1 bg-white shadow-xl rotate-3"
            >
              <img 
                src={userProfile.imageUrl} 
                alt="Profile" 
                className="w-full h-full rounded-[36px] object-cover"
              />
            </motion.div>
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-2 -right-2 bg-brand-mango text-white rounded-2xl p-2 border-4 border-white shadow-xl"
            >
              <Verified className="w-6 h-6 fill-white" />
            </motion.div>

            {/* Botão Sair Discreto ao lado da foto */}
            <button
              id="btn-profile-logout"
              onClick={async () => {
                if (confirm('Tem certeza que deseja sair?')) {
                  try {
                    await logout();
                  } catch (err) {
                    console.error("Erro ao sair:", err);
                  }
                }
              }}
              className="absolute left-[160px] top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap z-20"
            >
              <div className="w-9 h-9 rounded-full bg-slate-50 hover:bg-rose-50 flex items-center justify-center text-slate-400 hover:text-rose-600 border border-slate-200/50 shadow-sm transition-colors duration-300">
                <LogOut className="w-4 h-4 ml-0.5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-rose-600 transition-colors duration-300">
                Sair
              </span>
            </button>
          </div>
          
          <h1 className="text-3xl font-black text-brand-primary mb-1 flex items-center justify-center gap-2 translate-x-2">
            {userProfile.name}
            <Verified className="w-5 h-5 text-brand-mango fill-brand-mango" />
          </h1>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-brand-mango animate-pulse" />
            <span className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em]">Online agora</span>
            <span className="mx-1 text-brand-primary/10">|</span>
            <span className="text-[10px] font-black text-brand-mango uppercase tracking-widest bg-brand-mango/10 px-3 py-1 rounded-full">{userProfile.plan}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mb-8">
            <div className="bg-brand-highlight/30 border border-brand-primary/5 p-5 rounded-[24px] flex flex-col items-center">
              <p className="text-[9px] font-black text-brand-primary/30 uppercase tracking-[0.2em] mb-1">Conversas</p>
              <p className="text-2xl font-black text-brand-primary">{userProfile.currentConversations}<span className="text-brand-primary/20">/</span>{userProfile.maxConversations}</p>
            </div>
            <div className="bg-brand-highlight/30 border border-brand-primary/5 p-5 rounded-[24px] flex flex-col items-center">
              <p className="text-[9px] font-black text-brand-primary/30 uppercase tracking-[0.2em] mb-1">Score Ético</p>
              <p className="text-2xl font-black text-brand-primary">100<span className="text-brand-primary/20">%</span></p>
            </div>
          </div>

          {userProfile.verificationLevel === 1 && userProfile.daysActive >= 3 && (
            <div className="w-full bg-brand-highlight/20 border border-brand-secondary/10 p-5 rounded-[32px] flex flex-col gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                  <Timer className="w-5 h-5 text-brand-secondary" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-brand-primary uppercase tracking-tight mb-1">Verificação Nível II</p>
                  <p className="text-xs font-semibold text-brand-primary/40 leading-relaxed">
                    Mova a cabeça para validar sua identidade biométrica 3D.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('verification')}
                className="w-full py-4 bg-brand-secondary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-primary transition-colors shadow-lg shadow-brand-secondary/20"
              >
                Iniciar Verificação
              </button>
            </div>
          )}

          <div className="flex gap-4 w-full mb-8">
            <button 
              onClick={() => onNavigate('edit_profile')}
              className="flex-grow h-16 bg-brand-primary text-white font-black rounded-2xl hover:bg-brand-secondary active:scale-[0.98] transition-all shadow-xl shadow-brand-primary/20 uppercase tracking-[0.2em] text-[10px]"
            >
              Configurar Perfil
            </button>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="w-20 h-16 bg-white border-2 border-brand-primary/5 text-brand-primary flex flex-col items-center justify-center gap-1 rounded-2xl hover:border-brand-mango transition-all group"
            >
              <UserPlus className="w-5 h-5 text-brand-mango" />
              <span className="text-[8px] font-black uppercase tracking-widest">Convite</span>
            </button>
          </div>
        </div>
      </section>

      <div className="mb-8">
        <ParceiroBanner
          imageSource={citrinoLogo}
          title="Parceiro Estratégico Citrino"
          description="Acesse o clube de investimentos e benefícios exclusivos e potencialize suas conexões de alto nível."
          linkUrl="https://citrino.app"
          highlighted={true}
        />
      </div>

      <AdSpace variant="banner" userPlan={userProfile?.plan} userId={userProfile?.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-brand-primary text-white p-8 rounded-[48px] flex flex-col justify-between min-h-[220px] shadow-2xl shadow-brand-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10">
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">REPUTAÇÃO</h2>
            <p className="text-sm text-white/70 leading-relaxed font-bold tracking-tight">Sua pontuação é excelente baseada em sua conduta ética.</p>
          </div>
          <div className="flex items-end justify-between relative z-10">
            <span className="text-7xl font-black leading-none tracking-tighter">98<span className="text-xl text-white/20 ml-1">/100</span></span>
            <div className="bg-brand-mango text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">ELITE</div>
          </div>
        </div>

        <div className="bg-white border border-brand-primary/5 p-8 rounded-[48px] space-y-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.3em] mb-6">CONQUISTAS</h2>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-brand-highlight text-brand-secondary px-4 py-2.5 rounded-2xl border border-brand-secondary/10">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Verificado</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2.5 rounded-2xl border border-amber-100">
                <Star className="w-5 h-5 fill-amber-700" />
                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Pioneiro</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-brand-primary/40 font-bold leading-relaxed italic border-l-2 border-brand-highlight pl-4">
            Mantenha este padrão para desbloquear convites premium.
          </p>
        </div>
      </div>

      <section className="bg-white border border-brand-primary/5 rounded-[48px] overflow-hidden shadow-sm mb-8">
        <div className="p-8 border-b border-brand-primary/5 flex items-center gap-5 bg-brand-highlight/20">
          <div className="w-14 h-14 rounded-3xl bg-white shadow-sm flex items-center justify-center text-brand-primary">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-brand-primary tracking-tight">Privacidade Digital</h2>
            <p className="text-xs text-brand-primary/40 font-bold uppercase tracking-widest">Proteção Ativa por IA</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-brand-mango/5 text-brand-primary p-5 rounded-[32px] flex gap-4 items-start border border-brand-mango/20">
            <Info className="w-6 h-6 text-brand-mango shrink-0" />
            <p className="text-xs font-bold leading-relaxed">
              Sua criptografia está atualizada e operando no nível máximo de segurança bancária.
            </p>
          </div>

          <div className="space-y-8">
            <button 
              onClick={() => setIaFiltering(!iaFiltering)}
              className="w-full flex items-center justify-between group cursor-pointer text-left"
            >
              <div>
                <p className="text-sm font-black text-brand-primary">Filtro de Conduta IA</p>
                <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-widest mt-1">Bloqueio Proativo de Assédio</p>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors p-1 ${iaFiltering ? 'bg-brand-mango' : 'bg-brand-primary/10'}`}>
                <div className={`absolute bg-white w-6 h-6 rounded-full shadow-lg transition-all ${iaFiltering ? 'right-1' : 'left-1'}`} />
              </div>
            </button>
            
            <button 
              onClick={() => setLinkVerification(!linkVerification)}
              className="w-full flex items-center justify-between group cursor-pointer text-left"
            >
              <div>
                <p className="text-sm font-black text-brand-primary">Scan de Links</p>
                <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-widest mt-1">Prevenção contra Phishing</p>
              </div>
              <div className={`w-14 h-8 rounded-full relative transition-colors p-1 ${linkVerification ? 'bg-brand-mango' : 'bg-brand-primary/10'}`}>
                <div className={`absolute bg-white w-6 h-6 rounded-full shadow-lg transition-all ${linkVerification ? 'right-1' : 'left-1'}`} />
              </div>
            </button>

            <div className="flex items-center justify-between opacity-30">
              <div>
                <p className="text-sm font-black text-brand-primary">Ocultar Distância</p>
                <p className="text-[10px] text-brand-primary/40 font-bold uppercase tracking-widest mt-1">Privacidade de Localização</p>
              </div>
              <div className="w-14 h-8 bg-brand-primary/10 rounded-full p-1">
                <div className="bg-white w-6 h-6 rounded-full shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-24" />
    </div>
  );
}
