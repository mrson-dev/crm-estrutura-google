import React, { useState } from 'react';
import { Case, Document, StatusCaso, CaseType } from '../types';
import { summarizeText, suggestNextSteps } from '../services/geminiService';
import { AiSparkleIcon, SpinnerIcon, DocumentIcon, LightbulbIcon, ChevronLeftIcon } from './icons';

interface CaseDetailProps {
  caseData: Case;
}

// Documentos de exemplo para demonstração
const mockDocuments: Document[] = [
    { id: 'doc1', name: 'Petição Inicial.pdf', url: '#', uploadedDate: '2023-10-15', size: 1200000 },
    { id: 'doc2', name: 'Fotos_Evidencias.zip', url: '#', uploadedDate: '2023-10-20', size: 15300000 },
    { id: 'doc3', name: 'Contrato_Cliente.docx', url: '#', uploadedDate: '2023-09-01', size: 45000 },
];

const CaseDetail: React.FC<CaseDetailProps> = ({ caseData }) => {
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const [nextSteps, setNextSteps] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummaryError('');
    setSummary('');
    try {
      const result = await summarizeText(caseData.description);
      setSummary(result);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleSuggestNextSteps = async () => {
    setIsSuggesting(true);
    setSuggestionError('');
    setNextSteps('');
    try {
        const result = await suggestNextSteps(caseData.description);
        setNextSteps(result);
    } catch (error) {
        setSuggestionError(error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.');
    } finally {
        setIsSuggesting(false);
    }
  };
  
  const getStatusColor = (status: StatusCaso) => {
    switch(status) {
        case StatusCaso.ANALISE_INICIAL: return 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300';
        case StatusCaso.AGUARDANDO_DOCUMENTOS: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
        case StatusCaso.PROTOCOLADO_INSS: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
        case StatusCaso.EM_EXIGENCIA: return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300';
        case StatusCaso.RECURSO_ADMINISTRATIVO: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
        case StatusCaso.CONCEDIDO: return 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300';
        case StatusCaso.INDEFERIDO: return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200';
        default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200';
    }
  }

  const getCaseTypeStyle = (type: CaseType) => {
    switch (type) {
        case CaseType.ADMINISTRATIVE:
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case CaseType.JUDICIAL:
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        default:
            return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{caseData.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-mono">{caseData.caseNumber}</p>
            </div>
             <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getCaseTypeStyle(caseData.type)}`}>
                    {caseData.type}
                </span>
                <span className={`px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(caseData.status)}`}>
                    {caseData.status}
                </span>
            </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-700 pt-6">
            <div>
                <h4 className="font-semibold text-slate-600 dark:text-slate-300">Cliente</h4>
                <p className="text-slate-800 dark:text-slate-100">{caseData.client.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{caseData.client.email}</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-600 dark:text-slate-300">Advogado Responsável</h4>
                <p className="text-slate-800 dark:text-slate-100">{caseData.assignedLawyer}</p>
            </div>
            <div>
                <h4 className="font-semibold text-slate-600 dark:text-slate-300">Data de Criação</h4>
                <p className="text-slate-800 dark:text-slate-100">{new Date(caseData.createdDate).toLocaleDateString()}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Descrição do Caso</h3>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap">{caseData.description}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Assistente de IA</h3>
            <div className="space-y-3">
                <button
                    onClick={handleSummarize}
                    disabled={isSummarizing || isSuggesting}
                    className="w-full flex items-center justify-center bg-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-600 dark:hover:bg-sky-400 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                >
                    {isSummarizing ? (
                        <><SpinnerIcon className="w-5 h-5 mr-2" />Resumindo...</>
                    ) : (
                        <><AiSparkleIcon className="w-5 h-5 mr-2" />Gerar Resumo do Caso</>
                    )}
                </button>
                 <button
                    onClick={handleSuggestNextSteps}
                    disabled={isSuggesting || isSummarizing}
                    className="w-full flex items-center justify-center bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition-colors duration-200 disabled:bg-slate-400 dark:disabled:bg-slate-600"
                >
                    {isSuggesting ? (
                        <><SpinnerIcon className="w-5 h-5 mr-2" />Sugerindo...</>
                    ) : (
                        <><LightbulbIcon className="w-5 h-5 mr-2" />Sugerir Próximos Passos</>
                    )}
                </button>
            </div>
            {summary && (
                <div className="mt-4 bg-sky-50 dark:bg-sky-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-sky-800 dark:text-sky-300 mb-2">Resumo:</h4>
                    <div className="text-slate-700 dark:text-slate-200 space-y-2 prose prose-sm" dangerouslySetInnerHTML={{ __html: summary.replace(/\*/g, '•') }} />
                </div>
            )}
            {summaryError && <p className="mt-4 text-sm text-red-600">{summaryError}</p>}
             {nextSteps && (
                <div className="mt-4 bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2">Próximos Passos Sugeridos:</h4>
                    <div className="text-slate-700 dark:text-slate-200 space-y-2 prose prose-sm" dangerouslySetInnerHTML={{ __html: nextSteps.replace(/\*/g, '•') }} />
                </div>
            )}
            {suggestionError && <p className="mt-4 text-sm text-red-600">{suggestionError}</p>}
        </div>
      </div>
       <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Documentos</h3>
          <ul className="space-y-3">
            {mockDocuments.map(doc => (
                <li key={doc.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="flex items-center">
                        <DocumentIcon className="w-8 h-8 text-primary mr-4" />
                        <div>
                            <a href={doc.url} className="font-semibold text-primary hover:underline">{doc.name}</a>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Enviado em: {doc.uploadedDate} - {formatBytes(doc.size)}</p>
                        </div>
                    </div>
                    <button className="text-sm font-medium text-accent hover:underline">Baixar</button>
                </li>
            ))}
          </ul>
           <button className="mt-4 w-full border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold py-3 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-accent hover:text-accent transition-colors duration-200">
               + Enviar Novo Documento
           </button>
       </div>
    </div>
  );
};

export default CaseDetail;