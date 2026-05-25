import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Shield, Sparkles, MapPin, AlertCircle, UserCheck, ArrowUpDown } from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import * as pkg from 'react-window';
const { FixedSizeList: List } = pkg as any;

export function UserList() {
  const { users, loading, error } = useUsers();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(450);
  const [showGoldOnly, setShowGoldOnly] = useState<boolean>(() => {
    try {
      return localStorage.getItem('user_list_filter_gold') === 'true';
    } catch {
      return false;
    }
  });
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(() => {
    try {
      return localStorage.getItem('user_list_filter_verified') === 'true';
    } catch {
      return false;
    }
  });
  const [sortBy, setSortBy] = useState<'none' | 'reputation-desc' | 'reputation-asc'>('none');

  useEffect(() => {
    try {
      localStorage.setItem('user_list_filter_gold', String(showGoldOnly));
    } catch (err) {
      console.error('Failed to save gold filter preference:', err);
    }
  }, [showGoldOnly]);

  useEffect(() => {
    try {
      localStorage.setItem('user_list_filter_verified', String(showVerifiedOnly));
    } catch (err) {
      console.error('Failed to save verified filter preference:', err);
    }
  }, [showVerifiedOnly]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    
    updateSize();

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      setContainerWidth(entries[0].contentRect.width);
    });

    observer.observe(containerRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const filtered = users.filter(u => {
      if (showGoldOnly && u.plan !== 'gold') return false;
      if (showVerifiedOnly && u.verificationLevel < 2) return false;
      return true;
    });

    if (sortBy === 'reputation-desc') {
      return [...filtered].sort((a, b) => (b.reputation || 0) - (a.reputation || 0));
    } else if (sortBy === 'reputation-asc') {
      return [...filtered].sort((a, b) => (a.reputation || 0) - (b.reputation || 0));
    }
    return filtered;
  }, [users, showGoldOnly, showVerifiedOnly, sortBy]);

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
          <Sparkles className="w-4 h-4 text-amber-500 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-xs font-black uppercase tracking-widest text-[#94a3b8]">
          Carregando Conexões em Tempo Real...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-10 px-6 rounded-[32px] bg-red-500/5 border border-red-500/10 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">Falha de Sincronização</h3>
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
          Não foi possível sincronizar novos perfis em tempo real. Por favor verifique seu acesso de rede.
        </p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="w-full py-12 px-6 rounded-[32px] bg-slate-950 border border-slate-900 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-[#f59e0b]/60">
          <UserCheck className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-widest">Nenhum Membro Ativo</h3>
          <p className="text-[11px] text-[#94a3b8] mt-1 max-w-xs leading-relaxed">
            Nenhum outro cadastro ativo e válido foi localizado nesse momento.
          </p>
        </div>
      </div>
    );
  }

  const columns = containerWidth >= 520 ? 2 : 1;
  const rowCount = Math.ceil(filteredUsers.length / columns);
  const itemSize = 105; // row height 89px + padding bottom 16px
  const listHeight = Math.min(470, rowCount * itemSize);

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const startIndex = index * columns;
    const rowUsers = [];
    
    for (let c = 0; c < columns; c++) {
      const uIndex = startIndex + c;
      if (uIndex < filteredUsers.length) {
        rowUsers.push({ profile: filteredUsers[uIndex], index: uIndex });
      }
    }

    return (
      <div style={style} className="flex gap-4 pb-4 px-1">
        {rowUsers.map(({ profile, index: uIndex }) => {
          const isGold = profile.plan === 'gold';
          return (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(uIndex * 0.05, 0.4) }}
              className={`flex-1 relative overflow-hidden rounded-[24px] p-4 border transition-all duration-300 bg-slate-950 flex items-center justify-between ${
                isGold 
                  ? 'border-amber-500/20 hover:border-amber-500/50 shadow-[0_8px_20px_-6px_rgba(245,158,11,0.06)]' 
                  : 'border-slate-800/80 hover:border-slate-700'
              }`}
              style={{ height: '89px' }}
            >
              <div className="flex items-center gap-3.5 relative z-10 w-full min-w-0">
                {/* Profile Photo */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative group/img hover:scale-105 transition-transform duration-300">
                    <img 
                      src={profile.imageUrl} 
                      alt={profile.name} 
                      className="w-full h-full object-cover filter brightness-95"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-950 bg-emerald-500 shadow-sm" />
                </div>

                {/* Info Text */}
                <div className="min-w-0 flex-grow">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h5 className="text-xs font-black text-slate-100 truncate hover:text-amber-400 transition-colors">
                      {profile.name}, {profile.age}
                    </h5>
                    {profile.verificationLevel >= 2 && (
                      <Shield className="w-3 h-3 text-[#f59e0b] shrink-0 fill-[#f59e0b]/15" />
                    )}
                  </div>
                  
                  {/* Role / Description */}
                  <p className="text-[9px] font-black uppercase tracking-wider text-[#94a3b8] mt-0.5 truncate">
                    {profile.role || 'Membro Elite'}
                  </p>

                  {/* Location & Reputation Info */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 select-none">
                    <div className="flex items-center gap-1 min-w-0 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{profile.location}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-500 shrink-0 whitespace-nowrap ml-2">
                      ★ {profile.reputation || 100} Rep
                    </span>
                  </div>
                </div>

                {/* Plan Tag */}
                {isGold && (
                  <div className="px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-black uppercase tracking-wider shrink-0 select-none">
                    Gold
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        {columns === 2 && rowUsers.length === 1 && (
          <div className="flex-1 invisible" style={{ height: '89px' }} />
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="UserList space-y-4">
      {/* Header Stat Tag */}
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#f59e0b]">
          Lista de Membros Ativos ({filteredUsers.length})
        </h4>
        <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-emerald-500">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          Ativo
        </div>
      </div>

      {/* Filter Toggles Row */}
      <motion.div 
        layout
        whileTap={{ scale: 0.97 }}
        className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-2 rounded-2xl bg-slate-950/50 backdrop-blur-md border border-slate-900/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] transition-all"
        animate={{
          scale: (showGoldOnly || showVerifiedOnly || sortBy !== 'none') ? 1.01 : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <motion.button
            id="btn-filter-gold"
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowGoldOnly(!showGoldOnly)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              showGoldOnly
                ? 'bg-amber-500/20 text-[#f59e0b] border-amber-500/40 shadow-[0_4px_12px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/10'
                : 'bg-slate-900/20 text-slate-400 border-slate-800/60 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Sparkles className={`w-3 h-3 ${showGoldOnly ? 'text-amber-500' : 'text-slate-500'}`} />
            <span>Membros Gold</span>
            {showGoldOnly && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
          </motion.button>

          <motion.button
            id="btn-filter-verified"
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              showVerifiedOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_4px_12px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/10'
                : 'bg-slate-900/20 text-slate-400 border-slate-800/60 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <Shield className={`w-3 h-3 ${showVerifiedOnly ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>Verificados</span>
            {showVerifiedOnly && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
          </motion.button>

          {(showGoldOnly || showVerifiedOnly || sortBy !== 'none') && (
            <motion.button
              id="btn-filter-clear"
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowGoldOnly(false);
                setShowVerifiedOnly(false);
                setSortBy('none');
              }}
              className="text-[10px] font-extrabold text-slate-500 hover:text-red-400 uppercase tracking-widest pl-1.5 cursor-pointer transition-colors"
            >
              Limpar
            </motion.button>
          )}
        </div>

        {/* Reputação Sorter Dropdown Menu */}
        <div className="relative shrink-0 select-none">
          <select
            id="select-sort-reputation"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="appearance-none bg-slate-900/45 text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer focus:outline-none transition-all duration-200 pr-8"
          >
            <option value="none" className="bg-slate-950 text-slate-400">Ordenar por</option>
            <option value="reputation-desc" className="bg-slate-950 text-slate-200">Maior Reputação</option>
            <option value="reputation-asc" className="bg-slate-950 text-slate-200">Menor Reputação</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>

      {/* Virtualized List Container */}
      <div className="w-full">
        {filteredUsers.length > 0 ? (
          <List
            height={listHeight}
            itemCount={rowCount}
            itemSize={itemSize}
            width="100%"
            className="scrollbar-hide"
          >
            {Row}
          </List>
        ) : (
          <div className="w-full py-12 px-6 rounded-[24px] bg-slate-950/50 border border-slate-900/60 flex flex-col items-center justify-center text-center space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-[#f59e0b]">
              Nenhum resultado correspondente
            </p>
            <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
              Tente recarregar ou desativar os filtros de membro "Gold" ou "Verificado".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
