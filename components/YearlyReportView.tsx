
import React, { useMemo } from 'react';
import { Expense, Income } from '../types';
import { formatCurrency } from '../utils/helpers';
import GlassCard from './shared/GlassCard';

interface YearlyReportViewProps {
  year: number;
  expenses: Expense[];
  income: Income[];
  onBack: () => void;
}

const YearlyReportView: React.FC<YearlyReportViewProps> = ({ year, expenses, income, onBack }) => {

  const yearlyData = useMemo(() => {
    let yearlyIncome = 0;
    let yearlyExpenses = 0;
    const monthlyTotals = Array(12).fill(0);

    expenses.forEach(exp => {
      const date = new Date(exp.date);
      if (date.getFullYear() === year) {
        yearlyExpenses += exp.amount;
        monthlyTotals[date.getMonth()] += exp.amount;
      }
    });

    income.forEach(inc => {
      const date = new Date(inc.date);
      if (date.getFullYear() === year) {
        yearlyIncome += inc.amount;
      }
    });
    
    return { yearlyIncome, yearlyExpenses, monthlyTotals };
  }, [year, expenses, income]);
  
  const savings = yearlyData.yearlyIncome - yearlyData.yearlyExpenses;
  const maxMonthly = Math.max(...yearlyData.monthlyTotals) || 1;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 text-light-text-secondary dark:text-dark-text-secondary">
      <header className="flex justify-between items-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary tracking-tight">
          Yearly Report: {year}
        </h1>
        <button onClick={onBack} className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-full transition-colors duration-200">
          Back to Monthly
        </button>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-2">Total Income</h2>
          <p className="text-4xl font-bold text-green-400">{formatCurrency(yearlyData.yearlyIncome)}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-2">Total Expenses</h2>
          <p className="text-4xl font-bold text-red-400">{formatCurrency(yearlyData.yearlyExpenses)}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-2">Total Savings</h2>
          <p className={`text-4xl font-bold ${savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(savings)}</p>
        </GlassCard>
      </div>
      
      <GlassCard className="p-6 mt-6">
        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">Monthly Spending</h3>
        <div className="h-64 w-full flex justify-around items-end gap-2 p-4 bg-light-bg-tertiary/20 dark:bg-dark-bg-tertiary/20 rounded-xl">
          {yearlyData.monthlyTotals.map((total, index) => (
            <div key={index} className="flex flex-col items-center justify-end w-full h-full">
              <div
                className="transition-all duration-500 w-1/2 md:w-3/5 bg-teal-600 rounded-t-md"
                style={{ height: `${(total / maxMonthly) * 100}%` }}
                title={`${months[index]}: ${formatCurrency(total)}`}
              ></div>
              <span className="text-xs text-light-text-tertiary dark:text-dark-text-tertiary mt-2">{months[index]}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <footer className="text-center text-light-text-tertiary dark:text-dark-text-tertiary text-sm mt-8">
        © 2025 Made By Anas Sba3
      </footer>
    </div>
  );
};

export default YearlyReportView;
