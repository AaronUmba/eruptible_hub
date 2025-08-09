

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'error' | 'warn' | 'info';
  message: string;
  details?: string;
}

export interface AirtableRecord {
  recordId: string;
  createdTime: string;
}

export interface ClientCompany extends AirtableRecord {
  id: string; // This will be the same as recordId for consistency
  name: string;
  website?: string;
  logoUrl?: string;
  dashboardTitle?: string;
  colorScheme?: 'slate' | 'blue' | 'green' | 'purple' | 'orange';
  clientUsername?: string;
}

export interface Deliverable extends AirtableRecord {
  id: string;
  name:string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done' | 'Recurring' | 'Deferred';
  phase?: '1' | '2' | '3' | '4' | '5' | 'other';
  project_id: string[]; // From Airtable link
}

export interface Project extends AirtableRecord {
  id:string;
  name: string;
  projectGoal: string;
  client_id: string[]; // From Airtable link
  client: ClientCompany; // Populated after fetching
  deliverables: Deliverable[]; // Populated after fetching
  status: 'To Do' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
}

// --- Backend/Auth Types ---

export type ApiUser = {
  username: string;
  role: 'admin' | 'client';
};

export type User = ApiUser | null;

export interface AuthResponse {
    token: string;
    user: ApiUser;
}

export interface AdminCredentials {
  username: string;
  password?: string;
  recoveryEmail?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
}

// --- Airtable Configuration ---
export interface AirtableConfig {
    apiKey: string;
    baseId: string;
    projectsTable: string;
    clientsTable: string;
    deliverablesTable: string;
}

// --- App State and Actions ---

export interface AppState {
  // Auth state from backend
  user: User;
  token: string | null;
  adminCredentials: AdminCredentials;

  // Airtable data state
  airtableConfig: AirtableConfig | null;
  projects: Project[];
  clientCompanies: ClientCompany[];
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
  
  // App-wide state
  logs: LogEntry[];
  theme: 'light' | 'dark';
}

export type Action =
  // Auth Actions
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_ADMIN_CREDENTIALS'; payload: Partial<AdminCredentials> }
  
  // Airtable Config Actions
  | { type: 'SET_AIRTABLE_CONFIG'; payload: AirtableConfig | null }
  
  // Airtable Data Actions
  | { type: 'FETCH_DATA_START' }
  | { type: 'FETCH_DATA_SUCCESS'; payload: { projects: Project[], clients: ClientCompany[], syncDate: Date | null } }
  | { type: 'FETCH_DATA_ERROR'; payload: string }
  | { type: 'TOGGLE_DELIVERABLE_SUCCESS'; payload: { projectId: string; deliverableId: string } }
  | { type: 'UPDATE_CLIENT_SUCCESS'; payload: ClientCompany }

  // Generic App Actions
  | { type: 'ADD_LOG'; payload: Omit<LogEntry, 'id' | 'timestamp'> }
  | { type: 'CLEAR_LOGS' }
  | { type: 'TOGGLE_THEME' };