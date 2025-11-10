import React from 'react';
import CaseList from '../components/CaseList';
import { Case } from '../types';

// Mock data, this would be fetched via TanStack Query hooks
const initialCases: Case[] = []; // Em uma app real, viria de useCases()

const CaseListPage = () => {
    // This state would be managed by URL params with React Router
    const [selectedCaseId, setSelectedCaseId] = React.useState<string | null>(null);

    return (
        <CaseList 
            cases={initialCases}
            selectedCaseId={selectedCaseId}
            onSelectCase={setSelectedCaseId}
            onQuickCreate={() => {}}
        />
    );
};

export default CaseListPage;
