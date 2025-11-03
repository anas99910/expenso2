
import React, { useRef } from 'react';
import ModalWrapper from './ModalWrapper';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
  onImport: (file: File) => void;
  onResetRequest: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, appId, onImport, onResetRequest }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      onClose();
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Settings">
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-light-text-primary dark:text-dark-text-primary mb-2">Backup & Restore</h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">Restore from a JSON backup file.</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="glass-input w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-300 hover:file:bg-blue-600/40"
            accept=".json"
          />
        </div>
        
        <div className="pt-4 border-t border-light-border-primary dark:border-dark-border-primary">
          <h4 className="text-lg font-medium text-red-400 mb-2">Danger Zone</h4>
          <button onClick={onResetRequest} className="w-full text-left bg-red-600/20 text-red-300 hover:bg-red-600/40 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
            Clear All App Data
          </button>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">This will permanently delete all data.</p>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-6">
        <button type="button" onClick={onClose} className="bg-light-bg-tertiary/80 dark:bg-dark-bg-tertiary/80 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary font-medium py-2 px-5 rounded-full transition-colors duration-200">Close</button>
      </div>
    </ModalWrapper>
  );
};

export default SettingsModal;
