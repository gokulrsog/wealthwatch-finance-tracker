import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Target,
  Shield,
  PiggyBank
} from 'lucide-react';
import { formatCurrency, formatPercentage, getFinancialHealthColor } from '@/lib/utils';

interface InsightsDashboardProps {
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
  predictiveInsights: Array<{
    type: string;
    title: string;
    message: string;
    impact: 'positive' | 'warning' | 'negative';
  }> | null;
  summary: {
    totalIncome: number;
    totalExpenses: number;
    currentBalance: number;
    totalDebt: number;
    netWorth: number;
    savingsRate: number;
    monthlyAverageSavings: number;
  } | null;
}

export const InsightsDashboard = React.memo<InsightsDashboardProps>(({
  financialHealth,
  predictiveInsights,
  summary
}) => {
  if (!financialHealth || !summary) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const getInsightIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-danger-500" />;
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

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-success-600 bg-success-50';
      case 'medium':
        return 'text-warning-600 bg-warning-50';
      default:
        return 'text-danger-600 bg-danger-50';
    }
  };

  const generateCustomInsights = () => {
    const insights = [];
    
    // Savings rate insight
    if (summary.savingsRate > 0.2) {
      insights.push({
        icon: <PiggyBank className="h-6 w-6 text-success-600" />,
        title: 'Excellent Savings Rate',
        description: `You're saving ${formatPercentage(summary.savingsRate)} of your income, which is above the recommended 20%.`,
        color: 'bg-success-50 border-success-200'
      });
    } else if (summary.savingsRate < 0.1) {
      insights.push({
        icon: <AlertTriangle className="h-6 w-6 text-danger-600" />,
        title: 'Low Savings Rate',
        description: `Consider increasing your savings rate from ${formatPercentage(summary.savingsRate)} to at least 10-20% of income.`,
        color: 'bg-danger-50 border-danger-200'
      });
    }

    // Net worth insight
    if (summary.netWorth > 0) {
      insights.push({
        icon: <TrendingUp className="h-6 w-6 text-success-600" />,
        title: 'Positive Net Worth',
        description: `Your net worth of ${formatCurrency(summary.netWorth)} shows healthy financial progress.`,
        color: 'bg-success-50 border-success-200'
      });
    } else {
      insights.push({
        icon: <Target className="h-6 w-6 text-warning-600" />,
        title: 'Focus on Debt Reduction',
        description: `Work on reducing debt to improve your net worth from ${formatCurrency(summary.netWorth)}.`,
        color: 'bg-warning-50 border-warning-200'
      });
    }

    // Emergency fund insight
    const monthlyExpenses = summary.totalExpenses / 12;
    const emergencyFundMonths = summary.currentBalance / monthlyExpenses;
    
    if (emergencyFundMonths >= 6) {
      insights.push({
        icon: <Shield className="h-6 w-6 text-success-600" />,
        title: 'Strong Emergency Fund',
        description: `You have ${emergencyFundMonths.toFixed(1)} months of expenses saved - excellent financial security.`,
        color: 'bg-success-50 border-success-200'
      });
    } else if (emergencyFundMonths < 3) {
      insights.push({
        icon: <Shield className="h-6 w-6 text-warning-600" />,
        title: 'Build Emergency Fund',
        description: `Aim for 3-6 months of expenses. You currently have ${emergencyFundMonths.toFixed(1)} months saved.`,
        color: 'bg-warning-50 border-warning-200'
      });
    }

    return insights;
  };

  const customInsights = generateCustomInsights();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Financial Insights</h2>
        <p className="text-neutral-600">
          AI-powered analysis of your financial health and personalized recommendations
        </p>
      </div>

      {/* Financial Health Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Health Score</span>
              <span className={`text-2xl font-bold ${getFinancialHealthColor(financialHealth.score)}`}>
                {financialHealth.score}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="w-full bg-neutral-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    financialHealth.score >= 70 ? 'bg-success-500' : 
                    financialHealth.score >= 40 ? 'bg-warning-500' : 'bg-danger-500'
                  }`}
                  style={{ width: `${financialHealth.score}%` }}
                />
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(financialHealth.riskLevel)}`}>
                {financialHealth.riskLevel.toUpperCase()} RISK
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Top Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(financialHealth.factors)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`text-sm font-medium ${
                    value >= 70 ? 'text-success-600' : 
                    value >= 40 ? 'text-warning-600' : 'text-danger-600'
                  }`}>
                    {Math.round(value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-warning-500" />
              <span>Quick Wins</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {financialHealth.recommendations.slice(0, 2).map((rec, index) => (
                <p key={index} className="text-sm text-neutral-700 leading-relaxed">
                  • {rec}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Insights */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <CardHeader>
          <CardTitle>Personalized Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customInsights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${insight.color}`}
              >
                <div className="flex items-start space-x-3">
                  {insight.icon}
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-neutral-700">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      {predictiveInsights && predictiveInsights.length > 0 && (
        <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle>Predictive Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {predictiveInsights.map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 border-l-4 rounded-lg ${getInsightColor(insight.impact)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.impact)}
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-sm text-neutral-700">
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Recommendations */}
      <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
        <CardHeader>
          <CardTitle>Detailed Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financialHealth.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-neutral-700">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

InsightsDashboard.displayName = 'InsightsDashboard';