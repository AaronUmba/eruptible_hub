
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Signal, RefreshCw, Cloud } from 'lucide-react';

const IntegrationStatus: React.FC = () => {
    const { state, manualSync } = useAppContext();
    const { loading, error, lastSync, user } = state;
    const [airtable, setAirtable] = useState<{connected: boolean; reason?: string} | null>(null);

    useEffect(() => {
        let cancelled = false;
        async function check() {
            try {
                const res = await fetch('/api/airtable/health');
                const data = await res.json();
                if (!cancelled) setAirtable(data);
            } catch (e: any) {
                if (!cancelled) setAirtable({ connected: false, reason: e.message });
            }
        }
        check();
        const id = setInterval(check, 30000);
        return () => { cancelled = true; clearInterval(id); };
    }, []);

    const getStatus = (): { text: string; color: string; dotColor: string, subtext?: string } => {
        if (!user) {
             return { text: 'Not Logged In', color: 'text-yellow-400', dotColor: 'bg-yellow-500', subtext: 'Login to connect to the backend.' };
        }
        if (error) {
            return { text: 'Connection Error', color: 'text-destructive', dotColor: 'bg-destructive', subtext: 'Could not connect to the backend server.' };
        }
        if (loading) {
            return { text: 'Syncing...', color: 'text-blue-400', dotColor: 'bg-blue-500' };
        }
        return { text: 'Connected', color: 'text-green-400', dotColor: 'bg-green-500', subtext: 'Live connection to the project backend.' };
    };

    const status = getStatus();

    return (
        <div className="bg-surface border border-subtle rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
                <Signal className="w-6 h-6 mr-3 text-brand" />
                <h2 className="text-xl font-bold text-text-primary">Backend Connection</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                    <div className="flex items-center">
                        <span className={`w-2.5 h-2.5 rounded-full mr-3 ${status.dotColor} ${loading ? 'animate-pulse' : ''}`}></span>
                        <p className={`font-semibold ${status.color}`}>{status.text}</p>
                    </div>
                    {status.subtext && <p className="text-sm text-text-secondary mt-1 ml-6 max-w-md">{status.subtext}</p>}
                </div>

                <div className="w-full sm:w-auto mt-4 sm:mt-0 flex flex-col sm:items-end">
                     <button
                        onClick={manualSync}
                        disabled={loading || !user}
                        className="flex items-center justify-center bg-secondary hover:bg-subtle disabled:bg-secondary/50 disabled:cursor-not-allowed text-text-primary font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Syncing...' : 'Sync Now'}
                    </button>
                    {lastSync && !error && (
                        <p className="text-xs text-text-secondary mt-2 text-right">
                            Last synced: {lastSync.toLocaleString()}
                        </p>
                    )}
                </div>
            </div>
        </div>
        <div className="bg-surface border border-subtle rounded-lg p-6">
            <div className="flex items-center mb-4">
                <Cloud className="w-6 h-6 mr-3 text-brand" />
                <h2 className="text-xl font-bold text-text-primary">Airtable Connection</h2>
            </div>
            <div className="flex items-center">
                <span className={`w-2.5 h-2.5 rounded-full mr-3 ${airtable?.connected ? 'bg-green-500' : 'bg-destructive'}`}></span>
                <p className={`font-semibold ${airtable?.connected ? 'text-green-400' : 'text-destructive'}`}>
                    {airtable?.connected ? 'Connected' : 'Not Connected'}
                </p>
            </div>
            {!airtable?.connected && airtable?.reason && (
                <p className="text-sm text-text-secondary mt-1 ml-6 max-w-md">{airtable.reason}</p>
            )}
        </div>
    );
};

export default IntegrationStatus;
