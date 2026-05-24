import { motion } from 'motion/react';
import { 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Scan,
  Camera,
  Gavel,
  User,
  Cake,
  Verified,
  Video,
  X,
  MapPin,
  Search
} from 'lucide-react';
import { useState } from 'react';

import { Gender } from '../types';
import { MapComponent } from './MapComponent';


export function Verification({ onComplete }: { onComplete: (gender: Gender, photos: string[], location: string, video?: string) => void }) {
  const [step, setStep] = useState<'consent' | 'gender' | 'location' | 'photos' | 'video' | 'thumb' | 'concluir'>('consent');
  const [agreed, setAgreed] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [cep, setCep] = useState('');
  const [isVerifyingCep, setIsVerifyingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]); 
  const [isUploading, setIsUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const [countdown, setCountdown] = useState(5);

  const handleCepChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 8);
    let formatted = cleaned;
    if (cleaned.length > 5) {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    setCep(formatted);
    setCepError(null);

    if (cleaned.length === 8) {
      triggerSearch(cleaned);
    } else {
      setSelectedLocation('');
    }
  };

  const triggerSearch = async (code: string) => {
    const cleaned = code.replace(/\D/g, '');
    if (cleaned.length !== 8) return;

    setIsVerifyingCep(true);
    setCepError(null);
    
    try {
      // Primary Attempt: ViaCEP
      let response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      let data = await response.json();
      
      if (data.erro) {
        // Fallback Attempt: BrasilAPI
        const fallbackResponse = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleaned}`);
        if (!fallbackResponse.ok) {
          throw new Error('Fallback failed');
        }
        const fallbackData = await fallbackResponse.json();
        setSelectedLocation(`${fallbackData.city}, ${fallbackData.state}`);
      } else {
        setSelectedLocation(`${data.localidade}, ${data.uf}`);
      }
    } catch (err) {
      console.error('CEP lookup error:', err);
      // Try one more time with BrasilAPI directly if primary fails with exception
      try {
        const directFallback = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleaned}`);
        if (directFallback.ok) {
          const fbData = await directFallback.json();
          setSelectedLocation(`${fbData.city}, ${fbData.state}`);
          return;
        }
      } catch (e) {
        console.error('Final fallback error:', e);
      }
      setCepError('Não foi possível localizar este CEP. Verifique os números.');
    } finally {
      setIsVerifyingCep(false);
    }
  };
  const startRecording = () => {
    setRecording(true);
    let count = 5;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count === 0) {
        clearInterval(interval);
        setRecording(false);
        setStep('concluir'); // In a real app we'd save video metadata
      }
    }, 1000);
  };

  const currentStepInfo = {
    consent: { title: "Segurança e Ética", desc: "Sua jornada segura começa aqui." },
    gender: { title: "Identificação", desc: "Como você se identifica?" },
    location: { title: "Sua Localização", desc: "Encontre parceiros na sua região." },
    photos: { title: "Suas Fotos", desc: "Mínimo de 3 e máximo de 7 fotos." },
    video: { title: "Apresentação (Opcional)", desc: "Um vídeo de até 15 segundos." },
    thumb: { title: "Verificação de Vida I", desc: "Faça o sinal de 'Joinha' (👍) por 5 segundos." },
    concluir: { title: "Tudo Pronto!", desc: "Seu perfil está sendo processado." }
  };

  return (
    <div className="min-h-screen bg-brand-surface pt-16 pb-12 px-6 overflow-y-auto font-sans bg-linear-to-b from-white to-brand-highlight/30">
      <main className="max-w-lg mx-auto space-y-10">
        {step !== 'concluir' && (
          <header className="text-center space-y-3">
            <h1 className="text-4xl font-black text-brand-primary tracking-tighter">{currentStepInfo[step === 'thumb' ? 'thumb' : step].title}</h1>
            <p className="text-brand-primary/50 font-medium">{currentStepInfo[step === 'thumb' ? 'thumb' : step].desc}</p>
          </header>
        )}

        {step === 'consent' && (
          <div className="space-y-8">
            <div className="bg-brand-mango/5 border-l-4 border-brand-mango p-6 rounded-r-3xl flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-brand-mango shrink-0" />
              <p className="text-xs font-bold text-brand-primary/80 leading-normal">
                Seus dados são criptografados e protegidos. Biometria Opala Negra ativada.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 space-y-6">
              <div className="flex items-center gap-4 p-5 bg-brand-mango/10 rounded-2xl border border-brand-mango/20">
                <Gavel className="w-6 h-6 text-brand-mango" />
                <p className="text-sm font-bold text-brand-primary">Protocolo de biometria obrigatório para sua segurança.</p>
              </div>
              <label className="flex items-start gap-4 cursor-pointer p-2">
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-6 h-6 rounded-lg text-brand-mango focus:ring-brand-mango border-brand-primary/10"
                />
                <span className="text-sm font-medium text-brand-primary/50">Concordo com os Termos e Protocolo Bio-Ético.</span>
              </label>
              <button 
                disabled={!agreed}
                onClick={() => setStep('gender')}
                className="w-full h-14 bg-brand-mango text-white rounded-xl font-black text-base shadow-xl shadow-brand-mango/20 disabled:opacity-30 transition-all active:scale-95 hover:bg-brand-primary"
              >
                Prosseguir
              </button>
            </div>
          </div>
        )}

        {step === 'gender' && (
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { 
                setSelectedGender('male'); 
                setStep('location'); 
              }} 
              className="p-10 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:border-brand-secondary transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">♂</div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-primary">Masculino</span>
            </button>
            <button 
              onClick={() => { 
                setSelectedGender('female'); 
                setStep('location'); 
              }} 
              className="p-10 bg-white border border-brand-primary/5 rounded-[40px] shadow-sm hover:border-brand-secondary transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">♀</div>
              <span className="text-xs font-black uppercase tracking-widest text-brand-primary">Feminino</span>
            </button>
          </div>
        )}

        {step === 'location' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white p-8 rounded-[40px] border border-brand-primary/5 shadow-2xl shadow-brand-primary/5 space-y-8">
              <div className="rounded-3xl overflow-hidden border border-brand-primary/10 shadow-inner group relative">
                <MapComponent location={selectedLocation || "Brasil"} className="h-48 group-hover:scale-105 transition-transform duration-700" />
                {!selectedLocation && (
                  <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-[2px] flex items-center justify-center p-8 text-center">
                    <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">Aguardando verificação de CEP...</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-3 h-3 text-brand-mango" />
                    <label className="text-[10px] font-black text-brand-primary/40 uppercase tracking-widest">Código de Endereçamento Postal (CEP)</label>
                  </div>
                  <div className="relative group">
                    <input 
                      type="text"
                      placeholder="00000-000"
                      value={cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      className={`w-full h-16 px-6 bg-brand-highlight/30 border-2 rounded-2xl font-black text-xl tracking-widest text-brand-primary transition-all focus:outline-none placeholder:text-brand-primary/5 pr-20
                        ${cepError ? 'border-rose-200 bg-rose-50/30' : selectedLocation ? 'border-brand-mango/20 bg-brand-mango/5' : 'border-transparent focus:border-brand-primary/10'}
                      `}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {isVerifyingCep ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-brand-mango/20 border-t-brand-mango rounded-full animate-spin" />
                        </div>
                      ) : (
                        <button 
                          onClick={() => triggerSearch(cep)}
                          className={`p-2.5 rounded-xl transition-all ${cep.replace(/\D/g,'').length === 8 ? 'bg-brand-mango text-white shadow-lg shadow-brand-mango/20' : 'text-brand-primary/10 bg-transparent'}`}
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {cepError && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-[10px] font-bold text-rose-500 uppercase tracking-wider">{cepError}</motion.p>
                  )}
                </div>

                {selectedLocation && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-brand-primary text-white rounded-2xl flex items-center justify-between group overflow-hidden relative shadow-xl shadow-brand-primary/20"
                  >
                    <div className="relative z-10">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Localização Confirmada</p>
                      <p className="text-sm font-black tracking-tight">{selectedLocation}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative z-10">
                      <CheckCircle className="w-5 h-5 text-brand-mango" />
                    </div>
                    {/* Interior glow effect */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-mango/20 blur-3xl rounded-full" />
                  </motion.div>
                )}
              </div>

              <button 
                disabled={!selectedLocation || isVerifyingCep}
                onClick={() => {
                  setPhotos(selectedGender === 'male' 
                    ? ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=400&fit=crop"]
                    : ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop"]
                  );
                  setStep('photos');
                }}
                className="w-full h-16 bg-brand-mango text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-mango/20 transition-all active:scale-95 disabled:opacity-20 hover:bg-brand-primary flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <span className="relative z-10">Validar Protocolo Local</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] transition-transform" />
              </button>
            </div>
          </div>
        )}

        {step === 'photos' && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-3">
              {photos.map((src, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white shadow-md relative group">
                  <img src={src} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {photos.length < 7 && (
                <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-white text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-all cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;
                      if (photos.length + files.length > 7) {
                        alert('Máximo 7 fotos.');
                        return;
                      }
                      setIsUploading(true);
                      const newPhotos: string[] = [];
                      const fileList = Array.from(files);
                      let count = 0;
                      fileList.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            newPhotos.push(event.target.result as string);
                            count++;
                            if (count === fileList.length) {
                              setPhotos(prev => [...prev, ...newPhotos]);
                              setIsUploading(false);
                            }
                          }
                        };
                        reader.readAsDataURL(file as Blob);
                      });
                    }}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-8 h-8" />
                      <span className="text-[10px] font-black mt-2">ADD FOTO</span>
                    </>
                  )}
                </label>
              )}
            </div>
            <p className="text-[10px] font-black text-center text-gray-400 uppercase tracking-widest">Apenas fotos nítidas são permitidas.</p>
            <button 
              onClick={() => setStep('video')}
              disabled={photos.length < 3}
              className="w-full h-14 bg-brand-primary text-white rounded-xl font-black shadow-xl shadow-brand-primary/20 transition-all active:scale-95 hover:bg-brand-secondary disabled:opacity-50"
            >
              Confirmar Identidade ({photos.length}/3)
            </button>
          </div>
        )}

        {step === 'video' && (
          <div className="space-y-8">
            <div className="aspect-video bg-brand-primary rounded-[40px] overflow-hidden flex items-center justify-center relative">
               <Video className={`w-16 h-16 ${videoUrl ? 'text-brand-mango' : 'text-white/10'}`} />
               {videoUrl && <div className="absolute inset-0 bg-brand-mango/10" />}
               <div className="absolute top-6 right-6 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">MAX 15S</div>
               {videoUrl && (
                 <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-white uppercase tracking-widest">Vídeo Bio-Validado</span>
               )}
            </div>
            <div className="flex gap-4">
              {!videoUrl ? (
                <>
                  <button onClick={() => setStep('thumb')} className="flex-1 h-14 border border-brand-primary/10 text-brand-primary/40 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-brand-highlight transition-all">Pular Vídeo</button>
                  <button onClick={() => setVideoUrl("mock-video-url")} className="flex-1 h-14 bg-brand-mango text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-brand-mango/20 active:scale-95 transition-all hover:bg-brand-primary">Gravar Agora</button>
                </>
              ) : (
                <button onClick={() => setStep('thumb')} className="w-full h-14 bg-brand-primary text-white font-black text-base rounded-xl shadow-xl shadow-brand-primary/20 active:scale-95 transition-all hover:bg-brand-secondary">Finalizar Etapa</button>
              )}
            </div>
          </div>
        )}

        {step === 'thumb' && (
          <div className="space-y-8 text-center">
            <div className="max-w-sm mx-auto aspect-[3/4] bg-brand-primary rounded-[48px] overflow-hidden relative shadow-2xl">
              {!recording ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 space-y-4">
                  <div className="w-20 h-20 rounded-full bg-brand-mango/10 flex items-center justify-center mb-4">
                    <Verified className="w-10 h-10 text-brand-mango" />
                  </div>
                  <h3 className="text-white font-black text-2xl tracking-tight leading-snug">Gesto de Identidade</h3>
                  <p className="text-white/40 text-sm font-medium">Mantenha o polegar para cima 👍 por 5 segundos diante da câmera.</p>
                </div>
              ) : (
                <div className="absolute inset-0 border-[12px] border-brand-mango/30">
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-brand-mango text-white px-8 py-3 rounded-full font-black text-3xl shadow-2xl">
                    00:0{countdown}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-4 border-brand-mango/20 animate-ping" />
                  </div>
                </div>
              )}
            </div>

            {!recording ? (
              <button 
                onClick={startRecording}
                className="w-full h-16 bg-brand-mango text-white rounded-2xl font-black text-base shadow-xl shadow-brand-mango/25 active:scale-95 transition-all hover:bg-brand-primary flex items-center justify-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Iniciar Escaneamento
              </button>
            ) : (
              <div className="p-6 bg-brand-mango/5 rounded-2xl border border-brand-mango/20">
                <p className="text-[10px] font-black text-brand-mango uppercase tracking-[0.4em] animate-pulse">Processando Biometria Ética...</p>
              </div>
            )}
          </div>
        )}

        {step === 'concluir' && (
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in slide-in-from-bottom-10 duration-700 py-10">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-brand-mango blur-3xl opacity-20 rounded-full animate-pulse" />
              <div className="relative w-32 h-32 bg-white rounded-[40px] shadow-2xl shadow-brand-primary/5 flex items-center justify-center border border-brand-primary/5">
                <CheckCircle className="w-16 h-16 text-brand-mango" strokeWidth={1} />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white p-2.5 rounded-2xl shadow-xl">
                 <Verified className="w-6 h-6" />
              </div>
            </div>
            
            <h3 className="text-4xl font-black text-brand-primary tracking-tighter mb-4">
              Identidade <span className="text-brand-mango">Validada</span>
            </h3>
            
            <p className="text-brand-primary/50 leading-relaxed font-medium max-w-sm mb-12">
              Sua conta foi integrada com sucesso. Você agora faz parte de um ecossistema de relacionamentos reais e seguros.
            </p>
            
            <div className="w-full max-w-xs space-y-6">
              <button 
                type="button"
                onClick={() => {
                  if (selectedGender && photos.length >= 3) {
                    onComplete(selectedGender, photos, selectedLocation, videoUrl);
                  } else {
                    alert("Por favor, selecione seu gênero e adicione pelo menos 3 fotos.");
                    setStep('gender');
                  }
                }}
                className="w-full h-16 bg-brand-mango text-white rounded-[24px] font-black text-lg shadow-2xl shadow-brand-mango/40 flex items-center justify-center gap-3 group active:scale-[0.98] transition-all"
              >
                Ativar Descoberta
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2 text-[10px] font-black text-brand-primary/10 uppercase tracking-[0.4em] pt-4">
                <ShieldCheck className="w-3 h-3" />
                Segurança Opala Negra Ativa
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-12 border-t border-gray-100 text-center">
          <p className="text-[10px] font-bold text-gray-300 tracking-widest">© 2024 OPALA NEGRA. CONECTANDO PESSOAS COM SEGURANÇA.</p>
      </footer>
      
      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
