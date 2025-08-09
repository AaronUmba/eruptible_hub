
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ClientCompany } from '../types';
import ClientEditModal from './ClientEditModal';

const colorSchemeStyles: Record<NonNullable<ClientCompany['colorScheme']>, string> = {
    slate: 'bg-slate-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
};

const ClientManagementPanel: React.FC = () => {
    const { state, updateClient } = useAppContext();
    const { clientCompanies } = state;
    const [editingClient, setEditingClient] = useState<ClientCompany | null>(null);

    const handleSave = async (updatedClient: ClientCompany) => {
        await updateClient(updatedClient);
        setEditingClient(null);
    };

    if (clientCompanies.length === 0) {
        return (
         <div className="flex flex-col items-center justify-center h-full text-center">
             <h3 className="text-xl font-bold text-text-primary">No Client Companies Found</h3>
             <p className="text-text-secondary mt-2">Could not find any client companies in your Airtable base.</p>
         </div>
       );
     }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-surface border border-subtle rounded-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-subtle">
                        <thead className="bg-secondary">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-primary sm:pl-6">Client</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">Dashboard Title</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">Username</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-primary">Color Scheme</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-subtle">
                            {clientCompanies.map((client) => (
                                <tr key={client.recordId} className="hover:bg-secondary/50 transition-colors duration-200">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full bg-secondary object-cover" src={client.logoUrl} alt={`${client.name} logo`} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-medium text-text-primary">{client.name}</div>
                                                <div className="text-text-secondary">{client.website || 'No website'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-text-primary">
                                        {client.dashboardTitle || <span className="text-text-secondary/70 italic">Not set</span>}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-text-primary">
                                        {client.clientUsername || <span className="text-text-secondary/70 italic">Not set</span>}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-text-primary">
                                        <div className="flex items-center">
                                            <div className={`w-3 h-3 rounded-full mr-2 ${colorSchemeStyles[client.colorScheme || 'slate']}`}></div>
                                            <span className="capitalize">{client.colorScheme || 'slate'}</span>
                                        </div>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button
                                            onClick={() => setEditingClient(client)}
                                            className="text-brand hover:text-brand-dark"
                                        >
                                            Edit<span className="sr-only">, {client.name}</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {clientCompanies.map(client => (
                    <div key={client.recordId} className="bg-surface border border-subtle rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                                <div className="h-10 w-10 flex-shrink-0">
                                    <img className="h-10 w-10 rounded-full bg-secondary object-cover" src={client.logoUrl} alt={`${client.name} logo`} />
                                </div>
                                <div className="ml-4 min-w-0">
                                    <div className="font-medium text-text-primary truncate">{client.name}</div>
                                    <div className="text-text-secondary text-sm truncate">{client.website || 'No website'}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setEditingClient(client)}
                                className="text-brand hover:text-brand-dark font-semibold flex-shrink-0 ml-2"
                            >
                                Edit
                            </button>
                        </div>
                        <div className="mt-4 border-t border-subtle pt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="font-semibold text-text-secondary">Dashboard Title:</span>
                                <span className="text-text-primary text-right truncate pl-2">{client.dashboardTitle || <i className="text-text-secondary/70">Not set</i>}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold text-text-secondary">Username:</span>
                                <span className="text-text-primary truncate pl-2">{client.clientUsername || <i className="text-text-secondary/70">Not set</i>}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-text-secondary">Color Scheme:</span>
                                <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${colorSchemeStyles[client.colorScheme || 'slate']}`}></div>
                                    <span className="capitalize text-text-primary">{client.colorScheme || 'slate'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>


            {editingClient && (
                <ClientEditModal
                    client={editingClient}
                    onClose={() => setEditingClient(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default ClientManagementPanel;
