
import React, { useState, useEffect, FormEvent } from 'react';
import { saveBudget } from '../../services/firebaseService';
import ModalWrapper from './ModalWrapper';
import GlassInput from '../shared/GlassInput';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
  currentBudget: number;
  showToast: (message: string, isError?: boolean) => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ isOpen, onClose, appId, currentBudget, showToast }) => {
  const [amount, setAmount] = useState<number | ''>('');

  useEffect(() => {
    if (isOpen) {
      setAmount(currentBudget > 0 ? currentBudget : '');
    }
  }, [isOpen, currentBudget]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await saveBudget(appId, Number(amount) || 0);
      showToast('Budget updated!');
      onClose();
    } catch (error) {
      console.error("Error saving budget:", error);
      showToast('Failed to save budget.', true);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Set Monthly Budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="budget-amount" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Budget Amount (DH)</label>
          <GlassInput type="number" id="budget-amount" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="5000" min="0" step="100" />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="bg-light-bg-tertiary/80 dark:bg-dark-bg-tertiary/80 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary font-medium py-2 px-5 rounded-full transition-colors duration-200">Cancel</button>
          <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-5 rounded-full transition-colors duration-200">Set Budget</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default BudgetModal;
