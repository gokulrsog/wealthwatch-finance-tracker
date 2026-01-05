import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import type { FinancialSummary } from '@/types';

interface DashboardProps {
  summary: FinancialSummary;
  loading?: boolean;
}

const StatCard = React.memo<{
  title: string;
  value: number;
  icon: React.ReactNode;
  variant: 'positive' | 'negative' | 'neutral';
}>(({ title, value, icon, variant }) => {
  const colorClasses = {
    positive: 'text-success-600 bg-success-50',
    negative: 'text-danger-600 bg-danger-50',
    neutral: 'text-primary-600 bg-primary-50',
  };

  const valueColorClasses = {
    positive: 'text-success-600',
    negative: 'text-danger-600',
    neutral: 'text-slate-900',
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`p-3 rounded-xl ${colorClasses[variant]}`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className={`text-2xl font-bold ${valueColorClasses[variant]}`}>
            {formatCurrency(value)}
          </p>
        </div>
      </div>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

export const Dashboard = React.memo<DashboardProps>(({ summary, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-6 bg-slate-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Financial Dashboard
        </h1>
        <p className="text-slate-600">
          Overview of your financial health and recent activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Income"
          value={summary.totalIncome}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="positive"
        />
        
        <StatCard
          title="Total Expenses"
          value={summary.totalExpenses}
          icon={<TrendingDown className="w-6 h-6" />}
          variant="negative"
        />
        
        <StatCard
          title="Current Balance"
          value={summary.balance}
          icon={<Wallet className="w-6 h-6" />}
          variant={summary.balance >= 0 ? 'positive' : 'negative'}
        />
        
        <StatCard
          title="Total Debt"
          value={summary.totalDebt}
          icon={<CreditCard className="w-6 h-6" />}
          variant="negative"
        />
        
        <StatCard
          title="Net Worth"
          value={summary.netWorth}
          icon={<DollarSign className="w-6 h-6" />}
          variant={summary.netWorth >= 0 ? 'positive' : 'negative'}
        />
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';