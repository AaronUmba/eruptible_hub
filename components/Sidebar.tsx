

import React, { ReactNode } from 'react';
import { Folder, Settings, Users, Terminal, LogOut, Sun, Moon, FileText } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

type View = 'projects' | 'settings' | 'clients' | 'logs' | 'documentation';

interface SidebarProps {
  activeView?: View;
  onNavigate?: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavItem: React.FC<{
    icon: ReactNode;
    label: string;
    isActive: boolean;
    onClick?: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const baseClasses = "w-full flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-brand/10 text-brand";
    const inactiveClasses = "text-text-secondary hover:bg-secondary hover:text-text-primary";
    const disabledClasses = "cursor-default";

    return (
        <button
            onClick={onClick}
            disabled={!onClick}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${!onClick ? disabledClasses : ''}`}
        >
            <div className="w-5 h-5">{icon}</div>
            <span className="ml-3">{label}</span>
        </button>
    );
};

const ThemeToggle: React.FC = () => {
    const { state, toggleTheme } = useAppContext();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle theme"
        >
            {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, isOpen, onClose }) => {
  const { state, logout } = useAppContext();
  const { user } = state;

  if (!user) return null;
  
  const handleNavigate = (view: View) => {
    if (onNavigate) {
      onNavigate(view);
    }
    onClose(); // Close sidebar on mobile after clicking an item
  };
  
  const handleLogout = () => {
    logout();
    onClose();
  };

  const sidebarContent = (
      <div className="flex-1 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-subtle flex-shrink-0">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">Eruptible Dashboard</h1>
        </div>
        
        <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
            <NavItem
                icon={<Folder size={18} />}
                label="Projects"
                isActive={activeView === 'projects'}
                onClick={onNavigate ? () => handleNavigate('projects') : undefined}
            />
             {user.role === 'admin' && (
                <NavItem
                    icon={<Users size={18} />}
                    label="Clients"
                    isActive={activeView === 'clients'}
                    onClick={onNavigate ? () => handleNavigate('clients') : undefined}
                />
            )}
            {user.role === 'admin' && (
                <>
                  <NavItem
                      icon={<FileText size={18} />}
                      label="Documentation"
                      isActive={activeView === 'documentation'}
                      onClick={onNavigate ? () => handleNavigate('documentation') : undefined}
                  />
                  <NavItem
                      icon={<Settings size={18} />}
                      label="Settings"
                      isActive={activeView === 'settings'}
                      onClick={onNavigate ? () => handleNavigate('settings') : undefined}
                  />
                  <NavItem
                      icon={<Terminal size={18} />}
                      label="Developer Log"
                      isActive={activeView === 'logs'}
                      onClick={onNavigate ? () => handleNavigate('logs') : undefined}
                  />
                </>
            )}
        </div>

        <div className="px-4 py-4 border-t border-subtle flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center overflow-hidden">
                    <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center font-bold text-white flex-shrink-0">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="font-semibold text-sm text-text-primary capitalize truncate">{user.username}</p>
                        <p className="text-xs text-text-secondary capitalize">{user.role} Account</p>
                    </div>
                </div>
                 <ThemeToggle />
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center bg-secondary hover:bg-subtle text-text-primary font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200"
            >
                <LogOut size={16} className="mr-2" />
                Logout
            </button>
        </div>
      </div>
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden" 
            onClick={onClose} 
            aria-hidden="true" 
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          flex flex-col bg-surface border-r border-subtle
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;