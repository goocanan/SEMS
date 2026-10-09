import React, { useState, useRef, useMemo } from 'react';
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
  Edit3,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { parseExcelSpecification } from '@/lib/excel-parser';
import { toast } from 'sonner';

const STANDARD_MODELS = [
  { id: 'LUXEN-MR', label: 'LUXEN-MR (Passenger Machine Room - Standard)' },
  { id: 'NEW YZER', label: 'NEW YZER (Passenger MRL - Machine Roomless)' },
  { id: 'LUXEN-BED', label: 'LUXEN-BED (Hospital & Stretcher Medical Lift)' },
  { id: 'FREIGHT-MRL', label: 'FREIGHT-MRL (Heavy Duty Cargo & Goods Lift)' },
  { id: 'LUXEN-PANORAMIC', label: 'LUXEN-PANORAMIC (Glass Observation Lift)' },
  { id: 'NEW YZER-VILLA', label: 'NEW YZER-VILLA (Home & Compact Villa Lift)' },
  { id: 'HYBRID-ESCALATOR', label: 'HYBRID-ESCALATOR (Commercial Public Duty)' },
];

export const EgisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    egisList,
    revisions,
    projects,
    addDocument,
    createRevision,
    updateEgisModel,
  } = useProjectStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const egis = useMemo(() => {
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

  // Edit Model Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState('LUXEN-MR');
  const [customModel, setCustomModel] = useState('');
  const [aliasNameInput, setAliasNameInput] = useState(egis?.aliasName || '');
  const [createNewSeq, setCreateNewSeq] = useState(true);

  const handleSaveModelChange = () => {
    const finalModel = customModel.trim() || selectedModel;
    if (!finalModel) {
      toast.error('Please specify a model name');
      return;
    }

    updateEgisModel(egis.egisId, finalModel, aliasNameInput.trim(), createNewSeq);
    toast.success(
      `Model for ${egis.egisId} changed to "${finalModel}"! ${
        createNewSeq ? 'New sequence created in queue.' : ''
      }`
    );
    setShowEditModal(false);
  };

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
              <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                SEQ 00{egis.currentSeqNumber}
              </span>
            </div>
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>{egis.aliasName}</span>
              <button
                onClick={() => {
                  setAliasNameInput(egis.aliasName || '');
                  setShowEditModal(true);
                }}
                className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
                title="Change Model or Package Name"
              >
                <Edit3 className="w-3 h-3" />
                <span>Change Model</span>
              </button>
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

          {/* Hidden File Input for Excel */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".xlsx,.xls,.csv"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                const parsed = await parseExcelSpecification(file);
                addDocument({
                  name: file.name,
                  type: 'Excel',
                  size: parsed.fileSize,
                  project: egis.projectName,
                });

                const nextSeq = (displayRevisions[0]?.seqNumber || egis.currentSeqNumber || 1) + 1;
                createRevision({
                  egisRefId: egis.id,
                  egisId: egis.egisId,
                  seqNumber: nextSeq,
                  revisionLabel: `SPEC CHECK REV ${nextSeq}`,
                  price: parsed.detectedPrice || egis.latestPrice,
                  currency: egis.currency,
                  sourceFileName: file.name,
                  notes: `Uploaded via Excel Parser (${parsed.confidenceAvg}% confidence)`,
                });

                toast.success(`Successfully uploaded "${file.name}" and created SEQ 00${nextSeq}!`);
              } catch (err: any) {
                toast.error('Failed to parse Excel file: ' + (err?.message || 'Invalid format'));
              } finally {
                if (fileInputRef.current) fileInputRef.current.value = '';
              }
            }}
          />

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAliasNameInput(egis.aliasName || '');
                setShowEditModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-primary" />
              <span>Change Model</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload New SEQ Excel</span>
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

      {/* EDIT MODEL DIALOG MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-primary" />
                  Change Elevator Model for {egis.egisId}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update model designation and package description for this EGIS quotation option.
                </p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1.5 text-foreground">
                  Select Hyundai Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-border bg-background font-medium"
                >
                  {STANDARD_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                  <option value="CUSTOM">Custom / Other Model...</option>
                </select>
              </div>

              {selectedModel === 'CUSTOM' && (
                <div>
                  <label className="font-semibold block mb-1 text-foreground">
                    Custom Model Name
                  </label>
                  <input
                    type="text"
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="e.g. THE EL (High Speed Double Deck)"
                    className="w-full p-2 rounded-lg border border-border bg-background"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold block mb-1 text-foreground">
                  Package / Alternative Alias Name
                </label>
                <input
                  type="text"
                  value={aliasNameInput}
                  onChange={(e) => setAliasNameInput(e.target.value)}
                  placeholder="e.g. Passenger High Rise (Option 2 - MRL)"
                  className="w-full p-2.5 rounded-lg border border-border bg-background"
                />
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="createSeq"
                  checked={createNewSeq}
                  onChange={(e) => setCreateNewSeq(e.target.checked)}
                  className="mt-0.5 rounded border-border"
                />
                <label htmlFor="createSeq" className="cursor-pointer text-muted-foreground leading-relaxed">
                  <strong className="text-foreground block">
                    Record model change as new sequence (Recommended)
                  </strong>
                  Bumps sequence to SEQ 00{egis.currentSeqNumber + 1} and preserves the previous model in the audit history.
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl border border-border hover:bg-muted font-semibold text-xs text-muted-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModelChange}
                className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition-all"
              >
                Save Model Change
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground">
                    {rev.revisionLabel}
                  </span>
                  <StatusBadge status={rev.process} />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CurrencyDisplay
                    amount={rev.price}
                    currency={rev.currency}
                    className="font-bold text-sm"
                  />
                  {rev.priceValidity && (
                    <ValidityBadge validity={rev.priceValidity} type="Price" size="sm" />
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">{rev.notes}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>Source: <strong className="font-mono text-foreground">{rev.sourceFileName || 'N/A'}</strong></span>
                  <span>By: {rev.createdByName || 'Estimator'}</span>
                  {rev.approvedByName && <span>Approved by: {rev.approvedByName}</span>}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/comparisons')}
                    className="font-semibold text-primary hover:underline"
                  >
                    Compare Diffs →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
