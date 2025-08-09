
import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { LogEntry } from '../types';
import { Trash2 } from 'lucide-react';

const LogConsolePanel: React.FC = () => {
    const { state, clearLogs } = useAppContext();
    const { logs } = state;

    const logTypeClasses: Record<LogEntry['type'], { bg: string, text: string, border: string }> = {
        error: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
        warn: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
        info: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    };

    return (
        <div className="bg-surface border border-subtle rounded-lg h-full flex flex-col max-h-[calc(100vh-11rem)]">
            <header className="p-4 border-b border-subtle flex justify-between items-center flex-shrink-0">
                <h2 className="text-lg font-bold text-text-primary">Event Log</h2>
                <button
                    onClick={clearLogs}
                    disabled={logs.length === 0}
                    className="flex items-center bg-secondary hover:bg-destructive/80 disabled:bg-secondary/50 disabled:cursor-not-allowed text-text-primary hover:text-white font-bold py-1.5 px-3 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-destructive transition-colors duration-200"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Log
                </button>
            </header>
            <main className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                {logs.length === 0 ? (
                    <div className="text-text-secondary/70 italic h-full flex items-center justify-center">
                        <p>Log is empty. Events will appear here as they occur.</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {logs.map(log => {
                            const typeConfig = logTypeClasses[log.type];
                            return (
                                <li key={log.id} className={`p-3 rounded-md border ${typeConfig.bg} ${typeConfig.border}`}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-4 mb-1">
                                        <span className={`font-bold uppercase ${typeConfig.text}`}>{log.type}</span>
                                        <span className="text-text-secondary/80 text-xs flex-shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
                                    </div>
                                    <p className="text-text-secondary whitespace-pre-wrap break-words">{log.message}</p>
                                    {log.details && (
                                        <details className="mt-2 text-text-secondary">
                                            <summary className="cursor-pointer text-xs select-none outline-none">Details</summary>
                                            <pre className="text-xs bg-background p-2 rounded-md mt-1 overflow-x-auto">
                                                <code>{log.details}</code>
                                            </pre>
                                        </details>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </main>
        </div>
    );
};

export default LogConsolePanel;
