export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: string;
  category: string;
  description: string;
  date: string;
}

export interface PeriodSummary {
  period: string;
  income: number;
  expenses: number;
  netProfitLoss: number;
  transactionCount: number;
}

export type ViewMode = 'transactions' | 'monthly' | 'annual';