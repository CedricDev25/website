export interface Expense {
  id: string;
  category: string;
  amount: number;
}

export interface BudgetData {
  income: number;
  expenses: Expense[];
}

export interface AIInsight {
  type: 'warn' | 'good' | 'info';
  text: string;
}

export interface SavingsGoal {
  label: string;
  monthlySaving: number;
  yearsToGoal: number;
}

export interface AIAnalysis {
  savingsRate: number;
  remainingBudget: number;
  biggestSpend: string;
  insights: AIInsight[];
  savingsGoal: SavingsGoal;
}

export const CATEGORIES = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Insurance',
  'Other'
];
