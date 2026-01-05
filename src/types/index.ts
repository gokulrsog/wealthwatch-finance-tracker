export interface Transaction {
  id: string;
  amount: number;
  category: string;
  subcategory?: string;
  type: 'income' | 'expense';
  date: string;
  description: string;
  tags?: string[];
  recurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface Debt {
  id: string;
  lenderName: string;
  amount: number;
  dueDate: string;
  interestRate?: number;
  description: string;
  minimumPayment?: number;
  currentBalance?: number;
  status: 'active' | 'paid' | 'overdue';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
  alertThreshold?: number;
  color?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'emergency' | 'investment' | 'purchase' | 'travel' | 'other';
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
}

export interface FinancialHealth {
  score: number;
  factors: {
    savingsRate: number;
    debtToIncome: number;
    expenseStability: number;
    emergencyFund: number;
    diversification: number;
  };
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  monthlyAverage: number;
}

export interface CashFlowData {
  date: string;
  income: number;
  expenses: number;
  balance: number;
  netFlow: number;
}

export interface CategoryInsight {
  category: string;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
  trend: number;
  budgetUsage?: number;
  topSubcategories: Array<{
    name: string;
    amount: number;
    percentage: number;
  }>;
}