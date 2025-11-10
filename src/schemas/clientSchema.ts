import { z } from 'zod';

const representativeSchema = z.object({
    name: z.string().min(1, 'Nome do representante é obrigatório'),
    cpf: z.string().min(1, 'CPF do representante é obrigatório'),
    // Adicione outras validações para o representante se necessário
}).optional();

export const clientSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório e deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  dateOfBirth: z.string().optional(),
  
  // Campos de endereço
  cep: z.string().min(8, 'CEP inválido'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'UF é obrigatório'),
  complement: z.string().optional(),

  // Outros campos opcionais
  rg: z.string().optional(),
  rgIssuer: z.string().optional(),
  rgIssuerUF: z.string().optional(),
  dataEmissao: z.string().optional(),
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  nacionalidade: z.string().optional(),
  naturalidade: z.string().optional(),
  estadoCivil: z.string().optional(),
  profissao: z.string().optional(),
  tags: z.array(z.string()).optional(),

  legalRepresentative: representativeSchema,
});

export type ClientSchema = z.infer<typeof clientSchema>;
