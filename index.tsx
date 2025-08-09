import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './contexts/AppContext';

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element to mount to");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>
  );
};

// Check the document's ready state to handle cases where the script loads after the DOM is already interactive.
if (document.readyState !== 'loading') {
    renderApp();
} else {
    document.addEventListener('DOMContentLoaded', renderApp);
}
