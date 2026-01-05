import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { debtSchema, type DebtFormData } from '@/lib/validations';
import { addDebt } from '@/lib/storage';

interface DebtFormProps {
  onSuccess: () => void;
}

export const DebtForm = React.memo<DebtFormProps>(({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    },
  });

  const onSubmit = async (data: DebtFormData) => {
    try {
      await addDebt({
        ...data,
        amount: Number(data.amount),
        interestRate: data.interestRate ? Number(data.interestRate) : undefined,
        minimumPayment: data.minimumPayment ? Number(data.minimumPayment) : undefined,
        currentBalance: data.currentBalance ? Number(data.currentBalance) : Number(data.amount),
      });
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error adding debt:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Lender Name"
          placeholder="e.g., Chase Credit Card, Student Loan"
          error={errors.lenderName?.message}
          {...register('lenderName')}
        />

        <Input
          label="Total Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          {...register('amount', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />

        <Input
          label="Interest Rate (%)"
          type="number"
          step="0.01"
          placeholder="e.g., 18.99"
          error={errors.interestRate?.message}
          {...register('interestRate', { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Description"
        placeholder="Brief description of the debt"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Minimum Payment (Optional)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.minimumPayment?.message}
          {...register('minimumPayment', { valueAsNumber: true })}
        />

        <Input
          label="Current Balance (Optional)"
          type="number"
          step="0.01"
          placeholder="Leave blank to use total amount"
          error={errors.currentBalance?.message}
          {...register('currentBalance', { valueAsNumber: true })}
        />
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
          Add Debt
        </Button>
      </div>
    </form>
  );
});

DebtForm.displayName = 'DebtForm';