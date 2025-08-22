import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (): Promise<void> => {
  try {
    const element = document.getElementById('pdf-template');
    if (!element) {
      throw new Error('PDF template element not found');
    }

    // Configure html2canvas for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `profit-loss-statement-${currentDate}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  }
};

const generateMonthlyReportElement = async (year: number, month: number): Promise<HTMLElement> => {
  // Get transactions from localStorage
  const transactions = JSON.parse(localStorage.getItem('pnl-transactions') || '[]');
  const monthTransactions = transactions.filter((t: any) => {
    const date = new Date(t.date);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  });

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long' });
  const totalIncome = monthTransactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalExpenses = monthTransactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);
  const netProfitLoss = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Create temporary element
  const element = document.createElement('div');
  element.className = 'p-8 bg-white';
  element.innerHTML = `
    <div class="text-center mb-8 border-b-2 border-gray-200 pb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">MONTHLY PROFIT & LOSS REPORT</h1>
      <div class="text-gray-600">
        <p class="text-xl font-medium">${monthName} ${year}</p>
        <p>Generated on: ${new Date().toLocaleDateString('en-US')}</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="text-center p-4 bg-emerald-50 rounded-lg border">
        <div class="text-2xl font-bold text-emerald-600">${formatCurrency(totalIncome)}</div>
        <div class="text-sm text-emerald-700 font-medium">Total Income</div>
      </div>
      <div class="text-center p-4 bg-red-50 rounded-lg border">
        <div class="text-2xl font-bold text-red-600">${formatCurrency(totalExpenses)}</div>
        <div class="text-sm text-red-700 font-medium">Total Expenses</div>
      </div>
      <div class="text-center p-4 ${netProfitLoss >= 0 ? 'bg-blue-50' : 'bg-orange-50'} rounded-lg border">
        <div class="text-2xl font-bold ${netProfitLoss >= 0 ? 'text-blue-600' : 'text-orange-600'}">${formatCurrency(Math.abs(netProfitLoss))}</div>
        <div class="text-sm font-medium ${netProfitLoss >= 0 ? 'text-blue-700' : 'text-orange-700'}">Net ${netProfitLoss >= 0 ? 'Profit' : 'Loss'}</div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Transaction Details</h2>
      <div class="space-y-3">
        ${monthTransactions.map((t: any) => `
          <div class="flex justify-between items-center p-3 border rounded-lg ${t.type === 'income' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}">
            <div>
              <div class="font-medium">${t.description}</div>
              <div class="text-sm text-gray-600">${t.category} • ${new Date(t.date).toLocaleDateString('en-US')}</div>
            </div>
            <div class="text-lg font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}">
              ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(element);
  return element;
};

const generateAnnualReportElement = async (year: number): Promise<HTMLElement> => {
  // Get transactions from localStorage
  const transactions = JSON.parse(localStorage.getItem('pnl-transactions') || '[]');
  const yearTransactions = transactions.filter((t: any) => new Date(t.date).getFullYear() === year);

  // Group by months
  const monthlyData: { [key: number]: { income: number; expenses: number; transactions: any[] } } = {};
  
  for (let i = 0; i < 12; i++) {
    monthlyData[i] = { income: 0, expenses: 0, transactions: [] };
  }

  yearTransactions.forEach((t: any) => {
    const month = new Date(t.date).getMonth();
    monthlyData[month].transactions.push(t);
    if (t.type === 'income') {
      monthlyData[month].income += t.amount;
    } else {
      monthlyData[month].expenses += t.amount;
    }
  });

  const totalIncome = yearTransactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalExpenses = yearTransactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);
  const netProfitLoss = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Create temporary element
  const element = document.createElement('div');
  element.className = 'p-8 bg-white';
  element.innerHTML = `
    <div class="text-center mb-8 border-b-2 border-gray-200 pb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">ANNUAL PROFIT & LOSS REPORT</h1>
      <div class="text-gray-600">
        <p class="text-xl font-medium">${year}</p>
        <p>Generated on: ${new Date().toLocaleDateString('en-US')}</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6 mb-8">
      <div class="text-center p-4 bg-emerald-50 rounded-lg border">
        <div class="text-2xl font-bold text-emerald-600">${formatCurrency(totalIncome)}</div>
        <div class="text-sm text-emerald-700 font-medium">Total Income</div>
      </div>
      <div class="text-center p-4 bg-red-50 rounded-lg border">
        <div class="text-2xl font-bold text-red-600">${formatCurrency(totalExpenses)}</div>
        <div class="text-sm text-red-700 font-medium">Total Expenses</div>
      </div>
      <div class="text-center p-4 ${netProfitLoss >= 0 ? 'bg-blue-50' : 'bg-orange-50'} rounded-lg border">
        <div class="text-2xl font-bold ${netProfitLoss >= 0 ? 'text-blue-600' : 'text-orange-600'}">${formatCurrency(Math.abs(netProfitLoss))}</div>
        <div class="text-sm font-medium ${netProfitLoss >= 0 ? 'text-blue-700' : 'text-orange-700'}">Net ${netProfitLoss >= 0 ? 'Profit' : 'Loss'}</div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-xl font-bold text-gray-800 mb-4">Monthly Breakdown</h2>
      <div class="space-y-4">
        ${Object.entries(monthlyData).map(([monthIndex, data]) => {
          const month = parseInt(monthIndex);
          const monthNet = data.income - data.expenses;
          return `
            <div class="border rounded-lg p-4">
              <div class="flex justify-between items-center mb-2">
                <h3 class="text-lg font-semibold">${monthNames[month]}</h3>
                <span class="text-sm text-gray-500">${data.transactions.length} transactions</span>
              </div>
              <div class="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div class="text-sm text-emerald-600">Income</div>
                  <div class="font-bold text-emerald-700">${formatCurrency(data.income)}</div>
                </div>
                <div>
                  <div class="text-sm text-red-600">Expenses</div>
                  <div class="font-bold text-red-700">${formatCurrency(data.expenses)}</div>
                </div>
                <div>
                  <div class="text-sm ${monthNet >= 0 ? 'text-blue-600' : 'text-orange-600'}">Net</div>
                  <div class="font-bold ${monthNet >= 0 ? 'text-blue-700' : 'text-orange-700'}">${formatCurrency(Math.abs(monthNet))}</div>
                </div>
                <div>
                  <div class="text-sm text-gray-600">Margin</div>
                  <div class="font-bold text-gray-700">${data.income > 0 ? ((monthNet / data.income) * 100).toFixed(1) : '0.0'}%</div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(element);
  return element;
};