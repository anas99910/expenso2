
import React, { useState, useEffect, FormEvent } from 'react';
import { Expense, Categories } from '../../types';
import { saveExpense } from '../../services/firebaseService';
import { getTodayString } from '../../utils/helpers';
import ModalWrapper from './ModalWrapper';
import GlassInput from '../shared/GlassInput';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense | null;
  categories: Categories;
  appId: string;
  currentDate: { year: number; month: number };
  showToast: (message: string, isError?: boolean) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, expense, categories, appId, currentDate, showToast }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (expense) {
        setTitle(expense.title);
        setAmount(expense.amount);
        setCategory(expense.category);
        setDate(expense.date);
        setTags(expense.tags?.join(', ') || '');
      } else {
        // Reset form for new expense
        setTitle('');
        setAmount('');
        setCategory(Object.keys(categories)[0] || '');

        const today = new Date();
        const firstDayOfSelectedMonth = new Date(currentDate.year, currentDate.month, 1).toISOString().split('T')[0];
        const isCurrentMonth = today.getFullYear() === currentDate.year && today.getMonth() === currentDate.month;
        setDate(isCurrentMonth ? getTodayString() : firstDayOfSelectedMonth);
        setTags('');
      }
    }
  }, [isOpen, expense, categories, currentDate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!amount || !category) {
      showToast('Amount and category are required.', true);
      return;
    }

    const expenseData: Omit<Expense, 'id'> = {
      title: title.trim() || categories[category]?.label || 'Expense',
      amount: Number(amount),
      category: category,
      date: date,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      await saveExpense(appId, expenseData, expense?.id);
      showToast(expense ? 'Expense updated!' : 'Expense added!');
      onClose();
    } catch (error) {
      console.error("Error saving expense:", error);
      showToast('Failed to save expense.', true);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={expense ? 'Edit Expense' : 'Add New Expense'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="expense-title" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Description</label>
          <GlassInput type="text" id="expense-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Weekly Groceries" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="expense-amount" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Amount (DH)</label>
            <GlassInput type="number" id="expense-amount" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="150" min="0.01" step="0.01" required />
          </div>
          <div>
            <label htmlFor="expense-category" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Category</label>
            <select id="expense-category" value={category} onChange={e => setCategory(e.target.value)} required className="glass-input w-full rounded-lg p-3 h-[46px]">
              {Object.keys(categories).map(key => <option key={key} value={key}>{categories[key].label}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="expense-date" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Date</label>
          <GlassInput type="date" id="expense-date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="expense-tags" className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">Tags <span className="text-xs">(comma separated)</span></label>
          <GlassInput type="text" id="expense-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g., vacation, work, gift" />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="bg-light-bg-tertiary/80 dark:bg-dark-bg-tertiary/80 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary font-medium py-2 px-5 rounded-full transition-colors duration-200">Cancel</button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-5 rounded-full transition-colors duration-200">Save Expense</button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ExpenseModal;
