import React from 'react';
import { Process, ProjectStatus, RevisionStatus } from '@sems/shared';

interface StatusBadgeProps {
  status: Process | ProjectStatus | RevisionStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  switch (status) {
    case Process.QUOTATION:
      badgeStyle = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50';
      break;
    case Process.FUP:
      badgeStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50';
      break;
    case Process.APPROVAL:
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50';
      break;
    case Process.SPEC_CHECK:
      badgeStyle = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50';
      break;
    case Process.FINAL:
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50';
      break;
    case ProjectStatus.ACTIVE:
    case RevisionStatus.APPROVED:
      badgeStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50';
      break;
    case RevisionStatus.PENDING_REVIEW:
      badgeStyle = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50';
      break;
    case RevisionStatus.REJECTED:
    case ProjectStatus.LOST:
      badgeStyle = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${badgeStyle} ${className}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};
