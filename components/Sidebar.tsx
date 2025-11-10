import React from 'react';
import { NavLink } from 'react-router-dom';
import { View } from '../types';
import { 
    DashboardIcon, CaseIcon, SettingsIcon, CloseIcon, ProcessIcon, 
    CalendarIcon, AiSparkleIcon, DocumentIcon, FinancialIcon, ContactsIcon,
    LogoutIcon
} from './icons';

interface SidebarProps {
  currentView: View; // Can be removed or used for other logic if needed
  setCurrentView: (view: View) => void; // Can be removed
  isMobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
  officeName: string;
  officeLogoUrl: string | null;
}

const NavItem: React.FC<{
    to: string;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    className?: string;
  }> = ({ to, label, icon: Icon, onClick, className }) => (
    <li className={`my-1 ${className || ''}`}>
      <NavLink
        to={to}
        onClick={onClick}
        aria-label={label}
        className={({ isActive }) => `flex flex-col items-center w-full py-3 px-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary'
        }`}
      >
        <Icon className="w-6 h-6 shrink-0" />
        <span className="font-medium text-xs mt-1.5 whitespace-nowrap">{label}</span>
      </NavLink>
    </li>
  );

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word[0])
        .filter(char => char && char.match(/[a-zA-Z]/))
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

const Sidebar: React.FC<SidebarProps> = ({ 
    isMobileOpen, onMobileClose, 
    onLogout, officeName, officeLogoUrl 
}) => {

    const navItems = [
        { to: '/dashboard', label: 'Início', icon: DashboardIcon },
        { to: '/casos', label: 'Casos', icon: CaseIcon },
        { to: '/processos', label: 'Processos', icon: ProcessIcon },
        { to: '/agenda', label: 'Agenda', icon: CalendarIcon },
        { to: '/clientes', label: 'Clientes', icon: ContactsIcon, isNewSection: true },
        { to: '/documentos', label: 'Documentos', icon: DocumentIcon },
        { to: '/financeiro', label: 'Financeiro', icon: FinancialIcon },
        { to: '/ia', label: 'IA', icon: AiSparkleIcon, isNewSection: true },
    ];

    return (
        <>
            {/* Overlay for mobile view */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onMobileClose}
            ></div>
            <aside className={`bg-white dark:bg-slate-900 flex flex-col h-screen fixed lg:sticky top-0 left-0 border-r border-slate-200 dark:border-slate-700 z-40 transition-all duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0 w-24' : '-translate-x-full'} lg:w-24 lg:translate-x-0`}>
              <div className="flex items-center justify-between p-3 mb-4 h-16 shrink-0 lg:justify-center">
                <NavLink to="/dashboard" className="flex items-center overflow-hidden text-slate-900 dark:text-slate-50">
                    {officeLogoUrl ? (
                        <img src={officeLogoUrl} alt={officeName} className="w-10 h-10 object-contain rounded-md flex-shrink-0" />
                    ) : (
                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 flex items-center justify-center rounded-md text-primary font-bold text-lg flex-shrink-0">
                            {getInitials(officeName)}
                        </div>
                    )}
                </NavLink>
                 <button onClick={onMobileClose} className="lg:hidden p-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                    <CloseIcon className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="flex-grow flex flex-col relative px-2">
                <div className="flex-grow overflow-y-auto overflow-x-hidden">
                    <ul>
                        {navItems.map((item) => (
                           <NavItem
                               key={item.to}
                               to={item.to}
                               label={item.label}
                               icon={item.icon}
                               onClick={onMobileClose}
                               className={(item as any).isNewSection ? 'mt-6' : ''}
                           />
                        ))}
                    </ul>
                </div>
                <div className="mt-auto py-2 shrink-0">
                    <ul>
                        <NavItem
                            to="/settings" label="Configurações" icon={SettingsIcon}
                            onClick={onMobileClose}
                        />
                        <li>
                            <button
                                onClick={() => { onLogout(); onMobileClose(); }}
                                aria-label="Sair"
                                className="flex flex-col items-center w-full py-3 px-2 my-1 rounded-lg transition-all duration-200 text-slate-600 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-500"
                            >
                                <LogoutIcon className="w-6 h-6 shrink-0" />
                                <span className="font-medium text-xs mt-1.5 whitespace-nowrap">Sair</span>
                            </button>
                        </li>
                    </ul>
                </div>
              </nav>
            </aside>
        </>
    );
};

export default Sidebar;