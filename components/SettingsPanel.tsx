
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Settings as SettingsIcon } from 'lucide-react';
import IntegrationStatus from './IntegrationStatus';
import AdminSecuritySettings from './AdminSecuritySettings';

interface SettingsPanelProps {
  username: string;
  role: 'admin' | 'client';
}

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-text-primary">{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand ${enabled ? 'bg-brand' : 'bg-subtle'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ username, role }) => {
  const { state, toggleTheme } = useAppContext();

  return (
    <div className="max-w-4xl mx-auto">
      
      <IntegrationStatus />

      <div className="mt-8" />

      {role === 'admin' && <AdminSecuritySettings />}

      {/* Profile Section */}
      <div className="bg-surface border border-subtle rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-text-primary mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-text-secondary">Username</label>
            <p className="text-text-primary capitalize mt-1">{username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-text-secondary">Role</label>
            <p className="text-text-primary capitalize mt-1">{role}</p>
          </div>
        </div>
      </div>
      
      {/* Appearance Section */}
      <div className="bg-surface border border-subtle rounded-lg p-6 mb-8">
        <div className="flex items-center mb-1">
           <SettingsIcon className="w-5 h-5 mr-3 text-brand" />
           <h2 className="text-xl font-bold text-text-primary">Appearance</h2>
        </div>
        <p className="text-text-secondary mb-4 text-sm">Customize the look and feel of the application.</p>
        <div className="divide-y divide-subtle">
            <ToggleSwitch label="Dark Mode" enabled={state.theme === 'dark'} onToggle={toggleTheme} />
        </div>
      </div>
      
    </div>
  );
};

export default SettingsPanel;
