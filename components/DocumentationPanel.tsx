
import React, { useState } from 'react';
import { FileText, KeyRound, Server, Anchor, BookOpen } from 'lucide-react';

type DocKey = 'architecture' | 'deployment' | 'schema' | 'auth' | 'backend';

const docs: Record<DocKey, { title: string, icon: React.ElementType, content: React.ReactNode }> = {
  architecture: {
    title: "System Architecture",
    icon: Server,
    content: (
      <>
        <p className="lead">This document provides a high-level overview of the Eruptible PM dashboard's multi-container architecture, designed for deployment with Docker.</p>
        <h3 className="doc-heading">Core Services (Containers)</h3>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li><strong>Proxy (Nginx):</strong> The public entry point for all traffic. It serves the frontend application and intelligently forwards API requests (anything to `/api/*`) to the backend service.</li>
          <li><strong>Frontend (React/Nginx):</strong> A static build of the React SPA, served by its own lightweight Nginx server. It contains all the UI and client-side logic. This service is not exposed publicly.</li>
          <li><strong>Backend (Node.js/Express):</strong> A dedicated API server that handles all business logic, authentication, and communication with the Airtable API. This service is not exposed publicly.</li>
        </ul>
        <h3 className="doc-heading">Data & Request Flow</h3>
        <p className="text-text-secondary">This architecture provides enhanced security and scalability by abstracting the data source (Airtable) behind a dedicated backend.</p>
        <div className="space-y-4 my-4">
            <div className="p-4 bg-secondary rounded-lg border border-subtle">
                <p className="font-semibold text-text-primary">User Request (e.g., loading the page):</p>
                <p className="font-mono text-sm text-brand mt-1">[User Browser] → [Proxy] → [Frontend Service]</p>
            </div>
             <div className="p-4 bg-secondary rounded-lg border border-subtle">
                <p className="font-semibold text-text-primary">API Request (e.g., logging in):</p>
                <p className="font-mono text-sm text-brand mt-1">[User Browser] → [Proxy: /api/*] → [Backend Service] → [Airtable API]</p>
            </div>
        </div>
        <h3 className="doc-heading">Security</h3>
        <p className="text-text-secondary">Airtable API keys and other secrets are stored exclusively on the backend server via environment variables and are never exposed to the user's browser, providing a secure setup.</p>
      </>
    )
  },
  deployment: {
    title: "Deployment Guide",
    icon: Anchor,
    content: (
      <>
        <p className="lead">The application is designed to be deployed using Docker and Docker Compose, simplifying the setup process on any machine with Docker installed.</p>
        <h3 className="doc-heading">Prerequisites</h3>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
            <li>A server or local machine with Docker and Docker Compose installed.</li>
            <li>Git installed to clone the repository.</li>
            <li>An open port (typically port 80) on the server.</li>
        </ul>

        <h3 className="doc-heading">Setup Steps</h3>
        <ol className="list-decimal list-inside space-y-3 text-text-secondary">
            <li>Clone the repository to your server: <pre className="doc-code !inline-block !p-1 !my-0">git clone ...</pre></li>
            <li>Navigate into the project directory: <pre className="doc-code !inline-block !p-1 !my-0">cd eruptible-pm-stack</pre></li>
            <li>Create the backend environment file by copying the example: <pre className="doc-code !inline-block !p-1 !my-0">cp backend/.env.example backend/.env</pre></li>
            <li>Edit the new `.env` file and fill in your Airtable and admin credentials: <pre className="doc-code !inline-block !p-1 !my-0">nano backend/.env</pre></li>
            <li>Build and run the application using Docker Compose: <pre className="doc-code !inline-block !p-1 !my-0">docker-compose up --build -d</pre></li>
        </ol>
         <div className="p-4 mt-6 rounded-md bg-green-500/10 border border-green-500/20 text-green-300">
          <p className="font-bold">That's It!</p>
          <p className="text-sm">Your application should now be running and accessible via your server's IP address in a web browser.</p>
        </div>
      </>
    )
  },
  schema: {
    title: "Airtable Schema",
    icon: FileText,
    content: (
       <>
        <p className="lead">For the application to function correctly, your Airtable base must adhere to the following schema. Field names and types must match exactly.</p>
        
        <div className="schema-section">
            <h4 className="schema-title">Projects Table</h4>
            <p className="schema-description">Referenced by `PROJECTS_TABLE` in your `.env` file.</p>
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
            <p className="schema-description">Referenced by `CLIENTS_TABLE` in your `.env` file.</p>
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
            <p className="schema-description">Referenced by `DELIVERABLES_TABLE` in your `.env` file.</p>
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
    title: "Authentication",
    icon: KeyRound,
    content: (
       <>
        <p className="lead">Authentication is handled by the backend service, which verifies user credentials against environment variables (for the admin) or the Airtable Clients table.</p>
        <h3 className="doc-heading">User Roles</h3>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li><strong>Admin:</strong> Has full access to all projects, clients, and settings. Credentials are set in the `backend/.env` file.</li>
          <li><strong>Client:</strong> Has restricted access (client dashboard is currently a placeholder). Credentials are based on the `Client Username` field in Airtable.</li>
        </ul>
        <h3 className="doc-heading">Login Credentials (Default)</h3>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
          <li><strong>Admin Login:</strong> Username and Password as defined in your `.env` file.</li>
          <li><strong>Client Login:</strong> Use a value from the `Client Username` field in Airtable. The password for all clients is hardcoded in the backend to `password`.</li>
        </ul>
        <h3 className="doc-heading">Two-Factor Authentication (2FA)</h3>
        <p className="text-text-secondary mb-2">A demo 2FA system is available for the admin account, which can be configured in `Settings &gt; Admin Security`.</p>
        <div className="p-4 mt-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive">
          <p className="font-bold">Security Warning</p>
          <p className="text-sm">The 2FA secret and validation logic are currently handled on the frontend for demo purposes. In a real production app, this logic must be moved entirely to a secure backend.</p>
        </div>
      </>
    )
  },
  backend: {
    title: "Backend API",
    icon: Server,
    content: (
      <>
        <p className="lead">The Node.js backend serves a simple JSON API for the frontend to consume. It acts as a secure intermediary between the client and the Airtable service.</p>
        <h3 className="doc-heading">Core Responsibilities</h3>
        <ul className="list-disc list-inside space-y-2 text-text-secondary">
            <li><strong>Securely store secrets</strong> (like the Airtable API key) using environment variables.</li>
            <li><strong>Authenticate users</strong> against stored credentials.</li>
            <li><strong>Fetch data</strong> from Airtable on behalf of the user.</li>
            <li><strong>Process and shape data</strong> from Airtable into the format required by the frontend.</li>
            <li><strong>Handle data mutations</strong> (updates, creations) and reflect them in Airtable.</li>
        </ul>
        <h3 className="doc-heading">API Endpoints</h3>
        <p className="text-text-secondary">The following endpoints are exposed by the backend and proxied through Nginx under the `/api` path.</p>
        <ul className="list-disc list-inside space-y-1 my-2 font-mono text-sm bg-secondary p-4 rounded-md text-text-secondary">
            <li><code className="text-blue-400">POST /api/auth/login</code> - Authenticate users.</li>
            <li><code className="text-green-400">GET /api/data</code> - Fetch all projects and clients.</li>
            <li><code className="text-yellow-400">PATCH /api/deliverables/:id</code> - Update a specific deliverable.</li>
            <li><code className="text-yellow-400">PATCH /api/clients/:id</code> - Update a specific client's dashboard settings.</li>
        </ul>
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
            @apply inline-block bg-secondary p-1 rounded-md border border-subtle text-xs;
        }
      `}</style>

      <div className="bg-surface border border-subtle rounded-lg p-6 md:p-8 min-h-[calc(100vh-12rem)] flex flex-col md:flex-row gap-8">
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
