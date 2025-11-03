
import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { Expense, Categories } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import GlassCard from '../shared/GlassCard';

interface BreakdownCardProps {
  expenses: Expense[];
  categories: Categories;
}

type ChartType = 'bar' | 'pie';

const BreakdownCard: React.FC<BreakdownCardProps> = ({ expenses, categories }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  const categoryTotals = useMemo(() => {
    const totals = Object.keys(categories).reduce((acc, key) => {
        acc[key] = { name: categories[key].label, total: 0 };
        return acc;
    }, {} as { [key: string]: { name: string, total: number } });

    expenses.forEach(expense => {
      if (totals[expense.category]) {
        totals[expense.category].total += expense.amount;
      } else if (totals['other']) { // Fallback to 'other' if category was deleted
        totals['other'].total += expense.amount;
      }
    });
    
    return Object.values(totals).filter(c => c.total > 0);
  }, [expenses, categories]);

  const PIE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-dark-bg-tertiary text-white rounded-md shadow-lg">
          <p className="font-bold">{label}</p>
          <p>{`Total: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">Monthly Breakdown</h3>
        <div className="flex gap-2">
            <button onClick={() => setChartType('bar')} className={`p-2 rounded-lg glass-input ${chartType === 'bar' ? 'bg-blue-600/30 text-blue-300' : ''}`} title="Bar Chart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </button>
            <button onClick={() => setChartType('pie')} className={`p-2 rounded-lg glass-input ${chartType === 'pie' ? 'bg-blue-600/30 text-blue-300' : ''}`} title="Pie Chart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            </button>
        </div>
      </div>
      <div className="h-56 w-full p-2 bg-light-bg-tertiary/20 dark:bg-dark-bg-tertiary/20 rounded-xl">
        {categoryTotals.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={categoryTotals} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)' }} fontSize={12} interval={0} angle={-20} textAnchor="end" height={50} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.1)' }} />
                <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <PieChart>
                <Pie data={categoryTotals} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {categoryTotals.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-light-text-tertiary dark:text-dark-text-tertiary">No data for this month</div>
        )}
      </div>
    </GlassCard>
  );
};

export default BreakdownCard;
