
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  TrendingUp,
  Calendar,
  Zap,
  ChevronRight,
  Activity,
  FolderOpen,
  Globe,
  Plus,
  Stethoscope,
  BookOpen,
  FileText
} from 'lucide-react';

interface DashboardProps {
  onSelectTool: (tool: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);
  
  // Reordered based on new priority: SEO -> Post -> Others
  const quickActions = [
    {
      id: 'seo',
      label: 'Novo Artigo',
      icon: BookOpen,
      desc: 'Blog & SEO',
      color: 'bg-blue-600 text-white', 
      bg: 'bg-blue-50'
    },
    {
      id: 'post',
      label: 'Criar Post',
      icon: Plus,
      desc: 'Instagram',
      color: 'bg-brand-red text-white', 
      bg: 'bg-red-50'
    },
    {
      id: 'infographic',
      label: 'Infográfico',
      icon: Stethoscope,
      desc: 'Visual',
      color: 'bg-indigo-600 text-white',
      bg: 'bg-indigo-50'
    },
    {
      id: 'site',
      label: 'Meu Site',
      icon: Globe,
      desc: 'Ver Publicados',
      color: 'bg-slate-800 text-white',
      bg: 'bg-slate-100'
    }
  ];

  return (
    <div className="pb-32 animate-fadeIn bg-slate-50 min-h-full">
      
      {/* EXECUTIVE HEADER - Adjusted padding for no-header layout */}
      <div className="bg-white border-b border-slate-200 px-6 pt-safe pt-8 pb-4 sticky top-0 z-20">
         <div className="flex justify-between items-center">
             <div>
                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{greeting}, Dr.</p>
                 <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                     Carlos Franciozi
                 </h1>
                 <p className="text-slate-400 text-xs mt-1 font-medium">CRM: 111501 / TEOT: 10930</p>
             </div>
             <div className="relative">
                 <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-brand-red to-primary">
                    <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-slate-200">
                        {/* Placeholder looking like the doctor */}
                        <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80" className="w-full h-full object-cover grayscale" />
                    </div>
                 </div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
             </div>
         </div>
      </div>

      {/* HERO SECTION - "SEO FIRST" STYLE */}
      <div className="px-4 md:px-6 py-4">
        <div 
            onClick={() => onSelectTool('seo')}
            className="relative w-full rounded-[1.5rem] overflow-hidden shadow-2xl group cursor-pointer transform transition-all active:scale-[0.99] bg-slate-900"
        >
            {/* Background Image - Focus on Writing/Authority */}
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80" 
                    alt="Writing Background" 
                    className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-900/20"></div>
            </div>
            
            <div className="relative p-6 md:p-8 min-h-[200px] flex flex-col justify-center items-start z-10">
                <div className="mb-4">
                    <span className="inline-block py-1 px-2.5 rounded bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider mb-2 border border-blue-400/30">
                        Prioridade #1
                    </span>
                    <h2 className="text-white text-2xl md:text-3xl font-black leading-tight tracking-tight max-w-sm">
                        AUTORIDADE <br/> <span className="text-blue-400">DIGITAL (SEO)</span>
                    </h2>
                    <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-sm leading-relaxed">
                        Escreva artigos profundos para o site primeiro. Depois, a IA transforma em posts para o Instagram.
                    </p>
                </div>
                
                <button className="bg-white hover:bg-slate-100 text-slate-900 px-5 py-2.5 rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg transition-all group-hover:pl-6">
                    ESCREVER ARTIGO <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

      {/* QUICK ACTIONS GRID */}
      <div className="px-4 md:px-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ferramentas</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
              {quickActions.slice(1).map((action) => (
                  <button 
                    key={action.id}
                    onClick={() => onSelectTool(action.id)}
                    className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start gap-3 hover:border-primary/30 transition-all active:scale-95 group"
                  >
                     <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${action.bg} ${action.color.split(' ')[0] === 'bg-white' ? 'text-slate-900' : action.color.replace('text-white', 'text-current').replace('bg-', 'text-')}`}>
                         <action.icon className={`w-4.5 h-4.5 ${action.id === 'post' ? 'text-brand-red' : ''} ${action.id === 'infographic' ? 'text-indigo-600' : ''} ${action.id === 'site' ? 'text-slate-700' : ''}`} />
                     </div>
                     <div className="text-left">
                         <span className="block font-bold text-slate-900 text-sm">{action.label}</span>
                         <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{action.desc}</span>
                     </div>
                  </button>
              ))}
              
              {/* RTS Calc Special Card */}
              <button 
                onClick={() => onSelectTool('calculator')}
                className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start gap-3 hover:border-primary/30 transition-all active:scale-95 group relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-600/10 to-transparent rounded-bl-full -mr-4 -mt-4"></div>
                 <div className="w-9 h-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm relative z-10">
                     <Activity className="w-4.5 h-4.5" />
                 </div>
                 <div className="text-left relative z-10">
                     <span className="block font-bold text-slate-900 text-sm">RTS Calc</span>
                     <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Protocolo LCA</span>
                 </div>
              </button>
          </div>
      </div>

      {/* RECENT ACTIVITY / STATS */}
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Gestão</h3>
        </div>

        <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
            <div 
                onClick={() => onSelectTool('trends')}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shrink-0">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">Radar de Trends</h4>
                    <p className="text-xs text-slate-500 mt-0.5">O que estão buscando hoje.</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
