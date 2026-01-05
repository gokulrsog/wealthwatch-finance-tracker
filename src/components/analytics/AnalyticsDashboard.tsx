import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LineChart, BarChart } from '@/components/ui/Chart';
import { formatCurrency, formatPercentage, exportToCSV } from '@/lib/utils';
import { Download, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalyticsDashboardProps {
  cashFlowData: Array<{
    date: string;
    income: number;
    expenses: number;
    balance: number;
    netFlow: number;
  }> | null;
  categoryInsights: Array<{
    category: string;
    totalSpent: number;
    transactionCount: number;
    averageTransaction: number;
    trend: number;
    topSubcategories: Array<{
      name: string;
      amount: number;
      percentage: number;
    }>;
  }> | null;
  spendingPatterns: Array<{
    category: string;
    amount: number;
    percentage: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    monthlyAverage: number;
  }> | null;
  predictiveInsights: Array<{
    type: string;
    title: string;
    message: string;
    impact: 'positive' | 'warning' | 'negative';
  }> | null;
}

export const AnalyticsDashboard = React.memo<AnalyticsDashboardProps>(({
  cashFlowData,
  categoryInsights,
  spendingPatterns,
  predictiveInsights
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'3m' | '6m' | '12m'>('6m');

  const handleExportData = () => {
    if (cashFlowData) {
      exportToCSV(cashFlowData, `cash-flow-${selectedPeriod}.csv`);
    }
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-danger-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-success-500" />;
      default:
        return <Minus className="h-4 w-4 text-neutral-500" />;
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'border-l-success-500 bg-success-50';
      case 'warning':
        return 'border-l-warning-500 bg-warning-50';
      default:
        return 'border-l-danger-500 bg-danger-50';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Financial Analytics</h2>
          <p className="text-neutral-600">Comprehensive insights into your financial patterns</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-neutral-100 rounded-lg p-1">
            {(['3m', '6m', '12m'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-accent-600 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </div>
          
          <Button variant="secondary" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Cash Flow Chart */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-accent-600" />
            <span>Cash Flow Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cashFlowData && cashFlowData.length > 0 ? (
            <div className="space-y-6">
              <LineChart
                data={cashFlowData.map(item => ({
                  name: item.date,
                  value: item.balance
                }))}
                height={300}
                color="stroke-accent-500"
              />
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <div className="text-2xl font-bold text-success-600">
                    {formatCurrency(cashFlowData.reduce((sum, item) => sum + item.income, 0))}
                  </div>
                  <div className="text-sm text-neutral-600">Total Income</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <div className="text-2xl font-bold text-danger-600">
                    {formatCurrency(cashFlowData.reduce((sum, item) => sum + item.expenses, 0))}
                  </div>
                  <div className="text-sm text-neutral-600">Total Expenses</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <div className="text-2xl font-bold text-accent-600">
                    {formatCurrency(cashFlowData[cashFlowData.length - 1]?.balance || 0)}
                  </div>
                  <div className="text-sm text-neutral-600">Current Balance</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <div className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(
                      cashFlowData.reduce((sum, item) => sum + item.netFlow, 0) / cashFlowData.length
                    )}
                  </div>
                  <div className="text-sm text-neutral-600">Avg Monthly Flow</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-neutral-500">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No cash flow data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Spending Patterns */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {spendingPatterns && spendingPatterns.length > 0 ? (
              <div className="space-y-4">
                <BarChart
                  data={spendingPatterns.slice(0, 6).map(pattern => ({
                    name: pattern.category.length > 10 
                      ? pattern.category.substring(0, 10) + '...' 
                      : pattern.category,
                    value: pattern.amount,
                    color: getCategoryColor(pattern.category)
                  }))}
                  height={200}
                />
                
                <div className="space-y-2">
                  {spendingPatterns.slice(0, 5).map((pattern, index) => (
                    <div key={pattern.category} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getCategoryColor(pattern.category) }}
                        />
                        <span className="text-sm font-medium text-neutral-900">
                          {pattern.category}
                        </span>
                        {getTrendIcon(pattern.trend)}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-neutral-900">
                          {formatCurrency(pattern.amount)}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {formatPercentage(pattern.percentage)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-neutral-500">
                <p>No spending patterns available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Insights */}
        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Category Deep Dive</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryInsights && categoryInsights.length > 0 ? (
              <div className="space-y-4">
                {categoryInsights.slice(0, 5).map((insight, index) => (
                  <div key={insight.category} className="p-4 bg-neutral-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-neutral-900">{insight.category}</h4>
                      <div className={`text-sm font-medium ${
                        insight.trend > 0 ? 'text-danger-600' : 
                        insight.trend < 0 ? 'text-success-600' : 'text-neutral-600'
                      }`}>
                        {insight.trend > 0 ? '+' : ''}{insight.trend.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-neutral-500">Total Spent</div>
                        <div className="font-medium text-neutral-900">
                          {formatCurrency(insight.totalSpent)}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-500">Transactions</div>
                        <div className="font-medium text-neutral-900">
                          {insight.transactionCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-500">Avg per Transaction</div>
                        <div className="font-medium text-neutral-900">
                          {formatCurrency(insight.averageTransaction)}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-500">Top Subcategory</div>
                        <div className="font-medium text-neutral-900">
                          {insight.topSubcategories[0]?.name || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-neutral-500">
                <p>No category insights available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Predictive Insights */}
      {predictiveInsights && predictiveInsights.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader>
            <CardTitle>AI-Powered Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {predictiveInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`p-4 border-l-4 rounded-lg ${getInsightColor(insight.impact)}`}
                >
                  <h4 className="font-medium text-neutral-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-neutral-700">{insight.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';

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