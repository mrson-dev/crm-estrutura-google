import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Case, Client, View } from '../types';
import { 
    SearchIcon, CaseIcon, UserPlusIcon, TaskIcon, DashboardIcon, ProcessIcon, 
    CalendarIcon, DocumentIcon, FinancialIcon, ContactsIcon, SettingsIcon,
    AiSparkleIcon, ArrowRightIcon, BriefcaseIcon
} from './icons';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    cases: Case[];
    clients: Client[];
    onNavigate: (view: View, data?: any) => void;
    onQuickCreate: (itemType: 'case' | 'client' | 'task') => void;
}

type Command = {
    id: string;
    type: 'Navegação' | 'Ações' | 'Casos' | 'Clientes';
    icon: React.ElementType;
    title: string;
    subtitle?: string;
    action: () => void;
};

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, cases, clients, onNavigate, onQuickCreate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLUListElement>(null);

    const allCommands: Command[] = useMemo(() => {
        const navigationCommands: Command[] = [
            { id: 'nav-dashboard', type: 'Navegação', icon: DashboardIcon, title: 'Ir para Início', action: () => onNavigate(View.DASHBOARD) },
            { id: 'nav-cases', type: 'Navegação', icon: CaseIcon, title: 'Ir para Casos', action: () => onNavigate(View.CASES) },
            { id: 'nav-processes', type: 'Navegação', icon: ProcessIcon, title: 'Ir para Processos', action: () => onNavigate(View.PROCESSES) },
            { id: 'nav-agenda', type: 'Navegação', icon: CalendarIcon, title: 'Ir para Agenda', action: () => onNavigate(View.AGENDA) },
            { id: 'nav-clients', type: 'Navegação', icon: ContactsIcon, title: 'Ir para Clientes', action: () => onNavigate(View.CLIENTS) },
            { id: 'nav-documents', type: 'Navegação', icon: DocumentIcon, title: 'Ir para Documentos', action: () => onNavigate(View.DOCUMENTS) },
            { id: 'nav-financial', type: 'Navegação', icon: FinancialIcon, title: 'Ir para Financeiro', action: () => onNavigate(View.FINANCIAL) },
            { id: 'nav-ia', type: 'Navegação', icon: AiSparkleIcon, title: 'Ir para Assistente IA', action: () => onNavigate(View.IA) },
            { id: 'nav-settings', type: 'Navegação', icon: SettingsIcon, title: 'Ir para Configurações', action: () => onNavigate(View.SETTINGS) },
        ];

        const actionCommands: Command[] = [
            { id: 'act-new-case', type: 'Ações', icon: BriefcaseIcon, title: 'Novo Caso', action: () => onQuickCreate('case') },
            { id: 'act-new-client', type: 'Ações', icon: UserPlusIcon, title: 'Novo Cliente', action: () => onQuickCreate('client') },
            { id: 'act-new-task', type: 'Ações', icon: TaskIcon, title: 'Nova Tarefa', action: () => onQuickCreate('task') },
        ];

        const caseCommands: Command[] = cases.map(c => ({
            id: `case-${c.id}`,
            type: 'Casos',
            icon: CaseIcon,
            title: c.title,
            subtitle: c.caseNumber,
            action: () => onNavigate(View.CASES, { caseId: c.id }),
        }));

        const clientCommands: Command[] = clients.map(c => ({
            id: `client-${c.id}`,
            type: 'Clientes',
            icon: ContactsIcon,
            title: c.name,
            subtitle: c.email,
            action: () => onNavigate(View.CLIENTS, { clientId: c.id }),
        }));

        return [...navigationCommands, ...actionCommands, ...caseCommands, ...clientCommands];
    }, [cases, clients, onNavigate, onQuickCreate]);

    const filteredCommands = useMemo(() => {
        if (!searchTerm) return [];
        return allCommands.filter(cmd =>
            cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cmd.subtitle && cmd.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, 10);
    }, [searchTerm, allCommands]);

    const groupedCommands = useMemo(() => {
        const groups = new Map<string, Command[]>();
        const target = searchTerm ? filteredCommands : [...allCommands.filter(c => c.type === 'Navegação' || c.type === 'Ações')];

        target.forEach(cmd => {
            if (!groups.has(cmd.type)) {
                groups.set(cmd.type, []);
            }
            groups.get(cmd.type)!.push(cmd);
        });
        return Array.from(groups.entries());
    }, [searchTerm, filteredCommands, allCommands]);
    
    const flatCommandList = useMemo(() => groupedCommands.flatMap(([, commands]) => commands), [groupedCommands]);


    useEffect(() => {
        if (isOpen) {
            setSearchTerm('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % flatCommandList.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + flatCommandList.length) % flatCommandList.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                const command = flatCommandList[activeIndex];
                if (command) {
                    command.action();
                    onClose();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeIndex, flatCommandList, onClose]);
    
     useEffect(() => {
        const activeElement = resultsRef.current?.querySelector(`[data-index="${activeIndex}"]`);
        activeElement?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-[15vh]" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl transform animate-fade-in-down"
                onClick={e => e.stopPropagation()}
            >
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setActiveIndex(0);
                        }}
                        placeholder="Pesquisar ou digitar um comando..."
                        className="w-full bg-transparent text-lg py-4 pl-12 pr-4 border-b border-slate-200 dark:border-slate-700 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 text-slate-800 dark:text-slate-100"
                    />
                </div>
                <div className="p-2 max-h-[50vh] overflow-y-auto">
                    {flatCommandList.length > 0 ? (
                         <ul ref={resultsRef}>
                            {groupedCommands.map(([groupName, commands]) => (
                                <li key={groupName}>
                                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase px-3 pt-4 pb-2">{groupName}</h3>
                                    <ul>
                                        {commands.map(cmd => {
                                            const currentIndex = flatCommandList.findIndex(c => c.id === cmd.id);
                                            return (
                                                <li key={cmd.id}
                                                    data-index={currentIndex}
                                                    onMouseMove={() => setActiveIndex(currentIndex)}
                                                    onClick={() => { cmd.action(); onClose(); }}
                                                    className={`flex justify-between items-center p-3 m-1 rounded-lg cursor-pointer ${activeIndex === currentIndex ? 'bg-primary/10 text-primary' : 'text-slate-800 dark:text-slate-100'}`}
                                                >
                                                    <div className="flex items-center">
                                                        <cmd.icon className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
                                                        <div>
                                                            <span>{cmd.title}</span>
                                                            {cmd.subtitle && <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">{cmd.subtitle}</span>}
                                                        </div>
                                                    </div>
                                                    {activeIndex === currentIndex && <ArrowRightIcon className="w-5 h-5" />}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                           <p>Nenhum resultado encontrado.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;