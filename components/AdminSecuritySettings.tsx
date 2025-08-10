
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AdminCredentials } from '../types';
import * as OTPAuth from 'otpauth';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // Base32 characters
    let secret = '';
    for (let i = 0; i < 16; i++) {
        secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
};

const InputField: React.FC<{ label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string, autoComplete?: string }> = 
({ label, id, value, onChange, placeholder, type = "text", autoComplete }) => (
  <div>
    <label htmlFor={id} className="block text-text-primary text-sm font-bold mb-2">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className="w-full bg-secondary border border-subtle rounded-md py-2 px-3 text-text-primary leading-tight focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
      placeholder={placeholder}
      autoComplete={autoComplete}
    />
  </div>
);

const ToggleSwitch: React.FC<{ label: string, enabled: boolean, onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-3">
        <span className="text-text-primary font-medium">{label}</span>
        <button
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand ${enabled ? 'bg-brand' : 'bg-subtle'}`}
        >
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


const AdminSecuritySettings: React.FC = () => {
    const { state, updateAdminCredentials } = useAppContext();
    const [formData, setFormData] = useState<Partial<AdminCredentials>>({});
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [show2FASetup, setShow2FASetup] = useState(false);
    const [totpUri, setTotpUri] = useState('');
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        setFormData({
            username: state.adminCredentials.username,
            recoveryEmail: state.adminCredentials.recoveryEmail || '',
            twoFactorEnabled: state.adminCredentials.twoFactorEnabled,
            twoFactorSecret: state.adminCredentials.twoFactorSecret,
        });
    }, [state.adminCredentials]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    
    const handleToggle2FA = async () => {
        const isEnabling = !formData.twoFactorEnabled;
        
        if(isEnabling) {
            try {
                const response = await fetch('/api/auth/setup-2fa', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('eruptible_auth_token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to setup 2FA');
                }
                
                const data = await response.json();
                setFormData(prev => ({ 
                    ...prev, 
                    twoFactorEnabled: true,
                    twoFactorSecret: data.secret 
                }));
                setTotpUri(data.qrCode);
                setShow2FASetup(true);
            } catch (error) {
                setMessage({ type: 'error', text: 'Failed to setup 2FA' });
            }
        } else {
            setFormData(prev => ({ ...prev, twoFactorEnabled: false }));
            setShow2FASetup(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        const credsToUpdate: Partial<AdminCredentials> = { ...formData };
        
        if (newPassword) {
            if (newPassword !== confirmPassword) {
                setMessage({ type: 'error', text: 'Passwords do not match.' });
                return;
            }
            credsToUpdate.password = newPassword;
        }

        // if disabling 2FA, remove the secret
        if (state.adminCredentials.twoFactorEnabled && !formData.twoFactorEnabled) {
            credsToUpdate.twoFactorSecret = undefined;
        }

        updateAdminCredentials(credsToUpdate);
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="bg-surface border border-subtle rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
                <ShieldCheck className="w-6 h-6 mr-3 text-brand" />
                <h2 className="text-xl font-bold text-text-primary">Admin Security</h2>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-300 p-4 rounded-md mb-6 flex items-start">
                <AlertTriangle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                    <h3 className="font-bold">Security Notice</h3>
                    <p className="text-sm">For demonstration purposes, these credentials are saved in your browser's local storage. This is not secure for a real application. Do not use real passwords.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <InputField 
                    label="Admin Username"
                    id="username"
                    value={formData.username || ''}
                    onChange={handleChange}
                    autoComplete="username"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <InputField 
                        label="New Password"
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Leave blank to keep unchanged"
                        autoComplete="new-password"
                    />
                     <InputField 
                        label="Confirm New Password"
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                    />
                </div>

                <InputField 
                    label="Recovery Email (for 'Forgot Password')"
                    id="recoveryEmail"
                    type="email"
                    value={formData.recoveryEmail || ''}
                    onChange={handleChange}
                    placeholder="e.g., admin@example.com"
                />
                <p className="text-xs text-text-secondary -mt-4">Note: Email functionality is not implemented in this demo.</p>

                <div className="border-t border-subtle pt-6">
                     <ToggleSwitch label="Two-Factor Authentication (2FA)" enabled={formData.twoFactorEnabled || false} onToggle={handleToggle2FA} />
                </div>

                {show2FASetup && formData.twoFactorEnabled && (
                    <div className="bg-secondary p-4 rounded-md border border-subtle">
                         <h3 className="font-bold text-text-primary mb-2">Set up 2FA</h3>
                         <p className="text-sm text-text-secondary mb-4">Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy). Save your changes to enable 2FA on your next login.</p>
                         <div className="flex flex-col md:flex-row items-center gap-4">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(totpUri)}&bgcolor=F9FAFB`}
                                alt="2FA QR Code"
                                className="w-40 h-40 p-2 bg-white rounded-md border"
                            />
                            <div className="text-sm">
                                <p className="text-text-secondary">Can't scan? Enter this code manually:</p>
                                <p className="font-mono bg-background p-2 rounded-md my-2 text-brand tracking-wider">{formData.twoFactorSecret}</p>
                                <p className="text-text-secondary">Make sure to save this secret in a secure location. You will need it to recover your account.</p>
                            </div>
                         </div>
                    </div>
                )}
                
                <div className="flex items-center pt-2">
                    <button
                        type="submit"
                        className="bg-brand hover:bg-brand/90 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-brand transition-colors duration-200"
                    >
                        Save Security Settings
                    </button>
                    {message && <span className={`ml-4 transition-opacity duration-300 ${message.type === 'success' ? 'text-green-500' : 'text-destructive'}`}>{message.text}</span>}
                </div>
            </form>
        </div>
    );
};

export default AdminSecuritySettings;
