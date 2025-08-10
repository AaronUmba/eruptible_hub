

import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';
import ProjectDetailsPage from './ProjectDetailsPage';
import Sidebar from './Sidebar';
import SettingsPanel from './SettingsPanel';
import ClientManagementPanel from './ClientManagementPanel';
import LogConsolePanel from './LogConsolePanel';
import { useAppContext } from '../contexts/AppContext';
import { Loader2, Menu, ServerCrash } from 'lucide-react';
import DocumentationPanel from './DocumentationPanel';
import { ExternalLink } from 'lucide-react';

type View = 'projects' | 'settings' | 'clients' | 'logs' | 'documentation';

const AdminDashboard: React.FC = () => {
  const { state } = useAppContext();
  const { projects, user, loading, error } = state;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeView, setActiveView] = useState<View>('projects');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [airtableUrl, setAirtableUrl] = useState<string | null>(null);
  
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };
  
  const handleNavigate = (view: View) => {
    setActiveView(view);
    setSelectedProject(null);
    setSidebarOpen(false);
  }

  useEffect(() => {
    async function loadAirtableInfo() {
      try {
        const res = await fetch('/api/airtable/info');
        const data = await res.json();
        setAirtableUrl(data?.url ?? null);
      } catch {}
    }
    loadAirtableInfo();
  }, []);

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-12 h-12 text-brand animate-spin" />
        </div>
      );
    }

    if (error) {
       return (
        <div className="flex flex-col items-center justify-center h-full bg-surface p-8 rounded-lg border border-destructive/20 text-center">
          <ServerCrash className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-xl font-bold text-destructive">Connection Error</h3>
          <p className="text-text-secondary mt-2 max-w-md">Could not fetch data from the backend server. Please ensure it's running and accessible.</p>
          <p className="text-text-secondary/80 mt-2 text-sm max-w-md">{error}</p>
        </div>
      );
    }

    if (selectedProject) {
        return <ProjectDetailsPage project={selectedProject} onBack={handleBackToProjects} />;
    }
    
    // This check should happen after loading and error checks
    if (activeView === 'projects' && projects.length === 0) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h3 className="text-xl font-bold text-text-primary">No Projects Found</h3>
            <p className="text-text-secondary mt-2">The backend did not return any projects.</p>
            <p className="text-text-secondary mt-1 text-sm">Please check your Airtable base to ensure it contains project data.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project.recordId}
            project={project}
            onSelect={handleSelectProject}
          />
        ))}
      </div>
    );
  };
  
  const getHeaderTitle = () => {
    if (activeView === 'clients') return 'Client Management';
    if (activeView === 'logs') return 'Developer Log';
    if (activeView === 'documentation') return 'Documentation';
    if (selectedProject) return selectedProject.name;
    if (activeView === 'settings') return 'Settings';
    return 'Admin Dashboard';
  };

  const getHeaderSubtitle = () => {
    if (activeView === 'clients') return 'Manage client dashboards and credentials';
    if (activeView === 'logs') return 'View application events and errors';
    if (activeView === 'documentation') return 'Platform guides, tutorials, and technical info';
    if (selectedProject) return 'Project Deliverables Overview';
    if (activeView === 'settings') return 'Configure application and data sources';
    return 'All Projects Overview';
  };


  if (!user) return null;

  return (
    <div className="flex bg-background text-text-primary font-sans min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={handleNavigate}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 border-b border-subtle">
            <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-1 mr-3 text-text-secondary hover:text-text-primary"
                  aria-label="Open sidebar"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-2xl sm:text-2xl font-bold text-text-primary tracking-tight truncate" title={getHeaderTitle()}>
                    {getHeaderTitle()}
                  </h1>
                  <p className="text-text-secondary text-sm mt-1">
                    {getHeaderSubtitle()}
                  </p>
                </div>
                {airtableUrl && (
                  <a
                    href={airtableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center bg-secondary hover:bg-subtle text-text-primary font-medium px-3 py-2 rounded-md border border-subtle"
                    title="Open Airtable"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Airtable
                  </a>
                )}
            </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeView === 'projects' && renderDashboardContent()}
          {activeView === 'settings' && <SettingsPanel username={user.username} role={user.role} />}
          {activeView === 'clients' && <ClientManagementPanel />}
          {activeView === 'logs' && <LogConsolePanel />}
          {activeView === 'documentation' && <DocumentationPanel />}
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
