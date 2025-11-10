import Documentos from '../components/Documentos';
import React from 'react';
import { DocumentTemplate, Client, Case, User } from '../types';

const DocumentosPage = () => {
  // Mock data and handlers
  const [templates, setTemplates] = React.useState<DocumentTemplate[]>([]);
  const user: User | null = {id: '1', name: 'Advogado', email: 'a@b.com', avatarUrl: ''};

  return (
    <Documentos
      templates={templates}
      onAddTemplate={(t) => setTemplates(p => [...p, {...t, id: `dt${p.length+1}`}])}
      onUpdateTemplate={(ut) => setTemplates(p => p.map(t => t.id === ut.id ? ut : t))}
      onDeleteTemplate={(id) => setTemplates(p => p.filter(t => t.id !== id))}
      clients={[]}
      cases={[]}
      user={user}
    />
  );
};
export default DocumentosPage;
