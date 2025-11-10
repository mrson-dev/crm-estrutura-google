import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientDetail from '../components/ClientDetail';
import { SpinnerIcon } from '../components/icons';
// import { useClient } from '../hooks/useClient'; // Exemplo de hook para um cliente específico

const ClientDetailPage = () => {
    const { clientId } = useParams<{ clientId: string }>();
    const navigate = useNavigate();

    // Em uma aplicação real, você usaria um hook para buscar os dados do cliente específico
    // const { data: client, isLoading, isError } = useClient(clientId);
    // const { data: cases } = useCasesByClient(clientId);
    // const { data: tasks } = useTasksByClient(clientId);

    // Mock data for now
    const client = { id: 'client1', name: 'João da Silva (Detalhe)', email: 'joao.silva@example.com', phone: '1112223333', cpf: '123.456.789-00', rg: '12.345.678-9', dateOfBirth: '1960-01-01', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'São Paulo', state: 'SP', cep: '01000-000', tags: ['Aposentadoria'] };
    const cases: any[] = [];
    const tasks: any[] = [];
    const isLoading = false;
    const isError = false;

    if (isLoading) return <div className="flex justify-center items-center h-full"><SpinnerIcon className="w-10 h-10" /></div>;
    if (isError || !client) return <div className="p-8 text-center text-red-500">Cliente não encontrado.</div>;

    return (
        <ClientDetail 
            client={client as any}
            cases={cases}
            tasks={tasks}
            onBack={() => navigate('/clientes')}
            onEdit={() => { /* Open edit modal */ }}
            onNavigateToCase={(caseId) => navigate(`/casos/${caseId}`)}
        />
    );
};

export default ClientDetailPage;
