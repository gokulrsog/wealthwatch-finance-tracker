import React from 'react';
import { Trash2, Target, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { deleteGoal } from '@/lib/storage';

interface GoalWithProgress {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'emergency' | 'investment' | 'purchase' | 'travel' | 'other';
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  progress: number;
  daysRemaining: number;
}

interface GoalListProps {
  goals: GoalWithProgress[];
  onRefresh: () => void;
}

export const GoalList = React.memo<GoalListProps>(({ goals, onRefresh }) => {
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-danger-600 bg-danger-50';
      case 'medium':
        return 'text-warning-600 bg-warning-50';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency':
        return '🛡️';
      case 'investment':
        return '📈';
      case 'purchase':
        return '🛍️';
      case 'travel':
        return '✈️';
      default:
        return '🎯';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 0.8) return 'bg-success-500';
    if (progress >= 0.5) return 'bg-warning-500';
    return 'bg-accent-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goals ({goals.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {goals.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const progressPercentage = Math.min(goal.progress * 100, 100);
              const isCompleted = goal.progress >= 1;
              const isOverdue = goal.daysRemaining < 0 && !isCompleted;
              
              return (
                <div
                  key={goal.id}
                  className={`p-4 rounded-xl border ${
                    isCompleted 
                      ? 'bg-success-50 border-success-200' 
                      : isOverdue 
                      ? 'bg-danger-50 border-danger-200'
                      : 'bg-white border-neutral-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h4 className="font-semibold text-neutral-900">
                          {goal.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-neutral-500 capitalize">
                            {goal.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                      className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {goal.description && (
                    <p className="text-sm text-neutral-600 mb-3">
                      {goal.description}
                    </p>
                  )}
                  
                  {/* Progress */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-600">Progress</span>
                        <span className={isCompleted ? 'text-success-600 font-medium' : 'text-neutral-900'}>
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-neutral-500">Saved</div>
                        <div className="font-medium text-neutral-900">
                          {formatCurrency(goal.currentAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-neutral-500">Target</div>
                        <div className="font-medium text-neutral-900">
                          {formatCurrency(goal.targetAmount)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-100">
                      <div className="flex items-center space-x-1 text-neutral-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(goal.targetDate)}</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${
                        isCompleted 
                          ? 'text-success-600' 
                          : isOverdue 
                          ? 'text-danger-600' 
                          : 'text-neutral-600'
                      }`}>
                        <Target className="h-4 w-4" />
                        <span>
                          {isCompleted 
                            ? 'Completed!' 
                            : isOverdue 
                            ? `${Math.abs(goal.daysRemaining)} days overdue`
                            : `${goal.daysRemaining} days left`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-neutral-500">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No goals set yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

GoalList.displayName = 'GoalList';