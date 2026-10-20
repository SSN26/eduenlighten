import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: 'USD' | 'ZWL' = 'USD'): string {
  if (amount === 0) return 'Free';
  return currency === 'USD' ? `$${amount}` : `ZWL ${amount.toLocaleString()}`;
}
