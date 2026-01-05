import { Transaction, Debt, SpendingPattern, CashFlowData, CategoryInsight, FinancialHealth } from '@/types';
import { getMonthlyDateRange, isDateInRange, calculateTrend, getTrendDirection, formatCurrency } from '@/lib/utils';
import { subMonths, format } from 'date-fns';

export class FinancialAnalytics {
  private transactions: Transaction[];
  private debts: Debt[];

  constructor(transactions: Transaction[], debts: Debt[]) {
    this.transactions = transactions;
    this.debts = debts;
  }

  // Core financial metrics
  getTotalIncome(months: number = 12): number {
    const { start, end } = this.getDateRange(months);
    return this.transactions
      .filter(t => t.type === 'income' && isDateInRange(t.date, start, end))
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(months: number = 12): number {
    const { start, end } = this.getDateRange(months);
    return this.transactions
      .filter(t => t.type === 'expense' && isDateInRange(t.date, start, end))
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getCurrentBalance(): number {
    return this.transactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, 0);
  }

  getTotalDebt(): number {
    return this.debts
      .filter(d => d.status === 'active')
      .reduce((sum, d) => sum + (d.currentBalance || d.amount), 0);
  }

  getNetWorth(): number {
    return this.getCurrentBalance() - this.getTotalDebt();
  }

  // Savings and investment metrics
  getSavingsRate(months: number = 12): number {
    const income = this.getTotalIncome(months);
    const expenses = this.getTotalExpenses(months);
    if (income === 0) return 0;
    return (income - expenses) / income;
  }

  getMonthlyAverageSavings(months: number = 12): number {
    const income = this.getTotalIncome(months);
    const expenses = this.getTotalExpenses(months);
    return (income - expenses) / months;
  }

  // Spending analysis
  getSpendingPatterns(months: number = 6): SpendingPattern[] {
    const { start, end } = this.getDateRange(months);
    const currentExpenses = this.transactions
      .filter(t => t.type === 'expense' && isDateInRange(t.date, start, end));

    // Get previous period for comparison
    const { start: prevStart, end: prevEnd } = this.getDateRange(months, months);
    const previousExpenses = this.transactions
      .filter(t => t.type === 'expense' && isDateInRange(t.date, prevStart, prevEnd));

    const categoryTotals = this.groupByCategory(currentExpenses);
    const prevCategoryTotals = this.groupByCategory(previousExpenses);
    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals).map(([category, amount]) => {
      const previousAmount = prevCategoryTotals[category] || 0;
      const trend = calculateTrend(amount, previousAmount);

      return {
        category,
        amount,
        percentage: totalExpenses > 0 ? amount / totalExpenses : 0,
        trend: getTrendDirection(trend),
        monthlyAverage: amount / months,
      };
    }).sort((a, b) => b.amount - a.amount);
  }

  getCategoryInsights(months: number = 6): CategoryInsight[] {
    const { start, end } = this.getDateRange(months);
    const expenses = this.transactions
      .filter(t => t.type === 'expense' && isDateInRange(t.date, start, end));

    const categoryGroups = expenses.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = [];
      }
      acc[transaction.category].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);

    return Object.entries(categoryGroups).map(([category, transactions]) => {
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const transactionCount = transactions.length;
      const averageTransaction = totalSpent / transactionCount;

      // Calculate subcategories
      const subcategoryGroups = transactions.reduce((acc, t) => {
        const sub = t.subcategory || 'Other';
        acc[sub] = (acc[sub] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

      const topSubcategories = Object.entries(subcategoryGroups)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, amount]) => ({
          name,
          amount,
          percentage: amount / totalSpent,
        }));

      // Calculate trend
      const { start: prevStart, end: prevEnd } = this.getDateRange(months, months);
      const prevAmount = this.transactions
        .filter(t => t.type === 'expense' && 
                    t.category === category && 
                    isDateInRange(t.date, prevStart, prevEnd))
        .reduce((sum, t) => sum + t.amount, 0);

      const trend = calculateTrend(totalSpent, prevAmount);

      return {
        category,
        totalSpent,
        transactionCount,
        averageTransaction,
        trend,
        topSubcategories,
      };
    }).sort((a, b) => b.totalSpent - a.totalSpent);
  }

  // Cash flow analysis
  getCashFlowData(months: number = 12): CashFlowData[] {
    const data: CashFlowData[] = [];
    let runningBalance = 0;

    for (let i = months - 1; i >= 0; i--) {
      const { start, end } = this.getDateRange(1, i);
      const monthTransactions = this.transactions
        .filter(t => isDateInRange(t.date, start, end));

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const netFlow = income - expenses;
      runningBalance += netFlow;

      data.push({
        date: format(start, 'MMM yyyy'),
        income,
        expenses,
        balance: runningBalance,
        netFlow,
      });
    }

    return data;
  }

  // Financial health scoring
  calculateFinancialHealth(): FinancialHealth {
    const savingsRate = this.getSavingsRate();
    const totalIncome = this.getTotalIncome();
    const totalDebt = this.getTotalDebt();
    const currentBalance = this.getCurrentBalance();
    
    // Calculate individual factors (0-100 scale)
    const factors = {
      savingsRate: Math.min(100, Math.max(0, savingsRate * 100)),
      debtToIncome: Math.max(0, 100 - ((totalDebt / Math.max(totalIncome, 1)) * 100)),
      expenseStability: this.calculateExpenseStability(),
      emergencyFund: Math.min(100, (currentBalance / (this.getTotalExpenses(3) / 3)) * 10),
      diversification: this.calculateIncomeSourceDiversification(),
    };

    // Calculate overall score (weighted average)
    const weights = {
      savingsRate: 0.25,
      debtToIncome: 0.25,
      expenseStability: 0.2,
      emergencyFund: 0.2,
      diversification: 0.1,
    };

    const score = Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + (value * weights[key as keyof typeof weights]);
    }, 0);

    // Generate recommendations
    const recommendations = this.generateRecommendations(factors);
    
    // Determine risk level
    const riskLevel = score >= 70 ? 'low' : score >= 40 ? 'medium' : 'high';

    return {
      score: Math.round(score),
      factors,
      recommendations,
      riskLevel,
    };
  }

  // Predictive insights
  getPredictiveInsights() {
    const monthlyIncome = this.getTotalIncome(3) / 3;
    const monthlyExpenses = this.getTotalExpenses(3) / 3;
    const currentSavingsRate = this.getSavingsRate(3);
    
    const insights = [];

    // Savings projection
    if (currentSavingsRate > 0) {
      const monthlySavings = monthlyIncome * currentSavingsRate;
      const yearlyProjection = monthlySavings * 12;
      insights.push({
        type: 'savings_projection',
        title: 'Savings Projection',
        message: `At your current savings rate of ${(currentSavingsRate * 100).toFixed(1)}%, you'll save approximately ${formatCurrency(yearlyProjection)} this year.`,
        impact: 'positive'
      });
    }

    // Spending trends
    const spendingPatterns = this.getSpendingPatterns(6);
    const increasingCategories = spendingPatterns
      .filter(p => p.trend === 'increasing' && p.percentage > 0.1)
      .slice(0, 2);

    if (increasingCategories.length > 0) {
      insights.push({
        type: 'spending_alert',
        title: 'Rising Expenses',
        message: `Your spending on ${increasingCategories.map(c => c.category).join(' and ')} has increased recently. Consider reviewing these categories.`,
        impact: 'warning'
      });
    }

    // Debt payoff projections
    const activeDebts = this.debts.filter(d => d.status === 'active');
    if (activeDebts.length > 0 && currentSavingsRate > 0) {
      const totalDebt = this.getTotalDebt();
      const monthlySavings = monthlyIncome * currentSavingsRate;
      const monthsToPayoff = Math.ceil(totalDebt / monthlySavings);
      
      insights.push({
        type: 'debt_payoff',
        title: 'Debt Freedom Timeline',
        message: `If you allocate your monthly savings to debt repayment, you could be debt-free in approximately ${monthsToPayoff} months.`,
        impact: 'positive'
      });
    }

    return insights;
  }

  // Helper methods
  private getDateRange(months: number, offsetMonths: number = 0) {
    const targetDate = subMonths(new Date(), offsetMonths);
    const start = subMonths(targetDate, months - 1);
    return {
      start: new Date(start.getFullYear(), start.getMonth(), 1),
      end: new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
    };
  }

  private groupByCategory(transactions: Transaction[]): Record<string, number> {
    return transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateExpenseStability(): number {
    const last6Months = [];
    for (let i = 0; i < 6; i++) {
      const { start, end } = this.getDateRange(1, i);
      const monthlyExpenses = this.transactions
        .filter(t => t.type === 'expense' && isDateInRange(t.date, start, end))
        .reduce((sum, t) => sum + t.amount, 0);
      last6Months.push(monthlyExpenses);
    }

    if (last6Months.length < 2) return 50;

    const average = last6Months.reduce((sum, val) => sum + val, 0) / last6Months.length;
    const variance = last6Months.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / last6Months.length;
    const standardDeviation = Math.sqrt(variance);
    const coefficientOfVariation = average > 0 ? standardDeviation / average : 0;

    // Lower coefficient of variation = higher stability
    return Math.max(0, 100 - (coefficientOfVariation * 100));
  }

  private calculateIncomeSourceDiversification(): number {
    const incomeByCategory = this.groupByCategory(
      this.transactions.filter(t => t.type === 'income')
    );
    
    const categories = Object.keys(incomeByCategory).length;
    return Math.min(100, categories * 25); // Up to 4 categories for max score
  }

  private generateRecommendations(factors: FinancialHealth['factors']): string[] {
    const recommendations = [];

    if (factors.savingsRate < 50) {
      recommendations.push("Consider increasing your savings rate to at least 20% of your income.");
    }

    if (factors.debtToIncome < 60) {
      recommendations.push("Work on reducing your debt-to-income ratio by paying down high-interest debts first.");
    }

    if (factors.emergencyFund < 50) {
      recommendations.push("Build an emergency fund covering 3-6 months of expenses for financial security.");
    }

    if (factors.expenseStability < 60) {
      recommendations.push("Try to stabilize your monthly expenses by creating and sticking to a budget.");
    }

    if (factors.diversification < 50) {
      recommendations.push("Consider diversifying your income sources to reduce financial risk.");
    }

    return recommendations;
  }
}