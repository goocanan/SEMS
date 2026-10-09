import { Currency } from '../constants/enums';

export function formatCurrency(amount: number | null | undefined, currency: Currency | string = Currency.USD): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const curr = (currency || 'USD').toUpperCase();

  switch (curr) {
    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(amount);

    case 'CNY':
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        maximumFractionDigits: 0,
      }).format(amount);

    case 'EUR':
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }).format(amount);

    case 'JPY':
      return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        maximumFractionDigits: 0,
      }).format(amount);

    case 'IDR':
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(amount);

    default:
      return `${curr} ${amount.toLocaleString('en-US')}`;
  }
}
