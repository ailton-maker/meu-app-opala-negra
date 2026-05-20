import { useState } from 'react';
import { 
  Verified, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  Shield,
  Gavel,
  Lock,
  Sparkles,
  CreditCard,
  CheckCircle,
  ChevronRight
} from 'lucide-react';

export function PremiumCheckout({ onBack, onUpgrade }: { onBack: () => void, onUpgrade?: (tier: string) => void }) {
  const [selectedTier, setSelectedTier] = useState<string>('silver');

  return (
    <div className="fixed inset-0 z-[100] bg-white text-indigo-950 flex flex-col pt-safe overflow-y-auto">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-lg bg-white border-b border-gray-100 flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-50 transition-colors">
              <ArrowLeft className="w-6 h-6 text-indigo-950" />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Opala Negra Premium</h1>
          </div>
          <Shield className="w-6 h-6 text-indigo-950 fill-indigo-950/5" />
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-xl mx-auto w-full space-y-12">
        <section className="rounded-[32px] overflow-hidden relative h-56 bg-indigo-950 shadow-2xl border border-indigo-900/50 flex items-center justify-center">
          <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-indigo-900 via-indigo-950 to-emerald-900"></div>
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div className="relative z-10 text-center px-8">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-3 block">ASSINATURA ELITE</span>
            <h2 className="text-4xl font-extrabold text-white tracking-tighter">Desbloqueie seu Potencial</h2>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-emerald-500 fill-emerald-500" />
            <h3 className="text-xl font-bold tracking-tight">Escolha seu Plano</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                id: 'bronze', 
                label: 'Bronze', 
                price: 'R$15', 
                features: ['Até 15 conversas simultâneas', 'Exclua conversas para liberar espaço', 'Verificação Essencial'],
                color: 'from-amber-600 to-amber-800'
              },
              { 
                id: 'silver', 
                label: 'Prata', 
                price: 'R$25', 
                features: ['Até 25 conversas simultâneas', 'Ver quem te curtiu', 'Prioridade na Busca'], 
                popular: true,
                color: 'from-slate-300 to-slate-500'
              },
              { 
                id: 'gold', 
                label: 'Ouro', 
                price: 'R$45', 
                features: ['Até 35 conversas simultâneas', 'Explorar outras cidades', 'Modo Invisível', 'Selo Ouro de Reputação'],
                color: 'from-yellow-400 to-yellow-600'
              }
            ].map(plan => (
              <button 
                key={plan.id}
                onClick={() => setSelectedTier(plan.id)}
                className={`group relative flex flex-col p-6 rounded-[28px] text-left transition-all duration-300 ${
                  selectedTier === plan.id 
                    ? 'bg-white border-4 border-indigo-950 shadow-2xl scale-105 z-10' 
                    : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-950 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                    Mais Popular
                  </div>
                )}
                <div className={`w-full h-2 rounded-full bg-gradient-to-r ${plan.color} mb-4`} />
                <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${plan.popular ? 'text-indigo-900' : 'text-gray-400'}`}>
                  {plan.label}
                </span>
                <div className="text-3xl font-black text-indigo-950 mb-6">{plan.price}<span className="text-[10px] font-bold text-gray-400 ml-1">/mês</span></div>
                <ul className="space-y-3 flex-grow">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] font-bold text-gray-500 leading-snug">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[24px] flex gap-4 items-start shadow-sm shadow-amber-900/5">
            <ShieldCheck className="w-6 h-6 text-amber-600 fill-amber-600/10 shrink-0" />
            <div>
              <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Pagamento Seguro</h4>
              <p className="text-sm font-bold text-amber-800 leading-snug">
                Suas transações são processadas com criptografia de ponta a ponta via InfinitePay.
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-[32px] shadow-2xl shadow-indigo-900/5 space-y-8">
            <div className="flex justify-between items-center pb-6 border-b border-gray-50">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">Integração:</span>
              <span className="font-mono bg-indigo-50 px-3 py-1 rounded-lg text-xs font-bold text-indigo-900">ailton-soares-17p</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-950 rounded-2xl flex items-center justify-center text-emerald-400 shadow-lg">
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-lg font-black text-indigo-950">InfinitePay</p>
                  <p className="text-xs font-bold text-gray-400">Cartão de Crédito ou PIX</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-200 rotate-90" />
            </div>

            <button 
              onClick={() => onUpgrade?.(selectedTier)}
              className="w-full bg-indigo-950 text-white h-16 rounded-[24px] font-black text-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-900/30"
            >
              Confirmar Pagamento
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </section>

        <footer className="pt-12 pb-20 border-t border-gray-100 space-y-6">
          <div className="flex items-center gap-3 text-indigo-900/30">
            <Gavel className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">CONFORMIDADE LEGAL</span>
          </div>
          <p className="text-sm font-bold text-gray-400 leading-relaxed italic">
            Ao prosseguir, você concorda com nossos Termos de Uso. Em conformidade com a LGPD (Lei Geral de Proteção de Dados), seus dados pessoais de pagamento não são armazenados em nossos servidores, sendo processados exclusivamente pelo provedor InfinitePay sob as mais rigorosas normas de segurança PCI-DSS.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-gray-50 px-5 py-2 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
              <Lock className="w-3 h-3" />
              SSL SECURE
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-5 py-2 rounded-full text-[9px] font-black text-emerald-700 uppercase tracking-widest border border-emerald-100">
              <ShieldCheck className="w-3 h-3" />
              LGPD COMPLIANT
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
