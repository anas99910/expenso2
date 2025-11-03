
import React, { useMemo } from 'react';
import { Expense, Income, Categories } from '../../types';
import { formatCurrency, getDaysInMonth } from '../../utils/helpers';
import GlassCard from '../shared/GlassCard';

interface InsightsCardProps {
  periodExpenses: Expense[];
  periodIncome: Income[];
  categories: Categories;
  currentDate: { year: number; month: number };
}

const InsightsCard: React.FC<InsightsCardProps> = ({ periodExpenses, periodIncome, categories, currentDate }) => {

  const insights = useMemo(() => {
    const totalIncome = periodIncome.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savings = totalIncome - totalExpenses;

    if (periodExpenses.length === 0) {
      return { savings, topCategory: '--', highestExpense: { amount: 0, title: '--' }, avgSpend: 0 };
    }

    const categoryTotals = periodExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as { [key: string]: number });
    
    const topCategoryKey = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
    const topCategory = categories[topCategoryKey]?.label || 'Other';

    const highestExpense = periodExpenses.reduce((max, exp) => exp.amount > max.amount ? exp : max, { amount: 0, title: '--' } as Expense);

    const daysInMonth = getDaysInMonth(currentDate.year, currentDate.month);
    const now = new Date();
    const daysSoFar = (currentDate.year === now.getFullYear() && currentDate.month === now.getMonth()) ? now.getDate() : daysInMonth;
    const avgSpend = totalExpenses / daysSoFar;

    return { savings, topCategory, highestExpense, avgSpend };
  }, [periodExpenses, periodIncome, categories, currentDate]);

  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary mb-4">
        Monthly Insights
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary">MONTHLY SAVINGS</h3>
          <p className={`text-xl font-semibold ${insights.savings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(insights.savings)}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary">TOP CATEGORY</h3>
          <p className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">{insights.topCategory}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary">HIGHEST EXPENSE</h3>
          <p className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">{formatCurrency(insights.highestExpense.amount)}</p>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary truncate">{insights.highestExpense.title}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-light-text-tertiary dark:text-dark-text-tertiary">AVG. DAILY SPEND</h3>
          <p className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">{formatCurrency(insights.avgSpend)}</p>
        </div>
      </div>
    </GlassCard>
  );
};

export default InsightsCard;
