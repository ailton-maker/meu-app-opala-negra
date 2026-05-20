import { motion } from 'motion/react';
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
  Compass
} from 'lucide-react';
import { View, Gender, UserProfile } from '../types';

interface TopAppBarProps {
  view: View;
  onNavigate: (view: View) => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  userProfile: UserProfile | null;
}

export function TopAppBar({ view, onNavigate, title = 'Opala Negra', showBack, onBack, userProfile }: TopAppBarProps) {
  const userImage = userProfile?.imageUrl || (userProfile?.gender === 'female' 
    ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg border-b border-brand-primary/5 flex justify-between items-center px-5 h-16 transition-all">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-brand-highlight rounded-full transition-all active:scale-90">
              <ArrowLeft className="w-6 h-6 text-brand-primary" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black tracking-[0.3em] text-brand-primary/40 uppercase mr-1">Opala Negra</span>
          {view === 'messages' && (
            <button onClick={() => onNavigate('transactions')} className="p-2 hover:bg-brand-highlight rounded-full text-brand-primary/40 transition-colors">
              <History className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-2xl bg-white p-0.5 overflow-hidden border-2 border-brand-primary/10 hover:border-brand-mango transition-all active:scale-95 shadow-sm"
          >
            <img 
              src={userImage} 
              alt="My Profile" 
              className="w-full h-full object-cover rounded-[14px]"
            />
          </button>
        </div>
      </div>
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
