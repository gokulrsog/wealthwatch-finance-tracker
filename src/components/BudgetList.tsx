import React from 'react';
import { Trash2, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { deleteBudget } from '@/lib/storage';

interface BudgetStatus {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
  alertThreshold?: number;
  usage: number;
  isOverBudget: boolean;
  isNearLimit: boolean;
  remaining: number;
}

interface BudgetListProps {
  budgets: BudgetStatus[];
  onRefresh: () => void;
}

export const BudgetList = React.memo<BudgetListProps>(({ budgets, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const getBudgetIcon = (budget: BudgetStatus) => {
    if (budget.isOverBudget) {
      return <AlertTriangle className="h-5 w-5 text-danger-500" />;
    } else if (budget.isNearLimit) {
      return <TrendingUp className="h-5 w-5 text-warning-500" />;
    }
    return <CheckCircle className="h-5 w-5 text-success-500" />;
  };

  const getBudgetColor = (budget: BudgetStatus) => {
    if (budget.isOverBudget) {
      return {
        bg: 'bg-danger-50',
        border: 'border-l-danger-500',
        progress: 'bg-danger-500',
        text: 'text-danger-600'
      };
    } else if (budget.isNearLimit) {
      return {
        bg: 'bg-warning-50',
        border: 'border-l-warning-500',
        progress: 'bg-warning-500',
        text: 'text-warning-600'
      };
    }
    return {
      bg: 'bg-success-50',
      border: 'border-l-success-500',
      progress: 'bg-success-500',
      text: 'text-success-600'
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budgets ({budgets.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {budgets.length > 0 ? (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const colors = getBudgetColor(budget);
              const progressWidth = Math.min(budget.usage * 100, 100);
              
              return (
                <div
                  key={budget.id}
                  className={`p-4 rounded-xl border-l-4 ${colors.bg} ${colors.border}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getBudgetIcon(budget)}
                      <div>
                        <h4 className="font-semibold text-neutral-900">
                          {budget.category}
                        </h4>
                        <p className="text-sm text-neutral-600 capitalize">
                          {budget.period} budget
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                      className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-600">
                          {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                        </span>
                        <span className={colors.text}>
                          {formatPercentage(budget.usage)}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${colors.progress}`}
                          style={{ width: `${progressWidth}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-neutral-500">Remaining</div>
                        <div className="font-medium text-neutral-900">
                          {formatCurrency(budget.remaining)}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-500">Status</div>
                        <div className={`font-medium ${colors.text}`}>
                          {budget.isOverBudget 
                            ? 'Over Budget' 
                            : budget.isNearLimit 
                            ? 'Near Limit' 
                            : 'On Track'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No budgets created yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

BudgetList.displayName = 'BudgetList';