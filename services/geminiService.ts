
import { GoogleGenAI, Type } from "@google/genai";

// Assume que a API_KEY está configurada no ambiente.
// A inicialização agora lida com a chave de API diretamente.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const personSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'Nome completo.' },
        motherName: { type: Type.STRING, description: 'Nome da mãe.' },
        fatherName: { type: Type.STRING, description: 'Nome do pai.' },
        cpf: { type: Type.STRING, description: 'CPF no formato XXX.XXX.XXX-XX.' },
        rg: { type: Type.STRING, description: 'Número do RG.' },
        rgIssuer: { type: Type.STRING, description: 'Órgão emissor do RG.' },
        rgIssuerUF: { type: Type.STRING, description: 'UF do órgão emissor do RG.' },
        dataEmissao: { type: Type.STRING, description: 'Data de emissão do RG no formato AAAA-MM-DD.' },
        dateOfBirth: { type: Type.STRING, description: 'Data de nascimento no formato AAAA-MM-DD.' },
        nacionalidade: { type: Type.STRING, description: 'Nacionalidade.' },
        naturalidade: { type: Type.STRING, description: 'Naturalidade (cidade de nascimento).' },
        estadoCivil: { type: Type.STRING, description: 'Estado civil.' },
        profissao: { type: Type.STRING, description: 'Profissão.' },
    },
};

const extractClientInfo = async (prompt: string | any[]): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: {
                parts: Array.isArray(prompt) ? prompt : [{ text: prompt }]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: personSchema,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erro ao extrair informações com Gemini:", error);
        throw new Error("Não foi possível analisar o documento. Verifique a qualidade da imagem ou o conteúdo do texto.");
    }
};

export const extractClientInfoFromImage = async (base64Image: string, mimeType: string): Promise<string> => {
    const prompt = [
        { text: 'Extraia as informações pessoais desta imagem de documento de identidade. Retorne apenas o objeto JSON.' },
        { inlineData: { mimeType, data: base64Image } },
    ];
    return extractClientInfo(prompt);
};

export const extractClientInfoFromDocument = async (documentText: string): Promise<string> => {
    const prompt = `Extraia as informações pessoais do seguinte texto de documento. Retorne apenas o objeto JSON. Texto: "${documentText}"`;
    return extractClientInfo(prompt);
};


export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Resuma a seguinte descrição de caso jurídico em três pontos principais. Seja conciso e profissional. Descrição do Caso: "${text}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao resumir o texto com a API Gemini:", error);
    throw new Error("Falha ao gerar o resumo. Por favor, tente novamente.");
  }
};

export const suggestNextSteps = async (caseDescription: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Com base na seguinte descrição de caso jurídico, sugira de 3 a 5 próximos passos acionáveis que um advogado deveria considerar. Formate a resposta como uma lista de tópicos com marcadores. Seja prático e direto. Descrição do Caso: "${caseDescription}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Erro ao sugerir próximos passos com a API Gemini:", error);
        throw new Error("Falha ao gerar sugestões. Por favor, tente novamente.");
    }
};

export const askLegalQuestion = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Usando um modelo mais robusto para questões jurídicas
      contents: `Você é um assistente jurídico especialista. Responda à seguinte pergunta de forma clara, estruturada e informativa, como se estivesse auxiliando um advogado. Se a resposta incluir listas, use marcadores. Pergunta: "${prompt}"`,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao consultar a API Gemini:", error);
    throw new Error("Falha ao obter resposta. Por favor, tente novamente.");
  }
};
