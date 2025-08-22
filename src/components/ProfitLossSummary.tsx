import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Transaction } from '../types';

interface ProfitLossSummaryProps {
  transactions: Transaction[];
}

export default function ProfitLossSummary({ transactions }: ProfitLossSummaryProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfitLoss = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-500 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-emerald-600">Total Income</span>
        </div>
        <div className="text-3xl font-bold text-emerald-700">
          {formatCurrency(totalIncome)}
        </div>
        <div className="text-sm text-emerald-600 mt-2">
          {transactions.filter(t => t.type === 'income').length} transactions
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-red-500 rounded-lg">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-red-600">Total Expenses</span>
        </div>
        <div className="text-3xl font-bold text-red-700">
          {formatCurrency(totalExpenses)}
        </div>
        <div className="text-sm text-red-600 mt-2">
          {transactions.filter(t => t.type === 'expense').length} transactions
        </div>
      </div>

      <div className={`bg-gradient-to-br rounded-xl p-6 border ${
        netProfitLoss >= 0 
          ? 'from-blue-50 to-blue-100 border-blue-200' 
          : 'from-orange-50 to-orange-100 border-orange-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${
            netProfitLoss >= 0 ? 'bg-blue-500' : 'bg-orange-500'
          }`}>
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <span className={`text-sm font-medium ${
            netProfitLoss >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            Net {netProfitLoss >= 0 ? 'Profit' : 'Loss'}
          </span>
        </div>
        <div className={`text-3xl font-bold ${
          netProfitLoss >= 0 ? 'text-blue-700' : 'text-orange-700'
        }`}>
          {formatCurrency(Math.abs(netProfitLoss))}
        </div>
        <div className={`text-sm mt-2 ${
          netProfitLoss >= 0 ? 'text-blue-600' : 'text-orange-600'
        }`}>
          {netProfitLoss >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
        </div>
      </div>
    </div>
  );
}