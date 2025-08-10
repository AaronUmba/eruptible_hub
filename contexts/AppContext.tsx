
import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { AppState, Action, User, Deliverable, ClientCompany, AdminCredentials, AuthResponse, LogEntry } from '../types';

const AUTH_TOKEN_KEY = 'eruptible_auth_token';
const ADMIN_CREDENTIALS_KEY = 'eruptible_admin_credentials'; // Kept for 2FA demo on frontend
const THEME_KEY = 'eruptible_theme';

const getInitialState = (): AppState => {
    let token: string | null = null;
    let user: User = null;
    let adminCredentials: AdminCredentials = { username: 'admin', password: 'password', twoFactorEnabled: false };
    let theme: 'light' | 'dark' = 'dark';
    
    try {
        const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
        if (storedToken) {
           // In a real app, you'd verify this token with the backend
           // For now, we just assume it's valid if it exists.
        }

        const storedAdminCreds = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
        if (storedAdminCreds) adminCredentials = JSON.parse(storedAdminCreds);

        const storedTheme = localStorage.getItem(THEME_KEY);
        if (storedTheme === 'light' || storedTheme === 'dark') theme = storedTheme;

    } catch (e) {
        console.error("Failed to initialize state from localStorage", e);
    }
    
    return {
        user,
        token,
        adminCredentials,
        airtableConfig: null, // This is no longer used on the frontend
        projects: [],
        clientCompanies: [],
        logs: [],
        loading: false,
        error: null,
        lastSync: null,
        theme,
    };
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, error: null };
    case 'LOGOUT':
       try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      } catch (e) {
        console.error("Could not remove item from localStorage", e);
      }
      return { ...getInitialState(), logs: state.logs, theme: state.theme, adminCredentials: state.adminCredentials };
    case 'FETCH_DATA_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_DATA_SUCCESS':
      return { 
        ...state,
        loading: false,
        projects: action.payload.projects,
        clientCompanies: action.payload.clients,
        lastSync: action.payload.syncDate,
      };
    case 'FETCH_DATA_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'TOGGLE_DELIVERABLE_SUCCESS': {
      const { projectId, deliverableId } = action.payload;
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.recordId === projectId) {
            const newDeliverables = project.deliverables.map(d => {
              if (d.recordId === deliverableId) {
                const newStatus: Deliverable['status'] = d.status === 'Done' ? 'To Do' : 'Done';
                return { ...d, status: newStatus };
              }
              return d;
            });
            return { ...project, deliverables: newDeliverables };
          }
          return project;
        }),
      };
    }
    case 'UPDATE_CLIENT_SUCCESS': {
        return {
            ...state,
            clientCompanies: state.clientCompanies.map(client => 
                client.recordId === action.payload.recordId ? action.payload : client
            ),
             projects: state.projects.map(project => {
                if(project.client.recordId === action.payload.recordId) {
                    return { ...project, client: action.payload }
                }
                return project;
            }),
        };
    }
    case 'UPDATE_ADMIN_CREDENTIALS': {
        const newCreds = { ...state.adminCredentials, ...action.payload };
         try {
            localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(newCreds));
        } catch(e) {
            console.error("Could not save admin credentials to localStorage", e);
        }
        return { ...state, adminCredentials: newCreds };
    }
    case 'ADD_LOG': {
        const newLog = {
            ...action.payload,
            id: new Date().toISOString() + Math.random(),
            timestamp: new Date().toISOString(),
        };
        const updatedLogs = [newLog, ...state.logs].slice(0, 100);
        return { ...state, logs: updatedLogs };
    }
    case 'CLEAR_LOGS':
        return { ...state, logs: [] };
    case 'TOGGLE_THEME': {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        try {
            localStorage.setItem(THEME_KEY, newTheme);
        } catch(e) {
            console.error("Could not save theme to localStorage", e);
        }
        return { ...state, theme: newTheme };
    }
    // This action is no longer needed as config is on backend
    case 'SET_AIRTABLE_CONFIG': return state;
    default:
      return state;
  }
};

export interface AppContextType {
  state: AppState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateAdminCredentials: (creds: Partial<AdminCredentials>) => void;
  updateClient: (client: ClientCompany) => Promise<void>;
  toggleDeliverable: (projectId: string, deliverableId: string, currentStatus: Deliverable['status']) => Promise<void>;
  manualSync: () => void;
  clearLogs: () => void;
  toggleTheme: () => void;
  addLog: (payload: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());
  
  const addLog = useCallback((payload: Omit<LogEntry, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_LOG', payload });
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  const loadBackendData = useCallback(async () => {
    if (state.user?.role !== 'admin') return;

    dispatch({ type: 'FETCH_DATA_START' });
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const { projects, clients } = await response.json();
      dispatch({ type: 'FETCH_DATA_SUCCESS', payload: { projects, clients, syncDate: new Date() } });
      addLog({type: 'info', message: `Successfully synced ${projects.length} projects and ${clients.length} clients from backend.`})
    } catch (error: any) {
      const errorMessage = error.message || 'An unknown error occurred';
      dispatch({ type: 'FETCH_DATA_ERROR', payload: errorMessage });
      addLog({ type: 'error', message: 'Failed to fetch data from backend.', details: errorMessage });
    }
  }, [state.user?.role, addLog]);

  useEffect(() => {
    // Auto-fetch data if logged in
    if (state.token && state.user) {
      loadBackendData();
    }
  }, [state.token, state.user, loadBackendData]);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
      });
      if(!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid credentials');
      }
      const data: AuthResponse = await response.json();
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    } catch(err) {
      addLog({ type: 'warn', message: 'Login failed', details: (err as Error).message });
      throw err;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  const updateAdminCredentials = (creds: Partial<AdminCredentials>) => {
      dispatch({ type: 'UPDATE_ADMIN_CREDENTIALS', payload: creds });
      // Persist to backend so login uses new password
      fetch('/api/auth/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: creds.username ?? state.adminCredentials.username,
          password: creds.password,
          recoveryEmail: creds.recoveryEmail ?? state.adminCredentials.recoveryEmail,
        })
      }).catch(() => { /* ignore for now */});
      addLog({ type: 'info', message: 'Admin credentials updated.' });
  };
  
  const updateClient = async (client: ClientCompany) => {
    const { recordId, ...clientData } = client;
    const fieldsToUpdate = {
        'Dashboard Title': clientData.dashboardTitle,
        'Color Scheme': clientData.colorScheme,
    };
    try {
      await fetch(`/api/clients/${recordId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: fieldsToUpdate }),
      });
      dispatch({ type: 'UPDATE_CLIENT_SUCCESS', payload: client });
      addLog({ type: 'info', message: `Updated client: ${client.name}` });
    } catch (err) {
      const errorMsg = (err as Error).message;
      addLog({ type: 'error', message: `Failed to update client ${client.name}`, details: errorMsg });
      throw err;
    }
  };
  
  const toggleDeliverable = async (projectId: string, deliverableId: string, currentStatus: Deliverable['status']) => {
    const newStatus: Deliverable['status'] = currentStatus === 'Done' ? 'To Do' : 'Done';
    dispatch({ type: 'TOGGLE_DELIVERABLE_SUCCESS', payload: { projectId, deliverableId } });
    try {
        await fetch(`/api/deliverables/${deliverableId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: { Status: newStatus } }),
        });
        addLog({ type: 'info', message: `Toggled deliverable ${deliverableId} to ${newStatus}` });
    } catch(err) {
       const errorMsg = (err as Error).message;
       addLog({ type: 'error', message: `Failed to toggle deliverable ${deliverableId}`, details: errorMsg });
       dispatch({ type: 'TOGGLE_DELIVERABLE_SUCCESS', payload: { projectId, deliverableId } }); // Revert
       throw err;
    }
  };
  
  const manualSync = useCallback(() => {
    if (state.token && state.user) {
      loadBackendData();
    }
  }, [state.token, state.user, loadBackendData]);

  const clearLogs = () => { dispatch({ type: 'CLEAR_LOGS' }); };
  const toggleTheme = () => { dispatch({ type: 'TOGGLE_THEME' }); };

  return (
    <AppContext.Provider value={{ 
        state, login, logout, updateAdminCredentials, 
        updateClient, toggleDeliverable, manualSync, clearLogs, 
        toggleTheme, addLog
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
