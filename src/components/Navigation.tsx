import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  MessageSquare, 
  User, 
  LineChart, 
  ArrowLeft,
  X,
  History,
  Info,
  CheckCircle,
  AlertTriangle,
  LogOut,
  ChevronRight,
  Gavel,
  Verified,
  Camera,
  Download,
  Filter,
  TrendingUp,
  Receipt,
  Scan,
  MoreVertical,
  Send,
  PlusCircle,
  Lock,
  Sparkles,
  Search,
  Timer,
  Heart,
  UserRound,
  Compass,
  Gem,
  Sun,
  Moon,
  Tv
} from 'lucide-react';
import { View, Gender, UserProfile } from '../types';
import { StoneFractalLogo } from './StoneFractalLogo';

interface TopAppBarProps {
  view: View;
  onNavigate: (view: View) => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  userProfile: UserProfile | null;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function TopAppBar({ 
  view, 
  onNavigate, 
  title = 'Opala Negra', 
  showBack, 
  onBack, 
  userProfile,
  darkMode = false,
  onToggleDarkMode
}: TopAppBarProps) {
  const [forumOpen, setForumOpen] = useState(false);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [tvOpen, setTvOpen] = useState(false);

  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [mockThreads, setMockThreads] = useState([
    { id: 1, title: "🏁 Cronograma do Encontro Nacional Opala Negra 2026", author: "Luiz_Opala", replies: 32, category: "Estilo", likes: 18 },
    { id: 2, title: "🛠 Amortecedores Procombi vs Originais GM no 250-S", author: "Junior74", replies: 14, category: "Mecânica", likes: 8 },
    { id: 3, title: "💎 Restauração do Painel Instrumentos ODG Opala", author: "Ronaldo_Studio", replies: 45, category: "Restauração", likes: 23 },
    { id: 4, title: "🔒 Criptografia nos Códigos de Convite Ativos", author: "Dev_Admin", replies: 5, category: "Segurança", likes: 12 }
  ]);

  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});

  const userImage = userProfile?.imageUrl || (userProfile?.gender === 'female' 
    ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop");

  const startDownload = (fileName: string) => {
    if (downloadProgress[fileName] !== undefined) return;
    setDownloadProgress(prev => ({ ...prev, [fileName]: 0 }));
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setDownloadProgress(prev => ({ ...prev, [fileName]: current }));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          alert(`Download do arquivo "${fileName}" concluído com sucesso no simulador!`);
        }, 150);
      }
    }, 200);
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim()) return;
    const newThread = {
      id: Date.now(),
      title: newThreadTitle,
      author: userProfile?.name || "Membro Club",
      replies: 0,
      category: "Geral",
      likes: 0
    };
    setMockThreads([newThread, ...mockThreads]);
    setNewThreadTitle('');
  };

  const isProfileView = view === 'profile';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-white dark:bg-[#1C1C1C] border-b border-brand-primary/10 shadow-md">
      {/* O cabeçalho no perfil do usuário é sólido (sem transparência de blur) para garantir que absolutamente nenhuma renderização passe atrás da logo ou nome ao fazer scroll */}
      <div className={`w-full max-w-lg flex flex-col px-5 py-3 transition-all ${
        isProfileView ? 'h-auto' : 'h-16 justify-between items-center flex-row'
      }`}>
        
        {/* Row 1: Logo e Marca + Info Usuário e Tema */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button onClick={onBack} className="p-2 -ml-2 hover:bg-brand-highlight hover:dark:bg-white/5 rounded-full transition-all active:scale-90 cursor-pointer">
                <ArrowLeft className="w-6 h-6 text-brand-primary" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 flex items-center justify-center bg-transparent">
                  <StoneFractalLogo className="w-10 h-10" darkMode={darkMode} />
                </div>
                <span className={`text-[12px] font-black tracking-tighter uppercase transition-colors ${
                  darkMode ? 'text-white' : 'text-[#4B0082]'
                }`}>
                  Opala {darkMode ? (
                    <span className="text-[#D63031]">Negra</span>
                  ) : (
                    <span className="text-[#8A2BE2] font-black">Negra</span>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isProfileView && view === 'messages' && (
              <button onClick={() => onNavigate('transactions')} className="p-2 hover:bg-brand-highlight hover:dark:bg-white/5 rounded-full text-brand-primary/40 transition-colors cursor-pointer">
                <History className="w-5 h-5" />
              </button>
            )}

            {onToggleDarkMode && (
              <button 
                onClick={onToggleDarkMode} 
                className="p-2 text-brand-primary hover:bg-brand-highlight/60 hover:dark:bg-white/5 rounded-full transition-all active:scale-90 flex items-center justify-center cursor-pointer"
                aria-label="Alternar tema"
                title={darkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={darkMode ? "dark" : "light"}
                    initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 45, scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5 text-brand-mango" />
                    ) : (
                      <Moon className="w-5 h-5 text-brand-primary/60" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            )}

            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-2xl bg-white p-0.5 overflow-hidden border-2 border-brand-primary/10 hover:border-brand-mango transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              <img 
                src={userImage} 
                alt="My Profile" 
                className="w-full h-full object-cover rounded-[14px]"
              />
            </button>
          </div>
        </div>

        {/* Row 2: Elementos de Navegação Principais (Exclusivos para o Perfil do Usuário) */}
        {isProfileView && (
          <div className="flex items-center justify-between border-t border-brand-primary/5 pt-3 mt-2.5">
            <button
              onClick={() => setForumOpen(true)}
              className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#4B0082] dark:text-sky-400 hover:bg-brand-primary/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer opacity-90 hover:opacity-100"
            >
              Fórum
            </button>
            <button
              onClick={() => setDownloadsOpen(true)}
              className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#4B0082] dark:text-sky-400 hover:bg-brand-primary/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer opacity-90 hover:opacity-100"
            >
              Downloads
            </button>
            <button
              onClick={() => setTvOpen(true)}
              className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#4B0082] dark:text-sky-400 hover:bg-brand-primary/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer opacity-90 hover:opacity-100"
            >
              TV
            </button>
            <button
              onClick={() => onNavigate('help')}
              className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-[#4B0082] dark:text-sky-400 hover:bg-brand-primary/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer opacity-90 hover:opacity-100"
            >
              Ajuda
            </button>
            <button
              onClick={() => onNavigate('reputation')}
              className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
            >
              Admin
            </button>
          </div>
        )}
      </div>

      {/* MODAIS INTERATIVOS */}
      
      {/* 1. Modal Fórum */}
      <AnimatePresence>
        {forumOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#151515] text-slate-900 dark:text-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-brand-primary/10 relative"
            >
              {/* Header */}
              <div className="bg-brand-primary p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-mango fill-brand-mango" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider">Fórum de Discussão</h3>
                    <p className="text-[9px] font-bold text-white/60 tracking-widest uppercase">Canal de Membros Elite</p>
                  </div>
                </div>
                <button 
                  onClick={() => setForumOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Feed de Discussões */}
              <div className="p-5 max-h-[320px] overflow-y-auto space-y-3.5 scrollbar-thin">
                {mockThreads.map((thread) => (
                  <div key={thread.id} className="border-b border-slate-100 dark:border-slate-900 pb-3 last:border-b-0">
                    <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-primary/5 dark:bg-white/5 text-brand-primary dark:text-brand-mango">
                      {thread.category}
                    </span>
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 pointer-events-none">
                      {thread.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1 text-[9px] font-medium text-slate-400">
                      <span>Iniciado por @{thread.author}</span>
                      <div className="flex items-center gap-2 font-bold uppercase text-brand-mango">
                        <span>💬 {thread.replies} respostas</span>
                        <span>❤️ {thread.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Criar Nova Thread Form */}
              <form onSubmit={handleCreateThread} className="p-4 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-900 flex gap-2">
                <input 
                  type="text" 
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="Nova pauta de discussão..."
                  className="flex-grow px-3 py-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:border-brand-primary text-slate-900 dark:text-white"
                />
                <button 
                  type="submit"
                  className="bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-transform active:scale-95 cursor-pointer"
                >
                  Enviar
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Modal Downloads */}
      <AnimatePresence>
        {downloadsOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-[#151515] text-slate-900 dark:text-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-brand-primary/10 relative p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-2xl bg-brand-primary/5 flex items-center justify-center">
                    <Download className="w-5 h-5 text-brand-mango" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider">Downloads Oficiais</h3>
                    <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Arquivos e Colecionáveis</p>
                  </div>
                </div>
                <button 
                  onClick={() => setDownloadsOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Manual do Proprietário Opala 1979.pdf", size: "34.2 MB", desc: "PDF restaurado de alta definição" },
                  { name: "Esquema Elétrico Completo Opala.pdf", size: "12.8 MB", desc: "Arquivos técnicos de montagem original" },
                  { name: "Wallpaper Opala Negra Desktop 8K.png", size: "15.0 MB", desc: "Fundo de tela de alta resolução" }
                ].map((file) => {
                  const progress = downloadProgress[file.name];
                  const isDownloading = progress !== undefined && progress < 100;
                  const isFinished = progress === 100;

                  return (
                    <div key={file.name} className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-900 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{file.name}</h4>
                          <p className="text-[9px] text-slate-400 mt-0.5">{file.desc} • {file.size}</p>
                        </div>
                        <button 
                          onClick={() => startDownload(file.name)}
                          disabled={isDownloading || isFinished}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                            isFinished 
                              ? 'bg-emerald-500/10 text-emerald-500 font-extrabold'
                              : isDownloading 
                                ? 'bg-slate-200 text-slate-400' 
                                : 'bg-brand-primary text-white hover:scale-[1.03] active:scale-95'
                          }`}
                        >
                          {isFinished ? 'Pronto' : isDownloading ? 'Baixando' : 'Baixar'}
                        </button>
                      </div>

                      {isDownloading && (
                        <div className="w-full bg-slate-200 dark:bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-brand-mango h-full transition-all duration-200" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Modal TV */}
      <AnimatePresence>
        {tvOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999]"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-black text-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-red-600/30 relative"
            >
              {/* Header */}
              <div className="bg-red-600 p-5 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <Tv className="w-5 h-5 fill-white animate-pulse" />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider">Opala Negra TV</h3>
                    <p className="text-[9px] font-bold text-red-100 tracking-widest uppercase">Transmissão em Tempo Real</p>
                  </div>
                </div>
                <button 
                  onClick={() => setTvOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Player Display */}
              <div className="relative aspect-video bg-neutral-900 border-y border-neutral-800 flex flex-col items-center justify-center p-4">
                {/* Simulated video frame */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.12)_0%,transparent_100%)]" />
                
                <div className="w-14 h-14 rounded-full bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer shadow-lg shadow-red-600/20">
                  <span className="text-xl ml-1">▶</span>
                </div>
                
                <span className="text-[10px] uppercase font-black tracking-widest mt-4 text-red-500 animate-pulse">Sinal HD Estabilizado (Local)</span>
                <span className="text-[9px] text-neutral-400 mt-1 font-bold uppercase tracking-wider">Câmera Exclusiva Encontros 2026</span>

                {/* Soundbars simulation */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between h-4 px-2 opacity-50">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map((i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-red-600 rounded-t" 
                      style={{ 
                        height: `${Math.floor(Math.random() * 100)}%`,
                        animation: `ad-breathing ${1 + i * 0.15}s ease-in-out infinite`
                      }} 
                    />
                  ))}
                </div>
              </div>

              {/* Player Controls */}
              <div className="p-4 bg-neutral-950 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#ef4444]">
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-red-600/10 border border-red-600/25">AO VIVO</span>
                  <span className="text-white/40">👥 482 Assistindo</span>
                </div>
                <span className="text-white/40">1080p</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
  userProfile: UserProfile | null;
}

export function BottomNav({ activeView, onNavigate, userProfile }: BottomNavProps) {
  const tabs = [
    { id: 'discovery', label: 'DESCUBRIR', icon: Compass },
    { id: 'messages', label: 'MENSAGENS', icon: MessageSquare },
    { id: 'reputation', label: 'REPUTAÇÃO', icon: Verified },
    { id: 'profile', label: 'MEU PERFIL', icon: UserRound },
  ];

  const activeColorClass = 'bg-brand-mango text-white shadow-xl shadow-brand-mango/30 scale-105';
  const activeIconColor = 'text-white';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-lg h-24 bg-white/95 backdrop-blur-xl border-t border-brand-primary/5 flex justify-around items-center px-4 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
        {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        
        return (
          <button
          key={tab.id}
          onClick={() => onNavigate(tab.id as View)}
          className={`relative flex flex-col items-center justify-center w-20 h-14 rounded-2xl transition-all duration-300 ${
            isActive 
              ? activeColorClass
              : 'text-brand-primary/30 hover:text-brand-primary/60 hover:bg-brand-highlight/50'
          }`}
        >
          <Icon className={`w-6 h-6 ${isActive ? activeIconColor : ''} transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
          <span className={`text-[8px] font-black mt-1 tracking-[0.15em] transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
            {tab.label}
          </span>
          
          {isActive && (
            <motion.div 
              layoutId="nav-active-blob"
              className="absolute inset-0 bg-brand-mango rounded-2xl -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </button>
        );
      })}
      </div>
    </nav>
  );
}
