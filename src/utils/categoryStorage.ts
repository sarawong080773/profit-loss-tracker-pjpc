import { CategoryData } from '../types/category';

const STORAGE_KEY = 'pnl-categories';

// Default categories to populate on first load
const defaultCategories: CategoryData[] = [
  // Income Categories
  {
    id: 'income-salary',
    name: 'Sales Revenue',
    type: 'income',
    color: '#10B981',
    icon: 'DollarSign',
    description: 'Revenue from product and service sales',
    order: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'income-consulting',
    name: 'Consulting Revenue',
    type: 'income',
    color: '#3B82F6',
    icon: 'Briefcase',
    description: 'Revenue from consulting and professional services',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'income-subscription',
    name: 'Subscription Revenue',
    type: 'income',
    color: '#8B5CF6',
    icon: 'Zap',
    description: 'Recurring subscription and membership revenue',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'income-licensing',
    name: 'Licensing & Royalties',
    type: 'income',
    color: '#06B6D4',
    icon: 'Shield',
    description: 'Revenue from licensing agreements and royalties',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'income-interest',
    name: 'Interest Income',
    type: 'income',
    color: '#F59E0B',
    icon: 'TrendingUp',
    description: 'Interest earned on investments and deposits',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Expense Categories
  {
    id: 'expense-salaries',
    name: 'Salaries & Wages',
    type: 'expense',
    color: '#EF4444',
    icon: 'Briefcase',
    description: 'Employee salaries, wages, and contractor payments',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-benefits',
    name: 'Employee Benefits',
    type: 'expense',
    color: '#84CC16',
    icon: 'Heart',
    description: 'Health insurance, retirement, and other employee benefits',
    order: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-rent',
    name: 'Rent & Utilities',
    type: 'expense',
    color: '#8B5CF6',
    icon: 'Home',
    description: 'Office rent, utilities, and facility costs',
    order: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-marketing',
    name: 'Marketing & Advertising',
    type: 'expense',
    color: '#F59E0B',
    icon: 'Target',
    description: 'Marketing campaigns, advertising, and promotional expenses',
    order: 8,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-software',
    name: 'Software & Technology',
    type: 'expense',
    color: '#6366F1',
    icon: 'Laptop',
    description: 'Software licenses, SaaS subscriptions, and technology costs',
    order: 9,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-office',
    name: 'Office Supplies',
    type: 'expense',
    color: '#EC4899',
    icon: 'Folder',
    description: 'Office supplies, equipment, and materials',
    order: 10,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-travel',
    name: 'Travel & Transportation',
    type: 'expense',
    color: '#06B6D4',
    icon: 'Plane',
    description: 'Business travel, transportation, and related expenses',
    order: 11,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-professional',
    name: 'Professional Services',
    type: 'expense',
    color: '#10B981',
    icon: 'Shield',
    description: 'Legal, accounting, consulting, and other professional fees',
    order: 12,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-insurance',
    name: 'Insurance',
    type: 'expense',
    color: '#F97316',
    icon: 'Shield',
    description: 'Business insurance premiums and coverage',
    order: 13,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-depreciation',
    name: 'Depreciation',
    type: 'expense',
    color: '#6B7280',
    icon: 'TrendingDown',
    description: 'Depreciation of equipment and assets',
    order: 14,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-interest',
    name: 'Interest Expense',
    type: 'expense',
    color: '#DC2626',
    icon: 'DollarSign',
    description: 'Interest paid on loans and credit facilities',
    order: 15,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-taxes',
    name: 'Taxes & Fees',
    type: 'expense',
    color: '#7C2D12',
    icon: 'FileText',
    description: 'Business taxes, licenses, and regulatory fees',
    order: 16,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const loadCategories = (): CategoryData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // First time loading, save default categories
      saveCategories(defaultCategories);
      return defaultCategories;
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    return defaultCategories;
  }
};

export const saveCategories = (categories: CategoryData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};