
import { Goal } from '../types';

export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  return Math.min(100, (current / target) * 100);
};

export const getDaysRemaining = (targetDate: string): number => {
  const target = new Date(targetDate);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

export const getWeeklyRequired = (targetAmount: number, currentAmount: number, targetDate: string): number => {
  const remaining = Math.max(0, targetAmount - currentAmount);
  const days = getDaysRemaining(targetDate);
  const weeks = Math.ceil(days / 7);
  return weeks > 0 ? remaining / weeks : remaining;
};

export const getDailyRequired = (weeklyRequired: number): number => {
  return weeklyRequired / 7;
};

export const formatCurrency = (amount: number, currency: string = 'COP'): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};
