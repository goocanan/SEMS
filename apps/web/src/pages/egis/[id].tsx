import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/stores/project-store';
import { ValidityBadge } from '@/components/shared/validity-badge';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { StatusBadge } from '@/components/shared/status-badge';
import {
  ArrowLeft,
  UploadCloud,
  GitCompare,
  Layers,
  Building,
  Calendar,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { toast } from 'sonner';

export const EgisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { egisList, revisions, projects } = useProjectStore();

  const egis = React.useMemo(() => {
    const direct = egisList.find((e) => e.egisId === id);
    if (direct) return direct;

    // Check project egis summaries
    for (const p of projects) {
      const match = p.egisSummaries?.find((e) => e.egisId === id);
      if (match) {
        return {
          id: match.id,
          egisId: match.egisId,
          projectId: p.id,
          projectName: p.name,
          projectCode: p.projectCode,
          aliasName: match.aliasName || `${p.name} Package`,
          currency: match.currency as any,
          production: match.production as any,
          port: 'Shanghai Port',
          warrantyMonths: 12,
          issueDate: p.createdAt,
          expiryDate: match.egisValidity.expiryDate,
          currentSeqNumber: match.latestSeqNumber,
          latestPrice: match.latestPrice,
          egisValidity: match.egisValidity,
          priceValidity: match.priceValidity,
          status: 'ACTIVE' as any,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        };
      }
    }
    return egisList[0];
  }, [id, egisList, projects]);

  const egisRevisions = revisions.filter((r) => r.egisId === egis?.egisId);
  const displayRevisions = egisRevisions.length > 0 ? egisRevisions : revisions.slice(0, 3);

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/egis')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to EGIS Master</span>
      </button>

      {/* EGIS Hero Card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-extrabold text-foreground tracking-tight">
                {egis.egisId}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                SEQ 00{egis.currentSeqNumber}
              </span>
            </div>
            <div className="text-sm font-semibold text-foreground">
              {egis.aliasName}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building className="w-3.5 h-3.5" />
              <span>Project: </span>
              <button
                onClick={() => navigate(`/projects/${egis.projectId}`)}
                className="font-semibold text-primary hover:underline"
              >
                {egis.projectName} ({egis.projectCode})
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info('Excel upload modal opened for ' + egis.egisId)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload New SEQ</span>
            </button>
            <button
              onClick={() => navigate(`/projects/${egis.projectId}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold transition-all"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare Revisions</span>
            </button>
          </div>
        </div>

        {/* Commercial Grid Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-border/80 text-xs">
          <div>
            <span className="text-muted-foreground block text-[11px]">Production Origin</span>
            <span className="font-semibold text-foreground">{egis.production} Factory</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Quotation Currency</span>
            <span className="font-mono font-semibold text-foreground">{egis.currency}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Port of Shipment</span>
            <span className="font-medium text-foreground">{egis.port}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Warranty Period</span>
            <span className="font-mono font-semibold text-foreground">{egis.warrantyMonths} Months</span>
          </div>
        </div>

        {/* Validity Summary Row */}
        <div className="pt-2 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">EGIS Validity (180d):</span>
            {egis.egisValidity && <ValidityBadge validity={egis.egisValidity} type="EGIS" />}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Price Validity (30d):</span>
            {egis.priceValidity && <ValidityBadge validity={egis.priceValidity} type="Price" />}
          </div>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-muted-foreground font-sans">Latest Quoted Price:</span>
            <CurrencyDisplay
              amount={egis.latestPrice}
              currency={egis.currency}
              className="text-base font-bold text-foreground"
            />
          </div>
        </div>
      </div>

      {/* SEQ Timeline under this EGIS */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-foreground">
            Revision Sequences for {egis.egisId}
          </h2>
          <p className="text-xs text-muted-foreground">
            Complete lineage of quotations and design specifications
          </p>
        </div>

        <div className="space-y-4">
          {displayRevisions.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-sm text-foreground">
                    SEQ {rev.seqCode}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted">
                    {rev.revisionLabel}
                  </span>
                  <StatusBadge status={rev.process} />
                </div>
                <div className="flex items-center gap-2">
                  <CurrencyDisplay amount={rev.price} currency={rev.currency} className="font-bold text-sm" />
                  {rev.priceValidity && <ValidityBadge validity={rev.priceValidity} type="Price" size="sm" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{rev.notes}</p>
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                <span>File: {rev.sourceFileName}</span>
                <span>By {rev.createdByName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
