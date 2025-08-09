
import React, { useState } from 'react';
import { FileText, Database, KeyRound, Users, Server, BookOpen } from 'lucide-react';

type DocKey = 'architecture' | 'connecting' | 'schema' | 'auth' | 'backend';

const docs: Record<DocKey, { title: string, icon: React.ElementType, content: React.ReactNode }> = {
  architecture: {
    title: "System Architecture Overview",
    icon: Server,
    content: (
      <>
        <p className="lead">This document provides a high-level overview of the Eruptible PM dashboard's current architecture.</p>
        <h3 className="doc-heading">Core Components</h3>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li><strong>Frontend:</strong> A Single-Page Application (SPA) built with <strong>React and TypeScript</strong>.</li>
          <li><strong>Styling:</strong> <strong>Tailwind CSS</strong> is used for all styling, with a pre-configured theme for light and dark modes.</li>
          <li><strong>State Management:</strong> Global application state is managed by React's built-in <strong>Context API</strong> (`AppContext`).</li>
          <li><strong>Data Source:</strong> The application fetches all project, client, and deliverable data directly from the <strong>Airtable API</strong>.</li>
          <li><strong>Authentication:</strong> User login is handled by a <strong>mock API service</strong> (`services/api.ts`) that lives within the frontend code. This is for demonstration purposes only.</li>
        </ul>
        <h3 className="doc-heading">Data Flow</h3>
        <p className="text-text-secondary">The current architecture is frontend-centric. This is a common pattern for rapid development and prototypes.</p>
        <div className="space-y-4 my-4">
            <div className="p-4 bg-secondary rounded-lg border border-subtle">
                <p className="font-semibold text-text-primary">Project Data Flow:</p>
                <p className="font-mono text-sm text-brand mt-1">[User's Browser: React App] &lt;--&gt; [Airtable API]</p>
            </div>
             <div className="p-4 bg-secondary rounded-lg border border-subtle">
                <p className="font-semibold text-text-primary">Authentication Flow:</p>
                <p className="font-mono text-sm text-brand mt-1">[User's Browser: React App] &lt;--&gt; [Internal Mock API]</p>
            </div>
        </div>
        <h3 className="doc-heading">Conclusion</h3>
        <p className="text-text-secondary">This architecture is simple and effective for its purpose as a direct Airtable visualizer. For enhanced security, scalability, and integration with other services, the recommended next step is to build a dedicated backend service to act as an intermediary, as outlined in the <strong>Backend Integration Guide</strong>.</p>
      </>
    )
  },
  connecting: {
    title: "Connecting to Airtable",
    icon: Database,
    content: (
      <>
        <p className="lead">The platform is powered entirely by data from an Airtable base. To connect the application, you must provide your Airtable credentials in the <strong>Admin Dashboard {'>'} Settings</strong> panel.</p>
        <h3 className="doc-heading">Required Information</h3>
        <ol className="list-decimal list-inside space-y-3 text-text-secondary">
            <li><strong>API Key:</strong> Your personal Airtable access token. This should be treated like a password and kept secret. You can find this on your <a href="https://airtable.com/account" target="_blank" rel="noopener noreferrer" className="text-brand underline">Airtable account page</a>.</li>
            <li><strong>Base ID:</strong> The unique identifier for the Airtable base you want to connect to. This typically starts with `app...`. You can find this in the API documentation for your base.</li>
            <li><strong>Table Names:</strong> The exact, case-sensitive names of the tables in your base that hold your data for Projects, Clients, and Deliverables.</li>
        </ol>
        <div className="p-4 mt-6 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
          <p className="font-bold">Important Note</p>
          <p className="text-sm">The application expects a very specific schema (field names and types) in the tables you connect. Please refer to the <strong>Data Schema & Models</strong> document for the exact requirements.</p>
        </div>
      </>
    )
  },
  schema: {
    title: "Data Schema & Models",
    icon: FileText,
    content: (
       <>
        <p className="lead">For the application to function correctly, your Airtable base must adhere to the following schema. Field names and types must match exactly.</p>
        
        <div className="schema-section">
            <h4 className="schema-title">Projects Table</h4>
            <p className="schema-description">Set this name in `Settings {'>'} Projects Table Name`.</p>
            <table className="doc-table">
                <thead><tr><th>Field Name</th><th>Field Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td>Project</td><td>Single line text</td><td>The project's name.</td></tr>
                    <tr><td>Project Goal</td><td>Long text</td><td>A description of the project.</td></tr>
                    <tr><td>Company</td><td>Link to another record</td><td>A link to a <strong>single record</strong> in the Clients table.</td></tr>
                    <tr><td>Status</td><td>Single select</td><td>Options: `To Do`, `In Progress`, `Completed`, `On Hold`, `Cancelled`.</td></tr>
                    <tr><td>Deliverables</td><td>Link to another record</td><td>A link to <strong>multiple records</strong> in the Deliverables table.</td></tr>
                </tbody>
            </table>
        </div>

        <div className="schema-section">
            <h4 className="schema-title">Clients Table</h4>
            <p className="schema-description">Set this name in `Settings {'>'} Clients Table Name`.</p>
            <table className="doc-table">
                <thead><tr><th>Field Name</th><th>Field Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td>Name</td><td>Single line text</td><td>The client company's name.</td></tr>
                    <tr><td>Company Website</td><td>URL</td><td>(Optional) The client's official website.</td></tr>
                    <tr><td>Logo</td><td>Attachment</td><td>(Optional) A single image for the company logo.</td></tr>
                    <tr><td>Client Username</td><td>Single line text</td><td>(Optional) A unique username for client login.</td></tr>
                    <tr><td>Dashboard Title</td><td>Single line text</td><td>(Optional) Custom title for the client's view.</td></tr>
                    <tr><td>Color Scheme</td><td>Single select</td><td>(Optional) Options: `slate`, `blue`, `green`, `purple`, `orange`.</td></tr>
                </tbody>
            </table>
        </div>

        <div className="schema-section">
            <h4 className="schema-title">Deliverables Table</h4>
            <p className="schema-description">Set this name in `Settings {'>'} Deliverables Table Name`.</p>
            <table className="doc-table">
                <thead><tr><th>Field Name</th><th>Field Type</th><th>Description</th></tr></thead>
                <tbody>
                    <tr><td>Deliverable</td><td>Single line text</td><td>The deliverable's name.</td></tr>
                    <tr><td>Description</td><td>Long text</td><td>A description of the deliverable.</td></tr>
                    <tr><td>Status</td><td>Single select</td><td>Options: `To Do`, `In Progress`, `Done`, `Recurring`, `Deferred`.</td></tr>
                    <tr><td>Phase</td><td>Single select</td><td>(Optional) Options: `1`, `2`, `3`, `4`, `5`, `other`.</td></tr>
                    <tr><td>Project</td><td>Link to another record</td><td>A link to a <strong>single record</strong> in the Projects table.</td></tr>
                </tbody>
            </table>
        </div>
    </>
    )
  },
  auth: {
    title: "Authentication & User Roles",
    icon: KeyRound,
    content: (
       <>
        <p className="lead">The current authentication system is a mock implementation designed for demonstration purposes. It is not secure and should be replaced by a proper backend service for any production use.</p>
        <h3 className="doc-heading">User Roles</h3>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li><strong>Admin:</strong> Has full access to all projects, clients, settings, and documentation. Can modify all data.</li>
          <li><strong>Client:</strong> Has restricted access. The client-facing dashboard is currently a placeholder but is designed to eventually show a filtered view of only their projects.</li>
        </ul>
        <h3 className="doc-heading">Login Credentials (Default)</h3>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li><strong>Admin Login:</strong> Username `admin`, Password `password`.</li>
          <li><strong>Client Login:</strong> Use the value from the `Client Username` field in your Airtable "Clients" table. The password for all clients is hardcoded to `password`.</li>
        </ul>
        <h3 className="doc-heading">Two-Factor Authentication (2FA)</h3>
        <p className="text-text-secondary mb-2">A 2FA system is available for the admin account, which can be configured in `Settings {'>'} Admin Security`.</p>
        <div className="p-4 mt-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive-foreground">
          <p className="font-bold">Security Warning</p>
          <p className="text-sm">The 2FA secret is stored in your browser's local storage, and the code verification happens on the client-side. This is <strong>not secure</strong>. In a real application, the secret must be stored and verified on a secure server.</p>
        </div>
      </>
    )
  },
  backend: {
    title: "Backend Integration Guide",
    icon: Users,
    content: (
      <>
        <p className="lead">This guide is for developers creating a custom backend (e.g., in Node.js) to replace the direct Airtable connection and mock authentication, creating a more secure and scalable application.</p>
        <h3 className="doc-heading">Step 1: Create your API Endpoints</h3>
        <p className="text-text-secondary">Your backend should securely wrap the Airtable API and provide its own interface for the frontend to consume. Your server will be responsible for authenticating users and then making requests to Airtable using a securely stored API key.</p>
        <p className="text-text-secondary mt-2">Example endpoints to create:</p>
        <ul className="list-disc list-inside space-y-1 my-2 font-mono text-sm bg-secondary p-4 rounded-md text-text-secondary">
            <li>`POST /api/auth/login` - Authenticate users.</li>
            <li>`GET /api/projects` - Fetch all projects.</li>
            <li>`GET /api/clients` - Fetch all clients.</li>
            <li>`PATCH /api/deliverables/:id` - Update a specific deliverable.</li>
            <li>...and so on for all required data operations.</li>
        </ul>

        <h3 className="doc-heading">Step 2: Refactor Frontend Services</h3>
        <p className="text-text-secondary">The primary location for changes will be in `contexts/AppContext.tsx`. You will need to modify the functions that currently call `services/airtable.ts` and `services/api.ts`.</p>
        <p className="text-text-secondary mt-2">Example refactor for `loadAirtableData`:</p>
        <pre className="doc-code"><code>
{`// --- Before (in AppContext.tsx) ---
import * as airtable from '../services/airtable';
// ...
const { projects, clients } = await airtable.getProjectsAndClients(config);
dispatch({ type: 'FETCH_DATA_SUCCESS', payload: { projects, clients, ... } });

// --- After (in AppContext.tsx) ---
// ...
const response = await fetch('/api/data'); // Your new backend endpoint
const { projects, clients } = await response.json();
dispatch({ type: 'FETCH_DATA_SUCCESS', payload: { projects, clients, ... } });
`}
        </code></pre>
        <p className="text-text-secondary mt-4">Similarly, the `login` function should be updated to call your new `POST /api/auth/login` endpoint instead of the mock API service.</p>
        <h3 className="doc-heading">Conclusion</h3>
        <p className="text-text-secondary">By routing all data and authentication requests through a dedicated backend, you centralize business logic, enhance security by never exposing Airtable keys to the browser, and gain the ability to scale, cache, and integrate other services in the future.</p>
      </>
    )
  }
};

const DocumentationPanel: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<DocKey>('architecture');
  const CurrentDoc = docs[activeDoc];

  return (
    <div className="max-w-7xl mx-auto">
      <style>{`
        .lead {
          @apply text-lg text-text-secondary mb-6 border-l-4 border-brand pl-4;
        }
        .doc-heading {
          @apply text-xl font-bold text-text-primary mt-8 mb-4 pb-2 border-b border-subtle;
        }
        .schema-section {
            @apply mt-8;
        }
        .schema-title {
            @apply text-lg font-semibold text-text-primary mb-1;
        }
        .schema-description {
            @apply text-sm text-text-secondary mb-3;
        }
        .doc-table {
            @apply w-full text-left border-collapse;
        }
        .doc-table th, .doc-table td {
            @apply border border-subtle p-2 text-sm;
        }
        .doc-table th {
            @apply bg-secondary font-semibold text-text-primary;
        }
        .doc-table td {
            @apply text-text-secondary;
        }
        .doc-table td:first-child {
            @apply font-mono text-text-primary;
        }
        .doc-code {
            @apply block text-sm whitespace-pre-wrap bg-secondary p-4 rounded-md border border-subtle mt-2;
        }
      `}</style>

      <div className="bg-surface border border-subtle rounded-lg p-6 md:p-8 min-h-[60vh] flex flex-col md:flex-row gap-8">
        {/* Left Nav */}
        <nav className="md:w-1/4 flex-shrink-0 border-b md:border-b-0 md:border-r border-subtle pb-4 md:pb-0 md:pr-8">
            <div className="flex items-center mb-4">
              <BookOpen className="w-5 h-5 mr-3 text-brand" />
              <h2 className="text-lg font-bold text-text-primary">Documentation</h2>
            </div>
            <ul className="space-y-1">
              {Object.entries(docs).map(([key, { title, icon: Icon }]) => (
                <li key={key}>
                  <button
                    onClick={() => setActiveDoc(key as DocKey)}
                    className={`w-full text-left flex items-center p-2 rounded-md text-sm transition-colors ${
                      activeDoc === key
                        ? 'bg-brand/10 text-brand font-semibold'
                        : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span>{title}</span>
                  </button>
                </li>
              ))}
            </ul>
        </nav>

        {/* Right Content */}
        <main className="flex-1 md:w-3/4 overflow-y-auto">
          <div className="flex items-center mb-4">
            <CurrentDoc.icon className="w-6 h-6 mr-3 text-brand" />
            <h1 className="text-2xl font-bold text-text-primary">{CurrentDoc.title}</h1>
          </div>
          <article className="prose prose-sm max-w-none">
            {CurrentDoc.content}
          </article>
        </main>
      </div>
    </div>
  );
};

export default DocumentationPanel;
