import React from 'react';
import { Case, User, View } from '../types';
import { CalendarIcon, CloseIcon } from './icons';

interface InitialModalProps {
    user: User | null;
    cases: Case[];
    onNavigate: (view: View, data?: any) => void;
    onClose: () => void;
}

const InitialModal: React.FC<InitialModalProps> = ({ user, cases, onNavigate, onClose }) => {
    const upcomingDeadlines = cases
        .flatMap(c => (c.deadlines || []).map(d => ({ ...d, caseNumber: c.caseNumber, caseId: c.id })))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const getDaysUntil = (date: string) => {
        const today = new Date();
        const deadlineDate = new Date(date);
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDeadlineColor = (days: number) => {
        if (days < 0) return { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-500 dark:text-slate-400', label: 'Atrasado' };
        if (days <= 3) return { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-800 dark:text-rose-300', label: `em ${days} dia(s)` };
        if (days <= 7) return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-300', label: `em ${days} dia(s)` };
        return { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-800 dark:text-sky-300', label: `em ${days} dia(s)` };
    };
    
    const handleClose = () => {
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out px-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-2xl transform animate-fade-in-scale max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Olá, {user?.name.split(' ')[0]}!</h1>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">Aqui estão seus próximos compromissos e tarefas urgentes.</p>
                    </div>
                    <button onClick={handleClose} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6 overflow-y-auto flex-grow">
                    {upcomingDeadlines.length > 0 ? (
                        <ul className="space-y-3 pr-2">
                           {upcomingDeadlines.map(deadline => {
                                const days = getDaysUntil(deadline.date);
                                const colors = getDeadlineColor(days);
                                return (
                                    <li key={deadline.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg cursor-pointer hover:shadow-lg transition-shadow ${colors.bg}`}
                                        onClick={() => onNavigate(View.CASES, { caseId: deadline.caseId })}>
                                        <div className="flex items-center mb-2 sm:mb-0">
                                            <CalendarIcon className={`w-6 h-6 mr-4 flex-shrink-0 ${colors.text}`} />
                                            <div>
                                                <p className={`font-semibold ${colors.text}`}>{deadline.description}</p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    Caso: <span className="font-medium text-primary">{deadline.caseNumber}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right w-full sm:w-auto pl-10 sm:pl-0">
                                            <p className={`font-bold text-lg ${colors.text}`}>{new Date(deadline.date).toLocaleDateString()}</p>
                                            <p className={`text-sm font-medium ${colors.text}`}>{colors.label}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="text-center py-10 text-slate-600 dark:text-slate-400 flex flex-col items-center justify-center h-full">
                            <p className="text-lg">Nenhum prazo futuro encontrado.</p>
                            <p>Bom trabalho!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InitialModal;