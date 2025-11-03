
import React, { useMemo, useState } from 'react';
import { Expense, Income, Categories, HistoryType, SortOrder, View, ModalType, DeleteInfo } from '../types';
import Header from './Header';
import SummaryCard from './cards/SummaryCard';
import BreakdownCard from './cards/BreakdownCard';
import HistoryList from './HistoryList';
import InsightsCard from './cards/InsightsCard';
import WeeklySummaryCard from './cards/WeeklySummaryCard';

interface MainViewProps {
  expenses: Expense[];
  income: Income[];
  categories: Categories;
  budget: number;
  currentDate: { year: number; month: number };
  theme: 'light' | 'dark';
  setCurrentDate: React.Dispatch<React.SetStateAction<{ year: number; month: number }>>;
  setView: React.Dispatch<React.SetStateAction<View>>;
  onLogout: () => void;
  onOpenModal: (modal: ModalType, transaction?: Expense | Income | null) => void;
  onDelete: (info: DeleteInfo) => void;
}

const MainView: React.FC<MainViewProps> = (props) => {
  const { expenses, income, categories, budget, currentDate, setCurrentDate, setView, onLogout, onOpenModal, onDelete, theme } = props;

  const [historyType, setHistoryType] = useState<HistoryType>('expenses');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('date-desc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const periodData = useMemo(() => {
    const periodExpenses = expenses.filter(expense => {
      const date = new Date(expense.date);
      return date.getFullYear() === currentDate.year && date.getMonth() === currentDate.month;
    });
    const periodIncome = income.filter(inc => {
      const date = new Date(inc.date);
      return date.getFullYear() === currentDate.year && date.getMonth() === currentDate.month;
    });
    return { periodExpenses, periodIncome };
  }, [expenses, income, currentDate]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-light-text-secondary dark:text-dark-text-secondary">
      <Header
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        setView={setView}
        onLogout={onLogout}
        onOpenModal={onOpenModal}
        theme={theme}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <SummaryCard expenses={periodData.periodExpenses} budget={budget} />
          <BreakdownCard expenses={periodData.periodExpenses} categories={categories} />
          <HistoryList
            expenses={periodData.periodExpenses}
            income={periodData.periodIncome}
            categories={categories}
            onEdit={(type, item) => onOpenModal(type === 'expense' ? ModalType.EXPENSE : ModalType.INCOME, item)}
            onDelete={onDelete}
            historyType={historyType}
            setHistoryType={setHistoryType}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          <InsightsCard 
            periodExpenses={periodData.periodExpenses}
            periodIncome={periodData.periodIncome}
            categories={categories}
            currentDate={currentDate}
          />
          <WeeklySummaryCard expenses={expenses} categories={categories} />
          <div className="glass-card p-6">
            <button
                onClick={() => onOpenModal(ModalType.CATEGORY)}
                className="w-full text-center bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            >
                Manage Categories
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-light-text-tertiary dark:text-dark-text-tertiary text-sm mt-8">
        © 2025 Made By Anas Sba3
      </footer>
    </div>
  );
};

export default MainView;
