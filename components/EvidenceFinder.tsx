
import React, { useState } from 'react';
import { searchPubMed } from '../services/pubmedService';
import { PubMedArticle } from '../types';
import { Search, BookOpen, ExternalLink, Loader2, FileText, FlaskConical } from 'lucide-react';

const EvidenceFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PubMedArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
        const articles = await searchPubMed(query);
        setResults(articles);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
        {/* Header */}
        <div className="bg-slate-50 p-4 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                    <FlaskConical className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900">PubMed Evidence</h3>
            </div>
            <div className="relative">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ex: ACL reconstruction rehabilitation..."
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="absolute right-2 top-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Buscar'}
                </button>
            </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 animate-fadeIn">
                    <div className="relative mb-3">
                         <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-20 animate-pulse"></div>
                         <FlaskConical className="w-8 h-8 text-blue-600 animate-bounce relative z-10" />
                    </div>
                    <p className="text-xs font-bold text-slate-600">Consultando Base Científica...</p>
                    <p className="text-[10px] text-slate-400">NCBI / PubMed Database</p>
                </div>
            ) : results.length > 0 ? (
                <div className="space-y-2">
                    {results.map(article => (
                        <div key={article.uid} className="bg-white p-3 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors shadow-sm group animate-slideUp">
                            <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug line-clamp-2">{article.title}</h4>
                            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mb-2">
                                <span className="font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{article.source}</span>
                                <span>{article.pubdate?.split(' ')[0]}</span>
                                <span className="truncate max-w-[150px]">{article.authors?.[0]?.name} et al.</span>
                            </div>
                            <a 
                                href={article.url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                Ler no PubMed <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    ))}
                </div>
            ) : searched ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <BookOpen className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-xs">Nenhum artigo encontrado.</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <FileText className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-xs text-center px-6">Pesquise termos em inglês para melhores resultados científicos.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default EvidenceFinder;
