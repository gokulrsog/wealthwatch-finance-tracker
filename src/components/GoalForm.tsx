import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { goalSchema, type GoalFormData } from '@/lib/validations';
import { addGoal } from '@/lib/storage';

interface GoalFormProps {
  onSuccess: () => void;
}

export const GoalForm = React.memo<GoalFormProps>(({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      category: 'other',
      priority: 'medium',
      currentAmount: 0,
      targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    try {
      await addGoal({
        ...data,
        targetAmount: Number(data.targetAmount),
        currentAmount: Number(data.currentAmount),
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Goal Name"
        placeholder="e.g., Emergency Fund, New Car, Vacation"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Target Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.targetAmount?.message}
          {...register('targetAmount', { valueAsNumber: true })}
        />

        <Input
          label="Current Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.currentAmount?.message}
          {...register('currentAmount', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category
          </label>
          <select
            {...register('category')}
            className="input-field"
          >
            <option value="emergency">Emergency Fund</option>
            <option value="investment">Investment</option>
            <option value="purchase">Major Purchase</option>
            <option value="travel">Travel</option>
            <option value="other">Other</option>
          </select>
          {errors.category && (
            <p className="text-sm text-danger-600 mt-1">{errors.category.message}</p>
          )}
        </div>

        <Input
          label="Target Date"
          type="date"
          error={errors.targetDate?.message}
          {...register('targetDate')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Priority
          </label>
          <select
            {...register('priority')}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <p className="text-sm text-danger-600 mt-1">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <Input
        label="Description (Optional)"
        placeholder="Additional details about your goal"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="bg-accent-50 rounded-xl p-4">
        <h4 className="font-medium text-accent-900 mb-2">Goal Setting Tips</h4>
        <ul className="text-sm text-accent-800 space-y-1">
          <li>• Make your goals specific and measurable</li>
          <li>• Set realistic target dates to stay motivated</li>
          <li>• Break large goals into smaller milestones</li>
          <li>• Review and adjust your goals regularly</li>
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
          Create Goal
        </Button>
      </div>
    </form>
  );
});

GoalForm.displayName = 'GoalForm';