import React, { useState, useEffect, Suspense, useRef } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import QuickCreateModal from './components/QuickCreateModal';
import CommandPalette from './components/CommandPalette';
import { User, View, Case, Client, Task, Activity, DocumentTemplate } from './types';
import { SpinnerIcon } from './components/icons';

// Lazy load pages for code splitting
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const CaseListPage = React.lazy(() => import('./pages/CaseListPage'));
const ClientListPage = React.lazy(() => import('./pages/ClientListPage'));
const ClientDetailPage = React.lazy(() => import('./pages/ClientDetailPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const AgendaPage = React.lazy(() => import('./pages/AgendaPage'));
const ProcessosPage = React.lazy(() => import('./pages/ProcessosPage'));
const DocumentosPage = React.lazy(() => import('./pages/DocumentosPage'));
const FinanceiroPage = React.lazy(() => import('./pages/FinanceiroPage'));
const IAPage = React.lazy(() => import('./pages/IAPage'));
const ClientFormModal = React.lazy(() => import('./components/ClientFormModal'));

const queryClient = new QueryClient();

// Mock User for demonstration
const initialUser: User = {
  id: 'user1',
  name: 'Jessica Pearson',
  email: 'advogado@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=jessica',
};

const LoadingIndicator = () => (
    <div className="w-full h-full flex items-center justify-center">
        <SpinnerIcon className="w-10 h-10 text-primary" />
    </div>
);

const AppLayout: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(initialUser);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    
    // Mock data for components that still need it. 
    // This would be replaced by TanStack Query hooks.
    const [cases, setCases] = useState<Case[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [documentTemplates, setDocumentTemplates] = useState<DocumentTemplate[]>([]);

    // State for modals
    const [quickCreateModal, setQuickCreateModal] = useState<{ open: boolean; type: 'case' | 'client' | 'task' | null }>({ open: false, type: null });
    const [clientModalState, setClientModalState] = useState<{ open: boolean, initialData: Client | null }>({ open: false, initialData: null });
    
    const [officeName, setOfficeName] = useState("IntelliJuris");
    const [officeLogoUrl, setOfficeLogoUrl] = useState<string | null>(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (localStorage.getItem('theme') === 'dark') return true;
        if (localStorage.getItem('theme') === 'light') return false;
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'sky');

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    useEffect(() => {
        document.body.setAttribute('data-theme', themeColor);
        localStorage.setItem('themeColor', themeColor);
    }, [themeColor]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Mock handlers, to be replaced with API calls via TanStack mutations
    const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'> | Client) => {
      console.log('Saving client:', clientData);
      setClientModalState({ open: false, initialData: null });
    };
    const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => console.log('Adding task:', taskData);
    const handleAddCase = (caseData: any) => console.log('Adding case:', caseData);

    return (
        <div className="h-screen bg-slate-100 dark:bg-slate-950 lg:grid lg:grid-cols-[auto_1fr]">
            <Sidebar 
                currentView={View.DASHBOARD} // This needs to be updated based on router location
                setCurrentView={() => {}} 
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
                onLogout={() => { /* Implement logout */ }}
                officeName={officeName}
                officeLogoUrl={officeLogoUrl}
            />
            <div className="flex-1 flex flex-col min-w-0 h-screen">
                <Header 
                    user={currentUser} 
                    onLogout={() => { /* Implement logout */ }}
                    onMenuClick={() => setIsMobileSidebarOpen(true)}
                    onToggleNotifications={() => {}}
                    notificationCount={5} // Mock
                    view={View.DASHBOARD} // This needs to be updated based on router location
                    cases={[]}
                    selectedCaseId={null}
                    onNavigate={() => {}}
                    onQuickCreate={(type) => setQuickCreateModal({ open: true, type })}
                    onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                />
                <main className="flex-1 overflow-y-auto">
                    <Suspense fallback={<LoadingIndicator />}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>

            {quickCreateModal.open && (
                <QuickCreateModal
                    modalType={quickCreateModal.type as 'case' | 'task'}
                    onClose={() => setQuickCreateModal({ open: false, type: null })}
                    onAddTask={handleAddTask}
                    onAddCase={handleAddCase}
                    clients={clients}
                    cases={cases}
                />
            )}
            {clientModalState.open && (
                <Suspense fallback={<LoadingIndicator />}>
                    <ClientFormModal
                        isOpen={clientModalState.open}
                        onClose={() => setClientModalState({ open: false, initialData: null })}
                        onSave={handleSaveClient}
                        initialData={clientModalState.initialData}
                    />
                </Suspense>
            )}
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
                cases={[]}
                clients={[]}
                onNavigate={() => {}}
                onQuickCreate={(type) => setQuickCreateModal({ open: true, type })}
            />
        </div>
    );
};


const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // This would be replaced by a Firebase onAuthStateChanged listener
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLoginSuccess={handleLogin} />} />
                    <Route path="/*" element={isLoggedIn ? <ProtectedRoutes /> : <Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

const ProtectedRoutes = () => (
    <Routes>
        <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="casos" element={<CaseListPage />} />
            {/* Example of a detail page */}
            {/* <Route path="casos/:caseId" element={<CaseDetailPage />} /> */}
            <Route path="processos" element={<ProcessosPage />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="clientes" element={<ClientListPage />} />
            <Route path="clientes/:clientId" element={<ClientDetailPage />} />
            <Route path="documentos" element={<DocumentosPage />} />
            <Route path="financeiro" element={<FinanceiroPage />} />
            <Route path="ia" element={<IAPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
    </Routes>
);


export default App;