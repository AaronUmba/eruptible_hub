
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const Login: React.FC = () => {
  const { login } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!username.trim() || !password.trim()) {
      setError('Username and password cannot be empty.');
      setLoading(false);
      return;
    }
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus(null);
    try {
      await fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdentifier.trim() })
      });
      setForgotStatus('If an account exists for that identifier, a reset link has been sent.');
      setForgotIdentifier('');
    } catch (err: any) {
      setForgotStatus('If an account exists for that identifier, a reset link has been sent.');
    }
  };

  const renderCredentialForm = () => (
    <form onSubmit={handleCredentialSubmit} noValidate>
        {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md mb-6 text-sm">
                {error}
            </div>
        )}
        <div className="mb-4">
            <label htmlFor="username" className="block text-text-primary text-sm font-bold mb-2">
                Username
            </label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-secondary border border-subtle rounded-md py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                 placeholder="e.g., your username"
                required
                autoComplete="username"
            />
        </div>
        <div className="mb-6">
            <label htmlFor="password"className="block text-text-primary text-sm font-bold mb-2">
                Password
            </label>
            <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary border border-subtle rounded-md py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="••••••••"
                required
                autoComplete="current-password"
            />
        </div>
        <div className="flex items-center justify-between">
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200 disabled:bg-brand/50 disabled:cursor-not-allowed"
            >
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </div>
        <div className="mt-4 text-center">
          <button type="button" className="text-brand hover:text-brand/80 underline text-sm" onClick={() => setShowForgot(true)}>
            Forgot your password?
          </button>
        </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-text-primary tracking-tight">Eruptible PM</h1>
                <p className="text-text-secondary mt-2">Please sign in to continue</p>
            </header>
            <div className="bg-surface border border-subtle rounded-lg p-8 shadow-sm">
                {renderCredentialForm()}
            </div>
            {showForgot && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-surface border border-subtle rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Reset your password</h3>
                  <p className="text-sm text-text-secondary mb-4">Enter your email or username. If an account exists, you will receive a password reset link.</p>
                  <form onSubmit={handleForgotSubmit}>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      className="w-full bg-secondary border border-subtle rounded-md py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand mb-3"
                      placeholder="Email or username"
                      required
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 bg-brand hover:bg-brand/90 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200">
                        Send reset link
                      </button>
                      <button type="button" className="flex-1 bg-subtle hover:bg-subtle/80 text-text-primary font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200" onClick={() => { setShowForgot(false); setForgotStatus(null); }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                  {forgotStatus && <p className="text-xs text-text-secondary mt-3">{forgotStatus}</p>}
                </div>
              </div>
            )}
        </div>
    </div>
  );
};

export default Login;
