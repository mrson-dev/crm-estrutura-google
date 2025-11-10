import React, { useState, useMemo, useEffect } from 'react';
import { Case, StatusCaso, CaseType } from '../types';
import CaseDetail from './CaseDetail';
import { PlusIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './icons';

interface CasesViewProps {
  cases: Case[];
  selectedCaseId: string | null;
  onSelectCase: (caseId: string | null) => void;
  onQuickCreate: (itemType: 'case') => void;
}

const getStatusColor = (status: StatusCaso) => {
    switch(status) {
        case StatusCaso.ANALISE_INICIAL: return 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300';
        case StatusCaso.AGUARDANDO_DOCUMENTOS: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
        case StatusCaso.PROTOCOLADO_INSS: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
        case StatusCaso.EM_EXIGENCIA: return 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300';
        case StatusCaso.RECURSO_ADMINISTRATIVO: return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
        case StatusCaso.CONCEDIDO: return 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300';
        case StatusCaso.INDEFERIDO: return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200';
        default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200';
    }
};

const getCaseTypeStyle = (type: CaseType, element: 'text' | 'bg' | 'border' = 'bg') => {
    const styles = {
        [CaseType.ADMINISTRATIVE]: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-500' },
        [CaseType.JUDICIAL]: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-500' },
    };
    return styles[type][element] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
};


type CaseKey = 'caseNumber' | 'title' | 'status' | 'lastUpdated' | 'client.name' | 'type';

interface SortConfig {
  key: CaseKey;
  direction: 'ascending' | 'descending';
}

// Hook para debounce do input do usuário
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const useSortableData = (items: Case[], config: SortConfig | null) => {
    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (config !== null) {
            sortableItems.sort((a, b) => {
                const getNestedValue = (obj: any, path: string): any => {
                    try {
                        return path.split('.').reduce((o, i) => o[i], obj);
                    } catch (e) {
                        return undefined;
                    }
                }
                
                const aValue = getNestedValue(a, config.key);
                const bValue = getNestedValue(b, config.key);

                if (aValue < bValue) {
                    return config.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return config.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, config]);

    return sortedItems;
};

const CaseTableRow = React.memo(({ caseItem, onSelectCase, selectedCaseId }: { caseItem: Case; onSelectCase: (id: string) => void; selectedCaseId: string | null }) => {
  return (
    <tr
      onClick={() => onSelectCase(caseItem.id)}
      className={`border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer ${selectedCaseId === caseItem.id ? 'bg-sky-50 dark:bg-sky-900/30' : 'bg-white dark:bg-slate-800'}`}
    >
      <td className="px-6 py-4 font-medium text-primary whitespace-nowrap">{caseItem.caseNumber}</td>
      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100 max-w-xs truncate">{caseItem.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{caseItem.client.name}</td>
       <td className="px-6 py-4">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getCaseTypeStyle(caseItem.type, 'bg')} ${getCaseTypeStyle(caseItem.type, 'text')}`}>
          {caseItem.type}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
          {caseItem.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">{new Date(caseItem.lastUpdated).toLocaleDateString()}</td>
    </tr>
  );
});

const CaseCard = React.memo(({ caseItem, onSelectCase }: { caseItem: Case; onSelectCase: (id: string) => void; }) => {
    return (
        <div 
            onClick={() => onSelectCase(caseItem.id)}
            className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border-l-4 ${getCaseTypeStyle(caseItem.type, 'border')} cursor-pointer active:scale-[0.98] transition-transform`}
        >
            <div className="flex justify-between items-start gap-2">
                <p className="font-bold text-slate-800 dark:text-slate-100 pr-2">{caseItem.title}</p>
                 <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getCaseTypeStyle(caseItem.type, 'bg')} ${getCaseTypeStyle(caseItem.type, 'text')}`}>
                        {caseItem.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs text-center font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                    </span>
                </div>
            </div>
            <p className="text-sm text-primary font-mono mt-1">{caseItem.caseNumber}</p>
            <div className="text-sm text-slate-600 dark:text-slate-300 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <span>{caseItem.client.name}</span>
                <span>Últ. Atu.: {new Date(caseItem.lastUpdated).toLocaleDateString()}</span>
            </div>
        </div>
    );
});


const CaseList: React.FC<CasesViewProps> = ({ cases, selectedCaseId, onSelectCase, onQuickCreate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'lastUpdated', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<'all' | CaseType>('all');
    const ITEMS_PER_PAGE = 10;
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const filteredCases = useMemo(() => {
        const byType = typeFilter === 'all'
            ? cases
            : cases.filter(c => c.type === typeFilter);

        if (!debouncedSearchTerm) return byType;
        return byType.filter(c => 
            c.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            c.caseNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            c.client.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [cases, debouncedSearchTerm, typeFilter]);

    const sortedAndFilteredCases = useSortableData(filteredCases, sortConfig);
    const selectedCaseData = cases.find(c => c.id === selectedCaseId);
    
    // Efeito para resetar a paginação ao filtrar ou ordenar
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, sortConfig, typeFilter]);

    const totalPages = Math.ceil(sortedAndFilteredCases.length / ITEMS_PER_PAGE);
    const paginatedCases = sortedAndFilteredCases.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const requestSort = (key: CaseKey, directionParam?: 'ascending' | 'descending') => {
        let direction: 'ascending' | 'descending' = directionParam || 'ascending';
        if (!directionParam && sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortableHeader: React.FC<{ sortKey: CaseKey; children: React.ReactNode; }> = ({ sortKey, children }) => {
        const isSorting = sortConfig?.key === sortKey;
        const icon = isSorting ? (sortConfig?.direction === 'ascending' ? <ChevronUpIcon className="w-4 h-4 ml-1" /> : <ChevronDownIcon className="w-4 h-4 ml-1" />) : <div className="w-4 h-4 ml-1" />; // placeholder
        return (
            <th scope="col" className="px-6 py-3 cursor-pointer select-none" onClick={() => requestSort(sortKey)}>
                <div className="flex items-center">
                    {children}
                    {icon}
                </div>
            </th>
        );
    };

    if (selectedCaseData) {
        return (
            <div className="p-6 md:p-8 w-full h-full flex flex-col animate-fade-in-scale">
                <button 
                    onClick={() => onSelectCase(null)} 
                    className="flex items-center text-sm font-semibold text-primary hover:text-sky-700 dark:hover:text-sky-400 mb-6 transition-colors self-start"
                >
                    <ChevronLeftIcon className="w-5 h-5 mr-1" />
                    Voltar para a lista de casos
                </button>
                <div className="flex-grow overflow-y-auto">
                    <CaseDetail caseData={selectedCaseData} />
                </div>
            </div>
        );
    }

    const inputClasses = "w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-950 focus:ring-primary focus:border-primary transition-colors";

    return (
        <div className="p-6 md:p-8 w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Casos</h1>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                         <input
                            type="text"
                            placeholder="Buscar por título, nº ou cliente..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className={`${inputClasses} pr-10`}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                aria-label="Limpar busca"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                     {/* Mobile Sort Dropdown */}
                    <div className="md:hidden">
                        <label htmlFor="sort-cases" className="sr-only">Ordenar por</label>
                        <select
                            id="sort-cases"
                            className={inputClasses}
                            onChange={(e) => {
                                const [key, direction] = e.target.value.split(':');
                                requestSort(key as CaseKey, direction as 'ascending' | 'descending');
                            }}
                            value={`${sortConfig?.key}:${sortConfig?.direction}`}
                        >
                            <option value="lastUpdated:descending">Mais Recentes</option>
                            <option value="lastUpdated:ascending">Mais Antigos</option>
                            <option value="title:ascending">Título (A-Z)</option>
                            <option value="title:descending">Título (Z-A)</option>
                            <option value="status:ascending">Status (A-Z)</option>
                            <option value="client.name:ascending">Cliente (A-Z)</option>
                        </select>
                    </div>

                    <button 
                        onClick={() => onQuickCreate('case')}
                        className="flex items-center justify-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors shrink-0"
                    >
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Novo Caso
                    </button>
                </div>
            </div>

            {/* Type Filter */}
            <div className="mb-6">
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button onClick={() => setTypeFilter('all')} className={`px-4 py-2 text-sm font-semibold ${typeFilter === 'all' ? 'border-b-2 border-primary text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Todos</button>
                    <button onClick={() => setTypeFilter(CaseType.ADMINISTRATIVE)} className={`px-4 py-2 text-sm font-semibold ${typeFilter === CaseType.ADMINISTRATIVE ? 'border-b-2 border-primary text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Administrativos</button>
                    <button onClick={() => setTypeFilter(CaseType.JUDICIAL)} className={`px-4 py-2 text-sm font-semibold ${typeFilter === CaseType.JUDICIAL ? 'border-b-2 border-primary text-primary' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>Judiciais</button>
                </div>
            </div>


            {/* Content */}
            <div className="flex-grow overflow-y-auto">
                {/* Desktop Table */}
                <div className="bg-white dark:bg-slate-900 rounded-lg shadow-md overflow-hidden hidden md:block">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <SortableHeader sortKey="caseNumber">Nº do Caso</SortableHeader>
                                    <SortableHeader sortKey="title">Título</SortableHeader>
                                    <SortableHeader sortKey="client.name">Cliente</SortableHeader>
                                    <SortableHeader sortKey="type">Tipo</SortableHeader>
                                    <SortableHeader sortKey="status">Status</SortableHeader>
                                    <SortableHeader sortKey="lastUpdated">Última Atualização</SortableHeader>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {paginatedCases.map(c => (
                                   <CaseTableRow key={c.id} caseItem={c} onSelectCase={onSelectCase} selectedCaseId={selectedCaseId} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {sortedAndFilteredCases.length === 0 && (
                        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                            <p>Nenhum caso encontrado.</p>
                        </div>
                    )}
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden space-y-4">
                    {paginatedCases.length > 0 ? paginatedCases.map(c => (
                        <CaseCard key={c.id} caseItem={c} onSelectCase={onSelectCase} />
                    )) : (
                         <div className="text-center py-10 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                            <p>Nenhum caso encontrado.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pt-6 flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeftIcon className="w-4 h-4 mr-2" />
                        Anterior
                    </button>
                    <span>
                        Página <span className="font-bold text-slate-800 dark:text-slate-100">{currentPage}</span> de <span className="font-bold text-slate-800 dark:text-slate-100">{totalPages}</span>
                    </span>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Próxima
                        <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CaseList;