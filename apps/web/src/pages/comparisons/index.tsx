import React, { useState } from 'react';
import { MOCK_COMPARISON_REPORT } from '@/mocks/sems-data';
import { DiffItem, DiffType } from '@sems/shared';
import { GitCompare, CheckCircle2, XCircle, ArrowRight, FileSpreadsheet } from 'lucide-react';
import { useProjectStore } from '@/stores/project-store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const ComparisonsPage: React.FC = () => {
  const navigate = useNavigate();
  const { createRevision } = useProjectStore();
  const [diffs, setDiffs] = useState<DiffItem[]>(MOCK_COMPARISON_REPORT.diffs);

  const handleApprove = (id: string, name: string) => {
    setDiffs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isApproved: true, isRejected: false } : d))
    );
    toast.success(`Approved change: ${name}`);
  };

  const handleReject = (id: string, name: string) => {
    setDiffs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isRejected: true, isApproved: false } : d))
    );
    toast.error(`Rejected change: ${name}`);
  };

  const handleApproveAll = () => {
    setDiffs((prev) => prev.map((d) => ({ ...d, isApproved: true, isRejected: false })));
    toast.success('All specification differences approved!');
  };

  const approvedCount = diffs.filter((d) => d.isApproved).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Specification Comparison & Diff Audit
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit delta variations between SEQ revisions or incoming tender Excel files before generating a new SEQ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApproveAll}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Approve All Delta Changes ({diffs.length})
          </button>
          <button
            onClick={() => {
              createRevision({
                egisRefId: 'egis-001',
                egisId: 'HDE-26000125',
                seqNumber: 6,
                revisionLabel: 'FUP REV 2 (Approved Delta Spec Check)',
                price: 137500,
                currency: 'USD' as any,
                notes: `Generated from Diff Audit comparison with ${approvedCount} delta changes approved.`,
                sourceFileName: 'HDE-26000125_006_FUP_DeltaApproved.xlsx',
              });
              toast.success('Generated Sequence SEQ 006 with approved delta values! Transferred to Approvals Queue.');
              navigate('/approvals');
            }}
            disabled={approvedCount === 0}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm disabled:opacity-50 transition-all"
          >
            Generate Next SEQ →
          </button>
        </div>
      </div>

      {/* Comparison Overview Header Card */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">
              {MOCK_COMPARISON_REPORT.title}
            </span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-muted">
              {MOCK_COMPARISON_REPORT.baseEgisId}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Comparing Base <strong className="font-mono">SEQ {MOCK_COMPARISON_REPORT.baseSeqCode}</strong> with Target <strong className="font-mono">SEQ {MOCK_COMPARISON_REPORT.targetSeqCode}</strong>.
          </p>
        </div>

        {/* Change stats pills */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            {diffs.filter((d) => d.diffType === DiffType.ADDED).length} Added
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
            {diffs.filter((d) => d.diffType === DiffType.MODIFIED).length} Modified
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
            {diffs.filter((d) => d.diffType === DiffType.REMOVED).length} Removed
          </span>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">
            {approvedCount}/{diffs.length} Approved
          </span>
        </div>
      </div>

      {/* Side-by-Side Diff Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Field Specification</th>
                <th className="py-3 px-4">Base Value (SEQ 004)</th>
                <th className="py-3 px-4">Target Value (SEQ 005)</th>
                <th className="py-3 px-4">Reason / Comment</th>
                <th className="py-3 px-4 text-right">Review Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {diffs.map((diff) => (
                <tr
                  key={diff.id}
                  className={
                    diff.diffType === DiffType.ADDED
                      ? 'bg-emerald-500/5'
                      : diff.diffType === DiffType.MODIFIED
                      ? 'bg-amber-500/5'
                      : 'bg-rose-500/5'
                  }
                >
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        diff.diffType === DiffType.ADDED
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : diff.diffType === DiffType.MODIFIED
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-rose-500/10 text-rose-600'
                      }`}
                    >
                      {diff.diffType}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-foreground block">{diff.fieldLabel}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{diff.category}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-muted-foreground line-through">
                    {diff.oldFormatted}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                    {diff.newFormatted}
                  </td>

                  <td className="py-3.5 px-4 text-muted-foreground italic">
                    {diff.reviewComment || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {diff.isApproved ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : diff.isRejected ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-semibold text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(diff.id, diff.fieldLabel)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(diff.id, diff.fieldLabel)}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[11px] transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
