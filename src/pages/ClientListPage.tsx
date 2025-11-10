import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Client, Case } from '../types';
import { useClients } from '../hooks/useClients';
import { PlusIcon, PencilIcon, SearchIcon, TagIcon, SpinnerIcon } from './../components/icons';

interface ClientListPageProps {
    // Props como onAddClient podem ser adicionadas para abrir modais
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(word => word[0])
        .filter(char => char && char.match(/[a-zA-Z]/))
        .slice(0, 2)
        .join('')
        .toUpperCase();
};

const ClientCard: React.FC<{ client: Client; caseCount: number; onEdit: () => void; }> = ({ client, caseCount, onEdit }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md flex flex-col gap-4 group transition-shadow hover:shadow-xl">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                        {getInitials(client.name)}
                    </div>
                    <div>
                        <Link to={`/clientes/${client.id}`} className="text-lg font-bold text-slate-800 dark:text-slate-100 hover:text-primary cursor-pointer">{client.name}</Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{client.email}</p>
                    </div>
                </div>
                <button onClick={onEdit} className="p-2 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary transition-opacity">
                    <PencilIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {(client.tags || []).map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">{tag}</span>
                ))}
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between text-sm">
                <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">{caseCount}</span> {caseCount === 1 ? 'caso ativo' : 'casos ativos'}
                </div>
                <Link to={`/clientes/${client.id}`} className="font-semibold text-primary hover:underline cursor-pointer">Ver Perfil &rarr;</Link>
            </div>
        </div>
    );
};

const ClientListPage: React.FC<ClientListPageProps> = () => {
    const { data: clients, isLoading, isError, error } = useClients();
    
    // O restante da lógica de filtro e paginação seria implementado aqui.
    // Por enquanto, vamos apenas exibir os dados ou o estado de carregamento/erro.

    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><SpinnerIcon className="w-10 h-10 text-primary" /></div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-red-500">Erro ao carregar clientes: {error.message}</div>;
    }

    return (
        <div className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Clientes</h1>
                <button onClick={() => { /* Lógica para abrir modal */ }} className="flex items-center justify-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Cliente
                </button>
            </div>
            
            {/* Filtros e busca iriam aqui */}

            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients?.map(client => (
                    <ClientCard 
                        key={client.id} 
                        client={client} 
                        caseCount={0} // Mock, viria de outra query
                        onEdit={() => { /* Lógica para abrir modal de edição */ }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ClientListPage;