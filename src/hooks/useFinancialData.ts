import { useState, useEffect, useMemo } from 'react';
import { Transaction, Debt, Budget, Goal, FinancialHealth } from '@/types';
import { 
  getTransactions, 
  getDebts, 
  getBudgets, 
  getGoals,
  updateBudget
} from '@/lib/storage';
import { FinancialAnalytics } from '@/lib/analytics';

export function useFinancialData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    const loadData = () => {
      try {
        const loadedTransactions = getTransactions();
        const loadedDebts = getDebts();
        const loadedBudgets = getBudgets();
        const loadedGoals = getGoals();

        setTransactions(loadedTransactions);
        setDebts(loadedDebts);
        setBudgets(loadedBudgets);
        setGoals(loadedGoals);

        // Update budget spending calculations
        updateBudgetSpending(loadedBudgets, loadedTransactions);
      } catch (error) {
        console.error('Error loading financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Update budget spending when transactions change
  useEffect(() => {
    if (!isLoading) {
      updateBudgetSpending(budgets, transactions);
    }
  }, [transactions, budgets.length, isLoading]);

  // Analytics instance
  const analytics = useMemo(() => {
    return new FinancialAnalytics(transactions, debts);
  }, [transactions, debts]);

  // Core financial metrics
  const summary = useMemo(() => {
    if (isLoading) return null;

    return {
      totalIncome: analytics.getTotalIncome(),
      totalExpenses: analytics.getTotalExpenses(),
      currentBalance: analytics.getCurrentBalance(),
      totalDebt: analytics.getTotalDebt(),
      netWorth: analytics.getNetWorth(),
      savingsRate: analytics.getSavingsRate(),
      monthlyAverageSavings: analytics.getMonthlyAverageSavings(),
    };
  }, [analytics, isLoading]);

  // Advanced analytics
  const advancedMetrics = useMemo(() => {
    if (isLoading) return null;

    return {
      spendingPatterns: analytics.getSpendingPatterns(),
      categoryInsights: analytics.getCategoryInsights(),
      cashFlowData: analytics.getCashFlowData(),
      financialHealth: analytics.calculateFinancialHealth(),
      predictiveInsights: analytics.getPredictiveInsights(),
    };
  }, [analytics, isLoading]);

  // Recent transactions (last 30 days)
  const recentTransactions = useMemo(() => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return transactions
      .filter(t => new Date(t.date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [transactions]);

  // Active goals with progress
  const activeGoals = useMemo(() => {
    return goals
      .filter(g => g.status === 'active')
      .map(goal => ({
        ...goal,
        progress: goal.targetAmount > 0 ? goal.currentAmount / goal.targetAmount : 0,
        daysRemaining: Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return a.daysRemaining - b.daysRemaining;
      });
  }, [goals]);

  // Budget status
  const budgetStatus = useMemo(() => {
    return budgets.map(budget => {
      const usage = budget.limit > 0 ? budget.spent / budget.limit : 0;
      const alertThreshold = budget.alertThreshold || 80;
      
      return {
        ...budget,
        usage,
        isOverBudget: usage > 1,
        isNearLimit: usage >= (alertThreshold / 100),
        remaining: Math.max(0, budget.limit - budget.spent),
      };
    });
  }, [budgets]);

  // Refresh data
  const refreshData = () => {
    setIsLoading(true);
    const loadedTransactions = getTransactions();
    const loadedDebts = getDebts();
    const loadedBudgets = getBudgets();
    const loadedGoals = getGoals();

    setTransactions(loadedTransactions);
    setDebts(loadedDebts);
    setBudgets(loadedBudgets);
    setGoals(loadedGoals);
    setIsLoading(false);
  };

  // Update budget spending calculations
  const updateBudgetSpending = (budgetList: Budget[], transactionList: Transaction[]) => {
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    budgetList.forEach(budget => {
      const categoryExpenses = transactionList
        .filter(t => 
          t.type === 'expense' &&
          t.category === budget.category &&
          new Date(t.date) >= startOfMonth &&
          new Date(t.date) <= endOfMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);

      if (categoryExpenses !== budget.spent) {
        updateBudget(budget.id, { spent: categoryExpenses });
        setBudgets(prev => 
          prev.map(b => b.id === budget.id ? { ...b, spent: categoryExpenses } : b)
        );
      }
    });
  };

  return {
    // Data
    transactions,
    debts,
    budgets,
    goals,
    
    // Computed values
    summary,
    advancedMetrics,
    recentTransactions,
    activeGoals,
    budgetStatus,
    
    // State
    isLoading,
    
    // Actions
    refreshData,
    
    // Setters for optimistic updates
    setTransactions,
    setDebts,
    setBudgets,
    setGoals,
  };
}