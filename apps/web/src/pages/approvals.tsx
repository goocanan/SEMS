import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react';
import { MOCK_REVISIONS } from '@/mocks/sems-data';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { StatusBadge } from '@/components/shared/status-badge';
import { toast } from 'sonner';

export const ApprovalsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Pending Approvals Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review specifications and revision sequences submitted by estimators awaiting Lead Estimator or Management sign-off.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_REVISIONS.slice(0, 3).map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-primary">{rev.egisId}</span>
                  <span className="font-mono font-semibold text-xs px-2 py-0.5 rounded bg-muted">
                    SEQ {rev.seqCode}
                  </span>
                  <StatusBadge status={rev.process} />
                </div>
                <h2 className="text-sm font-semibold text-foreground">{rev.revisionLabel}</h2>
              </div>

              <div className="flex items-center gap-2">
                <CurrencyDisplay amount={rev.price} currency={rev.currency} className="text-base font-bold" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">{rev.notes}</p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60 text-xs">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>Submitted by: <strong className="text-foreground">{rev.createdByName}</strong></span>
                <span>Source File: <strong className="font-mono text-foreground">{rev.sourceFileName}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/comparisons')}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted font-semibold transition-colors"
                >
                  View Diff Audit
                </button>
                <button
                  onClick={() => toast.success(`Approved SEQ ${rev.seqCode}`)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                >
                  Approve SEQ
                </button>
                <button
                  onClick={() => toast.error(`Rejected SEQ ${rev.seqCode}`)}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
