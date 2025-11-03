
import React, { useMemo } from 'react';
import { Expense, Categories } from '../../types';
import { formatCurrency, getWeekRange } from '../../utils/helpers';
import GlassCard from '../shared/GlassCard';

interface WeeklySummaryCardProps {
  expenses: Expense[];
  categories: Categories;
}

const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({ expenses, categories }) => {

  const weeklyData = useMemo(() => {
    const today = new Date();
    const { start, end } = getWeekRange(today);
    const weeklyExpenses = expenses.filter(exp => exp.date >= start && exp.date <= end);
    const total = weeklyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    let topCategory = '--';
    if (weeklyExpenses.length > 0) {
      const categoryTotals = weeklyExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {} as { [key: string]: number });
      const topCategoryKey = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
      topCategory = categories[topCategoryKey]?.label || 'Other';
    }

    return { total, topCategory };
  }, [expenses, categories]);

  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
        This Week's Summary
      </h2>
      <div className="space-y-2">
        <div>
          <h3 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary">TOTAL SPENT (Mon-Sun)</h3>
          <p className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary">{formatCurrency(weeklyData.total)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary">TOP CATEGORY (This Week)</h3>
          <p className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">{weeklyData.topCategory}</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default WeeklySummaryCard;
