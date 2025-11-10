export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export enum StatusCaso {
  ANALISE_INICIAL = 'Análise Inicial',
  AGUARDANDO_DOCUMENTOS = 'Aguardando Documentos',
  PROTOCOLADO_INSS = 'Protocolado no INSS',
  EM_EXIGENCIA = 'Em Exigência',
  RECURSO_ADMINISTRATIVO = 'Recurso Administrativo',
  CONCEDIDO = 'Concedido',
  INDEFERIDO = 'Indeferido',
}

export enum CaseType {
  ADMINISTRATIVE = 'Administrativo',
  JUDICIAL = 'Judicial',
}

export interface Deadline {
  id: string;
  date: string;
  description: string;
  priority: 'Alta' | 'Média' | 'Baixa';
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: StatusCaso;
  type: CaseType;
  client: Client;
  assignedLawyer: string;
  createdDate: string;
  lastUpdated: string;
  deadlines?: Deadline[];
}

export interface RepresentativeData {
  name: string;
  motherName: string;
  fatherName: string;
  cpf: string;
  rg: string;
  rgIssuer: string;
  rgIssuerUF: string;
  dataEmissao: string;
  dateOfBirth: string;
  nacionalidade: string;
  naturalidade: string;
  estadoCivil: string;
  profissao: string;
}

export interface Client {
  id: string;
  createdAt: string;
  name: string;
  cpf: string;
  rg: string;
  rgIssuer: string;
  rgIssuerUF: string;
  dataEmissao: string;
  motherName: string;
  fatherName: string;
  dateOfBirth: string;
  nacionalidade: string;
  naturalidade: string;
  estadoCivil: string;
  profissao: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  legalRepresentative?: RepresentativeData;
  tags?: string[];
}


export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedDate: string;
  size: number; // in bytes
  caseId?: string; // Opcional, para vincular a um caso
}

export interface DocumentTemplate {
  id: string;
  title: string;
  content: string;
  category: 'Petição' | 'Contrato' | 'Procuração' | 'Outro';
}

export enum View {
  DASHBOARD,
  CASES,
  PROCESSES,
  AGENDA,
  IA,
  DOCUMENTS,
  FINANCIAL,
  CLIENTS,
  SETTINGS,
}

export interface Task {
  id: string;
  description: string;
  dueDate: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  completed: boolean;
  caseId?: string; // Opcional, para vincular a um caso
  clientId?: string; // Opcional, para vincular a um cliente
}

export enum ActivityType {
  STATUS_CHANGE = 'Status alterado',
  NEW_DOCUMENT = 'Novo documento',
  DEADLINE_ADDED = 'Prazo adicionado',
  CASE_CREATED = 'Caso criado',
  REQUIREMENT_PENDING = 'Exigência pendente',
  BENEFIT_GRANTED = 'Benefício concedido',
}

export interface Activity {
  id: string;
  type: ActivityType;
  caseNumber: string;
  caseId: string;
  timestamp: string;
  user: string;
}

export interface Processo {
  id: string;
  title: string;
  caseNumber: string;
  stage: 'A Fazer' | 'Em Andamento' | 'Concluído';
  responsible: string;
  dueDate: string;
}