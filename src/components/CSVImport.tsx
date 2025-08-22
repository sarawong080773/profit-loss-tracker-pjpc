import React, { useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';
import * as XLSX from 'xlsx';

interface CSVImportProps {
  onImportTransactions: (transactions: Transaction[]) => void;
}

export default function CSVImport({ onImportTransactions }: CSVImportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      handleExcelFile(file);
    } else if (fileExtension === 'csv') {
      handleCSVFile(file);
    } else {
      alert('Please select a CSV or Excel file (.csv, .xlsx, .xls)');
    }
  };

  const handleCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const transactions = parseCSV(csv);
        onImportTransactions(transactions);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        alert('Error parsing CSV file. Please check the format and try again.');
        console.error('CSV parsing error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to CSV format for parsing using xlsx built-in method
        const csvData = XLSX.utils.sheet_to_csv(worksheet);
        
        const transactions = parseCSV(csvData);
        onImportTransactions(transactions);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        alert('Error parsing Excel file. Please check the format and try again.');
        console.error('Excel parsing error:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const parseCSV = (csv: string): Transaction[] => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Expected headers: date, type, category, description, amount
    const requiredHeaders = ['date', 'type', 'category', 'description', 'amount'];
    const missingHeaders = requiredHeaders.filter(h => !headers.some(header => header.includes(h)));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const transactions: Transaction[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      
      if (values.length < headers.length) continue;
      
      const dateIndex = headers.findIndex(h => h.includes('date'));
      const typeIndex = headers.findIndex(h => h.includes('type'));
      const categoryIndex = headers.findIndex(h => h.includes('category'));
      const descriptionIndex = headers.findIndex(h => h.includes('description'));
      const amountIndex = headers.findIndex(h => h.includes('amount'));
      
      const date = values[dateIndex];
      const type = values[typeIndex].toLowerCase();
      const category = values[categoryIndex];
      const description = values[descriptionIndex];
      const amount = parseFloat(values[amountIndex]);
      
      // Validate data
      if (!date || !type || !category || !description || isNaN(amount)) {
        continue;
      }
      
      if (type !== 'income' && type !== 'expense') {
        continue;
      }
      
      transactions.push({
        id: crypto.randomUUID(),
        type: type as 'income' | 'expense',
        amount: Math.abs(amount),
        category,
        description,
        date: formatDate(date),
        createdAt: new Date().toISOString()
      });
    }
    
    return transactions;
  };

  const formatDate = (dateStr: string): string => {
    // Try to parse various date formats
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // Try MM/DD/YYYY format
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [month, day, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['Date', 'Type', 'Category', 'Description', 'Amount'],
      ['2024-01-15', 'income', 'Salary', 'Monthly salary payment', '5000'],
      ['2024-01-16', 'expense', 'Office Supplies', 'Printer paper and ink', '150'],
      ['2024-01-20', 'income', 'Freelance', 'Website development project', '2500'],
      ['2024-01-22', 'expense', 'Marketing', 'Google Ads campaign', '300']
    ];

    const csvContent = sampleData
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-pnl-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Upload className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Import Financial Data</h2>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Click to upload CSV or Excel file
            </p>
            <p className="text-sm text-gray-500">
              Supports CSV (.csv) and Excel (.xlsx, .xls) files
            </p>
          </label>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-800 mb-2">File Format Requirements:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Headers: Date, Type, Category, Description, Amount</li>
                <li>• Type must be either "income" or "expense"</li>
                <li>• Date format: YYYY-MM-DD or MM/DD/YYYY</li>
                <li>• Amount should be positive numbers</li>
                <li>• Supports CSV (.csv) and Excel (.xlsx, .xls) formats</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={downloadSampleCSV}
          className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Download Sample Template (CSV)
        </button>
      </div>
    </div>
  );
}