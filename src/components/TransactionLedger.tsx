import { 
  ShieldCheck, 
  TrendingUp, 
  Shield, 
  Receipt, 
  Clock, 
  Filter, 
  ChevronRight,
  TrendingDown,
  ArrowLeft
} from 'lucide-react';
// @ts-ignore
import * as ReactWindow from 'react-window';

const List = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList;

export function TransactionLedger({ onBack }: { onBack: () => void }) {
  // Generate a larger set of mock transactions to demonstrate react-window virtualization
  const baseTransactions = [
    { plan: 'Plano R$ 15', amount: 'R$ 15,00', status: 'Aprovado' },
    { plan: 'Plano R$ 10', amount: 'R$ 10,00', status: 'Pendente' },
    { plan: 'Plano R$ 7', amount: 'R$ 7,00', status: 'Aprovado' },
    { plan: 'Plano R$ 25', amount: 'R$ 25,00', status: 'Aprovado' },
    { plan: 'Plano R$ 50', amount: 'R$ 50,00', status: 'Aprovado' },
  ];

  const transactions = Array.from({ length: 500 }, (_, index) => {
    const base = baseTransactions[index % baseTransactions.length];
    const id = (index + 1).toString();
    const nsu = (49203841000 + index).toString();
    const day = Math.max(1, 24 - Math.floor(index / 15)).toString().padStart(2, '0');
    const hour = (10 + (index % 12)).toString().padStart(2, '0');
    const minute = (10 + (index % 49)).toString().padStart(2, '0');
    return {
      id,
      plan: base.plan,
      nsu,
      amount: base.amount,
      status: base.status,
      date: `${day} Out, 2023`,
      time: `${hour}:${minute}`
    };
  });

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const tx = transactions[index];
    if (!tx) return null;
    const isApproved = tx.status === 'Aprovado' || tx.status === 'Approved';
    return (
      <div style={style} className="pb-3 pr-2">
        <div className="group bg-indigo-900/10 border border-white/5 rounded-[32px] p-6 flex items-center justify-between hover:bg-indigo-900/30 transition-all cursor-pointer relative overflow-hidden h-[112px]">
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 opacity-40 transition-all group-hover:opacity-100 ${
            isApproved ? 'bg-emerald-400' : 'bg-amber-400'
          }`} />
          
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-100 group-hover:scale-105 transition-transform shrink-0">
              {isApproved ? <Receipt className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-black tracking-tight text-white m-0 truncate leading-none">{tx.plan}</p>
              <p className="text-[10px] font-bold text-indigo-100/30 uppercase tracking-widest mt-1.5">NSU: {tx.nsu}</p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xl font-black text-white m-0 leading-none">{tx.amount}</p>
            <div className="flex items-center justify-end gap-1.5 mt-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                isApproved ? 'text-emerald-400' : 'text-amber-400'
              }`}>{tx.status}</span>
            </div>
            <p className="text-[10px] font-bold text-indigo-100/20 mt-1.5 uppercase tracking-tighter">{tx.date} • {tx.time}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-indigo-950 text-indigo-50 flex flex-col pt-safe overflow-y-auto">
      <header className="fixed top-0 w-full z-50 bg-indigo-950 border-b border-white/5 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft className="w-6 h-6 text-indigo-50" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">Opala Negra</h1>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-400/20 shadow-2xl">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" />
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto w-full space-y-12 animate-fade-in">
        <div className="bg-indigo-900/40 border border-emerald-400/10 rounded-[32px] p-6 flex items-start gap-4 shadow-3xl">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
          <div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Status do Plano Ativo</p>
            <p className="text-sm font-bold text-indigo-100/90 leading-tight">
              Seu Plano via InfinitePay (R$ 15) está ativo e seguro. O monitoramento em tempo real está habilitado para todas as transações futuras.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-indigo-900/20 border border-white/5 rounded-[32px] p-8 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute inset-0 bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity blur-3xl rounded-full" />
            <div className="relative z-10">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">LIQUIDEZ ATUAL</h2>
              <p className="text-6xl font-black tracking-tighter text-white">R$ 4.280,50</p>
            </div>
            <div className="mt-12 flex items-center gap-2 relative z-10">
              <span className="text-emerald-400 flex items-center gap-1 font-black text-sm">
                <TrendingUp className="w-4 h-4" /> +12.5%
              </span>
              <span className="text-indigo-100/30 text-xs font-bold uppercase tracking-tight">vs mês anterior</span>
            </div>
          </div>

          <div className="bg-emerald-400 text-indigo-950 rounded-[32px] p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-emerald-400/20">
            <div className="w-16 h-16 rounded-full bg-indigo-950 flex items-center justify-center mb-4 text-emerald-400 shadow-xl">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black tracking-tight">Livro Razão Seguro</h3>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Histórico criptografado ponta a ponta</p>
          </div>
        </div>

        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold tracking-tighter">Histórico de Transações</h2>
            <button className="bg-white/5 hover:bg-white/10 px-6 py-2.5 rounded-2xl flex items-center gap-2 transition-all group">
              <Filter className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100 group-hover:text-white">Filtrar</span>
            </button>
          </div>

          <div className="space-y-3">
            <List
              height={450}
              itemCount={transactions.length}
              itemSize={124}
              width="100%"
            >
              {Row}
            </List>
          </div>

          <div className="mt-12 flex justify-center pb-20">
            <button className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2 hover:text-white transition-colors group">
              Ver arquivo completo
              <ChevronRight className="w-4 h-4 rotate-90 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
