
import React, { useState, FormEvent } from 'react';
import GlassCard from './shared/GlassCard';
import GlassInput from './shared/GlassInput';

interface PasswordGateProps {
  onLoginSuccess: (appId: string) => void;
}

const USERS = [
  { username: "anas9910", password: "24177", appId: "expenso-e317f" },
  { username: "test", password: "2222", appId: "expenso-test-mode" },
  { username: "user1", password: "333", appId: "expenso-user-333" },
  { username: "user2", password: "444", appId: "expenso-user-444" },
  { username: "user3", password: "555", appId: "expenso-user-555" }
];

const PasswordGate: React.FC<PasswordGateProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const foundUser = USERS.find(user => 
      user.username === username.trim().toLowerCase() && 
      user.password === password
    );

    if (foundUser) {
      setError(false);
      onLoginSuccess(foundUser.appId);
    } else {
      setError(true);
      setUsername('');
      setPassword('');
    }
  };

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.07.207-.141.414-.214.618m-2.06 3.095A9.002 9.002 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .07-.207-.141-.414-.214-.618m2.06-3.095l-2.06-3.095m16 0l-2.06 3.095" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .23-.62.5-1.22.814-1.78m3.95 3.95A3 3 0 018.02 14.02l-1.07-1.07m5.92-5.92A3 3 0 0115.98 9.98l1.07 1.07m-5.92 5.92l-1.07-1.07m5.92-5.92l1.07 1.07M3 3l18 18" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
      <GlassCard className="w-full max-w-sm p-6">
        <h3 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6 text-center">Expenso</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username-input" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Username</label>
            <GlassInput
              type="text"
              id="username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg p-3"
              required
              autoComplete="username"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Password</label>
            <div className="relative">
              <GlassInput
                type={showPassword ? 'text' : 'password'}
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg p-3 pr-10"
                required
                maxLength={5}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary"
                title="Show/Hide Password"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">Incorrect username or password. Please try again.</p>}
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-5 rounded-full transition-colors duration-200">
              Unlock
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default PasswordGate;
