
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

const Login: React.FC = () => {
  const { login, verify2FACode } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');

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
      const result = await login(username, password);
      if (result === '2FA_REQUIRED') {
        setStep('2fa');
      }
      // On 'SUCCESS', the App component will automatically handle the redirect.
    } catch (err: any) {
      setError(err.message || 'Invalid username or password. Please try again.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!code.trim()) {
        setError('2FA code cannot be empty.');
        setLoading(false);
        return;
    }
    try {
        await verify2FACode(code);
        // On success, App component will redirect
    } catch (err: any) {
        setError(err.message || 'Invalid 2FA code. Please try again.');
        setCode('');
    } finally {
        setLoading(false);
    }
  }

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
                placeholder="e.g., admin or client_name"
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
    </form>
  );

  const render2FAForm = () => (
     <form onSubmit={handle2FASubmit} noValidate>
        {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md mb-6 text-sm">
                {error}
            </div>
        )}
        <div className="mb-4">
            <label htmlFor="2fa-code" className="block text-text-primary text-sm font-bold mb-2">
                Two-Factor Code
            </label>
            <p className="text-sm text-text-secondary mb-3">Enter the code from your authenticator app.</p>
            <input
                id="2fa-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-secondary border border-subtle rounded-md py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                placeholder="e.g., 123456"
                required
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="\\d{6}"
            />
        </div>
        <div className="flex items-center justify-between">
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200 disabled:bg-brand/50 disabled:cursor-not-allowed"
            >
                {loading ? 'Verifying...' : 'Verify Code'}
            </button>
        </div>
        <button
            type="button"
            onClick={() => { setStep('credentials'); setError(''); setPassword(''); }}
            className="w-full text-center text-sm text-text-secondary hover:text-text-primary mt-4"
        >
            Back to login
        </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 font-sans">
        <div className="w-full max-w-md">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-text-primary tracking-tight">Eruptible PM</h1>
                <p className="text-text-secondary mt-2">
                    {step === 'credentials' ? 'Please sign in to continue' : 'Two-Factor Authentication'}
                </p>
            </header>
            <div className="bg-surface border border-subtle rounded-lg p-8 shadow-sm">
                {step === 'credentials' ? renderCredentialForm() : render2FAForm()}
            </div>
            <footer className="text-center mt-8 text-text-secondary text-sm">
                <p>Use 'admin' / 'password' for admin access (by default).</p>
                <p>Use a client username / 'password' for client access.</p>
            </footer>
        </div>
    </div>
  );
};

export default Login;
