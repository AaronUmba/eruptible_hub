
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { AdminCredentials } from '../types';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

// 2FA removed for now

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

// ToggleSwitch no longer used after 2FA removal


const AdminSecuritySettings: React.FC = () => {
    const { state, updateAdminCredentials } = useAppContext();
    const [formData, setFormData] = useState<Partial<AdminCredentials>>({});
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // 2FA UI removed
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        setFormData({
            username: state.adminCredentials.username,
            recoveryEmail: state.adminCredentials.recoveryEmail || '',
            twoFactorEnabled: false,
            twoFactorSecret: undefined,
        });
    }, [state.adminCredentials]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    
    // 2FA toggle removed

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

        // 2FA removed

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

                {/* 2FA UI removed */}
                
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
