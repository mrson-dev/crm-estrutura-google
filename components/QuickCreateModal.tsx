import React, { useState } from 'react';
import { Case, Client, Task, StatusCaso, CaseType } from '../types';
import { CloseIcon, SpinnerIcon } from './icons';

interface QuickCreateModalProps {
    modalType: 'case' | 'task' | null;
    onClose: () => void;
    onAddTask: (taskData: Omit<Task, 'id' | 'completed'>) => void;
    onAddCase: (caseData: Omit<Case, 'id' | 'caseNumber' | 'createdDate' | 'lastUpdated'>) => void;
    clients: Client[];
    cases: Case[];
}

// Reusable Form Components
const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-primary focus:border-primary transition-colors";
const selectClasses = `${inputClasses} appearance-none`;

const FormInput: React.FC<{ label: string; id: string; value: string; onChange: (val: string) => void; type?: string; required?: boolean; placeholder?: string; }> = ({ label, id, onChange, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <input id={id} onChange={(e) => onChange(e.target.value)} {...props} className={inputClasses} />
    </div>
);

const FormTextarea: React.FC<{ label: string; id: string; value: string; onChange: (val: string) => void; placeholder?: string; }> = ({ label, id, onChange, ...props }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <textarea id={id} rows={4} onChange={(e) => onChange(e.target.value)} {...props} className={inputClasses} />
    </div>
);

const FormSelect: React.FC<{ label: string; id: string; value: any; onChange: (val: any) => void; options: (string | {label: string, value: string})[]; required?: boolean; placeholder?: string; }> = ({ label, id, value, onChange, options, required, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        <select id={id} value={value} onChange={e => onChange(e.target.value)} required={required} className={selectClasses}>
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(opt => (
                typeof opt === 'string' ? 
                <option key={opt} value={opt}>{opt}</option> :
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);

const SubmitButton: React.FC<{ isSubmitting: boolean, text: string }> = ({ isSubmitting, text }) => (
    <div className="flex justify-end pt-4">
        <button type="submit" disabled={isSubmitting} className="flex items-center justify-center bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600">
            {isSubmitting ? <SpinnerIcon className="w-5 h-5" /> : text}
        </button>
    </div>
);


// Form components
const NewTaskForm: React.FC<{ onSubmit: (e: React.FormEvent, cb: () => void) => void; onAddTask: (data: any) => void; isSubmitting: boolean; cases: Case[]; }> = ({ onSubmit, onAddTask, isSubmitting, cases }) => {
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Média');
    const [caseId, setCaseId] = useState<string | undefined>(undefined);

    const handleSubmit = () => {
        onAddTask({ description, dueDate, priority, caseId });
    };

    return (
        <form onSubmit={(e) => onSubmit(e, handleSubmit)} className="space-y-4">
            <FormInput label="Descrição" id="description" value={description} onChange={setDescription} required />
            <FormInput label="Data de Vencimento" id="dueDate" type="date" value={dueDate} onChange={setDueDate} required />
            <FormSelect label="Prioridade" id="priority" value={priority} onChange={setPriority} options={['Baixa', 'Média', 'Alta']} />
            <FormSelect label="Vincular ao Caso (Opcional)" id="caseId" value={caseId} onChange={setCaseId} options={cases.map(c => ({ label: `${c.caseNumber} - ${c.title}`, value: c.id }))} placeholder="Selecione um caso" />
            <SubmitButton isSubmitting={isSubmitting} text="Adicionar Tarefa" />
        </form>
    );
};

const NewCaseForm: React.FC<{ onSubmit: (e: React.FormEvent, cb: () => void) => void; onAddCase: (data: any) => void; isSubmitting: boolean; clients: Client[]; }> = ({ onSubmit, onAddCase, isSubmitting, clients }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [clientId, setClientId] = useState('');
    const [status, setStatus] = useState(StatusCaso.ANALISE_INICIAL);
    const [caseType, setCaseType] = useState<CaseType>(CaseType.ADMINISTRATIVE);
    
    const handleSubmit = () => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            onAddCase({ title, description, client, status, type: caseType, assignedLawyer: 'Jessica Pearson' });
        } else {
            alert('Por favor, selecione um cliente válido.');
        }
    };

    return (
        <form onSubmit={(e) => onSubmit(e, handleSubmit)} className="space-y-4">
            <FormInput label="Título do Caso" id="title" value={title} onChange={setTitle} required />
            <FormSelect label="Cliente" id="clientId" value={clientId} onChange={setClientId} options={clients.map(c => ({ label: c.name, value: c.id }))} required placeholder="Selecione um cliente" />
            <FormSelect label="Tipo de Processo" id="caseType" value={caseType} onChange={setCaseType} options={Object.values(CaseType)} />
            <FormTextarea label="Descrição" id="description" value={description} onChange={setDescription} />
            <FormSelect label="Status Inicial" id="status" value={status} onChange={setStatus} options={Object.values(StatusCaso)} />
            <SubmitButton isSubmitting={isSubmitting} text="Adicionar Caso" />
        </form>
    );
};

const QuickCreateModal: React.FC<QuickCreateModalProps> = ({ 
    modalType, onClose, onAddTask, onAddCase, clients, cases 
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Common close handler
    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    // Generic form submission handler
    const handleSubmit = (e: React.FormEvent, submitAction: () => void) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            submitAction();
            setIsSubmitting(false);
            onClose();
        }, 500);
    };

    const renderForm = () => {
        switch(modalType) {
            case 'task':
                return <NewTaskForm onSubmit={handleSubmit} onAddTask={onAddTask} isSubmitting={isSubmitting} cases={cases} />;
            case 'case':
                return <NewCaseForm onSubmit={handleSubmit} onAddCase={onAddCase} isSubmitting={isSubmitting} clients={clients} />;
            default:
                return null;
        }
    };

    const getTitle = () => {
        switch(modalType) {
            case 'task': return 'Adicionar Nova Tarefa';
            case 'case': return 'Adicionar Novo Caso';
            default: return '';
        }
    };

    if (!modalType) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out px-4" onClick={handleClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg transform animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{getTitle()}</h2>
                    <button onClick={handleClose} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};

export default QuickCreateModal;
