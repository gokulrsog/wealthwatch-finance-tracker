import React from 'react';
import { Trash2, AlertTriangle, Calendar, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate, getDaysUntilDate } from '@/lib/utils';
import { deleteDebt } from '@/lib/storage';
import { Debt } from '@/types';

interface DebtListProps {
  debts: Debt[];
  onRefresh: () => void;
}

export const DebtList = React.memo<DebtListProps>(({ debts, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this debt?')) {
      try {
        await deleteDebt(id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting debt:', error);
      }
    }
  };

  const getDebtStatus = (debt: Debt) => {
    const daysUntil = getDaysUntilDate(debt.dueDate);
    
    if (daysUntil < 0) {
      return { status: 'overdue', color: 'text-danger-600', bgColor: 'bg-danger-50' };
    } else if (daysUntil <= 7) {
      return { status: 'due-soon', color: 'text-warning-600', bgColor: 'bg-warning-50' };
    }
    return { status: 'active', color: 'text-neutral-600', bgColor: 'bg-neutral-50' };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debts ({debts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {debts.length > 0 ? (
          <div className="space-y-4">
            {debts.map((debt) => {
              const debtStatus = getDebtStatus(debt);
              const daysUntil = getDaysUntilDate(debt.dueDate);
              const currentBalance = debt.currentBalance || debt.amount;
              
              return (
                <div
                  key={debt.id}
                  className={`p-4 rounded-xl border-l-4 ${debtStatus.bgColor} ${
                    debtStatus.status === 'overdue' ? 'border-l-danger-500' :
                    debtStatus.status === 'due-soon' ? 'border-l-warning-500' : 'border-l-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-neutral-900 mb-1">
                        {debt.lenderName}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {debt.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {debtStatus.status === 'overdue' && (
                        <AlertTriangle className="h-5 w-5 text-danger-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(debt.id)}
                        className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-neutral-500 mb-1">Current Balance</div>
                      <div className="font-semibold text-neutral-900">
                        {formatCurrency(currentBalance)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-neutral-500 mb-1">Due Date</div>
                      <div className={`font-medium ${debtStatus.color} flex items-center space-x-1`}>
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(debt.dueDate)}</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {daysUntil < 0 
                          ? `${Math.abs(daysUntil)} days overdue`
                          : `${daysUntil} days left`
                        }
                      </div>
                    </div>
                    
                    {debt.interestRate && (
                      <div>
                        <div className="text-neutral-500 mb-1">Interest Rate</div>
                        <div className="font-medium text-neutral-900 flex items-center space-x-1">
                          <Percent className="h-4 w-4" />
                          <span>{debt.interestRate}%</span>
                        </div>
                      </div>
                    )}
                    
                    {debt.minimumPayment && (
                      <div>
                        <div className="text-neutral-500 mb-1">Min. Payment</div>
                        <div className="font-medium text-neutral-900">
                          {formatCurrency(debt.minimumPayment)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No debts recorded</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

DebtList.displayName = 'DebtList';