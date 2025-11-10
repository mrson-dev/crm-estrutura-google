import React from 'react';
import Dashboard from '../components/Dashboard';
import { User, Case, Task, Activity } from '../types';

// Mock data, this would be fetched via TanStack Query hooks in a real scenario
const initialUser: User = { id: 'user1', name: 'Jessica Pearson', email: 'advogado@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=jessica' };
const initialCases: Case[] = []; // Em uma app real, viria de useCases()
const initialTasks: Task[] = []; // Em uma app real, viria de useTasks()
const initialActivity: Activity[] = []; // Em uma app real, viria de useActivity()

const DashboardPage = () => {
    return (
        <Dashboard 
            user={initialUser} 
            cases={initialCases} 
            tasks={initialTasks} 
            activityLog={initialActivity} 
            onNavigate={() => {}} 
            onQuickCreate={() => {}} 
            onToggleTask={() => {}} 
        />
    );
};

export default DashboardPage;
