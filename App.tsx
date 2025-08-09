
import React from 'react';
import { useAppContext } from './contexts/AppContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  const { state } = useAppContext();
  const { user } = state;

  if (!user) {
    return <Login />;
  }

  return (
    <ErrorBoundary>
      {user.role === 'admin' && <AdminDashboard />}
      {user.role === 'client' && <ClientDashboard />}
    </ErrorBoundary>
  );
};

export default App;
