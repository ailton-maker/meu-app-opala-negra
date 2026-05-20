import { 
  Shield, 
  TrendingUp, 
  Clock, 
  BarChart3, 
  AlertTriangle, 
  Download,
  Users,
  CreditCard,
  Map,
  ChevronRight,
  MoreVertical,
  Search,
  CheckCircle,
  XCircle,
  Timer as ClockIcon,
  Filter
} from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="pt-16 pb-24 px-5 max-w-7xl mx-auto w-full overflow-y-auto">
      <div className="mt-8 mb-12">
        <h2 className="text-4xl font-extrabold text-indigo-950 mb-4 tracking-tighter">Painel de Analytics</h2>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <Shield className="w-6 h-6 text-emerald-600" />
          <p className="text-sm font-bold text-emerald-800 tracking-tight leading-relaxed">
            Acesso restrito ao nível Administrativo. Todas as ações nesta página estão sendo registradas nos logs de auditoria para fins de compliance LGPD.
          </p>
        </div>
        <div className="flex justify-end mt-6">
          <button className="flex items-center gap-2 bg-indigo-950 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:opacity-90 transition-opacity shadow-lg">
            <Download className="w-4 h-4" /> 
            EXPORTAR CSV (LGPD)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-indigo-900/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Taxa de Match</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-5xl font-extrabold text-indigo-950 tracking-tighter">64.2%</div>
          <div className="flex items-center gap-1.5 text-emerald-500 mt-3 font-bold text-xs">
            <TrendingUp className="w-4 h-4" />
            +4.3% vs. mês anterior
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-indigo-900/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Sessão Média</span>
            <BarChart3 className="w-5 h-5 text-indigo-900" />
          </div>
          <div className="text-5xl font-extrabold text-indigo-950 tracking-tighter">18m 42s</div>
          <div className="text-xs font-bold text-gray-400 mt-3 tracking-wide">Média de engajamento por match</div>
        </div>

        <div className="bg-indigo-950 text-white rounded-[32px] p-8 shadow-xl md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-white/10" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest">Planos InfinitePay</span>
              <div className="bg-emerald-500 text-indigo-950 px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">REAL TIME</div>
            </div>
            <div className="flex items-end gap-3 mb-6">
              <div className="text-5xl font-black tracking-tighter">R$ 142.850,00</div>
            </div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-3 border border-white/5 p-[1px]">
              <div className="w-[75%] h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
            </div>
            <p className="text-xs font-bold text-white/60 tracking-tight">75% da meta mensal atingida via InfinitePay Connect</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[32px] p-8 shadow-xl shadow-indigo-900/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-indigo-950">Municípios Ativos</h3>
            <button className="text-[10px] font-extrabold text-indigo-900 hover:opacity-70 flex items-center gap-2 uppercase tracking-widest">
              Relatório Completo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="aspect-video bg-slate-50 border border-gray-50 rounded-2xl relative overflow-hidden flex items-center justify-center">
             <Map className="w-20 h-20 text-indigo-100" />
             <div className="absolute bottom-6 left-6 bg-white shadow-2xl p-4 rounded-2xl border border-gray-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-indigo-950">São Paulo - 42%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-300" />
                  <span className="text-xs font-bold text-indigo-950">Curitiba - 18%</span>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] flex flex-col shadow-xl shadow-indigo-900/5">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Denúncias Pendentes
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {[
              { id: '4920', tag: 'ALTA', msg: 'Comportamento inadequado...', time: 'Há 12 min' },
              { id: '4918', tag: 'MÉDIA', msg: 'Foto de perfil suspeita...', time: 'Há 45 min' },
              { id: '4915', tag: 'BAIXA', msg: 'Nickname impróprio...', time: 'Há 2h' },
            ].map(item => (
              <div key={item.id} className="p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black text-indigo-950 uppercase">ID: #{item.id}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
                    item.tag === 'ALTA' ? 'bg-rose-50 text-rose-600' : 'bg-gray-100 text-gray-500'
                  }`}>{item.tag}</span>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-4">{item.msg}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                    <ClockIcon className="w-3 h-3" /> {item.time}
                  </span>
                  <button className="px-5 py-2 bg-indigo-950 text-white rounded-xl text-[10px] font-bold group-hover:scale-105 transition-all">ANALISAR</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-xl shadow-indigo-900/5">
        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/20 flex justify-between items-center">
          <h3 className="text-xl font-bold text-indigo-950">Logs de Auditoria (Compliance LGPD)</h3>
          <div className="flex gap-2">
            <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50"><Search className="w-5 h-5" /></button>
            <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50"><Filter className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fcfdfe] text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Timestamp</th>
                <th className="px-8 py-4">Administrador</th>
                <th className="px-8 py-4">Ação Realizada</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { time: '2023-10-24 14:22:01', admin: 'marcos.silva@omiai.io', action: 'Alteração status: User #882 -> Banido', status: 'SUCESSO' },
                { time: '2023-10-24 14:15:33', admin: 'admin.system', action: 'Exportação relatório financeiro (IP)', status: 'SUCESSO' },
                { time: '2023-10-24 13:58:12', admin: 'ana.clara@omiai.io', action: 'Sincronização HSM - Chaves', status: 'FALHA' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-indigo-50/30 transition-colors cursor-pointer">
                  <td className="px-8 py-5 text-xs font-bold text-gray-300">{log.time}</td>
                  <td className="px-8 py-5 text-sm font-bold text-indigo-950">{log.admin}</td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-500">{log.action}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                      log.status === 'SUCESSO' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <CheckCircle className="w-3 h-3" />
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 text-center border-t border-gray-50 bg-gray-50/10">
          <button className="text-[10px] font-black text-indigo-300 hover:text-indigo-900 transition-colors uppercase tracking-widest">
            Carregar Mais Logs
          </button>
        </div>
      </div>
    </div>
  );
}
