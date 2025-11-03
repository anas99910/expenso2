
import React from 'react';
import { Expense } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import GlassCard from '../shared/GlassCard';

interface SummaryCardProps {
  expenses: Expense[];
  budget: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ expenses, budget }) => {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const percentage = budget > 0 ? Math.min((total / budget) * 100, 100) : 0;
  let progressBarColor = 'bg-blue-600';
  if (percentage > 90) progressBarColor = 'bg-red-600';
  else if (percentage > 70) progressBarColor = 'bg-yellow-500';

  const remaining = budget - total;

  return (
    <GlassCard className="p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-2">
            Total This Month
          </h2>
          <div className={`text-4xl md:text-5xl font-bold ${total > 0 ? 'text-red-500' : 'text-light-text-primary dark:text-dark-text-primary'}`}>
            {total > 0 ? `- ${formatCurrency(total)}` : formatCurrency(total)}
          </div>
        </div>
        <div className="sm:text-right">
          <h2 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary mb-2">
            Budget
          </h2>
          <div className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">
            {budget > 0 ? formatCurrency(budget) : 'Not Set'}
          </div>
        </div>
      </div>
      {/* Budget Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-light-bg-tertiary/30 dark:bg-dark-bg-tertiary/30 rounded-full h-2.5">
          <div 
            className={`${progressBarColor} h-2.5 rounded-full transition-all duration-500`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
        {budget > 0 ? (
          <p className={`text-base font-medium text-right mt-1 ${remaining >= 0 ? 'text-blue-400' : 'text-red-500'}`}>
            {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over budget`}
          </p>
        ) : (
          <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary text-right mt-1">
            Set a budget to track spending.
          </p>
        )}
      </div>
    </GlassCard>
  );
};

export default SummaryCard;
