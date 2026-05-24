import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  Eye, 
  CreditCard, 
  Mail, 
  Phone, 
  ChevronRight,
  ShieldAlert,
  Trash2,
  Share2,
  HelpCircle,
  Info,
  Settings as SettingsIcon,
  Globe,
  Ghost,
  LogOut,
  Moon
} from 'lucide-react';
import { UserProfile } from '../types';
import { logout } from '../services/firebase';
import { AdSpace } from './AdSpace';
import { firebaseDb } from '../services/db';

interface SettingsProps {
  onBack: () => void;
  userProfile: UserProfile | null;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Settings({ onBack, userProfile, darkMode = false, onToggleDarkMode }: SettingsProps) {
  const [notifications, setNotifications] = useState(notificationsEnabled(userProfile));
  const [readReceipts, setReadReceipts] = useState(true);
  const [ghostMode, setGhostMode] = useState(userProfile?.isGhostMode || false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function notificationsEnabled(profile: UserProfile | null) {
      // Mock logic: gold users might have different defaults
      return true;
  }

  const handleGhostToggle = async () => {
    if (!userProfile) return;
    const newStatus = !ghostMode;
    setGhostMode(newStatus);
    await firebaseDb.updateGhostMode(userProfile.id, newStatus);
  };

  const handleShare = async () => {
    if (!userProfile) return;
    
    // Construct the invite URL
    const inviteUrl = `${window.location.origin}${window.location.pathname}?invite=${userProfile.invitationCode || ''}`;
    const shareText = `Junte-se a mim no OPALA NEGRA, a rede de conexões de elite! Use meu código: ${userProfile.invitationCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'OPALA NEGRA - Elite Connections',
          text: shareText,
          url: inviteUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error(err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(inviteUrl);
        alert('Link de convite personalizado copiado para a área de transferência!');
      } catch (err) {
        console.error('Falha ao copiar link:', err);
        alert(`Copie seu código manualmente: ${userProfile.invitationCode}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col font-sans pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-lg bg-white border-b border-brand-primary/5 flex items-center px-5 h-16">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-brand-highlight rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-brand-primary" />
          </button>
          <h1 className="text-xl font-bold text-brand-primary ml-2 uppercase tracking-tighter">Configurações</h1>
        </div>
      </header>

      <main className="pt-20 pb-12 px-6 overflow-y-auto flex-grow max-w-lg mx-auto w-full">
        <div className="space-y-8">
          {/* Account Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Informações Básicas</h3>
            <div className="bg-white border border-brand-primary/5 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-6 flex items-center justify-between border-b border-brand-surface">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-primary">E-mail</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                      {userProfile?.authInfo?.email || 'Nâo cadastrado'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-200" />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-primary">Telefone</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                      {userProfile?.authInfo?.phone || '+55 (11) 9****-****'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-200" />
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preferências de Uso</h3>
            <div className="bg-white border border-brand-primary/5 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-6 flex items-center justify-between border-b border-brand-surface">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-primary">Notificações Push</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Alertas de mensagens e curtidas</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${notifications ? 'bg-brand-mango' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all ${notifications ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-6 flex items-center justify-between border-b border-brand-surface">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <Ghost className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-primary">Modo Fantasma</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Navegue sem ser visto</p>
                  </div>
                </div>
                <button 
                  onClick={handleGhostToggle}
                  className={`w-12 h-6 rounded-full relative transition-colors ${ghostMode ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all ${ghostMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-6 flex items-center justify-between border-b border-brand-surface">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-primary">Modo Noturno</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Interface escura e sofisticada</p>
                  </div>
                </div>
                <button 
                  onClick={onToggleDarkMode}
                  className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all ${darkMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-primary">Idioma do App</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Português (Brasil)</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-200" />
              </div>
            </div>
          </section>

          {/* Social Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Comunidade</h3>
            <button 
              onClick={handleShare}
              className="w-full bg-brand-primary text-white p-8 rounded-[40px] flex items-center justify-between group overflow-hidden relative shadow-xl shadow-brand-primary/20"
            >
              <div className="relative z-10 text-left">
                <p className="text-xl font-black tracking-tight mb-1">Convidar Amigos</p>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Ganhe Reputation Score</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                <Share2 className="w-7 h-7" />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary rounded-full blur-3xl -mr-10 -mt-10 opacity-50" />
            </button>
          </section>

          {/* Help & Info Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Suporte e Informações</h3>
            <div className="bg-white border border-brand-primary/5 rounded-[32px] overflow-hidden shadow-sm">
              <button className="p-6 w-full flex items-center justify-between border-b border-brand-surface hover:bg-brand-highlight transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-brand-primary text-left">Ajuda & FAQ</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-200" />
              </button>
              <button className="p-6 w-full flex items-center justify-between border-b border-brand-surface hover:bg-brand-highlight transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-mango">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-brand-primary text-left">Políticas de Segurança</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-200" />
              </button>
              <button className="p-6 w-full flex items-center justify-between hover:bg-brand-highlight transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <Info className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-brand-primary text-left">Sobre o App (v1.0.4)</p>
                </div>
                <div className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full bg-brand-mango" />
                   <span className="text-[10px] font-black text-brand-primary/30">ATIVO</span>
                </div>
              </button>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Privacidade avançada</h3>
            <div className="bg-white border border-brand-primary/5 rounded-[32px] overflow-hidden shadow-sm">
              <div className="p-6 flex items-center justify-between border-b border-brand-surface">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-brand-highlight flex items-center justify-center text-brand-primary">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-primary">Confirmação de Leitura</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Mostrar quando você ler mensagens</p>
                  </div>
                </div>
                <button 
                  onClick={() => setReadReceipts(!readReceipts)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${readReceipts ? 'bg-brand-primary' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-md transition-all ${readReceipts ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <button className="p-6 w-full flex items-center justify-between hover:bg-gray-50 transition-colors text-rose-500">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-left">Excluir Minha Conta</p>
                </div>
                <ChevronRight className="w-5 h-5 text-rose-200" />
              </button>
            </div>
          </section>

          <AdSpace variant="inline" userPlan={userProfile?.plan} userId={userProfile?.id} />

          <section className="pt-4">
            <button 
              id="settings-logout-btn"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full h-16 bg-white border border-gray-100 rounded-3xl flex items-center justify-center gap-3 text-brand-primary font-black uppercase text-xs tracking-widest hover:bg-brand-highlight transition-all"
            >
              <LogOut className="w-5 h-5" />
              Encerrar Sessão
            </button>
          </section>
        </div>
      </main>

      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-brand-primary/80 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[36px] p-8 text-center border border-brand-primary/5 shadow-2xl z-10"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-brand-primary tracking-tight mb-2">Encerrar Sessão Segura?</h3>
              <p className="text-sm text-brand-primary/60 leading-relaxed mb-8">
                Sua sessão atual de criptografia ponta a ponta será encerrada. Você precisará se autenticar novamente para acessar o aplicativo.
              </p>
              <div className="space-y-3">
                <button 
                  onClick={async () => {
                    setShowLogoutConfirm(false);
                    await logout();
                  }}
                  className="w-full py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-md active:scale-[0.98]"
                >
                  Confirmar Saída
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full py-4 bg-brand-highlight hover:bg-brand-primary/5 text-brand-primary rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98]"
                >
                  Voltar ao App
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
