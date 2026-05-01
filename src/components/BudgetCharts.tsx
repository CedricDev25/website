import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Expense } from '../types';

interface BudgetChartsProps {
  expenses: Expense[];
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#71717A'];

export default function BudgetCharts({ expenses }: BudgetChartsProps) {
  const data = expenses
    .filter(e => e.amount > 0)
    .map(e => ({
      name: e.category,
      value: e.amount
    }));

  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center">
        <div>
          <p className="text-gray-400 font-medium">Enter some expenses to see the breakdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Spending Mix</h3>
        <p className="text-sm text-gray-500">Visualizing your expense allocation</p>
      </div>
      
      <div className="flex-1 relative min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              itemStyle={{ fontWeight: 600 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-xs font-medium text-gray-600 truncate">{item.name}</span>
            <span className="text-xs font-bold text-gray-900 ml-auto">${item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
