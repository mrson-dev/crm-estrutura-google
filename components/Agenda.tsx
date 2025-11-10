import React, { useState, useMemo } from 'react';
import { Case, Task, Deadline } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface AgendaProps {
    cases: Case[];
    tasks: Task[];
}

type CalendarEvent = {
    id: string;
    date: string;
    description: string;
    type: 'deadline' | 'task';
};

const Agenda: React.FC<AgendaProps> = ({ cases, tasks }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const events = useMemo<CalendarEvent[]>(() => {
        const deadlineEvents: CalendarEvent[] = cases.flatMap(c => 
            (c.deadlines || []).map((d: Deadline) => ({
                id: `d-${d.id}`,
                date: d.date,
                description: d.description,
                type: 'deadline'
            }))
        );
        const taskEvents: CalendarEvent[] = tasks.map(t => ({
            id: `t-${t.id}`,
            date: t.dueDate,
            description: t.description,
            type: 'task'
        }));
        return [...deadlineEvents, ...taskEvents];
    }, [cases, tasks]);
    
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday
    const totalDays = lastDayOfMonth.getDate();

    const calendarDays = [];
    // Dias vazios do mês anterior
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(<div key={`empty-start-${i}`} className="border-r border-b border-slate-200 dark:border-slate-700"></div>);
    }
    // Dias do mês atual
    for (let day = 1; day <= totalDays; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateString = date.toISOString().split('T')[0];
        const dayEvents = events.filter(e => e.date === dateString);
        const isToday = new Date().toISOString().split('T')[0] === dateString;

        calendarDays.push(
            <div key={day} className="border-r border-b border-slate-200 dark:border-slate-700 p-2 min-h-[120px] flex flex-col transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className={`font-semibold mb-2 flex items-center justify-center w-8 h-8 rounded-full ${isToday ? 'bg-primary text-white' : 'text-slate-800 dark:text-slate-100'}`}>
                    {day}
                </div>
                <div className="space-y-1 overflow-y-auto">
                    {dayEvents.map(event => (
                        <div key={event.id} className={`p-1.5 rounded-md text-xs cursor-pointer ${event.type === 'deadline' ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300' : 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300'}`}>
                            <p className="font-medium truncate">{event.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    // Dias vazios do próximo mês
    const remainingCells = (7 - (calendarDays.length % 7)) % 7;
    for (let i = 0; i < remainingCells; i++) {
        calendarDays.push(<div key={`empty-end-${i}`} className="border-r border-b border-slate-200 dark:border-slate-700"></div>);
    }
    
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <div className="p-6 md:p-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <ChevronLeftIcon />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
                    </h2>
                    <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <ChevronRightIcon />
                    </button>
                </div>
                <div className="grid grid-cols-7 border-t border-l border-slate-200 dark:border-slate-700">
                    {weekDays.map(day => (
                        <div key={day} className="p-3 text-center font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700">
                            {day}
                        </div>
                    ))}
                    {calendarDays}
                </div>
            </div>
        </div>
    );
};

export default Agenda;