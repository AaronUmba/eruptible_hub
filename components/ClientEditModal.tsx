
import React, { useState, useEffect } from 'react';
import { ClientCompany } from '../types';
import { X, Info } from 'lucide-react';

interface ClientEditModalProps {
  client: ClientCompany;
  onClose: () => void;
  onSave: (client: ClientCompany) => void;
}

const colorOptions: { name: NonNullable<ClientCompany['colorScheme']>, bgClass: string }[] = [
    { name: 'slate', bgClass: 'bg-slate-500' },
    { name: 'blue', bgClass: 'bg-blue-500' },
    { name: 'green', bgClass: 'bg-green-500' },
    { name: 'purple', bgClass: 'bg-purple-500' },
    { name: 'orange', bgClass: 'bg-orange-500' },
];

type FormData = {
    "Dashboard Title": string,
    "Color Scheme": NonNullable<ClientCompany['colorScheme']>,
}

const ClientEditModal: React.FC<ClientEditModalProps> = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    "Dashboard Title": client.dashboardTitle || '',
    "Color Scheme": client.colorScheme || 'slate',
  });

  useEffect(() => {
    setFormData({
        "Dashboard Title": client.dashboardTitle || '',
        "Color Scheme": client.colorScheme || 'slate',
    });
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: NonNullable<ClientCompany['colorScheme']>) => {
    setFormData(prev => ({ ...prev, "Color Scheme": color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedClient = {
        ...client,
        dashboardTitle: formData["Dashboard Title"],
        colorScheme: formData["Color Scheme"],
    };
    onSave(updatedClient);
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-surface border border-subtle rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-subtle">
          <div>
            <h2 id="modal-title" className="text-xl font-bold text-text-primary">Edit Client Dashboard</h2>
            <p className="text-text-secondary">{client.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-text-secondary hover:bg-secondary hover:text-text-primary transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
            <main className="p-6 overflow-y-auto space-y-6">
                <div>
                    <label htmlFor="Dashboard Title" className="block text-text-primary text-sm font-bold mb-2">Dashboard Title</label>
                    <input
                        id="Dashboard Title"
                        name="Dashboard Title"
                        type="text"
                        value={formData["Dashboard Title"] || ''}
                        onChange={handleChange}
                        className="w-full bg-secondary border border-subtle rounded-md py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                        placeholder="e.g., Client Project Portal"
                    />
                </div>
                 <div>
                    <label className="block text-text-primary text-sm font-bold mb-2">Color Scheme</label>
                    <div className="flex items-center space-x-3">
                        {colorOptions.map(opt => (
                            <button
                                key={opt.name}
                                type="button"
                                onClick={() => handleColorChange(opt.name)}
                                className={`w-8 h-8 rounded-full ${opt.bgClass} transition-transform duration-200 ${formData["Color Scheme"] === opt.name ? 'ring-2 ring-offset-2 ring-offset-surface ring-white' : 'hover:scale-110'}`}
                                aria-label={`Set color scheme to ${opt.name}`}
                            ></button>
                        ))}
                    </div>
                </div>
                <div className="border-t border-subtle my-2"></div>
                 <div>
                    <label htmlFor="clientUsername" className="block text-text-primary text-sm font-bold mb-2">Client Username</label>
                    <input
                        id="clientUsername"
                        name="clientUsername"
                        type="text"
                        value={client.clientUsername || ''}
                        readOnly
                        className="w-full bg-subtle/50 border border-subtle rounded-md py-2 px-3 text-text-secondary leading-tight focus:outline-none cursor-not-allowed"
                    />
                     <div className="flex items-center text-xs text-text-secondary mt-2 p-2 bg-secondary rounded-md">
                        <Info size={16} className="mr-2 flex-shrink-0" />
                        <span>Client usernames are for login purposes and are managed separately from Airtable data.</span>
                    </div>
                </div>
            </main>
            <footer className="p-4 bg-secondary/50 border-t border-subtle flex justify-end items-center space-x-3">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-secondary hover:bg-subtle text-text-primary font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-brand hover:bg-brand/90 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200"
                >
                    Save Changes
                </button>
            </footer>
        </form>
      </div>
    </div>
  );
};

export default ClientEditModal;
