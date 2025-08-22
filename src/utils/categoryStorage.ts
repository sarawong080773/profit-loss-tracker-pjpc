import { CategoryData } from '../types/category';

const STORAGE_KEY = 'pnl-categories';

// Default categories to populate on first load
const defaultCategories: CategoryData[] = [
  // Income Categories
  {
    id: 'income-salary',
    name: 'Salary',
    type: 'income',
    color: '#10B981',
    icon: 'Briefcase',
    description: 'Regular employment income',
    order: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'income-freelance',
    name: 'Freelance',
    type: 'income',
    color: '#3B82F6',
    icon: 'Laptop',
    description: 'Freelance and contract work',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'income-business',
    name: 'Business Revenue',
    type: 'income',
    color: '#8B5CF6',
    icon: 'DollarSign',
    description: 'Business and entrepreneurial income',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'income-investment',
    name: 'Investment Returns',
    type: 'income',
    color: '#06B6D4',
    icon: 'TrendingUp',
    description: 'Returns from investments and dividends',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Expense Categories
  {
    id: 'expense-office',
    name: 'Office Supplies',
    type: 'expense',
    color: '#EF4444',
    icon: 'Briefcase',
    description: 'Office equipment and supplies',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-marketing',
    name: 'Marketing',
    type: 'expense',
    color: '#F59E0B',
    icon: 'Target',
    description: 'Marketing and advertising expenses',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-travel',
    name: 'Travel',
    type: 'expense',
    color: '#EC4899',
    icon: 'Plane',
    description: 'Business travel and transportation',
    order: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-meals',
    name: 'Meals & Entertainment',
    type: 'expense',
    color: '#84CC16',
    icon: 'Utensils',
    description: 'Business meals and entertainment',
    order: 7,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'expense-software',
    name: 'Software & Subscriptions',
    type: 'expense',
    color: '#6366F1',
    icon: 'Laptop',
    description: 'Software licenses and subscriptions',
    order: 8,
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