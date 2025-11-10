import React from 'react';
import { CurrencyDollarIcon, PlusIcon } from './icons';

const StatCard: React.FC<{ title: string; value: string; description: string; }> = ({ title, value, description }) => (
    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{value}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
);

const BarChart = () => {
    const data = [
        { month: 'Ago', revenue: 4500 },
        { month: 'Set', revenue: 8000 },
        { month: 'Out', revenue: 6200 },
        { month: 'Nov', revenue: 11500 },
        { month: 'Dez', revenue: 9800 },
    ];
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

    return (
        <div className="h-64 flex items-end justify-between space-x-4">
            {data.map(item => (
                <div key={item.month} className="flex-1 flex flex-col items-center">
                    <div 
                        className="w-full bg-primary rounded-t-md hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors"
                        style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    ></div>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2">{item.month}</span>
                </div>
            ))}
        </div>
    );
};

const mockTransactions = [
    { id: 1, type: 'Receita', description: 'Honorários - Caso BPC-2023-005', amount: 3500, date: '2023-11-28', status: 'Confirmado' },
    { id: 2, type: 'Despesa', description: 'Custas processuais', amount: -250.75, date: '2023-11-25', status: 'Confirmado' },
    { id: 3, type: 'Receita', description: 'Consulta Inicial - Novo Cliente', amount: 400, date: '2023-11-22', status: 'Confirmado' },
    { id: 4, type: 'Despesa', description: 'Serviços de Contabilidade', amount: -500, date: '2023-11-20', status: 'Confirmado' },
];

const Financeiro: React.FC = () => {
    const formatCurrencyBRL = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };
    
    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Painel Financeiro</h1>
                <button className="flex items-center bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 dark:hover:bg-sky-500 transition-colors">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nova Transação
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Faturamento (Mês)" value={formatCurrencyBRL(11530.50)} description="+15% vs. Mês Anterior" />
                <StatCard title="Despesas (Mês)" value={formatCurrencyBRL(3450.00)} description="-5% vs. Mês Anterior" />
                <StatCard title="Saldo a Receber" value={formatCurrencyBRL(25800.00)} description="de 5 casos em andamento" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Faturamento Mensal</h3>
                    <BarChart />
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Extrato Recente</h3>
                    <ul className="space-y-3">
                        {mockTransactions.map(t => (
                            <li key={t.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{t.description}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                                </div>
                                <p className={`font-semibold ${t.amount > 0 ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Financeiro;