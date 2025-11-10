import React, { useState, useMemo } from 'react';
import { Case, Processo } from '../types';
import { PlusIcon } from './icons';

// Dados de exemplo
const mockProcessos: Processo[] = [
    { id: 'p1', title: 'Elaborar Petição Inicial', caseNumber: 'APS-2023-001', stage: 'A Fazer', responsible: 'Jessica P.', dueDate: '2023-12-10' },
    { id: 'p2', title: 'Analisar Documentos do Cliente', caseNumber: 'BPC-2023-005', stage: 'A Fazer', responsible: 'Harvey S.', dueDate: '2023-12-05' },
    { id: 'p3', title: 'Agendar Perícia Médica', caseNumber: 'AUX-2022-012', stage: 'Em Andamento', responsible: 'Jessica P.', dueDate: '2023-12-15' },
    { id: 'p4', title: 'Protocolar Recurso', caseNumber: 'EXG-2023-004', stage: 'Em Andamento', responsible: 'Harvey S.', dueDate: '2023-12-08' },
    { id: 'p5', title: 'Calcular Valor da Causa', caseNumber: 'RUR-2023-008', stage: 'Concluído', responsible: 'Louis L.', dueDate: '2023-11-20' },
    { id: 'p6', title: 'Arquivar Processo', caseNumber: 'PEN-2023-002', stage: 'Concluído', responsible: 'Louis L.', dueDate: '2023-11-25' },
];

const STAGES: Processo['stage'][] = ['A Fazer', 'Em Andamento', 'Concluído'];

const StageColumn: React.FC<{
    title: Processo['stage'];
    processos: Processo[];
}> = ({ title, processos }) => {
    const stageColors = {
        'A Fazer': { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-300' },
        'Em Andamento': { bg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-800 dark:text-sky-300' },
        'Concluído': { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-300' }
    };
    return (
        <div className="flex-1 min-w-[300px] bg-slate-50 dark:bg-slate-900/50 rounded-lg flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                <div className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${stageColors[title].bg} ${stageColors[title].text}`}>
                    {title} ({processos.length})
                </div>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-grow">
                {processos.map(p => (
                    <div key={p.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{p.title}</p>
                        <p className="text-sm text-primary font-medium mt-1">{p.caseNumber}</p>
                        <div className="flex justify-between items-center mt-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>Vence: {new Date(p.dueDate).toLocaleDateString()}</span>
                            <span>{p.responsible}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const Processos: React.FC<{ cases: Case[] }> = ({ cases }) => {
    const [processos] = useState<Processo[]>(mockProcessos);

    const processosPorEstagio = useMemo(() => {
        return STAGES.reduce((acc, stage) => {
            acc[stage] = processos.filter(p => p.stage === stage);
            return acc;
        }, {} as Record<Processo['stage'], Processo[]>);
    }, [processos]);

    return (
        <div className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Fluxo de Processos</h1>
                <button className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Processo
                </button>
            </div>
            <div className="flex-grow flex gap-6 overflow-x-auto pb-4">
                {STAGES.map(stage => (
                    <StageColumn 
                        key={stage}
                        title={stage}
                        processos={processosPorEstagio[stage]}
                    />
                ))}
            </div>
        </div>
    );
};

export default Processos;