import { Transaction, Debt, Budget, Goal } from '@/types';

// Transaction storage
export const getTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem('wealthwatch_transactions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
};

export const saveTransactions = (transactions: Transaction[]): void => {
  try {
    localStorage.setItem('wealthwatch_transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
};

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const transactions = getTransactions();
  const newTransaction = {
    ...transaction,
    id: generateId(),
  };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  return newTransaction;
};

export const updateTransaction = (id: string, updates: Partial<Transaction>): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === id);
  if (index !== -1) {
    transactions[index] = { ...transactions[index], ...updates };
    saveTransactions(transactions);
  }
};

export const deleteTransaction = (id: string): void => {
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  saveTransactions(filtered);
};

// Debt storage
export const getDebts = (): Debt[] => {
  try {
    const stored = localStorage.getItem('wealthwatch_debts');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading debts:', error);
    return [];
  }
};

export const saveDebts = (debts: Debt[]): void => {
  try {
    localStorage.setItem('wealthwatch_debts', JSON.stringify(debts));
  } catch (error) {
    console.error('Error saving debts:', error);
  }
};

export const addDebt = (debt: Omit<Debt, 'id'>): Debt => {
  const debts = getDebts();
  const newDebt = {
    ...debt,
    id: generateId(),
    status: 'active' as const,
    currentBalance: debt.currentBalance || debt.amount,
  };
  debts.push(newDebt);
  saveDebts(debts);
  return newDebt;
};

export const updateDebt = (id: string, updates: Partial<Debt>): void => {
  const debts = getDebts();
  const index = debts.findIndex(d => d.id === id);
  if (index !== -1) {
    debts[index] = { ...debts[index], ...updates };
    saveDebts(debts);
  }
};

export const deleteDebt = (id: string): void => {
  const debts = getDebts();
  const filtered = debts.filter(d => d.id !== id);
  saveDebts(filtered);
};

// Budget storage
export const getBudgets = (): Budget[] => {
  try {
    const stored = localStorage.getItem('wealthwatch_budgets');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading budgets:', error);
    return [];
  }
};

export const saveBudgets = (budgets: Budget[]): void => {
  try {
    localStorage.setItem('wealthwatch_budgets', JSON.stringify(budgets));
  } catch (error) {
    console.error('Error saving budgets:', error);
  }
};

export const addBudget = (budget: Omit<Budget, 'id' | 'spent'>): Budget => {
  const budgets = getBudgets();
  const newBudget = {
    ...budget,
    id: generateId(),
    spent: 0,
  };
  budgets.push(newBudget);
  saveBudgets(budgets);
  return newBudget;
};

export const updateBudget = (id: string, updates: Partial<Budget>): void => {
  const budgets = getBudgets();
  const index = budgets.findIndex(b => b.id === id);
  if (index !== -1) {
    budgets[index] = { ...budgets[index], ...updates };
    saveBudgets(budgets);
  }
};

export const deleteBudget = (id: string): void => {
  const budgets = getBudgets();
  const filtered = budgets.filter(b => b.id !== id);
  saveBudgets(filtered);
};

// Goals storage
export const getGoals = (): Goal[] => {
  try {
    const stored = localStorage.getItem('wealthwatch_goals');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading goals:', error);
    return [];
  }
};

export const saveGoals = (goals: Goal[]): void => {
  try {
    localStorage.setItem('wealthwatch_goals', JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving goals:', error);
  }
};

export const addGoal = (goal: Omit<Goal, 'id'>): Goal => {
  const goals = getGoals();
  const newGoal = {
    ...goal,
    id: generateId(),
    currentAmount: goal.currentAmount || 0,
    status: 'active' as const,
  };
  goals.push(newGoal);
  saveGoals(goals);
  return newGoal;
};

export const updateGoal = (id: string, updates: Partial<Goal>): void => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index !== -1) {
    goals[index] = { ...goals[index], ...updates };
    saveGoals(goals);
  }
};

export const deleteGoal = (id: string): void => {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  saveGoals(filtered);
};

// Settings storage
export const getSettings = () => {
  try {
    const stored = localStorage.getItem('wealthwatch_settings');
    return stored ? JSON.parse(stored) : {
      currency: 'USD',
      theme: 'light',
      notifications: true,
      autoBackup: false,
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      currency: 'USD',
      theme: 'light',
      notifications: true,
      autoBackup: false,
    };
  }
};

export const saveSettings = (settings: any): void => {
  try {
    localStorage.setItem('wealthwatch_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

// Utility functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export const clearAllData = (): void => {
  localStorage.removeItem('wealthwatch_transactions');
  localStorage.removeItem('wealthwatch_debts');
  localStorage.removeItem('wealthwatch_budgets');
  localStorage.removeItem('wealthwatch_goals');
  localStorage.removeItem('wealthwatch_settings');
};

export const exportAllData = () => {
  const data = {
    transactions: getTransactions(),
    debts: getDebts(),
    budgets: getBudgets(),
    goals: getGoals(),
    settings: getSettings(),
    exportDate: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `wealthwatch_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};