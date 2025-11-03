
import React, { useMemo } from 'react';
import { Expense, Income, Categories, HistoryType, SortOrder, Transaction, DeleteInfo } from '../types';
import { GENERIC_ICON } from '../constants';
import { formatCurrency, formatDate } from '../utils/helpers';
import GlassCard from './shared/GlassCard';

interface HistoryListProps {
  expenses: Expense[];
  income: Income[];
  categories: Categories;
  onEdit: (type: 'expense' | 'income', item: Transaction) => void;
  onDelete: (info: DeleteInfo) => void;
  historyType: HistoryType;
  setHistoryType: (type: HistoryType) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  expenses, income, categories, onEdit, onDelete,
  historyType, setHistoryType, filterCategory, setFilterCategory,
  sortOrder, setSortOrder, searchTerm, setSearchTerm
}) => {

  const filteredAndSortedList = useMemo(() => {
    const expensesWithTag = expenses.map(e => ({ ...e, type: 'expense' as const }));
    const incomeWithTag = income.map(i => ({ ...i, type: 'income' as const }));

    let combinedList: (Expense & { type: 'expense' } | Income & { type: 'income' })[] = [];
    if (historyType === 'expenses') {
      combinedList = expensesWithTag;
    } else if (historyType === 'income') {
      combinedList = incomeWithTag;
    } else {
      combinedList = [...expensesWithTag, ...incomeWithTag];
    }
    
    return combinedList
      .filter(item => {
        // Fix: Add a type guard to ensure `item.category` is accessed only when `item` is an expense.
        if (item.type === 'expense' && historyType === 'expenses' && filterCategory !== 'all' && item.category !== filterCategory) return false;
        
        const lowerSearchTerm = searchTerm.toLowerCase();
        if (lowerSearchTerm === '') return true;

        const titleMatch = item.title.toLowerCase().includes(lowerSearchTerm);
        const tagMatch = item.type === 'expense' && item.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm));

        return titleMatch || tagMatch;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'date-asc': return a.date.localeCompare(b.date);
          case 'amount-desc': return b.amount - a.amount;
          case 'amount-asc': return a.amount - b.amount;
          case 'date-desc':
          default:
            return b.date.localeCompare(a.date);
        }
      });
  }, [expenses, income, historyType, filterCategory, sortOrder, searchTerm]);

  return (
    <section>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">History</h2>
            <select value={historyType} onChange={e => setHistoryType(e.target.value as HistoryType)} className="glass-input text-sm rounded-lg py-1 px-2">
                <option value="expenses">Expenses</option>
                <option value="income">Income</option>
                <option value="all">All</option>
            </select>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="glass-input text-sm rounded-lg py-1 px-2" disabled={historyType !== 'expenses'}>
                <option value="all">All Categories</option>
                {Object.keys(categories).map(key => <option key={key} value={key}>{categories[key].label}</option>)}
            </select>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value as SortOrder)} className="glass-input text-sm rounded-lg py-1 px-2">
                <option value="date-desc">Sort by Date (Newest)</option>
                <option value="date-asc">Sort by Date (Oldest)</option>
                <option value="amount-desc">Sort by Amount (High)</option>
                <option value="amount-asc">Sort by Amount (Low)</option>
            </select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="search" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="glass-input text-sm rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto" 
              placeholder="Search or #tag..." 
            />
            {/* Export buttons would go here, logic handled in parent */}
        </div>
      </div>
      
      {/* List */}
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <div className="space-y-4 pr-1">
          {filteredAndSortedList.length === 0 ? (
            <GlassCard className="p-6 text-center text-light-text-tertiary dark:text-dark-text-tertiary">
              <p className="text-sm">No transactions match your filters.</p>
            </GlassCard>
          ) : (
            filteredAndSortedList.map(item => <TransactionItem key={item.id} item={item} categories={categories} onEdit={onEdit} onDelete={onDelete} />)
          )}
        </div>
      </div>
    </section>
  );
};

// Sub-component for a single transaction item
interface TransactionItemProps {
  item: (Expense & { type: 'expense' }) | (Income & { type: 'income' });
  categories: Categories;
  onEdit: (type: 'expense' | 'income', item: Transaction) => void;
  onDelete: (info: DeleteInfo) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ item, categories, onEdit, onDelete }) => {
  const isExpense = item.type === 'expense';
  const categoryIcon = isExpense ? (categories[item.category]?.icon || GENERIC_ICON) : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" /></svg>`;

  return (
    <GlassCard className="p-4 transition-all duration-200 hover:border-light-border-primary/20 dark:hover:border-dark-border-primary/20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div 
          className="flex items-center gap-4 mb-2 sm:mb-0 cursor-pointer" 
          onClick={() => onEdit(item.type, item)}
        >
          <div className={`p-3 bg-light-bg-tertiary/60 dark:bg-dark-bg-tertiary/60 rounded-xl ${isExpense ? 'text-light-text-primary dark:text-dark-text-primary' : 'text-green-400'}`} dangerouslySetInnerHTML={{ __html: categoryIcon }} />
          <div>
            <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{item.title}</p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{formatDate(item.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <p className={`font-semibold text-lg ${isExpense ? 'text-red-500' : 'text-green-400'}`}>
            {isExpense ? '-' : '+'} {formatCurrency(item.amount)}
          </p>
          <div className="flex gap-2">
            <button className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-blue-400 transition-colors" onClick={() => onEdit(item.type, item)} title={`Edit ${isExpense ? 'Expense' : 'Income'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button className="p-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-red-400 transition-colors" onClick={() => onDelete({ id: item.id, type: item.type })} title={`Delete ${isExpense ? 'Expense' : 'Income'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
      {isExpense && item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 pl-0 sm:pl-16">
          {item.tags.map(tag => <span key={tag} className="text-xs bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-full">{tag}</span>)}
        </div>
      )}
    </GlassCard>
  );
};

export default HistoryList;