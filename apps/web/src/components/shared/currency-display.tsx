import React from 'react';
import { Currency, formatCurrency } from '@sems/shared';

interface CurrencyDisplayProps {
  amount: number | null | undefined;
  currency?: Currency | string;
  className?: string;
  isBold?: boolean;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = Currency.USD,
  className = '',
  isBold = true,
}) => {
  const formatted = formatCurrency(amount, currency);

  return (
    <span className={`font-mono tracking-tight ${isBold ? 'font-semibold' : 'font-normal'} ${className}`}>
      {formatted}
    </span>
  );
};
