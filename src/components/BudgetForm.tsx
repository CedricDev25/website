import React, { useState } from 'react';
import { Plus, Trash2, Wallet, CircleDollarSign } from 'lucide-react';
import { BudgetData, CATEGORIES, Expense } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BudgetFormProps {
  onAnalyze: (data: BudgetData) => void;
  isLoading: boolean;
}

export default function BudgetForm({ onAnalyze, isLoading }: BudgetFormProps) {
  const [income, setIncome] = useState<number>(3000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: 'Housing', amount: 1000 },
    { id: '2', category: 'Food', amount: 400 },
    { id: '3', category: 'Transport', amount: 200 },
  ]);

  const addExpense = () => {
    const newExpense: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      category: 'Other',
      amount: 0,
    };
    setExpenses([...expenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const handleAnalyze = () => {
    onAnalyze({ income, expenses });
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-50 rounded-2xl text-green-600">
          <Wallet size={24} />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your Budget</h2>
          <p className="text-sm text-gray-500">Plan your monthly flow</p>
        </div>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Monthly Income</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-8 pr-4 focus:ring-2 focus:ring-green-500 transition-all font-medium text-gray-900"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expenses</label>
            <button
              onClick={addExpense}
              className="flex items-center gap-1 text-xs font-bold text-green-600 hover:bg-green-50 px-2 py-1 rounded-lg transition-colors"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <AnimatePresence initial={false}>
            {expenses.map((expense) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 group"
              >
                <select
                  value={expense.category}
                  onChange={(e) => updateExpense(expense.id, { category: e.target.value })}
                  className="flex-1 bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-green-500 text-sm font-medium text-gray-700"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    value={expense.amount}
                    onChange={(e) => updateExpense(expense.id, { amount: Number(e.target.value) })}
                    className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-7 pr-3 focus:ring-2 focus:ring-green-500 text-sm font-medium text-gray-900 text-right"
                    placeholder="0"
                  />
                </div>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="p-3 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-500 font-medium">Total Expenses</span>
          <span className="text-xl font-bold font-mono text-gray-900">${totalExpenses.toLocaleString()}</span>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full bg-gray-900 text-white rounded-2xl py-5 px-6 font-bold flex items-center justify-center gap-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <>
              <CircleDollarSign size={20} />
              <span>Analyze with Gemini</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
