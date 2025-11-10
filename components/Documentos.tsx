import React, { useState, useMemo, useEffect } from 'react';
import { Document, DocumentTemplate, Client, Case, User } from '../types';
import { DocumentIcon, PlusIcon, SearchIcon, FileSignatureIcon, PencilIcon, TrashIcon, CloseIcon, SpinnerIcon } from './icons';

// --- MOCK DATA (provisório) ---
const mockDocuments: Document[] = [
    { id: 'doc1', name: 'Petição Inicial Aposentadoria.pdf', url: '#', uploadedDate: '2023-10-15', size: 1200000, caseId: 'case1' },
    { id: 'doc2', name: 'Fotos_Evidencias_BPC.zip', url: '#', uploadedDate: '2023-10-20', size: 15300000, caseId: 'case2' },
    { id: 'doc3', name: 'Contrato_Cliente_Carlos.docx', url: '#', uploadedDate: '2023-09-01', size: 45000, caseId: 'case3' },
    { id: 'doc4', name: 'Laudo Medico Dr. House.pdf', url: '#', uploadedDate: '2023-11-05', size: 850000, caseId: 'case3' },
];

// --- MODAL DE FORMULÁRIO DE TEMPLATE ---
const TemplateFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (template: Omit<DocumentTemplate, 'id'> | DocumentTemplate) => void;
    initialData?: DocumentTemplate | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<DocumentTemplate['category']>('Outro');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setCategory(initialData.category);
            setContent(initialData.content);
        } else {
            setTitle('');
            setCategory('Outro');
            setContent('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const templateData = { title, category, content };
        if (initialData) {
            onSubmit({ ...initialData, ...templateData });
        } else {
            onSubmit(templateData);
        }
    };

    const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
    
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{initialData ? 'Editar Modelo' : 'Novo Modelo de Documento'}</h2>
                        <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título do Modelo</label>
                            <input id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value as any)} className={inputClasses}>
                                <option>Petição</option><option>Contrato</option><option>Procuração</option><option>Outro</option>
                            </select>
                        </div>
                        <div>
                             <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Conteúdo do Modelo</label>
                             <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={10} className={inputClasses} />
                             {/* FIX: Escape curly braces in JSX text to prevent them from being parsed as JavaScript expressions. */}
                             <p className="text-xs text-slate-500 mt-1">{"Use placeholders como `{{CLIENTE_NOME}}` ou `{{CPF_CLIENTE}}` para dados dinâmicos."}</p>
                        </div>
                    </div>
                    <div className="flex justify-end p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg">
                        <button type="submit" className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors">{initialData ? 'Salvar Alterações' : 'Criar Modelo'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MODAL DE GERAÇÃO DE DOCUMENTO ---
const GenerateDocumentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    template: DocumentTemplate;
    clients: Client[];
    user: User | null;
}> = ({ isOpen, onClose, template, clients, user }) => {
    const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
    const [selectedClientId, setSelectedClientId] = useState('');

    const placeholders = useMemo(() => {
        const matches = template.content.match(/\{\{([A-Z_]+)\}\}/g) || [];
        return [...new Set(matches.map(p => p.slice(2, -2)))];
    }, [template.content]);

    useEffect(() => {
        const initialValues: Record<string, string> = {};
        const client = clients.find(c => c.id === selectedClientId);

        placeholders.forEach(p => {
            if (p === 'CLIENTE_NOME' && client) initialValues[p] = client.name;
            else if (p === 'CPF_CLIENTE' && client) initialValues[p] = '000.000.000-00'; // Mock
            else if (p === 'ADVOGADO_NOME' && user) initialValues[p] = user.name;
            else if (p === 'OAB_ADVOGADO' && user) initialValues[p] = 'UF 123.456'; // Mock
            else initialValues[p] = '';
        });
        setPlaceholderValues(initialValues);
    }, [selectedClientId, placeholders, clients, user]);

    const generatedContent = useMemo(() => {
        return placeholders.reduce((acc, placeholder) => {
            const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, 'g');
            return acc.replace(regex, placeholderValues[placeholder] || `{{${placeholder}}}`);
        }, template.content);
    }, [template.content, placeholders, placeholderValues]);
    
    if (!isOpen) return null;

    const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl animate-fade-in-scale flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b dark:border-slate-700 shrink-0">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Gerar Documento: {template.title}</h2>
                    <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><CloseIcon /></button>
                </div>
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto border-r dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Preencher Dados</h3>
                        <div>
                             <label className="block text-sm font-medium mb-1">Cliente (para preenchimento automático)</label>
                             <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className={inputClasses}>
                                 <option value="">Nenhum</option>
                                 {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                             </select>
                        </div>
                        {placeholders.map(p => (
                            <div key={p}>
                                <label className="block text-sm font-medium mb-1">{p.replace(/_/g, ' ').toLowerCase()}</label>
                                <input value={placeholderValues[p] || ''} onChange={e => setPlaceholderValues(v => ({...v, [p]: e.target.value}))} className={inputClasses} />
                            </div>
                        ))}
                    </div>
                    <div className="p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                         <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Pré-visualização</h3>
                         <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap p-4 border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800">
                            {generatedContent}
                         </div>
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg shrink-0 gap-3">
                    <button onClick={() => navigator.clipboard.writeText(generatedContent)} className="bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-700 transition-colors">Copiar Texto</button>
                    <button className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">Salvar como PDF</button>
                </div>
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL ---
interface DocumentosProps {
    templates: DocumentTemplate[];
    onAddTemplate: (template: Omit<DocumentTemplate, 'id'>) => void;
    onUpdateTemplate: (template: DocumentTemplate) => void;
    onDeleteTemplate: (templateId: string) => void;
    clients: Client[];
    cases: Case[];
    user: User | null;
}

const Documentos: React.FC<DocumentosProps> = ({ templates, onAddTemplate, onUpdateTemplate, onDeleteTemplate, clients, cases, user }) => {
    const [activeTab, setActiveTab] = useState<'modelos' | 'documentos'>('modelos');
    const [searchTerm, setSearchTerm] = useState('');
    const [modalState, setModalState] = useState<{ type: 'add' | 'edit' | 'generate', data?: DocumentTemplate } | null>(null);

    const filteredDocuments = useMemo(() => {
        if (!searchTerm) return mockDocuments;
        return mockDocuments.filter(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const handleEditTemplate = (template: DocumentTemplate) => setModalState({ type: 'edit', data: template });
    const handleDeleteTemplate = (templateId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este modelo?")) {
            onDeleteTemplate(templateId);
        }
    };
    
    const handleSubmitTemplateForm = (templateData: Omit<DocumentTemplate, 'id'> | DocumentTemplate) => {
        if ('id' in templateData) {
            onUpdateTemplate(templateData);
        } else {
            onAddTemplate(templateData);
        }
        setModalState(null);
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="p-6 md:p-8">
            {modalState && (modalState.type === 'add' || modalState.type === 'edit') && (
                <TemplateFormModal 
                    isOpen={true}
                    onClose={() => setModalState(null)}
                    onSubmit={handleSubmitTemplateForm}
                    initialData={modalState.data}
                />
            )}
            {modalState && modalState.type === 'generate' && modalState.data && (
                <GenerateDocumentModal 
                    isOpen={true}
                    onClose={() => setModalState(null)}
                    template={modalState.data}
                    clients={clients}
                    user={user}
                />
            )}

            <header className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Documentos</h1>
                    <p className="text-slate-600 dark:text-slate-300 mt-1">Gerencie seus arquivos e crie documentos a partir de modelos.</p>
                </div>
                {activeTab === 'modelos' && (
                    <button onClick={() => setModalState({ type: 'add' })} className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Novo Modelo
                    </button>
                )}
                 {activeTab === 'documentos' && (
                    <button className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Enviar Documento
                    </button>
                )}
            </header>
            
            <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('modelos')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'modelos' ? 'border-primary text-primary' : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-primary'}`}>Modelos</button>
                    <button onClick={() => setActiveTab('documentos')} className={`py-3 px-1 border-b-2 font-semibold text-sm ${activeTab === 'documentos' ? 'border-primary text-primary' : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-primary'}`}>Meus Documentos</button>
                </nav>
            </div>
            
            {activeTab === 'modelos' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(template => (
                        <div key={template.id} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex flex-col justify-between group transition-shadow hover:shadow-xl">
                            <div>
                                <div className="flex justify-between items-start">
                                    <DocumentIcon className="h-10 w-10 text-primary mb-4" />
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditTemplate(template)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary"><PencilIcon className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteTemplate(template.id)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-500"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{template.title}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{template.category}</p>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 h-[60px]">{template.content}</p>
                            </div>
                            <button onClick={() => setModalState({ type: 'generate', data: template })} className="mt-6 w-full flex items-center justify-center bg-primary/10 text-primary font-semibold px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
                                <FileSignatureIcon className="w-5 h-5 mr-2" />
                                Gerar Documento
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {activeTab === 'documentos' && (
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                    <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input type="search" placeholder="Buscar documentos..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg py-2 pl-10 pr-4 text-slate-900 dark:text-slate-100" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-left">Nome</th><th className="px-6 py-3 text-left">Caso</th>
                                    <th className="px-6 py-3 text-left">Data</th><th className="px-6 py-3 text-left">Tamanho</th>
                                    <th className="px-6 py-3"><span className="sr-only">Ações</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredDocuments.map(doc => (
                                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-100 flex items-center"><DocumentIcon className="w-5 h-5 mr-3 text-primary" />{doc.name}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{doc.caseId ? `Caso #${doc.caseId.replace('case', '')}` : 'N/A'}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{new Date(doc.uploadedDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{formatBytes(doc.size)}</td>
                                        <td className="px-6 py-4 text-right"><a href={doc.url} className="font-medium text-primary hover:underline">Baixar</a></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredDocuments.length === 0 && <div className="text-center py-10 text-slate-500">Nenhum documento encontrado.</div>}
                </div>
            )}
        </div>
    );
};

export default Documentos;