import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { budgetSchema, type BudgetFormData } from '@/lib/validations';
import { addBudget } from '@/lib/storage';

interface BudgetFormProps {
  onSuccess: () => void;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Health & Fitness',
  'Travel',
  'Education',
  'Other'
];

export const BudgetForm = React.memo<BudgetFormProps>(({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: 'monthly',
      alertThreshold: 80,
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    try {
      await addBudget({
        ...data,
        limit: Number(data.limit),
        alertThreshold: data.alertThreshold ? Number(data.alertThreshold) : undefined,
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category
          </label>
          <select
            {...register('category')}
            className="input-field"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-danger-600 mt-1">{errors.category.message}</p>
          )}
        </div>

        <Input
          label="Budget Limit"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.limit?.message}
          {...register('limit', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Period
          </label>
          <select
            {...register('period')}
            className="input-field"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          {errors.period && (
            <p className="text-sm text-danger-600 mt-1">{errors.period.message}</p>
          )}
        </div>

        <Input
          label="Alert Threshold (%)"
          type="number"
          min="1"
          max="100"
          placeholder="80"
          error={errors.alertThreshold?.message}
          {...register('alertThreshold', { valueAsNumber: true })}
        />
      </div>

      <div className="bg-neutral-50 rounded-xl p-4">
        <h4 className="font-medium text-neutral-900 mb-2">Budget Tips</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>• Set realistic limits based on your historical spending</li>
          <li>• Use the alert threshold to get notified before overspending</li>
          <li>• Review and adjust your budgets regularly</li>
        </ul>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-neutral-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset();
            onSuccess();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Budget
        </Button>
      </div>
    </form>
  );
});

BudgetForm.displayName = 'BudgetForm';