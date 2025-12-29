
import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const CFMComplianceGuide: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('identificacao');

  const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
      <div className="bg-slate-900 p-4 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-yellow-500/20 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg leading-none">Compliance Médico</h3>
          <p className="text-slate-400 text-xs mt-1">Baseado na Resolução CFM Nº 2.336/2023</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
        
        {/* ART 4 - IDENTIFICAÇÃO */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button onClick={() => toggle('identificacao')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
             <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-800 text-sm">Art. 4º - Identificação Obrigatória</span>
             </div>
             {openSection === 'identificacao' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSection === 'identificacao' && (
            <div className="p-4 pt-0 text-sm text-slate-600 border-t border-slate-100 mt-2">
              <p className="mb-2">Todas as peças de publicidade devem conter <strong>obrigatoriamente</strong>:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Nome do médico;</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Número do registro no CRM (com estado);</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> A palavra "MÉDICO";</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Se for especialista: Nome da especialidade + Número do RQE (Registro de Qualificação de Especialista).</li>
              </ul>
            </div>
          )}
        </div>

        {/* ART 9 - PERMISSÕES (IMAGENS) */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button onClick={() => toggle('imagens')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
             <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-bold text-slate-800 text-sm">Art. 9º e 14º - Uso de Imagens/Antes e Depois</span>
             </div>
             {openSection === 'imagens' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSection === 'imagens' && (
            <div className="p-4 pt-0 text-sm text-slate-600 border-t border-slate-100 mt-2">
              <p className="mb-2">É <strong>PERMITIDO</strong>:</p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> Mostrar ambiente de trabalho e equipamentos (desde que tenham registro na Anvisa);</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> <strong>Antes e Depois (Art. 14):</strong> Permitido para fins educativos, demonstrando a evolução de tratamentos.</li>
              </ul>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs">
                 <strong>Regras para Antes e Depois:</strong>
                 <ul className="list-disc pl-4 mt-1 space-y-1 text-yellow-800">
                    <li>Deve ser do portfólio próprio do médico.</li>
                    <li>Não pode identificar o paciente (salvo autorização expressa).</li>
                    <li>Texto deve explicar que cada caso é único (variabilidade biológica).</li>
                    <li>Não pode prometer resultado (fim do "resultado garantido").</li>
                 </ul>
              </div>
            </div>
          )}
        </div>

        {/* ART 11 - PROIBIÇÕES */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button onClick={() => toggle('proibicoes')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
             <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="font-bold text-slate-800 text-sm">Art. 11º - O que é PROIBIDO</span>
             </div>
             {openSection === 'proibicoes' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSection === 'proibicoes' && (
            <div className="p-4 pt-0 text-sm text-slate-600 border-t border-slate-100 mt-2">
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Garantir resultados ("Cura garantida", "Livre-se da dor para sempre").</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Atribuir capacidade privilegiada a equipamentos ("A única máquina que resolve").</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Divulgar preços como forma de diferencial ("Consulta mais barata", "Promoção", "Black Friday").</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Venda casada ou premiações ("Trate o joelho e ganhe massagem").</li>
                <li className="flex items-start gap-2"><XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" /> Selos de "Melhor Médico do Ano" ou similares comerciais.</li>
              </ul>
            </div>
          )}
        </div>

        {/* ART 8 - SENSACIONALISMO */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <button onClick={() => toggle('sensacionalismo')} className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
             <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-slate-800 text-sm">Art. 8º - Sensacionalismo e Selfies</span>
             </div>
             {openSection === 'sensacionalismo' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {openSection === 'sensacionalismo' && (
            <div className="p-4 pt-0 text-sm text-slate-600 border-t border-slate-100 mt-2">
              <p className="mb-2"><strong>Selfies (Autorretratos):</strong> Permitidas, desde que não tenham caráter sensacionalista.</p>
              <p className="mb-2 font-bold text-slate-800">O que é Sensacionalismo (§2º)?</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" /> Divulgar métodos não reconhecidos pelo CFM.</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" /> Adulterar dados estatísticos.</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" /> Usar imagem de forma a causar pânico ou medo na sociedade.</li>
                <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" /> Usar adjetivos que denotem superioridade ("O melhor", "O único capaz").</li>
              </ul>
            </div>
          )}
        </div>

      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
         <p className="text-[10px] text-slate-400">
            A MediSocial AI está configurada para gerar conteúdos que respeitam automaticamente estas diretrizes.
         </p>
      </div>
    </div>
  );
};

export default CFMComplianceGuide;
