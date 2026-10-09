import { BUSINESS_RULES } from '../constants/business-rules';
import { ValidityLevel } from '../constants/enums';
import { ValidityStatus } from '../types/common';
import { daysRemaining, formatDate } from './date';

/**
 * Calculates EGIS validity status based on BR-03:
 * - > 60 days: VALID (Green)
 * - 31 - 60 days: CAUTION (Yellow)
 * - 8 - 30 days: WARNING (Orange)
 * - 1 - 7 days: URGENT (Red)
 * - <= 0 days: EXPIRED (Red)
 */
export function calculateEgisValidity(expiryDate: string, fromDate?: string | Date): ValidityStatus {
  const days = daysRemaining(expiryDate, fromDate);
  const isExpired = days <= 0;

  let level: ValidityLevel;
  let label: string;

  if (days <= 0) {
    level = ValidityLevel.EXPIRED;
    label = 'Expired';
  } else if (days <= BUSINESS_RULES.EGIS_THRESHOLDS.URGENT_DAYS) {
    level = ValidityLevel.URGENT;
    label = `${days}d left`;
  } else if (days <= BUSINESS_RULES.EGIS_THRESHOLDS.WARNING_DAYS) {
    level = ValidityLevel.WARNING;
    label = `${days}d left`;
  } else if (days <= BUSINESS_RULES.EGIS_THRESHOLDS.CAUTION_DAYS) {
    level = ValidityLevel.CAUTION;
    label = `${days}d left`;
  } else {
    level = ValidityLevel.VALID;
    label = `${days}d valid`;
  }

  return {
    daysRemaining: days,
    level,
    isExpired,
    expiryDate,
    label,
  };
}

/**
 * Calculates Price validity status based on BR-04:
 * - > 30 days: VALID (Green)
 * - 8 - 30 days: CAUTION (Yellow)
 * - 1 - 7 days: WARNING / URGENT (Orange)
 * - <= 0 days: EXPIRED (Red)
 */
export function calculatePriceValidity(priceExpiryDate: string, fromDate?: string | Date): ValidityStatus {
  const days = daysRemaining(priceExpiryDate, fromDate);
  const isExpired = days <= 0;

  let level: ValidityLevel;
  let label: string;

  if (days <= BUSINESS_RULES.PRICE_THRESHOLDS.EXPIRED_DAYS) {
    level = ValidityLevel.EXPIRED;
    label = 'Expired';
  } else if (days <= BUSINESS_RULES.PRICE_THRESHOLDS.URGENT_DAYS) {
    level = ValidityLevel.URGENT;
    label = `${days}d left`;
  } else if (days <= BUSINESS_RULES.PRICE_THRESHOLDS.CAUTION_DAYS) {
    level = ValidityLevel.CAUTION;
    label = `${days}d left`;
  } else {
    level = ValidityLevel.VALID;
    label = `${days}d valid`;
  }

  return {
    daysRemaining: days,
    level,
    isExpired,
    expiryDate: priceExpiryDate,
    label,
  };
}

export function getValidityColorClass(level: ValidityLevel): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (level) {
    case ValidityLevel.VALID:
      return {
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-500',
      };
    case ValidityLevel.CAUTION:
      return {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-500/30',
        dot: 'bg-amber-500',
      };
    case ValidityLevel.WARNING:
      return {
        bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-500/30',
        dot: 'bg-orange-500',
      };
    case ValidityLevel.URGENT:
    case ValidityLevel.EXPIRED:
      return {
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500',
      };
  }
}
