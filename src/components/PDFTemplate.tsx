import React from 'react';
import { FileDown, Building2, Calendar, DollarSign, Download, BarChart3 } from 'lucide-react';
import { Transaction } from '../types';

interface PDFTemplateProps {
  transactions: Transaction[];
  onGeneratePDF: () => void;
  onGenerateMonthlyPDF: (year: number, month: number) => void;
  onGenerateAnnualPDF: (year: number) => void;
}

export default function PDFTemplate({ transactions, onGeneratePDF, onGenerateMonthlyPDF, onGenerateAnnualPDF }: PDFTemplateProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

  // Group transactions by category
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Get date range
  const dates = transactions.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
  const startDate = dates.length > 0 ? dates[0].toLocaleDateString('en-US') : 'N/A';
  const endDate = dates.length > 0 ? dates[dates.length - 1].toLocaleDateString('en-US') : 'N/A';

  // Get available years and months for report generation
  const availableYears = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort((a, b) => b - a);
  const getAvailableMonths = (year: number) => {
    return [...new Set(
      transactions
        .filter(t => new Date(t.date).getFullYear() === year)
        .map(t => new Date(t.date).getMonth())
    )].sort((a, b) => b - a);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileDown className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Financial Reports</h2>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Report Generation Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Summary Report */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileDown className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-800">Summary Report</h3>
            </div>
            <p className="text-blue-700 text-sm mb-4">
              Complete overview of all transactions and categories
            </p>
            <button
              onClick={onGeneratePDF}
              disabled={transactions.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Generate Summary PDF
            </button>
          </div>

          {/* Monthly Reports */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-800">Monthly Reports</h3>
            </div>
            <p className="text-green-700 text-sm mb-4">
              Detailed breakdown by month with all transactions
            </p>
            <div className="space-y-3">
              {availableYears.length === 0 ? (
                <p className="text-green-600 text-sm">No data available</p>
              ) : (
                availableYears.slice(0, 2).map(year => (
                  <div key={year} className="space-y-2">
                    <h4 className="font-medium text-green-800">{year}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableMonths(year).slice(0, 4).map(monthIndex => (
                        <button
                          key={monthIndex}
                          onClick={() => onGenerateMonthlyPDF(year, monthIndex + 1)}
                          className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded hover:bg-green-300 transition-colors"
                        >
                          {monthNames[monthIndex].slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Annual Reports */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-800">Annual Reports</h3>
            </div>
            <p className="text-purple-700 text-sm mb-4">
              Year-end summary with monthly breakdowns
            </p>
            <div className="space-y-2">
              {availableYears.length === 0 ? (
                <p className="text-purple-600 text-sm">No data available</p>
              ) : (
                availableYears.map(year => (
                  <button
                    key={year}
                    onClick={() => onGenerateAnnualPDF(year)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-200 text-purple-800 rounded-lg hover:bg-purple-300 transition-colors text-sm"
                  >
                    <BarChart3 className="w-3 h-3" />
                    {year} Annual Report
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* PDF Preview Template */}
        <div id="pdf-template" className="p-8 bg-white">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">PROFIT & LOSS STATEMENT</h1>
            </div>
            <div className="text-gray-600">
              <p className="text-lg font-medium">Financial Performance Report</p>
              <p>Period: {startDate} - {endDate}</p>
              <p>Generated on: {currentDate}</p>
            </div>
          </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Executive Summary
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-emerald-50 rounded-lg border">
              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</div>
              <div className="text-sm text-emerald-700 font-medium">Total Revenue</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
              <div className="text-sm text-red-700 font-medium">Total Expenses</div>
            </div>
            <div className={`text-center p-4 rounded-lg border ${
              netProfitLoss >= 0 ? 'bg-blue-50' : 'bg-orange-50'
            }`}>
              <div className={`text-2xl font-bold ${
                netProfitLoss >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {formatCurrency(Math.abs(netProfitLoss))}
              </div>
              <div className={`text-sm font-medium ${
                netProfitLoss >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                Net {netProfitLoss >= 0 ? 'Profit' : 'Loss'}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        {/* Two-Column Layout: Revenue & Expenses */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Revenue Section (Left Column) */}
          <div>
            <h2 className="text-xl font-bold text-emerald-800 mb-4 pb-2 border-b-2 border-emerald-200">
              REVENUE
            </h2>
            <div className="space-y-3">
              {Object.entries(incomeByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">{category}</span>
                  <span className="text-right font-semibold text-emerald-600">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
              {Object.keys(incomeByCategory).length === 0 && (
                <div className="text-center py-4 text-gray-500">No revenue recorded</div>
              )}
              <div className="border-t-2 border-emerald-300 pt-3 mt-4">
                <div className="flex justify-between items-center bg-emerald-50 p-3 rounded">
                  <span className="text-lg font-bold text-emerald-800">TOTAL REVENUE</span>
                  <span className="text-lg font-bold text-emerald-800">
                    {formatCurrency(totalIncome)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Section (Right Column) */}
          <div>
            <h2 className="text-xl font-bold text-red-800 mb-4 pb-2 border-b-2 border-red-200">
              EXPENSES
            </h2>
            <div className="space-y-3">
              {Object.entries(expensesByCategory).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">{category}</span>
                  <span className="text-right font-semibold text-red-600">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
              {Object.keys(expensesByCategory).length === 0 && (
                <div className="text-center py-4 text-gray-500">No expenses recorded</div>
              )}
              <div className="border-t-2 border-red-300 pt-3 mt-4">
                <div className="flex justify-between items-center bg-red-50 p-3 rounded">
                  <span className="text-lg font-bold text-red-800">TOTAL EXPENSES</span>
                  <span className="text-lg font-bold text-red-800">
                    {formatCurrency(totalExpenses)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* P&L Summary Section (Bottom) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center pb-2 border-b-2 border-gray-300">
            PROFIT & LOSS SUMMARY
          </h2>
          <div className={`border-2 rounded-lg p-6 ${
            netProfitLoss >= 0 ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
          }`}>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-300">
                <span className="text-xl font-semibold text-gray-700">Total Revenue</span>
                <span className="text-xl font-bold text-emerald-600">
                  {formatCurrency(totalIncome)}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-300">
                <span className="text-xl font-semibold text-gray-700">Total Expenses</span>
                <span className="text-xl font-bold text-red-600">
                  ({formatCurrency(totalExpenses)})
                </span>
              </div>
              <div className="border-t-2 border-gray-400 pt-4">
                <div className={`flex justify-between items-center p-4 rounded-lg ${
                  netProfitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className="text-2xl font-bold text-gray-800">
                    NET {netProfitLoss >= 0 ? 'PROFIT' : 'LOSS'}
                  </span>
                  <span className={`text-2xl font-bold ${
                    netProfitLoss >= 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {netProfitLoss >= 0 ? '' : '('}{formatCurrency(Math.abs(netProfitLoss))}{netProfitLoss >= 0 ? '' : ')'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Key Metrics Row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-300">
              <div className="text-center">
                <div className="text-sm text-gray-600 font-medium">Profit Margin</div>
                <div className="text-lg font-bold text-gray-800">
                  {totalIncome > 0 ? ((netProfitLoss / totalIncome) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 font-medium">Expense Ratio</div>
                <div className="text-lg font-bold text-gray-800">
                  {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : '0.0'}%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 font-medium">Total Transactions</div>
                <div className="text-lg font-bold text-gray-800">{transactions.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-4">
          <p>This report was generated automatically from your financial data.</p>
          <p>Report generated on {currentDate}</p>
        </div>
      </div>
      </div>

      {transactions.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Add some transactions to generate your P&L report</p>
        </div>
      )}
    </div>
  );
}