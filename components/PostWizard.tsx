
import React, { useState, useRef, useEffect } from 'react';
import { PostCategory, Tone, PostState, PostFormat } from '../types';
import { 
    HeartPulse, 
    BriefcaseMedical, 
    Activity, 
    User, 
    ShieldCheck, 
    HelpCircle, 
    Search,
    Sparkles,
    Image as ImageIcon,
    Smartphone,
    LayoutGrid,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Check,
    Wand2,
    Flame,
    TrendingUp,
    Target,
    Zap
} from 'lucide-react';

interface PostWizardProps {
  onGenerate: (state: PostState) => void;
  isGenerating: boolean;
  initialState?: PostState | null; // New Prop for Trends
}

const PostWizard: React.FC<PostWizardProps> = ({ onGenerate, isGenerating, initialState }) => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<PostCategory>(PostCategory.PATHOLOGY);
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [format, setFormat] = useState<PostFormat>(PostFormat.FEED);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{topic?: boolean}>({});
  
  // Detect if we are in "Trend Mode" (Viral Strategy)
  const isTrendMode = !!initialState?.customInstructions;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill State from Trends (Run once when initialState changes)
  useEffect(() => {
    if (initialState) {
        setCategory(initialState.category);
        setTopic(initialState.topic);
        setTone(initialState.tone);
        setFormat(initialState.format);
        // If it's a trend, jump to Step 3 (Review/Tone)
        if (initialState.customInstructions) {
            setStep(3);
        }
    } else {
        // Reset defaults if opened fresh
        setStep(1);
        setCategory(PostCategory.PATHOLOGY);
        setTopic('');
        setTone(Tone.PROFESSIONAL);
        setFormat(PostFormat.FEED);
        setUploadedImage(null);
    }
  }, [initialState]);

  const handleNext = () => {
    if (step === 2 && !topic.trim()) {
        setErrors({ topic: true });
        return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    // If trend mode, preserve instructions
    const customInstructions = initialState?.customInstructions || '';
    onGenerate({ category, topic, tone, format, customInstructions, uploadedImage });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const categories = [
    { id: PostCategory.PATHOLOGY, icon: <HeartPulse className="w-5 h-5" />, label: "Doenças" },
    { id: PostCategory.SURGERY, icon: <BriefcaseMedical className="w-5 h-5" />, label: "Cirurgias" },
    { id: PostCategory.SPORTS, icon: <Activity className="w-5 h-5" />, label: "Esporte" },
    { id: PostCategory.REHAB, icon: <User className="w-5 h-5" />, label: "Reabilitação" },
    { id: PostCategory.LIFESTYLE, icon: <ShieldCheck className="w-5 h-5" />, label: "Vida" },
    { id: PostCategory.MYTHS, icon: <HelpCircle className="w-5 h-5" />, label: "Mitos" },
  ];

  // Progress Bar
  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col h-full animate-fadeIn w-full">
        
        {/* Progress Header */}
        <div className="mb-6">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Passo {step} de 3</span>
                <span>{step === 1 ? 'Formato' : step === 2 ? 'Conteúdo' : 'Personalização'}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-1">
            
            {/* STEP 1: FORMAT & MEDIA */}
            {step === 1 && (
                <div className="space-y-6 animate-slideUp">
                    <h2 className="text-xl font-bold text-slate-900">Como será esse post?</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setFormat(PostFormat.FEED)}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group
                            ${format === PostFormat.FEED 
                                ? 'border-primary bg-blue-50/50 shadow-lg shadow-blue-500/10' 
                                : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${format === PostFormat.FEED ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <LayoutGrid className="w-5 h-5" />
                            </div>
                            <span className="block font-bold text-slate-900">Feed</span>
                            <span className="text-xs text-slate-500 mt-1 block">Quadrado (1:1). Ideal para educação e detalhes.</span>
                            {format === PostFormat.FEED && <div className="absolute top-4 right-4 text-primary"><Check className="w-5 h-5" /></div>}
                        </button>

                        <button
                            onClick={() => setFormat(PostFormat.STORY)}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left group
                            ${format === PostFormat.STORY 
                                ? 'border-primary bg-blue-50/50 shadow-lg shadow-blue-500/10' 
                                : 'border-slate-100 bg-white hover:border-slate-200'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors ${format === PostFormat.STORY ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <span className="block font-bold text-slate-900">Story</span>
                            <span className="text-xs text-slate-500 mt-1 block">Vertical (9:16). Rápido, direto e interativo.</span>
                             {format === PostFormat.STORY && <div className="absolute top-4 right-4 text-primary"><Check className="w-5 h-5" /></div>}
                        </button>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-3">Imagem de Referência (Opcional)</label>
                        <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                        
                        {!uploadedImage ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-3 cursor-pointer hover:border-primary hover:bg-primary-50/30 transition-all text-slate-500 hover:text-primary group bg-white"
                            >
                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium">Carregar Raio-X ou Foto</span>
                            </div>
                        ) : (
                            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                <img src={uploadedImage} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                     <button onClick={() => setUploadedImage(null)} className="bg-white text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">Remover</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: CONTENT */}
            {step === 2 && (
                <div className="space-y-6 animate-slideUp">
                    <h2 className="text-xl font-bold text-slate-900">Sobre o que vamos falar?</h2>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                            <button 
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all
                                ${category === cat.id 
                                    ? 'border-primary bg-primary text-white shadow-md' 
                                    : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                            >
                                <div className={`${category === cat.id ? 'text-white' : 'text-slate-400'}`}>{cat.icon}</div>
                                <span className="text-xs font-bold">{cat.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative pt-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tema Principal</label>
                        <div className="relative">
                            <Search className={`absolute left-4 top-3.5 w-5 h-5 ${errors.topic ? 'text-red-400' : 'text-slate-400'}`} />
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => { setTopic(e.target.value); setErrors({topic: false}); }}
                                autoFocus
                                className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none focus:ring-2 transition-all font-medium
                                ${errors.topic ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary-100'}`} 
                                placeholder="Ex: Dor no menisco ao agachar..."
                            />
                        </div>
                        {errors.topic && <p className="text-red-500 text-xs font-bold mt-1 ml-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Digite um tema para continuar</p>}
                    </div>
                </div>
            )}

            {/* STEP 3: TONE & CONFIRMATION (Enhanced for Trends) */}
            {step === 3 && (
                <div className="space-y-6 animate-slideUp">
                    
                    {/* Trend Strategy Card - ONLY Visible if coming from TrendAnalyzer */}
                    {isTrendMode && (
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 mb-6 border border-slate-700">
                             {/* Abstract Background Effects */}
                             <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20"></div>
                             <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-10"></div>
                             
                             <div className="relative p-6">
                                 <div className="flex items-center justify-between mb-4">
                                     <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                                         <Flame className="w-3 h-3 fill-orange-400" /> ESTRATÉGIA VIRAL
                                     </span>
                                     <Target className="w-5 h-5 text-slate-500" />
                                 </div>
                                 
                                 <h3 className="text-xl font-bold leading-tight mb-2 text-white tracking-tight">"{topic}"</h3>
                                 <p className="text-sm text-slate-300 leading-relaxed mb-6 border-l-2 border-primary pl-3">
                                     A IA detectou alta demanda. O post será otimizado para <span className="text-white font-bold">retenção</span> e <span className="text-white font-bold">compartilhamento</span>.
                                 </p>
                                 
                                 <div className="grid grid-cols-2 gap-3">
                                     <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center gap-3">
                                         <Zap className="w-4 h-4 text-yellow-400" />
                                         <span className="text-xs font-bold text-slate-200">Headline Clickbait</span>
                                     </div>
                                     <div className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center gap-3">
                                         <TrendingUp className="w-4 h-4 text-green-400" />
                                         <span className="text-xs font-bold text-slate-200">Alta Relevância</span>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">
                            {isTrendMode ? 'Ajuste Fino da IA' : 'Qual a "vibe" do post?'}
                        </h2>
                        
                        <div className="space-y-3">
                            {Object.values(Tone).slice(0, 5).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all group
                                    ${tone === t 
                                        ? 'border-primary bg-primary-50 text-primary-700 shadow-sm' 
                                        : 'border-slate-100 bg-white text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold text-sm">{t.split('/')[0]}</span>
                                        <span className="text-xs opacity-70">{t.split('/')[1]}</span>
                                    </div>
                                    {tone === t && <div className="bg-primary text-white rounded-full p-1"><Check className="w-3 h-3" /></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload in Final Step for Trends to allow customization */}
                    {isTrendMode && (
                        <div className="pt-4 border-t border-slate-100 mt-4">
                            <label className="block text-sm font-bold text-slate-700 mb-3">Adicionar Foto Pessoal (Opcional)</label>
                            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageUpload} />
                            
                            {!uploadedImage ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-16 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary-50/30 transition-all text-slate-500 hover:text-primary group bg-white"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="text-xs font-medium">Usar foto ao invés de IA</span>
                                </div>
                            ) : (
                                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                    <img src={uploadedImage} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <button onClick={() => setUploadedImage(null)} className="bg-white text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">Remover</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

        </div>

        {/* Footer Navigation / Loading State */}
        <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-3">
            {isGenerating ? (
                <div className="w-full flex flex-col items-center justify-center py-4 animate-fadeIn">
                    <div className="relative mb-3">
                       <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                       <div className="relative bg-white p-4 rounded-full shadow-lg border border-orange-100">
                           <Wand2 className="w-8 h-8 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                       </div>
                    </div>
                    <p className="text-sm font-bold text-slate-700">Criando Post Incrível...</p>
                    <p className="text-xs text-slate-400 animate-pulse">Gerando imagem e legenda criativa</p>
                </div>
            ) : (
                <>
                    {step > 1 && (
                        <button 
                            onClick={handleBack}
                            className="px-5 py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    
                    {step < 3 ? (
                        <button 
                            onClick={handleNext}
                            className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            Próximo <ArrowRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            className={`flex-1 bg-gradient-to-r ${isTrendMode ? 'from-orange-500 to-red-600' : 'from-primary to-orange-600'} text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all group`}
                        >
                            <Sparkles className="w-5 h-5 text-yellow-200 group-hover:rotate-12 transition-transform" />
                            {isTrendMode ? 'Gerar Post Viral' : 'Gerar Post'}
                        </button>
                    )}
                </>
            )}
        </div>

    </div>
  );
};

export default PostWizard;
