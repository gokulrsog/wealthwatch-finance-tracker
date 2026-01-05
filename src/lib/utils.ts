import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

export function formatCurrencyDetailed(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'MMM dd, yyyy');
}

export function formatDateShort(date: string): string {
  return format(parseISO(date), 'MMM dd');
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

export function getMonthlyDateRange(monthsBack: number = 0) {
  const targetDate = subMonths(new Date(), monthsBack);
  return {
    start: startOfMonth(targetDate),
    end: endOfMonth(targetDate)
  };
}

export function isDateInRange(date: string, start: Date, end: Date): boolean {
  const targetDate = parseISO(date);
  return isWithinInterval(targetDate, { start, end });
}

export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function getTrendDirection(trend: number): 'increasing' | 'decreasing' | 'stable' {
  if (Math.abs(trend) < 5) return 'stable';
  return trend > 0 ? 'increasing' : 'decreasing';
}

export function getDaysUntilDate(dateString: string): number {
  const targetDate = parseISO(dateString);
  return differenceInDays(targetDate, new Date());
}

export function getFinancialHealthColor(score: number): string {
  if (score >= 80) return 'text-success-600';
  if (score >= 60) return 'text-warning-600';
  return 'text-danger-600';
}

export function getCategoryColor(category: string): string {
  const colors = {
    'Food & Dining': 'bg-red-500',
    'Transportation': 'bg-blue-500',
    'Shopping': 'bg-purple-500',
    'Entertainment': 'bg-pink-500',
    'Bills & Utilities': 'bg-orange-500',
    'Health & Fitness': 'bg-green-500',
    'Travel': 'bg-indigo-500',
    'Education': 'bg-yellow-500',
    'Investment': 'bg-teal-500',
    'Income': 'bg-emerald-500',
    'Other': 'bg-gray-500'
  };
  return colors[category as keyof typeof colors] || 'bg-gray-500';
}

export function exportToCSV(data: any[], filename: string) {
  const csv = convertToCSV(data);
  downloadCSV(csv, filename);
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(value => 
      typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
    ).join(',')
  );
  
  return [headers, ...rows].join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}