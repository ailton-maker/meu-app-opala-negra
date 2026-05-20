import { 
  Shield, 
  X, 
  Gavel, 
  AlertTriangle, 
  Search, 
  Megaphone, 
  ShieldAlert, 
  Briefcase, 
  Link2Off,
  Send,
  UserX,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export function ReportProfile({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 text-white flex flex-col pt-safe overflow-y-auto">
      <header className="fixed top-0 w-full z-50 bg-zinc-950 border-b border-white/5 flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-400" />
          <h1 className="text-xl font-bold text-indigo-50 tracking-tight">Opala Negra</h1>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-6 h-6 text-zinc-400" />
        </button>
      </header>

      <main className="flex-grow pt-24 pb-32 px-6 max-w-2xl mx-auto w-full space-y-12">
        <div className="bg-indigo-500/10 border border-indigo-400/20 rounded-3xl p-6 flex gap-4 items-start shadow-2xl">
          <Gavel className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-bold text-indigo-50 mb-1">Divulgação Obrigatória</h3>
            <p className="text-sm text-indigo-100/60 leading-relaxed font-medium">
              Enviar esta denúncia leva ao <span className="text-indigo-400 font-bold underline">bloqueio automático</span> deste usuário. Toda denúncia passa por revisão pericial manual de nossa equipe de confiança e segurança.
            </p>
          </div>
        </div>

        <section className="space-y-10">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter">Denunciar Perfil</h1>
            <p className="text-zinc-500 font-bold">Selecione o motivo principal desta denúncia para ajudar nossa equipe a investigar de forma eficaz.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'harassment', label: 'Assédio', desc: 'Abuso direcionado, bullying ou atenção indesejada persistente.', icon: Megaphone },
              { id: 'fake', label: 'Perfil Falso', desc: 'Roubo de identidade, catfishing ou contas de bot automatizadas.', icon: UserX },
              { id: 'safety', label: 'Política/Ofensivo', desc: 'Discurso de ódio, agendas políticas extremas ou mídia ofensiva.', icon: ShieldAlert },
              { id: 'external', label: 'Contato Externo', desc: 'Tentativas de mover a conversa para plataformas não monitoradas.', icon: Link2Off },
            ].map(cat => {
              const Icon = cat.icon;
              return (
                <label key={cat.id} className="group cursor-pointer relative bg-zinc-900 border border-white/5 hover:border-indigo-400/50 transition-all p-6 rounded-[28px] flex flex-col gap-4">
                  <input type="radio" name="report_type" className="sr-only peer" />
                  <div className="absolute top-6 right-6 w-5 h-5 border-2 border-white/10 rounded-full peer-checked:border-indigo-400 peer-checked:bg-indigo-400 flex items-center justify-center transition-all">
                    <div className="w-2 h-2 bg-indigo-950 rounded-full opacity-0 peer-checked:opacity-100"></div>
                  </div>
                  <Icon className="w-8 h-8 text-indigo-400" />
                  <div>
                    <h4 className="font-bold text-indigo-50 mb-1">{cat.label}</h4>
                    <p className="text-xs text-zinc-500 leading-normal font-medium">{cat.desc}</p>
                  </div>
                </label>
              )
            })}
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-1">Contexto Adicional</label>
            <textarea 
              className="w-full bg-zinc-900 border border-white/5 rounded-[24px] p-6 text-white font-medium focus:ring-2 focus:ring-indigo-400/50 outline-none transition-all placeholder:text-zinc-700 min-h-[160px]"
              placeholder="Descreva o comportamento ou evidências em detalhes..."
            />
          </div>

          <div className="pt-6 space-y-4">
            <button className="w-full h-16 bg-rose-600 text-white rounded-[24px] font-bold text-lg hover:bg-rose-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl">
              <AlertTriangle className="w-6 h-6" />
              Enviar Denúncia & Bloquear
            </button>
            <button onClick={onBack} className="w-full h-16 bg-white/[0.03] border border-white/5 text-zinc-400 rounded-[24px] font-bold hover:bg-white/[0.05] transition-colors">
              Cancelar
            </button>
          </div>
          
          <p className="text-center text-[10px] font-bold text-zinc-700 italic tracking-wide">
            Nota: 3 denúncias resultam em um bloqueio temporário automático.
          </p>
        </section>

        <div className="p-8 rounded-[32px] bg-zinc-900 border border-white/5 flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-indigo-400/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-xs font-bold text-zinc-500 leading-normal">
            Sua segurança é nossa prioridade. As denúncias são estritamente confidenciais e não notificam o usuário denunciado sobre sua identidade.
          </p>
        </div>
      </main>
    </div>
  );
}
