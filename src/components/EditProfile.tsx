import { useState, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Camera, 
  Save, 
  User, 
  FileText, 
  MapPin, 
  Briefcase,
  Image as ImageIcon,
  Video,
  X,
  Settings as SettingsIcon,
  Cake,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, View } from '../types';

interface EditProfileProps {
  onBack: () => void;
  onNavigate: (view: View) => void;
  userProfile: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
}

export function EditProfile({ onBack, onNavigate, userProfile, onUpdateProfile }: EditProfileProps) {
  const [name, setName] = useState(userProfile?.name || "");
  const [age, setAge] = useState(userProfile?.age?.toString() || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [location, setLocation] = useState(userProfile?.location || "");
  const [role, setRole] = useState(userProfile?.role || "");
  const [photos, setPhotos] = useState<string[]>(userProfile?.photos || []);
  const [video, setVideo] = useState<string | undefined>(userProfile?.verificationVideo);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 7) {
      alert('Você pode ter no máximo 7 fotos.');
      return;
    }

    setIsUploading(true);
    const newPhotos: string[] = [];
    let count = 0;

    const fileList = Array.from(files);
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
  };

  const handleSave = () => {
    if (!userProfile) return;
    if (photos.length < 3) {
      alert('Você precisa de pelo menos 3 fotos.');
      return;
    }
    onUpdateProfile({
      ...userProfile,
      name,
      age: parseInt(age) || userProfile.age,
      bio,
      location,
      role,
      photos,
      verificationVideo: video
    });
    onBack();
  };

  const planInfo = {
    free: { label: 'Gratuito', color: 'bg-gray-100 text-gray-500' },
    bronze: { label: 'Bronze', color: 'bg-amber-100 text-amber-700' },
    silver: { label: 'Prata', color: 'bg-slate-200 text-slate-700' },
    gold: { label: 'Ouro', color: 'bg-yellow-100 text-yellow-700' }
  };

  const currentPlan = planInfo[userProfile?.plan || 'free'];

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col font-sans bg-linear-to-b from-white to-brand-highlight/30">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg border-b border-brand-primary/5 flex items-center justify-between px-5 h-16">
          <div className="flex items-center">
            <button onClick={onBack} className="p-2 -ml-2 hover:bg-brand-highlight rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-brand-primary" />
            </button>
            <h1 className="text-xl font-black text-brand-primary ml-2 uppercase tracking-tighter">Editar Perfil</h1>
          </div>
          <button 
            onClick={() => onNavigate('settings')}
            className="p-2 hover:bg-brand-highlight rounded-full transition-colors text-brand-primary"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="pt-20 pb-12 px-6 overflow-y-auto flex-grow max-w-lg mx-auto w-full">
        <div className="bg-white border border-brand-primary/5 rounded-[32px] p-6 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${currentPlan.color} flex items-center justify-center shadow-lg`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-primary/30 uppercase tracking-widest">Plano Ativo</p>
              <p className="text-sm font-black text-brand-primary uppercase tracking-tight">{currentPlan.label}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('premium')}
            className="text-[10px] font-black text-brand-mango bg-brand-mango/10 px-6 py-2.5 rounded-full uppercase tracking-widest hover:bg-brand-mango hover:text-white transition-all"
          >
            Mudar Plano
          </button>
        </div>

        <div className="flex flex-col items-center mb-10">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
              <img src={photos[0] || userProfile?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <label className="bg-brand-mango absolute bottom-0 right-0 text-white p-2.5 rounded-full border-4 border-white shadow-xl hover:scale-110 transition-transform active:rotate-12 cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                capture="user"
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) {
                        setPhotos(prev => [event.target?.result as string, ...prev.slice(1)]);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <Camera className="w-5 h-5" />
            </label>
          </div>
          <p className="mt-4 text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.3em]">Identidade Visual</p>
        </div>
        {/* Media Section */}
        <section className="mb-8 space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fotos do Perfil ({photos.length}/7)</h3>
            <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest bg-brand-highlight px-2 py-0.5 rounded">Mínimo 3</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {photos.map((src, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden relative shadow-sm bg-gray-100">
                <img src={src} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                  className="absolute top-1.5 right-1.5 bg-white text-rose-500 w-7 h-7 rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-all z-20 border border-rose-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {photos.length < 7 && (
              <>
                <label className={`aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:border-brand-secondary/50 hover:bg-gray-50 transition-all cursor-pointer`}>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-brand-mango border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Galeria</span>
                    </>
                  )}
                </label>
                <label className={`aspect-[3/4] rounded-xl border-2 border-dashed border-brand-mango/30 bg-brand-mango/5 flex flex-col items-center justify-center gap-1.5 text-brand-mango hover:border-brand-mango hover:bg-brand-mango/10 transition-all cursor-pointer`}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment"
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  <Camera className="w-6 h-6" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Câmera</span>
                </label>
              </>
            )}
          </div>
        </section>

        <section className="mb-8 space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vídeo de Verificação (15s)</h3>
          <div className="relative">
            {!video ? (
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    const mockUrl = "https://images.unsplash.com/photo-15" + (Math.floor(Math.random() * 9000000) + 1000000) + "?w=400&h=600&fit=crop";
                    setVideo(mockUrl);
                  }}
                  className={`flex-1 h-24 rounded-3xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center gap-2 group transition-all hover:bg-gray-50 active:bg-gray-100`}
                >
                  <Video className="w-6 h-6 text-gray-300 group-hover:text-brand-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gravar Vídeo</span>
                </button>
                <button 
                  onClick={() => {
                    const mockUrl = "https://images.unsplash.com/photo-15" + (Math.floor(Math.random() * 9000000) + 1000000) + "?w=400&h=600&fit=crop";
                    setVideo(mockUrl);
                  }}
                  className={`flex-1 h-24 rounded-3xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center gap-2 group transition-all hover:bg-gray-50 active:bg-gray-100`}
                >
                  <ImageIcon className="w-6 h-6 text-gray-300 group-hover:text-brand-secondary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subir Vídeo</span>
                </button>
              </div>
            ) : (
              <div className="relative h-32 rounded-3xl bg-brand-primary overflow-hidden flex items-center justify-center">
                <Video className="w-10 h-10 text-emerald-400" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-white uppercase tracking-widest">Vídeo de 15s Carregado</span>
                <button 
                  onClick={() => setVideo(undefined)}
                  className="absolute top-3 right-3 bg-white/20 hover:bg-rose-500 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 pl-12 pr-5 rounded-2xl bg-white border border-gray-100 text-brand-primary font-bold focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Idade</label>
            <div className="relative">
              <Cake className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full h-14 pl-12 pr-5 rounded-2xl bg-white border border-gray-100 text-brand-primary font-bold focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ocupação</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-14 pl-12 pr-5 rounded-2xl bg-white border border-gray-100 text-brand-primary font-bold focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Localização</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-14 pl-12 pr-5 rounded-2xl bg-white border border-gray-100 text-brand-primary font-bold focus:ring-2 focus:ring-brand-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio / Sobre Mim</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-32 pl-12 pr-5 py-4 rounded-2xl bg-white border border-gray-100 text-brand-primary font-bold focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none"
              />
            </div>
          </div>
        </section>

        <div className="mt-12">
          <button 
            onClick={handleSave}
            className="w-full h-16 bg-brand-mango text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-2xl shadow-brand-mango/20 uppercase tracking-widest"
          >
            <Save className="w-6 h-6" />
            Salvar Relacionamento
          </button>
        </div>
      </main>
    </div>
  );
}
