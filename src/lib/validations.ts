import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  tags: z.array(z.string()).optional(),
  recurring: z.boolean().optional(),
  recurringInterval: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
});

export const debtSchema = z.object({
  lenderName: z.string().min(1, 'Lender name is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  dueDate: z.string().min(1, 'Due date is required'),
  interestRate: z.number().min(0).max(100).optional(),
  description: z.string().min(1, 'Description is required'),
  minimumPayment: z.number().min(0).optional(),
  currentBalance: z.number().min(0).optional(),
});

export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  limit: z.number().min(0.01, 'Budget limit must be greater than 0'),
  period: z.enum(['monthly', 'yearly']),
  alertThreshold: z.number().min(0).max(100).optional(),
  color: z.string().optional(),
});

export const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required'),
  targetAmount: z.number().min(0.01, 'Target amount must be greater than 0'),
  currentAmount: z.number().min(0).default(0),
  targetDate: z.string().min(1, 'Target date is required'),
  category: z.enum(['emergency', 'investment', 'purchase', 'travel', 'other']),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type DebtFormData = z.infer<typeof debtSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
export type GoalFormData = z.infer<typeof goalSchema>;