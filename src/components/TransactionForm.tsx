import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { transactionSchema, type TransactionFormData } from '@/lib/validations';
import { addTransaction } from '@/lib/storage';

interface TransactionFormProps {
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
  'Investment',
  'Income',
  'Other'
];

export const TransactionForm = React.memo<TransactionFormProps>(({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const transactionType = watch('type');

  const onSubmit = async (data: TransactionFormData) => {
    try {
      await addTransaction({
        ...data,
        amount: Number(data.amount),
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Type
          </label>
          <select
            {...register('type')}
            className="input-field"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          {errors.type && (
            <p className="text-sm text-danger-600 mt-1">{errors.type.message}</p>
          )}
        </div>

        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
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
          label="Date"
          type="date"
          error={errors.date?.message}
          {...register('date')}
        />
      </div>

      <Input
        label="Description"
        placeholder="Enter transaction description"
        error={errors.description?.message}
        {...register('description')}
      />

      <Input
        label="Subcategory (Optional)"
        placeholder="e.g., Groceries, Gas, Salary"
        error={errors.subcategory?.message}
        {...register('subcategory')}
      />

      <div className="flex items-center space-x-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('recurring')}
            className="rounded border-neutral-300 text-accent-600 focus:border-accent-500 focus:ring-accent-500"
          />
          <span className="text-sm text-neutral-700">Recurring transaction</span>
        </label>
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
          {transactionType === 'income' ? 'Add Income' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
});

TransactionForm.displayName = 'TransactionForm';