export function parseIsoDate(dateStr: string | Date): Date {
  if (dateStr instanceof Date) return dateStr;
  return new Date(dateStr);
}

export function daysBetween(from: string | Date, to: string | Date): number {
  const d1 = parseIsoDate(from);
  const d2 = parseIsoDate(to);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function daysRemaining(targetDate: string | Date, fromDate: string | Date = new Date()): number {
  return daysBetween(fromDate, targetDate);
}

export function formatDate(dateStr: string | Date | undefined | null, formatType: 'short' | 'medium' | 'long' = 'medium'): string {
  if (!dateStr) return '—';
  const d = parseIsoDate(dateStr);
  if (isNaN(d.getTime())) return '—';

  if (formatType === 'short') {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  if (formatType === 'long') {
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function addDays(dateStr: string | Date, days: number): string {
  const d = new Date(parseIsoDate(dateStr));
  d.setDate(d.getDate() + days);
  return d.toISOString();
}
