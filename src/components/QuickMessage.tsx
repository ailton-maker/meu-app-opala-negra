import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send, Lock } from 'lucide-react';

interface QuickMessageProps {
  onClose: () => void;
  onSend: (message: string) => void;
  recipientName: string;
}

export function QuickMessage({ onClose, onSend, recipientName }: QuickMessageProps) {
  const [message, setMessage] = useState('');
  const maxChars = 150;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-indigo-950/60 backdrop-blur-sm flex items-center justify-center px-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl border border-gray-100"
      >
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-indigo-950">Enviar nota rápida</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <p className="text-sm text-gray-500 font-medium">
            Chame a atenção de <span className="text-indigo-950 font-bold">{recipientName}</span> com uma mensagem ética.
          </p>

          <div className="relative">
            <textarea 
              autoFocus
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
              className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-indigo-900 font-medium placeholder:text-gray-300 focus:ring-2 focus:ring-indigo-950 outline-none transition-all resize-none"
              placeholder={`Diga algo legal para ${recipientName}...`}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <span className={`text-[10px] font-black ${message.length >= maxChars ? 'text-rose-500' : 'text-gray-300'}`}>
                {message.length}/{maxChars}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onSend(message)}
              className="w-full h-14 bg-indigo-950 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
            >
              Enviar Mensagem
              <Send className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest opacity-60">
              <Lock className="w-3 h-3" />
              Criptografia de ponta a ponta
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
