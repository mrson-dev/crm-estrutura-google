import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, View, Case } from '../types';
import { 
    LogoutIcon, BellIcon, MenuIcon, SearchIcon, ChevronDownIcon, SettingsIcon, 
    PlusIcon, BriefcaseIcon, UserPlusIcon, TaskIcon, CommandIcon
} from './icons';

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
    onMenuClick: () => void;
    onToggleNotifications: () => void;
    notificationCount: number;
    view: View;
    cases: Case[];
    selectedCaseId: string | null;
    onNavigate: (view: View, data?: any) => void;
    onQuickCreate: (itemType: 'case' | 'client' | 'task') => void;
    onOpenCommandPalette: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    user, onLogout, onMenuClick, onToggleNotifications, notificationCount, 
    view, cases, selectedCaseId, onNavigate, onQuickCreate, onOpenCommandPalette
}) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isNewMenuOpen, setIsNewMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const newMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
            if (newMenuRef.current && !newMenuRef.current.contains(event.target as Node)) setIsNewMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const headerTitle = useMemo(() => {
        const caseData = cases.find(c => c.id === selectedCaseId);
        switch (view) {
          case View.DASHBOARD: return "Início";
          case View.CASES: return caseData ? `Casos / ${caseData.caseNumber}` : "Casos";
          case View.PROCESSES: return "Processos";
          case View.AGENDA: return "Agenda";
          case View.IA: return "Assistente IA";
          case View.DOCUMENTS: return "Documentos";
          case View.FINANCIAL: return "Financeiro";
          case View.CLIENTS: return "Clientes";
          case View.SETTINGS: return "Configurações";
          default: return "IntelliJuris CRM";
        }
    }, [view, selectedCaseId, cases]);

    const renderTitle = () => {
        const caseData = cases.find(c => c.id === selectedCaseId);
        if (view === View.CASES && caseData) {
            return (
                <div className="flex items-center text-xl md:text-2xl whitespace-nowrap overflow-hidden">
                    <span className="font-medium text-slate-600 dark:text-slate-300 hover:text-primary cursor-pointer" onClick={() => onNavigate(View.CASES)}>Casos</span>
                    <span className="mx-2 text-slate-500 dark:text-slate-400">/</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 truncate">{caseData.caseNumber}</span>
                </div>
            );
        }
        return <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">{headerTitle}</h1>;
    };

    return (
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 md:px-6 flex justify-between items-center h-16 shrink-0 z-20 sticky top-0">
            {/* Lado Esquerdo: Título e Menu Mobile */}
            <div className="flex items-center min-w-0">
                <button onClick={onMenuClick} className="lg:hidden p-2 mr-2 text-slate-600 dark:text-slate-300 hover:text-primary">
                    <MenuIcon className="w-6 h-6" />
                </button>
                {renderTitle()}
            </div>

            {/* Centro: Barra de Pesquisa (Desktop) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg px-4 hidden md:block">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                    </div>
                     <button 
                        onClick={onOpenCommandPalette} 
                        className="w-full text-left bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg py-2 pl-10 pr-4 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white dark:focus:bg-slate-900 focus:border-accent transition-all"
                    >
                        Pesquisar ou digitar um comando...
                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 rounded border bg-white dark:bg-slate-700 dark:border-slate-600 px-1.5 font-mono text-[10px] font-medium text-slate-600 dark:text-slate-300">
                            <CommandIcon className="w-3 h-3" />K
                        </kbd>
                    </button>
                </div>
            </div>

            {/* Lado Direito: Ações */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                {/* Search Icon for Mobile */}
                <button onClick={onOpenCommandPalette} className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-primary">
                    <SearchIcon className="w-6 h-6" />
                </button>
                
                 {/* Quick Create Button */}
                 <div className="relative" ref={newMenuRef}>
                    <button 
                        onClick={() => setIsNewMenuOpen(prev => !prev)}
                        className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors" 
                        aria-label="Criação Rápida"
                    >
                        <PlusIcon className="w-6 h-6" />
                    </button>
                    {isNewMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-slate-700 z-10 animate-fade-in-scale origin-top-right">
                            <div className="py-1">
                                <button onClick={() => { onQuickCreate('case'); setIsNewMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <BriefcaseIcon className="w-5 h-5 mr-3" />
                                    Novo Caso
                                </button>
                                <button onClick={() => { onQuickCreate('client'); setIsNewMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <UserPlusIcon className="w-5 h-5 mr-3" />
                                    Novo Cliente
                                </button>
                                <button onClick={() => { onQuickCreate('task'); setIsNewMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <TaskIcon className="w-5 h-5 mr-3" />
                                    Nova Tarefa
                                </button>
                            </div>
                        </div>
                    )}
                 </div>

                {/* Notifications Button */}
                <div className="relative">
                    <button 
                        onClick={onToggleNotifications}
                        className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors" 
                        aria-label="Notificações"
                    >
                        <BellIcon className="w-6 h-6" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white ring-2 ring-white dark:ring-slate-900">
                                {notificationCount > 9 ? '9+' : notificationCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* User Menu */}
                {user && (
                    <div className="relative" ref={userMenuRef}>
                        <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="flex items-center p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
                            <span className="hidden md:inline font-semibold text-sm mx-2 text-slate-600 dark:text-slate-300">{user.name.split(' ')[0]}</span>
                            <ChevronDownIcon className="w-5 h-5 text-slate-500 hidden md:inline" />
                        </button>
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-slate-700 z-10 animate-fade-in-scale origin-top-right">
                                <div className="py-1">
                                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                    </div>
                                    <button onClick={() => { onNavigate(View.SETTINGS); setIsUserMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <SettingsIcon className="w-5 h-5 mr-3" />
                                        Configurações
                                    </button>
                                    <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <LogoutIcon className="w-5 h-5 mr-3" />
                                        Sair
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;