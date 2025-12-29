
import React, { useState, useEffect } from 'react';
import { RTSMetrics, RTSHistoryEntry } from '../types';
import { Activity, Dumbbell, Brain, Ruler, CheckCircle, AlertTriangle, XCircle, Share2, Info, Save, History } from 'lucide-react';

const ReturnToSportCalculator: React.FC = () => {
  const [metrics, setMetrics] = useState<RTSMetrics>({
    patientName: '',
    limbSymmetry: 85,
    painScore: 2,
    romExtension: 0,
    romFlexion: 135,
    hopTest: 80,
    psychologicalReadiness: 70
  });

  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<RTSHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  useEffect(() => {
    const saved = localStorage.getItem('rts_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const painFactor = Math.max(0, 10 - metrics.painScore) * 10; 
    const romFactor = (metrics.romFlexion >= 130 && metrics.romExtension <= 5) ? 100 : 50;
    const calculated = (
        (metrics.limbSymmetry * 0.3) +
        (metrics.hopTest * 0.3) +
        (metrics.psychologicalReadiness * 0.2) +
        (painFactor * 0.1) +
        (romFactor * 0.1)
    );
    setScore(Math.round(calculated));
  }, [metrics]);

  const handleSave = () => {
      if (!metrics.patientName.trim()) {
          alert("Digite o nome do paciente para salvar.");
          return;
      }
      const newEntry: RTSHistoryEntry = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          patientName: metrics.patientName,
          score: score,
          metrics: { ...metrics }
      };
      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('rts_history', JSON.stringify(updatedHistory));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const getStatus = (s: number) => {
      if (s >= 90) return { label: 'Apto', color: 'text-green-600', stroke: '#16a34a', bg: 'bg-green-100', icon: CheckCircle, desc: 'Alta' };
      if (s >= 75) return { label: 'Treino', color: 'text-yellow-600', stroke: '#ca8a04', bg: 'bg-yellow-100', icon: AlertTriangle, desc: 'Prog.' };
      return { label: 'Inapto', color: 'text-red-600', stroke: '#dc2626', bg: 'bg-red-100', icon: XCircle, desc: 'Reab' };
  };

  const status = getStatus(score);

  const CustomSlider = ({ label, value, min, max, onChange, unit = '' }: any) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</label>
            <span className="text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md min-w-[3rem] text-center shadow-sm">
                {value}{unit}
            </span>
        </div>
        <input 
            type="range" min={min} max={max} 
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 touch-none"
        />
    </div>
  );

  return (
    <div className="h-full flex flex-col animate-fadeIn pb-28 lg:pb-0 font-sans bg-slate-50">
        
        {/* Compact Header */}
        <div className="bg-white/80 backdrop-blur-md px-5 py-4 border-b border-slate-100 sticky top-0 z-10 flex justify-between items-center">
             <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" /> RTS Calc
                </h1>
                <p className="text-xs text-slate-500 font-medium">Protocolo ACL-RSI</p>
             </div>
             <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2.5 rounded-xl transition-all ${showHistory ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
             >
                 <History className="w-5 h-5" />
             </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
            
            {showHistory ? (
                <div className="space-y-3">
                    {history.length === 0 && <p className="text-center text-slate-400 text-sm mt-10">Histórico vazio.</p>}
                    {history.map(entry => (
                        <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">{entry.patientName}</h3>
                                <p className="text-[10px] text-slate-500">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                            <div className={`text-lg font-black ${entry.score >= 90 ? 'text-green-500' : 'text-slate-700'}`}>
                                {entry.score}%
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                <input 
                    type="text"
                    placeholder="Nome do Paciente"
                    value={metrics.patientName}
                    onChange={(e) => setMetrics({...metrics, patientName: e.target.value})}
                    className="w-full p-4 rounded-xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />

                {/* Compact Score Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide mb-2 ${status.bg} ${status.color}`}>
                            <status.icon className="w-3 h-3" /> {status.label}
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 leading-none">
                            {score}%
                        </h2>
                        <p className="text-slate-400 text-[10px] font-medium mt-1 uppercase tracking-wider">Score Final</p>
                    </div>

                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                            <circle 
                                cx="48" cy="48" r="40" 
                                stroke={status.stroke} 
                                strokeWidth="8" 
                                fill="transparent" 
                                strokeDasharray="251.2" 
                                strokeDashoffset={251.2 - (251.2 * score) / 100} 
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out" 
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity className={`w-6 h-6 ${status.color}`} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                    <CustomSlider label="LSI (Simetria)" value={metrics.limbSymmetry} min={0} max={100} unit="%" onChange={(v: number) => setMetrics({...metrics, limbSymmetry: v})} />
                    <CustomSlider label="Hop Test (Saltos)" value={metrics.hopTest} min={0} max={100} unit="%" onChange={(v: number) => setMetrics({...metrics, hopTest: v})} />
                    <CustomSlider label="Psicológico (ACL-RSI)" value={metrics.psychologicalReadiness} min={0} max={100} unit="" onChange={(v: number) => setMetrics({...metrics, psychologicalReadiness: v})} />
                    
                    <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Dor (EVA)</label>
                        <div className="flex gap-1">
                            {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                                <button key={v} onClick={() => setMetrics({...metrics, painScore: v})} className={`flex-1 aspect-square rounded-md text-[9px] font-bold ${metrics.painScore === v ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{v}</button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <CustomSlider label="Flexão" value={metrics.romFlexion} min={0} max={150} unit="°" onChange={(v: number) => setMetrics({...metrics, romFlexion: v})} />
                        <CustomSlider label="Extensão" value={metrics.romExtension} min={0} max={10} unit="°" onChange={(v: number) => setMetrics({...metrics, romExtension: v})} />
                    </div>
                </div>
                
                <button 
                    onClick={handleSave}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] mb-4
                    ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-slate-900 text-white'}`}
                >
                    {saveStatus === 'saved' ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {saveStatus === 'saved' ? 'Salvo!' : 'Salvar Resultado'}
                </button>
                </>
            )}
        </div>
    </div>
  );
};

export default ReturnToSportCalculator;
