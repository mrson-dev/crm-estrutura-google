import React, { useState, useRef, useEffect } from 'react';
import { AiSparkleIcon, SpinnerIcon } from './icons';
import { askLegalQuestion } from '../services/geminiService';

interface Message {
    sender: 'user' | 'ia';
    text: string;
}

const IA: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const iaResponse = await askLegalQuestion(input);
            const iaMessage: Message = { sender: 'ia', text: iaResponse };
            setMessages(prev => [...prev, iaMessage]);
        } catch (error) {
            const errorMessage: Message = {
                sender: 'ia',
                text: 'Desculpe, não consegui processar sua pergunta. Por favor, tente novamente.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-primary focus:border-primary transition-colors";

    return (
        <div className="p-6 md:p-8 h-full flex flex-col">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center">
                    <AiSparkleIcon className="w-8 h-8 mr-3 text-primary" />
                    Assistente Jurídico com IA
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-1">Faça sua pergunta sobre legislação, jurisprudência ou doutrina.</p>
            </div>

            <div className="flex-grow bg-white dark:bg-slate-900 rounded-lg shadow-md flex flex-col overflow-hidden">
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-500 dark:text-slate-400 h-full flex items-center justify-center">
                            <p>Comece fazendo uma pergunta, por exemplo: <br/><em>"Quais são os requisitos para a aposentadoria por idade urbana em 2023?"</em></p>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'ia' && <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0"><AiSparkleIcon/></div>}
                            <div className={`max-w-xl p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-primary/10 text-slate-800 dark:text-slate-100' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'}`}>
                                <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*/g, '•').replace(/\n/g, '<br />') }}></div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0"><AiSparkleIcon/></div>
                            <div className="max-w-xl p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center">
                                <SpinnerIcon className="w-5 h-5 mr-3" />
                                <span>Analisando...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSendMessage} className="flex gap-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite sua pergunta aqui..."
                            className={inputClasses}
                            disabled={isLoading}
                        />
                        <button type="submit" className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600" disabled={isLoading}>
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default IA;