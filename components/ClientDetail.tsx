import React, { useState } from 'react';
import { Client, Case, Task } from '../types';
import { PencilIcon, ChevronLeftIcon, BriefcaseIcon, DocumentIcon, TaskIcon, UserCircleIcon, TagIcon } from './icons';

interface ClientDetailProps {
    client: Client;
    cases: Case[];
    tasks: Task[];
    onBack: () => void;
    onEdit: (client: Client) => void;
    onNavigateToCase: (caseId: string) => void;
}

const getInitials = (name: string) => name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
        <div className="mt-2 text-slate-800 dark:text-slate-100">{children}</div>
    </div>
);

const ClientDetail: React.FC<ClientDetailProps> = ({ client, cases, tasks, onBack, onEdit, onNavigateToCase }) => {
    const [activeTab, setActiveTab] = useState<'cases' | 'tasks' | 'documents'>('cases');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'cases':
                return (
                    <ul className="space-y-3">
                        {cases.map(c => (
                            <li key={c.id} onClick={() => onNavigateToCase(c.id)} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <p className="font-semibold text-primary">{c.title}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">{c.caseNumber} - <span className="font-medium">{c.status}</span></p>
                            </li>
                        ))}
                    </ul>
                );
            case 'tasks':
                 return (
                    <ul className="space-y-3">
                        {tasks.map(t => (
                            <li key={t.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <p className={`font-medium ${t.completed ? 'line-through text-slate-500' : ''}`}>{t.description}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300">Vence em: {new Date(t.dueDate).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                );
            case 'documents':
                return <p className="text-slate-500 text-center py-8">Nenhum documento encontrado.</p>;
            default:
                return null;
        }
    };
    
    return (
        <div className="p-6 md:p-8 space-y-6">
            <button onClick={onBack} className="flex items-center text-sm font-semibold text-primary hover:underline mb-4">
                <ChevronLeftIcon className="w-4 h-4 mr-1" /> Voltar para lista de clientes
            </button>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                 <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-3xl font-bold text-primary">
                            {getInitials(client.name)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{client.name}</h1>
                            <p className="text-slate-500 dark:text-slate-400">{client.email} | {client.phone}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(client.tags || []).map(tag => (
                                    <span key={tag} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => onEdit(client)} className="flex items-center text-sm font-semibold border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <PencilIcon className="w-4 h-4 mr-2" /> Editar
                    </button>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md space-y-6">
                    <DetailSection title="Informações Pessoais">
                        <p><strong>CPF:</strong> {client.cpf}</p>
                        <p><strong>RG:</strong> {client.rg}</p>
                        <p><strong>Nascimento:</strong> {client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                    </DetailSection>
                    <DetailSection title="Endereço">
                        <p>{client.street}, {client.number} {client.complement}</p>
                        <p>{client.neighborhood}, {client.city} - {client.state}</p>
                        <p>CEP: {client.cep}</p>
                    </DetailSection>
                    {client.legalRepresentative?.name && (
                         <DetailSection title="Representante Legal">
                            <p><strong>Nome:</strong> {client.legalRepresentative.name}</p>
                            <p><strong>CPF:</strong> {client.legalRepresentative.cpf}</p>
                        </DetailSection>
                    )}
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                     <div className="border-b border-slate-200 dark:border-slate-700 mb-4">
                        <nav className="-mb-px flex space-x-6">
                             <button onClick={() => setActiveTab('cases')} className={`py-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 ${activeTab === 'cases' ? 'border-primary text-primary' : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-primary'}`}><BriefcaseIcon className="w-5 h-5"/> Casos</button>
                             <button onClick={() => setActiveTab('tasks')} className={`py-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 ${activeTab === 'tasks' ? 'border-primary text-primary' : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-primary'}`}><TaskIcon className="w-5 h-5"/> Tarefas</button>
                             <button onClick={() => setActiveTab('documents')} className={`py-3 px-1 border-b-2 font-semibold text-sm flex items-center gap-2 ${activeTab === 'documents' ? 'border-primary text-primary' : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-primary'}`}><DocumentIcon className="w-5 h-5"/> Documentos</button>
                        </nav>
                    </div>
                    <div>{renderTabContent()}</div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetail;