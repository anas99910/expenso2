
import React, { useState, useEffect, FormEvent } from 'react';
import { Income } from '../../types';
import { saveIncome } from '../../services/firebaseService';
import { getTodayString } from '../../utils/helpers';
import ModalWrapper from './ModalWrapper';
import GlassInput from '../shared/GlassInput';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  income: Income | null;
  appId: string;
  showToast: (message: string, isError?: boolean) => void;
}

const IncomeModal: React.FC<IncomeModalProps> = ({ isOpen, onClose, income, appId, showToast }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (income) {
        setTitle(income.title);
        setAmount(income.amount);
        setDate(income.date);
      } else {
        setTitle('');
        setAmount('');
        setDate(getTodayString());
      }
    }
  }, [isOpen, income]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !amount) {
      showToast('Title and amount are required.', true);
      return;
    }

    const incomeData: Omit<Income, 'id'> = {
      title: title.trim(),
      amount: Number(amount),
      date: date,
    };

    try {
      await saveIncome(appId, incomeData, income?.id);
      showToast(income ? 'Income updated!' : 'Income added!');
      onClose();
    } catch (error) {
      console.error("Error saving income:", error);
      showToast('Failed to save income.', true);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={income ? 'Edit Income' : 'Add Income'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="income-title" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Description</label>
          <GlassInput type="text" id="income-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Monthly Salary" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="income-amount" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Amount (DH)</label>
            <GlassInput type="number" id="income-amount" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="10000" min="0.01" step="0.01" required />
          </div>
          <div>
            <label htmlFor="income-date" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Date</label>
            <GlassInput type="date" id="income-date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="bg-light-bg-tertiary/80 dark:bg-dark-bg-tertiary/80 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary font-medium py-2 px-5 rounded-full transition-colors duration-200">Cancel</button>
          <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-5 rounded-full transition-colors duration-200">Save Income</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default IncomeModal;
