import React, { useMemo } from 'react';
import { Case, StatusCaso, View, Task, User, Activity, ActivityType } from '../types';
import { 
    CalendarIcon, CheckCircleIcon, ArrowPathIcon, PlusCircleIcon, DocumentIcon, 
    CheckBadgeIcon, CurrencyDollarIcon, BriefcaseIcon, PlusIcon
} from './icons';

interface DashboardProps {
    user: User | null;
    cases: Case[];
    tasks: Task[];
    activityLog: Activity[];
    onNavigate: (view: View, data?: any) => void;
    // FIX: The type for onQuickCreate's itemType was changed from 'contact' to 'client' to match the implementation in App.tsx.
    onQuickCreate: (itemType: 'case' | 'client' | 'task') => void;
    onToggleTask: (taskId: string) => void;
}

const StatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: string;
    color: string;
}> = React.memo(({ icon: Icon, title, value, color }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
));

const MyTasks: React.FC<{ tasks: Task[], onTaskToggle: (taskId: string) => void, onQuickCreate: (itemType: 'task') => void }> = ({ tasks, onTaskToggle, onQuickCreate }) => {
    const sortedTasks = [...tasks].sort((a, b) => a.completed === b.completed ? 0 : a.completed ? 1 : -1).slice(0, 4);

    const getPriorityColor = (priority: 'Alta' | 'Média' | 'Baixa') => {
        switch(priority) {
            case 'Alta': return 'border-rose-500';
            case 'Média': return 'border-amber-500';
            case 'Baixa': return 'border-sky-500';
            default: return 'border-slate-300 dark:border-slate-600';
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Minhas Tarefas</h3>
                <button 
                    onClick={() => onQuickCreate('task')}
                    className="flex items-center text-sm font-semibold text-primary hover:text-sky-700 dark:hover:text-sky-400 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Adicionar
                </button>
            </div>
            {sortedTasks.length > 0 ? (
                 <ul className="space-y-3 flex-grow">
                    {sortedTasks.map(task => (
                        <li key={task.id} className={`flex items-center p-3 rounded-lg border-l-4 transition-colors ${getPriorityColor(task.priority)} ${task.completed ? 'bg-slate-50 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                            <button onClick={() => onTaskToggle(task.id)} className="mr-3 flex-shrink-0">
                                {task.completed ? (
                                    <CheckCircleIcon className="w-6 h-6 text-teal-500" />
                                ) : (
                                    <div className="w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-full hover:border-primary"></div>
                                )}
                            </button>
                            <div>
                                <p className={`font-medium ${task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-100'}`}>{task.description}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Vence em: {new Date(task.dueDate).toLocaleDateString()}</p>
                            </div>
                        </li>
                    ))}
                 </ul>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-400 text-center py-4">Você está em dia com suas tarefas!</p>
                </div>
            )}
        </div>
    )
}

const CriticalDeadlines: React.FC<{cases: Case[], onNavigate: (view: View, data?: any) => void}> = ({ cases, onNavigate }) => {
    const upcomingDeadlines = cases
        .flatMap(c => (c.deadlines || []).map(d => ({ ...d, caseNumber: c.caseNumber, caseId: c.id })))
        .filter(d => new Date(d.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 4);
    
    const getDaysUntil = (date: string) => {
        const today = new Date();
        const deadlineDate = new Date(date);
        today.setHours(0, 0, 0, 0);
        deadlineDate.setHours(0, 0, 0, 0);
        const diffTime = deadlineDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDeadlineColor = (days: number) => {
        if (days <= 3) return { text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' };
        if (days <= 7) return { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' };
        return { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20' };
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md h-full flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Prazos Críticos</h3>
            {upcomingDeadlines.length > 0 ? (
                <ul className="space-y-3 flex-grow">
                    {upcomingDeadlines.map(deadline => {
                        const days = getDaysUntil(deadline.date);
                        const { text, bg } = getDeadlineColor(days);
                        const dayLabel = days === 0 ? 'Hoje' : days === 1 ? 'Amanhã' : `em ${days} dias`;

                        return (
                            <li key={deadline.id} onClick={() => onNavigate(View.CASES, {caseId: deadline.caseId})}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${bg} hover:shadow-md hover:scale-[1.02]`}>
                                <div>
                                    <p className={`font-semibold text-sm ${text}`}>{deadline.description}</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Caso: {deadline.caseNumber}</p>
                                </div>
                                <div className={`text-sm font-bold text-center flex-shrink-0 ml-2 px-2 py-1 rounded ${text}`}>
                                    {dayLabel}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                 <div className="flex-grow flex items-center justify-center">
                    <p className="text-slate-600 dark:text-slate-400 text-center py-4">Nenhum prazo crítico nos próximos dias.</p>
                </div>
            )}
        </div>
    );
}

const BenefitFunnel: React.FC<{cases: Case[]}> = ({ cases }) => {
    const statusOrder: StatusCaso[] = [
        StatusCaso.ANALISE_INICIAL, StatusCaso.AGUARDANDO_DOCUMENTOS, StatusCaso.PROTOCOLADO_INSS,
        StatusCaso.EM_EXIGENCIA, StatusCaso.RECURSO_ADMINISTRATIVO, StatusCaso.CONCEDIDO,
    ];

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        statusOrder.forEach(s => counts[s] = 0);
        cases.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++; });
        return counts;
    }, [cases]);
    
    const maxCount = useMemo(() => Math.max(...Object.values(statusCounts).map(Number), 1), [statusCounts]);

    const statusInfo: { [key in StatusCaso]: { color: string; label: string } } = {
        [StatusCaso.ANALISE_INICIAL]: { color: 'bg-sky-500', label: 'Análise Inicial' },
        [StatusCaso.AGUARDANDO_DOCUMENTOS]: { color: 'bg-amber-500', label: 'Aguard. Documentos' },
        [StatusCaso.PROTOCOLADO_INSS]: { color: 'bg-indigo-500', label: 'Protocolado no INSS' },
        [StatusCaso.EM_EXIGENCIA]: { color: 'bg-rose-500', label: 'Em Exigência' },
        [StatusCaso.RECURSO_ADMINISTRATIVO]: { color: 'bg-orange-500', label: 'Recurso Admin.' },
        [StatusCaso.CONCEDIDO]: { color: 'bg-teal-500', label: 'Concedido' },
        [StatusCaso.INDEFERIDO]: { color: 'bg-slate-500', label: 'Indeferido' },
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md h-full">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Funil de Benefícios</h3>
            <div className="space-y-4">
                {statusOrder.map(status => (
                    <div key={status} className="flex items-center text-sm">
                        <span className="w-36 text-slate-600 dark:text-slate-300 shrink-0 text-right pr-4">{statusInfo[status].label}</span>
                        <div className="flex-grow bg-slate-100 dark:bg-slate-700 rounded-full h-6 relative">
                            <div className={`${statusInfo[status].color} h-6 rounded-full transition-all duration-500`}
                                style={{ width: `${(statusCounts[status] / maxCount) * 100}%` }}
                            ></div>
                             <span className="absolute inset-0 flex items-center justify-end pr-3 font-bold text-white text-shadow-sm">{statusCounts[status]}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActivityIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
    const commonClasses = "w-5 h-5 text-white";
    switch (type) {
        case ActivityType.STATUS_CHANGE:
            return <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center ring-4 ring-amber-100 dark:ring-amber-900/30"><ArrowPathIcon className={commonClasses} /></div>;
        case ActivityType.NEW_DOCUMENT:
            return <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center ring-4 ring-sky-100 dark:ring-sky-900/30"><DocumentIcon className={commonClasses} /></div>;
        case ActivityType.DEADLINE_ADDED:
        case ActivityType.REQUIREMENT_PENDING:
            return <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center ring-4 ring-rose-100 dark:ring-rose-900/30"><CalendarIcon className={commonClasses} /></div>;
        case ActivityType.CASE_CREATED:
            return <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center ring-4 ring-indigo-100 dark:ring-indigo-900/30"><PlusCircleIcon className={commonClasses} /></div>;
        case ActivityType.BENEFIT_GRANTED:
            return <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center ring-4 ring-teal-100 dark:ring-teal-900/30"><CheckBadgeIcon className={commonClasses} /></div>;
        default: return null;
    }
};

const RecentActivity: React.FC<{ activityLog: Activity[], onNavigate: (view: View, data?: any) => void; }> = ({ activityLog, onNavigate }) => {
    const sortedActivity = [...activityLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000; if (interval > 1) return `há ${Math.floor(interval)} anos`;
        interval = seconds / 2592000; if (interval > 1) return `há ${Math.floor(interval)} meses`;
        interval = seconds / 86400; if (interval > 1) return `há ${Math.floor(interval)} dias`;
        interval = seconds / 3600; if (interval > 1) return `há ${Math.floor(interval)} horas`;
        interval = seconds / 60; if (interval > 1) return `há ${Math.floor(interval)} min`;
        return `há poucos segundos`;
    }
    return (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md h-full">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Atividade Recente</h3>
            {sortedActivity.length > 0 ? (
                <ul className="space-y-4">
                    {sortedActivity.map(activity => (
                        <li key={activity.id} className="flex items-start">
                            <ActivityIcon type={activity.type} />
                            <div className="ml-4">
                                <p className="text-sm text-slate-700 dark:text-slate-200">
                                    <span className="font-semibold">{activity.user}</span> {activity.type.toLowerCase()} no caso <span className="font-semibold text-primary cursor-pointer hover:underline" onClick={() => onNavigate(View.CASES, { caseId: activity.caseId })}>{activity.caseNumber}</span>.
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{timeSince(activity.timestamp)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-600 dark:text-slate-400 text-center py-4">Nenhuma atividade recente.</p>
            )}
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ user, cases, tasks, activityLog, onNavigate, onQuickCreate, onToggleTask }) => {

    const formatCurrencyBRL = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const dashboardData = useMemo(() => {
        const concededThisMonth = cases.filter(c => {
            const lastUpdated = new Date(c.lastUpdated);
            const today = new Date();
            return c.status === StatusCaso.CONCEDIDO && lastUpdated.getMonth() === today.getMonth() && lastUpdated.getFullYear() === today.getFullYear();
        }).length;

        const activeCases = cases.filter(c => c.status !== StatusCaso.CONCEDIDO && c.status !== StatusCaso.INDEFERIDO).length;

        return {
            concededThisMonth,
            potentialFees: 125800, // Mocked value
            activeCases,
        };
    }, [cases]);
    
    return (
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Bom dia, {user?.name.split(' ')[0]}!</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Aqui está um resumo do seu escritório hoje.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={BriefcaseIcon} title="Casos Ativos" value={dashboardData.activeCases.toString()} color="bg-indigo-500" />
                <StatCard icon={CheckBadgeIcon} title="Benefícios Concedidos (Mês)" value={dashboardData.concededThisMonth.toString()} color="bg-teal-500" />
                <StatCard icon={CurrencyDollarIcon} title="Honorários a Receber (Potencial)" value={formatCurrencyBRL(dashboardData.potentialFees)} color="bg-sky-500" />
                <StatCard icon={CalendarIcon} title="Prazos em 7 dias" value={cases.flatMap(c => c.deadlines || []).filter(d => { const days = (new Date(d.date).getTime() - new Date().getTime()) / (1000*3600*24); return days >= 0 && days <= 7}).length.toString()} color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MyTasks tasks={tasks} onTaskToggle={onToggleTask} onQuickCreate={onQuickCreate} />
                <CriticalDeadlines cases={cases} onNavigate={onNavigate} />
            </div>

            <div className="grid grid-cols-1 gap-6">
                 <BenefitFunnel cases={cases} />
            </div>

             <div className="grid grid-cols-1 gap-6">
                 <RecentActivity activityLog={activityLog} onNavigate={onNavigate} />
            </div>
        </div>
    );
};

export default Dashboard;
