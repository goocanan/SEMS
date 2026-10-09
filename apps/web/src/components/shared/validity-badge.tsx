import React from 'react';
import { ValidityLevel, ValidityStatus, getValidityColorClass, formatDate } from '@sems/shared';
import { ShieldAlert, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';

interface ValidityBadgeProps {
  validity: ValidityStatus;
  type?: 'EGIS' | 'Price';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const ValidityBadge: React.FC<ValidityBadgeProps> = ({
  validity,
  type = 'EGIS',
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const { level, daysRemaining, isExpired, expiryDate, label } = validity;
  const styles = getValidityColorClass(level);

  const getIcon = () => {
    if (isExpired) return <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />;
    if (level === ValidityLevel.URGENT) return <Clock className="w-3.5 h-3.5 text-rose-500" />;
    if (level === ValidityLevel.WARNING || level === ValidityLevel.CAUTION)
      return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
    return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size];

  return (
    <div
      title={`${type} Validity: expires on ${formatDate(expiryDate)} (${daysRemaining} days remaining)`}
      className={`inline-flex items-center rounded-full border transition-all duration-150 ${styles.bg} ${styles.border} ${sizeClasses} ${className}`}
    >
      {showIcon && getIcon()}
      <span className="font-mono">{label}</span>
      {type && (
        <span className="text-[10px] uppercase tracking-wider opacity-60 font-sans">
          {type}
        </span>
      )}
    </div>
  );
};
