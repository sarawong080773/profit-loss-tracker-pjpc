import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Trash2, Calendar, FileText, Upload, FileDown, Settings } from 'lucide-react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ProfitLossSummary from './components/ProfitLossSummary';
import CSVImport from './components/CSVImport';
import PeriodView from './components/PeriodView';
import PDFTemplate from './components/PDFTemplate';
import CategoryManager from './components/CategoryManager';
import { Transaction, ViewMode } from './types';
import { CategoryData } from './types/category';
import { loadTransactions, saveTransactions } from './utils/storage';
import { loadCategories, saveCategories } from './utils/categoryStorage';
import { generatePDF } from './utils/pdfGenerator';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode | 'categories'>('transactions');
  const [showPDFTemplate, setShowPDFTemplate] = useState(false);

  useEffect(() => {
    const loaded = loadTransactions();
    const loadedCategories = loadCategories();
    setTransactions(loaded);
    setCategories(loadedCategories);
  }, []);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const importTransactions = (newTransactions: Transaction[]) => {
    if (newTransactions.length === 0) {
      alert('No valid transactions found in the CSV file.');
      return;
    }

    const duplicateCheck = window.confirm(
      `Found ${newTransactions.length} transactions to import. This will add them to your existing data. Continue?`
    );
    
    if (duplicateCheck) {
      setTransactions(prev => [...newTransactions, ...prev]);
      alert(`Successfully imported ${newTransactions.length} transactions!`);
    }
  };
  const clearAllTransactions = () => {
    if (window.confirm('Are you sure you want to delete ALL transactions? This cannot be undone.')) {
      setTransactions([]);
    }
  };

  const exportToCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvData = transactions.map(t => [
      t.date,
      t.type,
      t.category,
      t.description,
      t.amount.toString()
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pnl-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGeneratePDF = async () => {
    await generatePDF('summary');
  };

  const handleGenerateMonthlyPDF = async (year: number, month: number) => {
    await generatePDF('monthly', { year, month });
  };

  const handleGenerateAnnualPDF = async (year: number) => {
    await generatePDF('annual', { year });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Profit & Loss Tracker</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your income and expenses to monitor your financial performance and make informed business decisions.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode('transactions')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                  viewMode === 'transactions'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                Transactions
              </button>
              <button
                onClick={() => setViewMode('categories')}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                  viewMode === 'categories'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                Categories
              </button>
              <button
                onClick={() => setShowPDFTemplate(!showPDFTemplate)}
                className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
                  showPDFTemplate
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileDown className="w-4 h-4" />
                Reports
              </button>
            </div>
            
            <button
              onClick={exportToCSV}
              disabled={transactions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            
            <button
              onClick={clearAllTransactions}
              disabled={transactions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </header>

        <div className="space-y-8">
          <ProfitLossSummary transactions={transactions} />
          
          {showPDFTemplate ? (
            <PDFTemplate 
              transactions={transactions} 
              onGeneratePDF={handleGeneratePDF}
              onGenerateMonthlyPDF={handleGenerateMonthlyPDF}
              onGenerateAnnualPDF={handleGenerateAnnualPDF}
            />
          ) : viewMode === 'categories' ? (
            <CategoryManager
              categories={categories}
              onUpdateCategories={setCategories}
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="space-y-8">
                <TransactionForm 
                  onAddTransaction={addTransaction} 
                  categories={categories}
                  onSwitchToCategories={() => setViewMode('categories')}
                />
                <CSVImport onImportTransactions={importTransactions} />
              </div>
              <div className="xl:col-span-1">
                <TransactionList 
                  transactions={transactions} 
                  onDeleteTransaction={deleteTransaction} 
                />
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-500">
            Built for professional financial tracking and business management • {transactions.length} total transactions
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;