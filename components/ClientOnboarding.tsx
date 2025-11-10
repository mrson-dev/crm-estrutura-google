import React, { useState, useMemo, useEffect } from 'react';
import { Client, Case } from '../types';
import { PlusIcon, PencilIcon, SearchIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon, TagIcon } from './icons';

interface ClientListProps {
    clients: Client[];
    cases: Case[];
    onAddClient: () => void;
    onEditClient: (client: Client) => void;
    onSelectClient: (clientId: string) => void;
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

const ClientCard: React.FC<{ client: Client; caseCount: number; onSelect: () => void; onEdit: () => void; }> = ({ client, caseCount, onSelect, onEdit }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md flex flex-col gap-4 group transition-shadow hover:shadow-xl">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-primary flex-shrink-0">
                        {getInitials(client.name)}
                    </div>
                    <div>
                        <a onClick={onSelect} className="text-lg font-bold text-slate-800 dark:text-slate-100 hover:text-primary cursor-pointer">{client.name}</a>
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
                <a onClick={onSelect} className="font-semibold text-primary hover:underline cursor-pointer">Ver Perfil &rarr;</a>
            </div>
        </div>
    );
};

const ClientList: React.FC<ClientListProps> = ({ clients, cases, onAddClient, onEditClient, onSelectClient }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        clients.forEach(c => (c.tags || []).forEach(t => tags.add(t)));
        return Array.from(tags).sort();
    }, [clients]);

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || client.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTags = activeTags.length === 0 || activeTags.every(tag => (client.tags || []).includes(tag));
            return matchesSearch && matchesTags;
        });
    }, [clients, searchTerm, activeTags]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTags]);

    const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
    const paginatedClients = filteredClients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    
    const clientCaseCounts = useMemo(() => {
        const counts = new Map<string, number>();
        cases.forEach(c => {
            counts.set(c.client.id, (counts.get(c.client.id) || 0) + 1);
        });
        return counts;
    }, [cases]);

    const toggleTag = (tag: string) => {
        setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    };

    return (
        <div className="p-6 md:p-8 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Clientes</h1>
                <button onClick={onAddClient} className="flex items-center justify-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Cliente
                </button>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <SearchIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Buscar por nome ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg py-2 pl-10 pr-4" />
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <TagIcon className="w-5 h-5 text-slate-500" />
                    {allTags.map(tag => (
                         <button key={tag} onClick={() => toggleTag(tag)}
                            className={`px-3 py-1 text-sm font-semibold rounded-full border transition-colors ${
                                activeTags.includes(tag) ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}>
                            {tag}
                         </button>
                    ))}
                </div>
            </div>

            {paginatedClients.length > 0 ? (
                <>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedClients.map(client => (
                        <ClientCard 
                            key={client.id} 
                            client={client} 
                            caseCount={clientCaseCounts.get(client.id) || 0}
                            onSelect={() => onSelectClient(client.id)}
                            onEdit={() => onEditClient(client)}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="pt-6 flex justify-between items-center text-sm">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="flex items-center px-4 py-2 border rounded-lg disabled:opacity-50">
                            <ChevronLeftIcon className="w-4 h-4 mr-2" /> Anterior
                        </button>
                        <span>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="flex items-center px-4 py-2 border rounded-lg disabled:opacity-50">
                            Próxima <ChevronRightIcon className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                )}
                </>
            ) : (
                <div className="flex-grow flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg">
                    <p className="text-slate-500">Nenhum cliente encontrado com os filtros atuais.</p>
                </div>
            )}
        </div>
    );
};

export default ClientList;