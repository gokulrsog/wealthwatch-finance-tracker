import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  PiggyBank,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatPercentage, getFinancialHealthColor } from '@/lib/utils';
import { DonutChart } from '@/components/ui/Chart';

interface OverviewDashboardProps {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    totalDebt: number;
    netWorth: number;
    savingsRate: number;
    monthlyAverageSavings: number;
  } | null;
  financialHealth: {
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
  } | null;
  spendingPatterns: Array<{
    category: string;
    amount: number;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }> | null;
  recentTransactions: any[];
}

export const OverviewDashboard = React.memo<OverviewDashboardProps>(({ 
  summary, 
  financialHealth, 
  spendingPatterns,
  recentTransactions 
}) => {
  if (!summary || !financialHealth) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Total Balance',
      value: formatCurrency(summary.currentBalance),
      icon: Wallet,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      change: summary.monthlyAverageSavings > 0 ? '+' + formatCurrency(summary.monthlyAverageSavings) : null,
      changeLabel: 'Monthly avg',
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(summary.totalIncome / 12),
      icon: TrendingUp,
      color: 'text-success-600',
      bgColor: 'bg-success-50',
      change: summary.savingsRate > 0 ? formatPercentage(summary.savingsRate) : null,
      changeLabel: 'Savings rate',
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(summary.totalExpenses / 12),
      icon: CreditCard,
      color: 'text-warning-600',
      bgColor: 'bg-warning-50',
    },
    {
      title: 'Total Debt',
      value: formatCurrency(summary.totalDebt),
      icon: TrendingDown,
      color: summary.totalDebt > 0 ? 'text-danger-600' : 'text-success-600',
      bgColor: summary.totalDebt > 0 ? 'bg-danger-50' : 'bg-success-50',
    },
    {
      title: 'Net Worth',
      value: formatCurrency(summary.netWorth),
      icon: DollarSign,
      color: summary.netWorth > 0 ? 'text-success-600' : 'text-danger-600',
      bgColor: summary.netWorth > 0 ? 'bg-success-50' : 'bg-danger-50',
    },
  ];

  const topSpendingCategories = spendingPatterns?.slice(0, 5).map(pattern => ({
    name: pattern.category,
    value: pattern.amount,
    color: getCategoryColor(pattern.category),
  })) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  {card.change && (
                    <div className="text-right">
                      <div className={`text-sm font-medium ${card.color}`}>{card.change}</div>
                      <div className="text-xs text-neutral-500">{card.changeLabel}</div>
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900 mb-1">{card.value}</div>
                  <div className="text-sm text-neutral-500">{card.title}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Financial Health Score */}
        <Card className="lg:col-span-1 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Financial Health</span>
              <div className={`flex items-center space-x-2 ${getFinancialHealthColor(financialHealth.score)}`}>
                {financialHealth.score >= 70 ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
                <span className="font-bold">{financialHealth.score}/100</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-neutral-600">
                      Overall Score
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-3 text-xs flex rounded-full bg-neutral-100">
                  <div 
                    style={{ width: `${financialHealth.score}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                      financialHealth.score >= 70 ? 'bg-success-500' : 
                      financialHealth.score >= 40 ? 'bg-warning-500' : 'bg-danger-500'
                    }`}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                {Object.entries(financialHealth.factors).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-sm font-medium text-neutral-900">
                      {Math.round(value)}/100
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Top Recommendations</h4>
                <ul className="text-xs text-neutral-600 space-y-1">
                  {financialHealth.recommendations.slice(0, 2).map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-accent-500 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spending Breakdown */}
        <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {topSpendingCategories.length > 0 ? (
              <DonutChart
                data={topSpendingCategories}
                size={200}
                centerText="Total Spent"
                centerValue={formatCurrency(summary.totalExpenses)}
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-neutral-500">
                <div className="text-center">
                  <PiggyBank className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No spending data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {recentTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-success-100' : 'bg-neutral-200'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-5 w-5 text-success-600" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-neutral-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-neutral-900">{transaction.description}</div>
                      <div className="text-sm text-neutral-500">{transaction.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      transaction.type === 'income' ? 'text-success-600' : 'text-neutral-900'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-neutral-500">
              <div className="text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent transactions</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

OverviewDashboard.displayName = 'OverviewDashboard';

function getCategoryColor(category: string): string {
  const colors = {
    'Food & Dining': '#ef4444',
    'Transportation': '#3b82f6',
    'Shopping': '#8b5cf6',
    'Entertainment': '#ec4899',
    'Bills & Utilities': '#f59e0b',
    'Health & Fitness': '#10b981',
    'Travel': '#6366f1',
    'Education': '#eab308',
    'Investment': '#14b8a6',
    'Income': '#059669',
    'Other': '#6b7280'
  };
  return colors[category as keyof typeof colors] || '#6b7280';
}