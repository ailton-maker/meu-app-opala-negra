import { 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Star, 
  MapPin, 
  ArrowRight,
  Shield,
  CreditCard,
  History,
  Lock,
  ChevronRight,
  CheckCircle,
  Info,
  HelpCircle,
  LogOut,
  Download
} from 'lucide-react';

export function HelpAndData({ onBack }: { onBack: () => void }) {
  return (
    <div className="pt-20 pb-24 px-5 max-w-2xl mx-auto h-full overflow-y-auto">
      <div className="mt-8 mb-10">
        <h2 className="text-4xl font-extrabold text-indigo-950 tracking-tighter">Ajuda & Dados</h2>
        <p className="text-gray-400 font-bold mt-2">Gerencie sua privacidade e obtenha assistência profissional.</p>
      </div>

      {/* Security Banner */}
      <div className="mb-10 p-5 rounded-[24px] bg-slate-50 border border-gray-100 flex items-start gap-4">
        <Info className="w-5 h-5 text-indigo-700 fill-indigo-700/10 shrink-0" />
        <p className="text-xs font-bold text-gray-500 leading-normal">
          A segurança dos seus dados é nossa prioridade. Cumprimos os padrões globais de proteção de dados (LGPD/GDPR) para garantir que sua privacidade permaneça intacta.
        </p>
      </div>

      <section className="mb-12">
        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-6">Suporte ao Cliente</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:bg-gray-50 active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950 flex items-center justify-center text-white">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-indigo-950">Central de Atendimento</p>
                <p className="text-xs text-gray-400 font-bold">Fale com nossa equipe</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-200" />
          </button>
          
          <button className="w-full flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:bg-gray-50 active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 flex items-center justify-center text-indigo-950">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-indigo-950">Chat ao Vivo</p>
                <p className="text-xs text-gray-400 font-bold">Suporte instantâneo para membros premium</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-200" />
          </button>
        </div>
      </section>

      <section className="mb-12">
        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-6">Backup & Recuperação de Conta</h3>
        <div className="p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">EMAIL DE RECUPERAÇÃO</label>
              <div className="relative">
                <input 
                  type="email"
                  defaultValue="backup@exemplo.com"
                  className="w-full h-14 px-5 rounded-2xl border border-gray-100 bg-gray-50 text-indigo-950 font-bold focus:ring-2 focus:ring-indigo-950 outline-none transition-all"
                />
                <CheckCircle className="absolute right-4 top-4 w-6 h-6 text-emerald-500 fill-emerald-500/10" />
              </div>
            </div>
            <button className="w-full h-14 bg-indigo-950 text-white font-bold rounded-2xl hover:opacity-90 active:scale-95 transition-all">
              Atualizar Configurações de Recuperação
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-6">Portabilidade de Dados (LGPD)</h3>
        <div className="space-y-3">
          <div className="p-5 bg-white border border-gray-100 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-indigo-900">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-950">Exportar Dados Pessoais</p>
                <p className="text-xs text-gray-400 font-bold">Solicite um .zip do histórico do seu perfil</p>
              </div>
            </div>
            <button className="px-5 py-2 bg-emerald-400 text-indigo-950 text-[10px] font-black rounded-full hover:opacity-90 active:scale-95 transition-all">
              EXPORTAR
            </button>
          </div>
          
          <div className="p-5 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-between opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <History className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">Solicitar Logs</p>
                <p className="text-xs text-gray-400 font-bold">Última exportação: 3 meses atrás</p>
              </div>
            </div>
            <Lock className="w-5 h-5 text-gray-300" />
          </div>
        </div>
      </section>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
