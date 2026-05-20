import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck,
  Lock,
  ChevronRight,
  Verified,
  Search,
  Filter,
  Receipt,
  Clock,
  MoreVertical,
  MessageSquare,
  EyeOff,
  Send,
  PlusCircle,
  AlertOctagon,
  Image as ImageIcon,
  UserRound,
  Bell,
  BellOff,
  Ban
} from 'lucide-react';
import { UserProfile, Conversation, Message } from '../types';
import { firebaseDb } from '../services/db';
import { auth } from '../services/firebase';

export function ChatView({ conversationId, onBack, userProfile }: { conversationId: string | null, onBack: () => void, userProfile: UserProfile | null }) {
  const [text, setText] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRemoteTyping, setIsRemoteTyping] = useState(false);

  useEffect(() => {
    if (conversationId && userProfile) {
      // Subscribe to messages
      const unsubscribeMessages = firebaseDb.subscribeToMessages(conversationId, (newMessages) => {
        setMessages(newMessages);
      });

      // Subscribe to conversation for remote typing status
      const unsubscribeConversation = firebaseDb.subscribeToConversations(userProfile.id, (convs) => {
        const current = convs.find(c => c.id === conversationId);
        if (current) {
          setConversation(current);
          
          // Determine if target is typing
          const targetId = current.participants.find(p => p !== userProfile.id);
          if (targetId && current.typingStatus?.[targetId]) {
            setIsRemoteTyping(true);
          } else {
            setIsRemoteTyping(false);
          }
        }
      });

      return () => {
        unsubscribeMessages();
        unsubscribeConversation();
      };
    }
  }, [conversationId, userProfile]);

  // Handle local typing indicator
  useEffect(() => {
    if (!conversationId || !userProfile) return;

    if (text.length > 0) {
      firebaseDb.setTypingStatus(conversationId, userProfile.id, true);
      
      const timeout = setTimeout(() => {
        firebaseDb.setTypingStatus(conversationId, userProfile.id, false);
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      firebaseDb.setTypingStatus(conversationId, userProfile.id, false);
    }
  }, [text, conversationId, userProfile]);

  const handleSend = async () => {
    if (text.trim() && conversationId && auth.currentUser) {
      await firebaseDb.sendMessage(conversationId, text, auth.currentUser.uid);
      setText('');
      // Explicitly clear typing on send
      firebaseDb.setTypingStatus(conversationId, auth.currentUser.uid, false);
    }
  };

  if (!conversation) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-brand-surface/50 backdrop-blur-md flex justify-center overflow-hidden">
      <div className="w-full max-w-lg bg-white flex flex-col relative shadow-2xl overflow-hidden">
        <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 bg-white shrink-0">
          <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-50">
            <ChevronRight className="w-6 h-6 rotate-180 text-brand-primary" />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-brand-mango/10 flex items-center justify-center overflow-hidden">
               {conversation.targetProfile.imageUrl ? (
                 <img src={conversation.targetProfile.imageUrl} alt={conversation.targetProfile.name} className="w-full h-full object-cover" />
               ) : (
                 <UserRound className="w-6 h-6 text-brand-mango" />
               )}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full transition-colors ${isRemoteTyping ? 'bg-emerald-500 animate-pulse' : 'bg-brand-mango'}`}></div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-black text-brand-primary">{conversation.targetProfile.name}</h2>
              <Verified className="w-3.5 h-3.5 text-brand-mango fill-brand-mango" />
            </div>
            {isRemoteTyping ? (
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                Digitando...
              </p>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-brand-primary/30 font-black uppercase tracking-tight">
                <Lock className="w-2.5 h-2.5" />
                Relacionamento Seguro
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={async () => {
              if (conversationId && conversation) {
                await firebaseDb.toggleMute(conversationId, !!conversation.isMuted);
              }
            }}
            className={`p-2 rounded-full transition-all active:scale-90 ${conversation.isMuted ? 'text-brand-mango bg-brand-mango/10' : 'text-gray-400 hover:bg-gray-50'}`}
            title={conversation.isMuted ? 'Ativar Notificações' : 'Silenciar Notificações'}
          >
            {conversation.isMuted ? <BellOff className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </button>
          <button 
            onClick={async () => {
              if (conversation && userProfile && confirm(`Deseja bloquear ${conversation.targetProfile.name}? Você não receberá mais mensagens deste usuário.`)) {
                await firebaseDb.blockUser(userProfile.id, conversation.targetProfile.id);
                onBack();
              }
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90"
            title="Bloquear Usuário"
          >
            <Ban className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-grow bg-brand-surface overflow-y-auto px-5 py-6 space-y-6">
        <div className="bg-brand-mango/5 border border-brand-mango/20 rounded-2xl p-5 flex gap-4 shadow-sm">
          <AlertOctagon className="w-6 h-6 text-brand-mango shrink-0" />
          <div>
            <p className="text-[10px] font-black text-brand-mango uppercase tracking-widest mb-1 opacity-70">Protocolo Opala Negra</p>
            <p className="text-sm text-brand-primary/80 leading-snug font-medium">
              Para sua segurança em relacionamentos reais, prefira manter a conversa aqui. Nossa IA protege sua identidade.
            </p>
          </div>
        </div>

        {/* Messages List */}
        {messages.map((msg, idx) => (
          <div 
            key={msg.id || idx} 
            className={`flex flex-col gap-1 max-w-[85%] ${msg.senderId === userProfile?.id ? 'self-end items-end' : 'items-start'}`}
          >
            <div className={`p-4 rounded-2xl shadow-sm ${
              msg.senderId === userProfile?.id 
                ? 'bg-brand-primary text-white rounded-tr-none' 
                : 'bg-white border border-gray-100 text-brand-primary rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed font-medium">
                {msg.text}
              </p>
            </div>
            <div className="flex items-center gap-1 px-1">
              <span className="text-[10px] text-gray-400 font-bold">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
              </span>
              {msg.senderId === userProfile?.id && (
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-2xl transition-colors">
            <PlusCircle className="w-6 h-6" />
          </button>
          <div className="flex-grow bg-gray-50 border border-gray-100 rounded-2xl p-1 relative flex items-center">
            <textarea 
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 py-3 px-3 text-sm font-medium text-brand-primary placeholder:text-gray-400 resize-none max-h-32"
              placeholder="Escreva sua mensagem segura..."
            />
            <div className="px-3">
              <Lock className="w-4 h-4 text-emerald-500 opacity-40" />
            </div>
          </div>
          <button 
            onClick={handleSend}
            className="p-4 bg-brand-mango text-white rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </div>
);
}

export function Messages({ onOpenChat, userProfile }: { onOpenChat: (id: string) => void, userProfile: UserProfile | null }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (userProfile) {
      const unsubscribe = firebaseDb.subscribeToConversations(userProfile.id, (newConvs) => {
        setConversations(newConvs);
      });
      return () => unsubscribe();
    }
  }, [userProfile]);

  const deleteConversation = (id: string) => {
    if (confirm('Deseja arquivar esta conversa?')) {
      // Logic for archiving
    }
  };

  return (
    <div className="pt-16 pb-24 px-5 max-w-lg mx-auto h-full overflow-y-auto bg-linear-to-b from-white to-brand-highlight/30">
      <div className="mt-8 mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-brand-primary tracking-tighter">Mensagens</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/30 mt-1">
            Espapaço Ocupado: <span className="text-brand-mango">{conversations.length}/{userProfile?.maxConversations || '∞'}</span>
          </p>
        </div>
        <button className="p-3 bg-brand-highlight text-brand-primary rounded-xl hover:bg-brand-mango hover:text-white transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest">Nenhuma conversa ainda</p>
          </div>
        ) : (
          conversations.map(conv => (
            <div key={conv.id} className="relative group">
              <button 
                onClick={() => onOpenChat(conv.id)}
                className="w-full flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-3xl hover:bg-gray-50 transition-colors active:scale-[0.99]"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-brand-highlight flex items-center justify-center overflow-hidden">
                    {conv.targetProfile.imageUrl ? (
                      <img src={conv.targetProfile.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <UserRound className="w-8 h-8 text-brand-primary/20" />
                    )}
                  </div>
                  {conv.targetProfile.verificationLevel >= 2 && (
                    <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                      <Verified className="w-5 h-5 text-brand-mango fill-brand-mango border-2 border-white rounded-full" />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow text-left">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-brand-primary">{conv.targetProfile.name}</h3>
                      {conv.unreadCount > 0 && <span className="w-1.5 h-1.5 rounded-full bg-brand-mango animate-pulse" />}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {conv.updatedAt && (
                        (conv.updatedAt instanceof Date) ? 
                          conv.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                          (conv.updatedAt as any).toDate ? 
                            (conv.updatedAt as any).toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                            new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1 font-medium">{conv.lastMessage.text}</p>
                </div>

                {conv.unreadCount > 0 ? (
                  <div className="w-5 h-5 bg-brand-mango text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {conv.unreadCount}
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-brand-secondary" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
