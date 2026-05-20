import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  ChevronLeft, 
  Info,
  CheckCircle2,
  Lock,
  UserPlus,
  Gem
} from 'lucide-react';

import { signInWithGoogle } from '../services/firebase';

interface AccessFlowProps {
  inviteCode: string;
  onUpdateInviteCode: (code: string) => void;
  onComplete: (authInfo: { method: string; value: string; inviteCode?: string }) => void;
}

export function AccessFlow({ inviteCode, onUpdateInviteCode, onComplete }: AccessFlowProps) {
  const [step, setStep] = useState<'splash' | 'auth' | 'input' | 'ethics'>('splash');
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // App.tsx handles navigation
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => {
        setStep('auth');
      }, 1800); // 1.8s is slightly faster
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNext = () => {
    if (step === 'auth') {
      setStep('auth'); 
    } else if (step === 'input') {
      if (value) setStep('ethics');
    } else if (step === 'ethics') {
      onComplete({ method: method!, value, inviteCode });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-brand-surface to-brand-highlight relative overflow-hidden flex flex-col items-center">
      {/* Background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-mango/10 rounded-full blur-[120px] select-none pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[100px] select-none pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'splash' && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-primary flex flex-col items-center justify-center p-12 cursor-pointer"
            onClick={() => setStep('auth')}
          >
            <div className="absolute top-10 right-10 z-20 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Gem className="w-3 h-3 text-brand-mango" />
              </div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">OPALA <span className="text-brand-mango">NEGRA</span></p>
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className="mt-16 text-center z-10"
            >
              <div className="flex justify-center gap-2 mb-8">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-2.5 h-2.5 bg-brand-mango rounded-full shadow-[0_0_15px_rgba(255,126,51,0.5)]" 
                  />
                ))}
              </div>
              <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.5em] animate-pulse">Toque para entrar</p>
            </motion.div>
          </motion.div>
        )}

        {step === 'auth' && (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md px-8 pt-24 pb-12 flex flex-col h-full z-10"
          >
            <div className="absolute top-10 right-10 flex items-center gap-2">
              <Gem className="w-3 h-3 text-brand-mango" />
              <p className="text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.4em]">OPALA <span className="text-brand-mango">NEGRA</span></p>
            </div>

            <h1 className="text-4xl font-black text-brand-primary tracking-tighter mb-4 leading-tight mt-12">
              Relacionamentos <span className="text-brand-mango">reais</span> e exclusivos.
            </h1>
            <p className="text-gray-500 font-medium mb-12">Acesse o protocolo de elite ON.</p>

            <div className="space-y-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full group flex items-center gap-4 p-4 bg-brand-primary text-white rounded-2xl hover:bg-brand-secondary hover:shadow-xl hover:shadow-brand-primary/10 transition-all text-left disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-sm tracking-tight">Continuar com Conta Google</span>
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Acesso Seguro</span>
                </div>
                {loading ? (
                  <div className="w-4 h-4 ml-auto border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4 ml-auto text-white/20 group-hover:translate-x-1 transition-all" />
                )}
              </motion.button>
              
              <div className="bg-brand-mango/5 border border-brand-mango/20 p-5 rounded-3xl space-y-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-brand-mango" />
                  <span className="text-[10px] font-black text-brand-mango uppercase tracking-widest">Tem um convite?</span>
                </div>
                <input 
                  type="text"
                  placeholder="ON-XXXX-000"
                  value={inviteCode}
                  onChange={(e) => onUpdateInviteCode(e.target.value.toUpperCase())}
                  className="w-full p-4 bg-white border border-brand-mango/10 rounded-2xl font-black text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-mango/20 transition-all placeholder:text-brand-primary/10"
                />
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-primary/5"></div></div>
                <div className="relative flex justify-center text-[10px]"><span className="bg-brand-surface px-4 text-brand-primary/20 font-black uppercase tracking-widest">Outras Opções</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMethod('email'); setStep('input'); }}
                  className="group flex flex-col items-center gap-3 p-6 bg-white/70 backdrop-blur-md border border-brand-primary/5 rounded-[32px] hover:border-brand-mango/30 hover:shadow-xl hover:shadow-brand-mango/5 transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-mango/10 flex items-center justify-center text-brand-mango group-hover:bg-brand-mango group-hover:text-white transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-brand-primary font-bold text-[10px] uppercase tracking-widest">E-mail</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setMethod('phone'); setStep('input'); }}
                  className="group flex flex-col items-center gap-3 p-6 bg-white/70 backdrop-blur-md border border-brand-primary/5 rounded-[32px] hover:border-brand-mango/30 hover:shadow-xl hover:shadow-brand-mango/5 transition-all text-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-mango/10 flex items-center justify-center text-brand-mango group-hover:bg-brand-mango group-hover:text-white transition-all duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-brand-primary font-bold text-[10px] uppercase tracking-widest">Telefone</span>
                </motion.button>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-4 p-6 bg-white/40 backdrop-blur-md rounded-[32px] border border-white shadow-sm">
              <Lock className="w-5 h-5 text-brand-mango mt-1 shrink-0" />
              <p className="text-[11px] font-bold text-brand-primary/40 leading-relaxed">
                Utilizamos biometria avançada para garantir relacionamentos reais. Ao entrar, você concorda com nossos <span className="text-brand-mango underline">Protocolos Éticos</span>.
              </p>
            </div>
          </motion.div>
        )}

        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-md px-8 pt-24 pb-12 flex flex-col h-full z-10"
          >
            <button 
              onClick={() => setStep('auth')}
              className="flex items-center gap-2 text-brand-primary/30 hover:text-brand-mango mb-10 transition-colors uppercase text-[10px] font-black tracking-[0.2em]"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>

            <h2 className="text-4xl font-black text-brand-primary tracking-tighter mb-8 leading-tight">
              Insira seus <span className="text-brand-mango">detalhes.</span>
            </h2>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-primary/30 ml-6 uppercase tracking-[0.3em]">
                  {method === 'email' ? 'Seu E-mail Profissional' : 'Seu Telefone'}
                </label>
                <div className="relative">
                  <input 
                    autoFocus
                    type={method === 'email' ? 'email' : 'tel'}
                    placeholder={method === 'email' ? 'nome@omiai.app' : '+55 (11) 99999-9999'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-8 bg-white border border-brand-mango/10 rounded-[40px] font-black text-xl text-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-mango/5 focus:border-brand-mango transition-all placeholder:text-brand-primary/5 shadow-sm"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {value.length > 5 && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-brand-mango/20 text-brand-mango flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-primary/30 ml-6 uppercase tracking-[0.3em]">
                  Código de Convite (Opcional)
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="ON-XXXX-000"
                    value={inviteCode}
                    onChange={(e) => onUpdateInviteCode(e.target.value.toUpperCase())}
                    className="w-full p-6 bg-white border border-brand-mango/10 rounded-[32px] font-black text-sm text-brand-primary focus:outline-none focus:ring-4 focus:ring-brand-mango/5 focus:border-brand-mango transition-all placeholder:text-brand-primary/10 shadow-sm"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2">
                    <UserPlus className="w-5 h-5 text-brand-primary/10" />
                  </div>
                </div>
                <p className="text-[9px] font-bold text-brand-mango ml-6 uppercase tracking-wider">
                  Ganhe 1 semana de Gold ao usar um convite!
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                disabled={!value}
                className="w-full py-8 bg-brand-secondary text-white rounded-[40px] font-black text-lg shadow-2xl shadow-brand-secondary/30 flex items-center justify-center gap-4 group disabled:opacity-30 disabled:scale-100 transition-all"
              >
                Continuar
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </motion.button>

              <p className="text-center text-[10px] font-black text-brand-primary/20 uppercase tracking-[0.2em] px-10">
                Código de segurança criptografado enviado instantaneamente.
              </p>
            </div>
          </motion.div>
        )}

        {step === 'ethics' && (
          <motion.div 
            key="ethics"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md px-8 pt-20 pb-12 flex flex-col h-full z-10"
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-brand-mango/10 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-10 h-10 text-brand-mango" />
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-brand-primary tracking-tighter mb-4">Compromisso Opala Negra</h2>
              <p className="text-gray-500 font-medium">Princípios de integridade e respeito mútuo em escala global.</p>
            </div>

            <div className="space-y-4 mb-12">
              {[
                { title: "Identidade Real", desc: "Biometria avançada para um ecossistema livre de robôs." },
                { title: "Conduta Ética", desc: "Protocolos rigorosos de convivência e banimento instantâneo." },
                { title: "Privacidade Digital", desc: "Seus dados são blindados e sua história pertence a você." }
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="p-6 bg-white/60 backdrop-blur-sm border border-brand-mango/5 rounded-[32px] flex items-start gap-5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-2xl bg-brand-mango/10 flex items-center justify-center text-brand-mango shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-brand-primary text-sm uppercase tracking-tight">{item.title}</h4>
                    <p className="text-xs text-brand-primary/50 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="w-full h-16 bg-brand-secondary text-white rounded-2xl font-black text-base shadow-xl shadow-brand-secondary/25 flex items-center justify-center gap-3 group mt-auto hover:bg-brand-primary transition-all duration-300"
            >
              Aceitar Compromisso
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
