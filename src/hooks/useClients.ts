import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { Client } from '../types';

// Função para buscar os clientes na API
const fetchClients = async (): Promise<Client[]> => {
  // A rota '/clients' seria um endpoint na sua API do Cloud Run
  // Por enquanto, vamos simular um retorno com um pequeno delay.
  // const { data } = await apiClient.get('/clients');
  // return data;

  console.log("Fetching clients (simulated)...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Dados de exemplo para desenvolvimento
  const initialClientTemplate = { cpf: '', rg: '', rgIssuer: '', rgIssuerUF: '', dataEmissao: '', motherName: '', fatherName: '', dateOfBirth: '', nacionalidade: '', naturalidade: '', estadoCivil: '', profissao: '', email: '', phone: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' };
  return [
    { id: 'client1', createdAt: new Date().toISOString(), name: 'João da Silva (API)', ...initialClientTemplate, email: 'joao.silva@example.com', phone: '111-222-3333', tags: ['Aposentadoria', 'VIP'] },
    { id: 'client2', createdAt: new Date().toISOString(), name: 'Maria Oliveira (API)', ...initialClientTemplate, email: 'maria.oliveira@example.com', phone: '444-555-6666', tags: ['BPC/LOAS'] },
    { id: 'client3', createdAt: new Date().toISOString(), name: 'Carlos Pereira (API)', ...initialClientTemplate, email: 'carlos.pereira@example.com', phone: '777-888-9999', tags: ['Auxílio-Doença'] },
  ];
};

export const useClients = () => {
  return useQuery<Client[], Error>({
    queryKey: ['clients'], // Chave de cache para o TanStack Query
    queryFn: fetchClients,
  });
};
