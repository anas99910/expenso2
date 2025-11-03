
import React, { useState, FormEvent } from 'react';
import ModalWrapper from './ModalWrapper';
import GlassInput from '../shared/GlassInput';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === '9999') {
      setError(false);
      onConfirm();
      setPassword('');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Admin Access">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reset-password-input" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Enter Admin Password to continue</label>
          <GlassInput
            type="password"
            id="reset-password-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
          {error && <p className="text-red-400 text-sm mt-2">Incorrect password.</p>}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="bg-light-bg-tertiary/80 dark:bg-dark-bg-tertiary/80 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary font-medium py-2 px-5 rounded-full transition-colors duration-200">Cancel</button>
          <button type="submit" className="bg-red-600 hover:bg-red-500 text-white font-medium py-2 px-5 rounded-full transition-colors duration-200">Confirm</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ResetPasswordModal;
