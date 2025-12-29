
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Briefcase,
  History as HistoryIcon,
  Zap,
  CheckCircle2,
  Globe,
  Settings,
  BookOpen
} from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import PostWizard from './components/PostWizard';
import ArticleWizard from './components/ArticleWizard';
import InfographicWizard from './components/InfographicWizard';
import ConversionWizard from './components/ConversionWizard';
import TrendAnalyzer from './components/TrendAnalyzer';
import ReturnToSportCalculator from './components/ReturnToSportCalculator';
import PostPreview from './components/PostPreview';
import ArticlePreview from './components/ArticlePreview';
import InfographicPreview from './components/InfographicPreview';
import ConversionPreview from './components/ConversionPreview';
import MaterialsLibrary from './components/MaterialsLibrary';
import SiteContentList from './components/SiteContentList';
import { generatePostImage, generatePostText, generateSEOArticle, generateInfographicContent, generateConversionContent } from './services/geminiService';
import { GeneratedResult, PostState, GeneratedArticle, ArticleState, InfographicState, InfographicResult, ConversionState, ConversionResult, PostFormat, PostCategory, Tone } from './types';

type ViewMode = 'dashboard' | 'post' | 'seo' | 'materials' | 'infographic' | 'conversion' | 'history' | 'site' | 'trends' | 'calculator';
type MobileTab = 'editor' | 'preview';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');
  
  // --- STATE MANAGEMENT & HISTORY ---
  const [history, setHistory] = useState<GeneratedResult[]>([]);
  
  // Post State (Persistent)
  const [postResult, setPostResult] = useState<GeneratedResult | null>(null);
  const [postLoading, setPostLoading] = useState(false);
  const [postLastState, setPostLastState] = useState<PostState | null>(null); // For Regeneration
  const [wizardInitialState, setWizardInitialState] = useState<PostState | null>(null); // For Trends/Articles Pre-fill
  
  const [regenTextLoading, setRegenTextLoading] = useState(false);
  const [regenImageLoading, setRegenImageLoading] = useState(false);

  // Other Tools State
  const [articleResult, setArticleResult] = useState<GeneratedArticle | null>(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [infographicResult, setInfographicResult] = useState<InfographicResult | null>(null);
  const [infographicLoading, setInfographicLoading] = useState(false);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  
  // Feedback UI
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Load History on Mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('medisocial_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) { console.error(e); }
    }
    
    // Resume last draft if available
    const savedDraft = localStorage.getItem('medisocial_last_post');
    if (savedDraft) setPostResult(JSON.parse(savedDraft));
  }, []);

  // Save History
  useEffect(() => {
    localStorage.setItem('medisocial_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (postResult) localStorage.setItem('medisocial_last_post', JSON.stringify(postResult));
  }, [postResult]);

  useEffect(() => {
    setMobileTab('editor');
    setError(null);
  }, [viewMode]);

  // --- SHOW TOAST HELPER ---
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- HANDLERS ---
  const handleGeneratePost = async (state: PostState) => {
    setPostLoading(true);
    setError(null);
    setPostLastState(state);

    try {
      const content = await generatePostText(state);
      
      let imageUrl = null;
      let isCustomImage = false;

      if (state.uploadedImage) {
          imageUrl = state.uploadedImage;
          isCustomImage = true;
      } else {
          imageUrl = await generatePostImage(content.imagePromptDescription, state.format);
      }

      const newResult = { 
          id: Date.now().toString(),
          date: new Date().toISOString(),
          content, 
          imageUrl, 
          isCustomImage 
      };

      setPostResult(newResult);
      setHistory(prev => [newResult, ...prev]); // Add to history
      setMobileTab('preview');
      showToast('Post gerado com sucesso!'); 
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao gerar o post.");
    } finally {
      setPostLoading(false);
    }
  };

  const handleRegeneratePostText = async () => {
    if (!postLastState || !postResult) return;
    setRegenTextLoading(true);
    try {
      const newContent = await generatePostText(postLastState);
      setPostResult({ ...postResult, content: newContent });
      showToast('Texto atualizado!');
    } catch (err: any) {
        setError("Falha ao regerar o texto");
    } finally {
      setRegenTextLoading(false);
    }
  };

  const handleRegeneratePostImage = async () => {
    if (!postResult?.content?.imagePromptDescription || postResult.isCustomImage) return;
    setRegenImageLoading(true);
    try {
      const newImageUrl = await generatePostImage(postResult.content.imagePromptDescription, postLastState?.format || PostFormat.FEED);
      setPostResult({ ...postResult, imageUrl: newImageUrl });
      showToast('Nova imagem gerada!');
    } catch (err: any) {
        setError("Falha ao regerar a imagem");
    } finally {
        setRegenImageLoading(false);
    }
  };

  const handleGenerateArticle = async (state: ArticleState) => {
    setArticleLoading(true);
    setError(null);
    try {
        const article = await generateSEOArticle(state);
        setArticleResult(article);
        setMobileTab('preview');
        showToast('Artigo SEO criado!');
    } catch (err: any) {
        setError(err.message || "Erro ao gerar artigo.");
    } finally {
        setArticleLoading(false);
    }
  }

  // --- BRIDGE: ARTICLE -> POST ---
  const handleTransformArticleToPost = (article: GeneratedArticle) => {
      // Create initial state for Post Wizard based on Article
      const newState: PostState = {
          topic: article.title,
          category: PostCategory.PATHOLOGY, // Default assumption
          tone: Tone.EDUCATIONAL,
          format: PostFormat.FEED,
          customInstructions: `Baseie o post EXATAMENTE neste artigo: "${article.title}". Resuma os pontos principais para o Instagram.`
      };

      setWizardInitialState(newState);
      setViewMode('post');
      setMobileTab('editor');
      showToast('Iniciando Post do Artigo...');
  };

  const handleGenerateInfographic = async (state: InfographicState) => {
    setInfographicLoading(true);
    setError(null);
    try {
        const data = await generateInfographicContent(state);
        setInfographicResult({ data }); 
        setMobileTab('preview');
        showToast('Infográfico estruturado!');

        const heroPromise = data.heroImagePrompt 
            ? generatePostImage(data.heroImagePrompt, PostFormat.FEED)
            : Promise.resolve(null);
        const anatomyPromise = data.anatomy?.imagePrompt 
            ? generatePostImage(data.anatomy.imagePrompt, PostFormat.FEED)
            : Promise.resolve(null);

        heroPromise.then(url => setInfographicResult(prev => prev ? { ...prev, heroImageUrl: url } : null));
        anatomyPromise.then(url => setInfographicResult(prev => prev ? { ...prev, anatomyImageUrl: url } : null));

    } catch (err: any) {
        setError(err.message || "Erro no infográfico.");
    } finally {
        setInfographicLoading(false);
    }
  }

  const handleGenerateConversion = async (state: ConversionState) => {
      setConversionLoading(true);
      setError(null);
      try {
          const result = await generateConversionContent(state);
          setConversionResult(result);
          setMobileTab('preview');
          showToast('Estratégia de conversão pronta!');
      } catch (err: any) {
          setError(err.message || "Erro na estratégia.");
      } finally {
          setConversionLoading(false);
      }
  };

  // Callback from Trend Analyzer to create a post
  const handleUseTrend = (partialState: Partial<PostState>) => {
      // Create full state
      const fullState: PostState = {
          topic: '',
          category: partialState.category!,
          tone: partialState.tone!,
          format: partialState.format!,
          customInstructions: partialState.customInstructions || '',
          ...partialState
      };
      
      setWizardInitialState(fullState); // Pass data to wizard
      setViewMode('post'); // Navigate to wizard
  };

  const getPageInfo = () => {
    switch (viewMode) {
      case 'post': return { title: 'Criar Post', subtitle: 'Instagram Feed/Story' };
      case 'seo': return { title: 'Blog Médico', subtitle: 'Artigo SEO (Prioridade)' };
      case 'infographic': return { title: 'Infográfico', subtitle: 'Educação Visual' };
      case 'materials': return { title: 'Biblioteca', subtitle: 'Materiais e Evidências' };
      case 'conversion': return { title: 'Conversão', subtitle: 'Quebra de Objeções' };
      case 'history': return { title: 'Histórico', subtitle: 'Criações Anteriores' };
      case 'site': return { title: 'Seu Joelho', subtitle: 'Conteúdo do Site' };
      case 'trends': return { title: 'Trends', subtitle: 'Google Trends Brasil' };
      case 'calculator': return { title: 'Calculadora RTS', subtitle: 'Retorno ao Esporte' };
      default: return { title: '', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageInfo();
  const hasResult = postResult || articleResult || infographicResult || conversionResult;
  const isGenerating = postLoading || articleLoading || infographicLoading || conversionLoading;

  // Tools that handle their own full-page layout/scrolling
  const isFullPageTool = ['trends', 'calculator', 'materials', 'site'].includes(viewMode);

  return (
    <div className="flex h-screen bg-app-bg text-app-text overflow-hidden font-sans relative selection:bg-primary selection:text-white">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] animate-slideUp bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            {toast}
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* HEADER (Only show if NOT in dashboard) */}
          {viewMode !== 'dashboard' && (
            <Header 
                onBack={() => setViewMode('dashboard')}
                showBack={true}
                title={title}
                subtitle={subtitle}
            />
          )}

          <main className="flex-1 overflow-hidden relative flex flex-col">
              
              {/* DASHBOARD VIEW (HOME) */}
              {viewMode === 'dashboard' && (
                  <div className="w-full h-full overflow-y-auto no-scrollbar pb-24">
                      <Dashboard onSelectTool={(tool) => setViewMode(tool as ViewMode)} />
                  </div>
              )}

              {/* HISTORY VIEW */}
              {viewMode === 'history' && (
                  <div className="w-full h-full overflow-y-auto no-scrollbar p-6 pb-24">
                      {history.length === 0 ? (
                          <div className="text-center text-slate-400 mt-20">
                              <HistoryIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                              <p>Nenhum histórico encontrado.</p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {history.map(item => (
                                  <div key={item.id} onClick={() => { setPostResult(item); setViewMode('post'); setMobileTab('preview'); }} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-4 cursor-pointer hover:shadow-md transition-all">
                                      <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                          {item.imageUrl && <img src={item.imageUrl} className="w-full h-full object-cover" />}
                                      </div>
                                      <div className="overflow-hidden">
                                          <p className="font-bold text-sm truncate">{item.content?.headline || 'Sem título'}</p>
                                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.content?.caption}</p>
                                          <p className="text-[10px] text-slate-400 mt-2">{new Date(item.date).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              )}

              {/* TOOL VIEWS */}
              {viewMode !== 'dashboard' && viewMode !== 'history' && (
                  <div className="flex flex-col h-full relative">
                       
                       {/* EDITOR PANEL - Left Side or Full Mobile */}
                       <div className={`
                            flex-1 bg-slate-50 relative flex flex-col
                            ${(hasResult || isGenerating) && mobileTab === 'preview' ? 'hidden' : 'flex'}
                            ${!isFullPageTool ? 'overflow-hidden' : 'overflow-hidden'} 
                       `}>
                            {/* Scrollable Container */}
                            <div className={`flex-1 overflow-y-auto no-scrollbar ${isFullPageTool ? 'w-full' : 'p-0 lg:p-6 w-full lg:max-w-2xl lg:mx-auto'}`}>
                                {error && (
                                    <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3 text-sm animate-fadeIn mx-6 mt-6">
                                        <Zap className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                {viewMode === 'post' && (
                                    <div className="h-full flex flex-col p-4 pb-32 lg:pb-0">
                                        <PostWizard onGenerate={handleGeneratePost} isGenerating={postLoading} initialState={wizardInitialState} />
                                    </div>
                                )}
                                {viewMode === 'seo' && <div className="p-4"><ArticleWizard onGenerate={handleGenerateArticle} isGenerating={articleLoading} /></div>}
                                {viewMode === 'infographic' && <div className="p-4"><InfographicWizard onGenerate={handleGenerateInfographic} isGenerating={infographicLoading} /></div>}
                                {viewMode === 'conversion' && <div className="p-4"><ConversionWizard onGenerate={handleGenerateConversion} isGenerating={conversionLoading} /></div>}
                                
                                {/* Full Page Tools - Self contained scrolling */}
                                {viewMode === 'materials' && <MaterialsLibrary />}
                                {viewMode === 'trends' && <TrendAnalyzer onUseTrend={handleUseTrend} />}
                                {viewMode === 'calculator' && <ReturnToSportCalculator />}
                                {viewMode === 'site' && <SiteContentList />}
                            </div>
                       </div>

                       {/* PREVIEW PANEL - Right Side or Mobile Toggle */}
                       <div className={`
                            flex-1 bg-app-bg relative flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200
                            ${(hasResult || isGenerating) && mobileTab === 'preview' ? 'flex h-full' : 'hidden lg:flex'}
                            ${isFullPageTool ? '!hidden' : ''}
                       `}>
                            <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar pb-32 lg:pb-0 relative">
                                
                                {/* Loading State */}
                                {isGenerating && (
                                    <div className="h-full flex flex-col items-center justify-center p-8 animate-fadeIn bg-white/90 backdrop-blur-md absolute inset-0 z-50">
                                        <div className="w-20 h-20 relative mb-6">
                                            <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">Criando Conteúdo</h3>
                                        <p className="text-slate-500 text-sm animate-pulse text-center max-w-xs">A IA está analisando protocolos clínicos e referências visuais...</p>
                                    </div>
                                )}

                                {/* Results */}
                                {viewMode === 'post' && postResult && (
                                    <div className="py-8 px-4 flex justify-center min-h-full">
                                        <PostPreview 
                                            result={postResult}
                                            onRegenerateText={handleRegeneratePostText}
                                            onRegenerateImage={handleRegeneratePostImage}
                                            isRegenerating={regenTextLoading || regenImageLoading}
                                        />
                                    </div>
                                )}
                                {viewMode === 'post' && !postResult && !isGenerating && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <Globe className="w-8 h-8 opacity-20" />
                                        </div>
                                        <p className="text-sm">O preview do seu post aparecerá aqui.</p>
                                    </div>
                                )}

                                {/* ARTICLE PREVIEW WITH BRIDGE */}
                                {viewMode === 'seo' && articleResult && (
                                    <div className="p-4 lg:p-12 max-w-4xl mx-auto">
                                        <ArticlePreview 
                                            article={articleResult} 
                                            onConvertToPost={handleTransformArticleToPost} 
                                        />
                                    </div>
                                )}
                                
                                {viewMode === 'infographic' && infographicResult && <div className="w-full h-full min-h-screen lg:min-h-0"><InfographicPreview data={infographicResult.data} heroImageUrl={infographicResult.heroImageUrl} anatomyImageUrl={infographicResult.anatomyImageUrl} /></div>}
                                {viewMode === 'conversion' && conversionResult && <div className="p-4 lg:p-12 max-w-4xl mx-auto"><ConversionPreview result={conversionResult} /></div>}
                            </div>
                       </div>

                  </div>
              )}

          </main>

          {/* FLOATING MOBILE TAB CONTROLS */}
          {(hasResult || isGenerating) && viewMode !== 'dashboard' && viewMode !== 'history' && !isFullPageTool && (
                <div className="lg:hidden fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex bg-white rounded-full shadow-float border border-slate-100 p-1.5 w-[200px] animate-slideUp">
                    <button 
                        onClick={() => setMobileTab('editor')}
                        className={`flex-1 py-3 rounded-full text-xs font-bold transition-all
                        ${mobileTab === 'editor' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Editor
                    </button>
                    <button 
                        onClick={() => setMobileTab('preview')}
                        className={`flex-1 py-3 rounded-full text-xs font-bold transition-all
                        ${mobileTab === 'preview' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        Resultado
                    </button>
                </div>
            )}

          {/* FIXED BOTTOM NAVIGATION */}
          <nav className="fixed bottom-0 left-0 right-0 h-[85px] bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-between items-start pt-3 px-6 z-50 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
              <button 
                  onClick={() => { setViewMode('dashboard'); }}
                  className={`flex flex-col items-center gap-1.5 w-16 group transition-all active:scale-95
                  ${viewMode === 'dashboard' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <LayoutDashboard className={`w-6 h-6 ${viewMode === 'dashboard' ? 'fill-current' : ''}`} />
                  <span className="text-[10px] font-bold tracking-tight">Início</span>
              </button>
              
              <button 
                onClick={() => setViewMode('site')}
                className={`flex flex-col items-center gap-1.5 w-16 group transition-all active:scale-95
                ${viewMode === 'site' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <Globe className="w-6 h-6" />
                  <span className="text-[10px] font-bold tracking-tight">Site</span>
              </button>

              <div className="relative -top-6">
                 <button 
                    onClick={() => { setViewMode('seo'); }} 
                    className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-glow border-4 border-white transition-transform active:scale-90 group"
                 >
                    <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
                 </button>
              </div>

              <button 
                onClick={() => setViewMode('post')} 
                className={`flex flex-col items-center gap-1.5 w-16 group transition-all active:scale-95
                ${viewMode === 'post' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <Briefcase className="w-6 h-6" />
                  <span className="text-[10px] font-bold tracking-tight">Post</span>
              </button>

              <button 
                onClick={() => setViewMode('history')}
                className={`flex flex-col items-center gap-1.5 w-16 group transition-all active:scale-95
                ${viewMode === 'history' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
              >
                  <HistoryIcon className="w-6 h-6" />
                  <span className="text-[10px] font-bold tracking-tight">Histórico</span>
              </button>
          </nav>

      </div>
    </div>
  );
}

export default App;
