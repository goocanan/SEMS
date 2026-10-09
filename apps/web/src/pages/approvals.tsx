import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useProjectStore } from '@/stores/project-store';
import { RevisionStatus } from '@sems/shared';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { StatusBadge } from '@/components/shared/status-badge';
import { toast } from 'sonner';

export const ApprovalsPage: React.FC = () => {
  const navigate = useNavigate();
  const { revisions, approveRevision, rejectRevision } = useProjectStore();

  const pendingRevisions = revisions.filter(
    (rev) => rev.status === RevisionStatus.PENDING_REVIEW || (rev.status as string) === 'PENDING_REVIEW'
  );

  const handleApprove = (revId: string, seqCode: string) => {
    approveRevision(revId);
    toast.success(`Approved SEQ ${seqCode} successfully! Status updated to Approved.`);
  };

  const handleReject = (revId: string, seqCode: string) => {
    rejectRevision(revId, 'Specifications require revision adjustments');
    toast.error(`Rejected SEQ ${seqCode}. Logged to audit trail.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Pending Approvals Queue
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Review specifications and revision sequences submitted by estimators awaiting Lead Estimator or Management sign-off.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
          <span>{pendingRevisions.length} Pending Review</span>
        </div>
      </div>

      {pendingRevisions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-foreground">All caught up!</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            There are currently no revisions pending approval. All submitted sequences have been processed.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-2 text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            Go to Projects Portfolio <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRevisions.map((rev) => (
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
                  <span>Submitted by: <strong className="text-foreground">{rev.createdByName || 'Estimator'}</strong></span>
                  <span>Source File: <strong className="font-mono text-foreground">{rev.sourceFileName || 'N/A'}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/comparisons')}
                    className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted font-semibold transition-colors"
                  >
                    View Diff Audit
                  </button>
                  <button
                    onClick={() => handleApprove(rev.id, rev.seqCode)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm"
                  >
                    Approve SEQ
                  </button>
                  <button
                    onClick={() => handleReject(rev.id, rev.seqCode)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors shadow-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
