
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAppContext } from '../contexts/AppContext';
import { Menu } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const { state } = useAppContext();
  const { user } = state;
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="flex bg-background text-text-primary font-sans min-h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeView="projects" 
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
                <h1 className="text-2xl sm:text-2xl font-bold text-text-primary tracking-tight">Client Dashboard</h1>
                <p className="text-text-secondary text-sm mt-1">Welcome, <span className="capitalize">{user.username}</span>!</p>
              </div>
           </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto flex flex-col items-center justify-center text-center">
          <div className="bg-surface p-8 rounded-lg border border-subtle">
            <h2 className="text-2xl font-bold text-text-primary mb-4">Under Construction</h2>
            <p className="text-text-secondary max-w-md">
              This area is being developed. Soon you will be able to see your project's progress and deliverables right here.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
