import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MOCK_PROJECTS,
  MOCK_EGIS_DETAILS,
  MOCK_REVISIONS,
  MOCK_SPECIFICATION_SNAPSHOT,
  MOCK_COMPARISON_REPORT,
} from '@/mocks/sems-data';
import { ValidityBadge } from '@/components/shared/validity-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import {
  FolderKanban,
  Layers,
  FileSpreadsheet,
  FileText,
  History,
  GitCompare,
  DollarSign,
  ShieldCheck,
  Cpu,
  ScrollText,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { SPEC_CATEGORIES } from '@sems/shared';
import { toast } from 'sonner';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find project or fallback to first
  const project = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'egis'
    | 'specifications'
    | 'documents'
    | 'revisions'
    | 'comparison'
    | 'pricing'
    | 'validity'
    | 'generator'
    | 'audit'
  >('overview');

  interface TabItem {
    id: 'overview' | 'egis' | 'specifications' | 'documents' | 'revisions' | 'comparison' | 'pricing' | 'validity' | 'generator' | 'audit';
    label: string;
    icon: React.ElementType;
    count?: number;
  }

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: FolderKanban },
    { id: 'egis', label: 'EGIS Alternatives', icon: Layers, count: project.egisSummaries?.length },
    { id: 'specifications', label: 'Specification', icon: FileSpreadsheet },
    { id: 'documents', label: 'Documents', icon: FileText, count: 6 },
    { id: 'revisions', label: 'Revision History', icon: History, count: MOCK_REVISIONS.length },
    { id: 'comparison', label: 'Comparison', icon: GitCompare, count: 5 },
    { id: 'pricing', label: 'Pricing Trends', icon: DollarSign },
    { id: 'validity', label: 'Validity Tracker', icon: ShieldCheck },
    { id: 'generator', label: 'EGIS Generator', icon: Cpu },
    { id: 'audit', label: 'Audit Log', icon: ScrollText },
  ];

  return (
    <div className="space-y-6">
      {/* Project Header Card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {project.name}
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border">
                {project.projectCode}
              </span>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-xs text-muted-foreground">
              Customer: <strong className="text-foreground">{project.customerName}</strong>
              {project.endUser && ` • End User: ${project.endUser}`}
              {project.consultant && ` • Consultant: ${project.consultant}`}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => toast.info('New EGIS alternative modal opened')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add EGIS Alternative</span>
            </button>
          </div>
        </div>

        {/* Metadata Badges Bar */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/60">
          <span>📍 {project.location}</span>
          <span>🏗 {project.buildingType}</span>
          <span>⚡ {project.unitQuantity}x {project.productType}</span>
          <span>👤 Lead Marketing: {project.primaryMarketingName}</span>
          {project.supportingMarketing && (
            <span>👥 Support: {project.supportingMarketing.join(', ')}</span>
          )}
        </div>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="border-b border-border overflow-x-auto scrollbar-none flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Info details */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-foreground">Project Core Information</h2>
              <dl className="divide-y divide-border/60 text-xs">
                <div className="py-2 flex justify-between">
                  <dt className="text-muted-foreground">Customer</dt>
                  <dd className="font-semibold text-right">{project.customerName}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-muted-foreground">End User</dt>
                  <dd className="font-medium text-right">{project.endUser || '—'}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-muted-foreground">Consultant</dt>
                  <dd className="font-medium text-right">{project.consultant || '—'}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-muted-foreground">Contractor</dt>
                  <dd className="font-medium text-right">{project.contractor || '—'}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="font-medium text-right">{project.location}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-muted-foreground">Units</dt>
                  <dd className="font-mono font-semibold text-right">{project.unitQuantity} Elevators</dd>
                </div>
              </dl>
            </div>

            {/* Aliases Manager */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">Project Aliases ({project.aliases.length})</h2>
                <button
                  onClick={() => toast.info('Add alias')}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  + Add Alias
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                All tender nicknames resolve directly to this project when importing specs.
              </p>
              <div className="space-y-2">
                {project.aliases.map((al) => (
                  <div
                    key={al.id}
                    className="p-2.5 rounded-lg border border-border bg-muted/30 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium">{al.name}</span>
                    {al.isPrimary ? (
                      <span className="text-[10px] font-semibold text-primary px-2 py-0.5 rounded bg-primary/10">
                        Primary
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Alias</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Marketing Personnel */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-foreground">Marketing & Team</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border bg-muted/30 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-600 font-bold flex items-center justify-center text-xs">
                    BS
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{project.primaryMarketingName}</div>
                    <div className="text-[10px] text-muted-foreground">Primary Marketing PIC</div>
                  </div>
                </div>

                {project.supportingMarketing?.map((mkt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-border bg-muted/30 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                      {mkt.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{mkt}</div>
                      <div className="text-[10px] text-muted-foreground">Support Marketing</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* EGIS Alternatives Overview Section */}
          <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">EGIS Alternative Options</h2>
                <p className="text-xs text-muted-foreground">
                  1 Project can have multiple EGIS alternatives (e.g., China USD, China CNY, Korea USD)
                </p>
              </div>
              <button
                onClick={() => setActiveTab('egis')}
                className="text-xs text-primary font-semibold hover:underline"
              >
                View Detailed Table →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {project.egisSummaries?.map((egis) => (
                <div
                  key={egis.id}
                  onClick={() => navigate(`/egis/${egis.egisId}`)}
                  className="p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-foreground">{egis.egisId}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                      SEQ 00{egis.latestSeqNumber}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-foreground">{egis.aliasName}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {egis.production} Factory • {egis.currency}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Latest Price</span>
                    <CurrencyDisplay
                      amount={egis.latestPrice}
                      currency={egis.currency}
                      className="text-base font-bold text-foreground"
                    />
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <ValidityBadge validity={egis.egisValidity} type="EGIS" size="sm" />
                    <ValidityBadge validity={egis.priceValidity} type="Price" size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. EGIS Alternatives Tab */}
      {activeTab === 'egis' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-foreground">Project EGIS Portfolio</h2>
                <p className="text-xs text-muted-foreground">
                  Manage commercial configurations and factory origins
                </p>
              </div>
              <button
                onClick={() => toast.info('New EGIS modal')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New EGIS</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="py-3 px-4">EGIS ID</th>
                    <th className="py-3 px-4">Description / Package</th>
                    <th className="py-3 px-4">Production</th>
                    <th className="py-3 px-4">Currency</th>
                    <th className="py-3 px-4">Latest SEQ</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">EGIS Validity</th>
                    <th className="py-3 px-4">Price Validity</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_EGIS_DETAILS.map((egis) => (
                    <tr
                      key={egis.id}
                      onClick={() => navigate(`/egis/${egis.egisId}`)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">{egis.egisId}</td>
                      <td className="py-3.5 px-4 font-medium">{egis.aliasName}</td>
                      <td className="py-3.5 px-4">{egis.production}</td>
                      <td className="py-3.5 px-4 font-mono font-semibold">{egis.currency}</td>
                      <td className="py-3.5 px-4 font-mono">SEQ 00{egis.currentSeqNumber}</td>
                      <td className="py-3.5 px-4">
                        <CurrencyDisplay amount={egis.latestPrice} currency={egis.currency} />
                      </td>
                      <td className="py-3.5 px-4">
                        {egis.egisValidity && <ValidityBadge validity={egis.egisValidity} type="EGIS" size="sm" />}
                      </td>
                      <td className="py-3.5 px-4">
                        {egis.priceValidity && <ValidityBadge validity={egis.priceValidity} type="Price" size="sm" />}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-primary font-semibold hover:underline">
                          View SEQ →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Specification Tab */}
      {activeTab === 'specifications' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Specification Viewer — SEQ 005 (Latest Spec Check)
              </h2>
              <p className="text-xs text-muted-foreground">
                Canonical field representation mapped from uploaded Excel workbook with cell traceability.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-semibold border border-emerald-500/20">
                96% Fields Populated
              </span>
            </div>
          </div>

          {/* Categorized Fields Display */}
          <div className="space-y-4">
            {SPEC_CATEGORIES.map((cat) => {
              const categoryFields = Object.values(MOCK_SPECIFICATION_SNAPSHOT.fields).filter(
                (f) => f.category === cat.id
              );

              if (categoryFields.length === 0) return null;

              return (
                <div key={cat.id} className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="p-3.5 bg-muted/50 border-b border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">{cat.description}</p>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {categoryFields.length} attributes
                    </span>
                  </div>

                  <div className="divide-y divide-border">
                    {categoryFields.map((field) => (
                      <div
                        key={field.fieldKey}
                        className="py-3 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 text-xs"
                      >
                        <div className="sm:w-1/3">
                          <span className="font-semibold text-foreground">{field.fieldLabel}</span>
                        </div>
                        <div className="sm:w-1/3">
                          <span className="font-mono font-medium text-foreground bg-muted/60 px-2 py-1 rounded">
                            {field.formattedValue}
                          </span>
                        </div>
                        <div className="sm:w-1/3 text-right">
                          <span className="font-mono text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border">
                            {field.sourceSheet}:{field.sourceCell}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Revision History Tab */}
      {activeTab === 'revisions' && (
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
          <div>
            <h2 className="text-sm font-bold text-foreground">Sequence Timeline (SEQ 001 → SEQ 005)</h2>
            <p className="text-xs text-muted-foreground">
              Audit trail of all quotation, follow up plan, approval drawing, and spec check revisions.
            </p>
          </div>

          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
            {MOCK_REVISIONS.map((rev, index) => (
              <div key={rev.id} className="relative space-y-2">
                {/* Timeline node dot */}
                <div
                  className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-background ring-4 ring-card ${
                    index === 0 ? 'bg-primary' : 'bg-slate-400'
                  }`}
                />

                <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
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
                      <span>Source: <strong className="font-mono text-foreground">{rev.sourceFileName}</strong></span>
                      <span>By: {rev.createdByName}</span>
                      {rev.approvedByName && <span>Approved by: {rev.approvedByName}</span>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('comparison')}
                        className="font-semibold text-primary hover:underline"
                      >
                        Compare with SEQ 004 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                {MOCK_COMPARISON_REPORT.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                Side-by-side diff comparing base SEQ 004 with target SEQ 005. Approve or reject field variations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.success('All remaining diffs approved!')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm"
              >
                Approve All Changes
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Change Type</th>
                    <th className="py-3 px-4">Field Name</th>
                    <th className="py-3 px-4">Base Value (SEQ 004)</th>
                    <th className="py-3 px-4">Target Value (SEQ 005)</th>
                    <th className="py-3 px-4">Reviewer Note</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_COMPARISON_REPORT.diffs.map((diff) => (
                    <tr
                      key={diff.id}
                      className={
                        diff.diffType === 'ADDED'
                          ? 'bg-emerald-500/5'
                          : diff.diffType === 'MODIFIED'
                          ? 'bg-amber-500/5'
                          : 'bg-rose-500/5'
                      }
                    >
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            diff.diffType === 'ADDED'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : diff.diffType === 'MODIFIED'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-rose-500/10 text-rose-600'
                          }`}
                        >
                          {diff.diffType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {diff.fieldLabel}
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
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => toast.success(`Approved ${diff.fieldLabel}`)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => toast.error(`Rejected ${diff.fieldLabel}`)}
                              className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-semibold"
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
      )}

      {/* 9. Generator Tab */}
      {activeTab === 'generator' && (
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-5">
          <div>
            <h2 className="text-sm font-bold text-foreground">EGIS SPEC Excel Export Generator</h2>
            <p className="text-xs text-muted-foreground">
              Generate standardized Excel output matching the official Hyundai factory EGIS SPEC format.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Target EGIS Alternative</label>
                <select className="w-full p-2 rounded-lg border border-border bg-background">
                  <option>HDE-26000125 — Standard China (USD)</option>
                  <option>HDE-26000126 — Direct RMB (CNY)</option>
                  <option>HDE-26000127 — High-Speed Korea (USD)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Sequence Revision</label>
                <select className="w-full p-2 rounded-lg border border-border bg-background font-mono">
                  <option>SEQ 005 — SPEC CHECK REV 0 (Approved)</option>
                  <option>SEQ 004 — APPROVAL REV 0</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Export Template</label>
                <select className="w-full p-2 rounded-lg border border-border bg-background">
                  <option>Standard Hyundai Elevator Template v3.2</option>
                  <option>High-Speed Korean LUXEN Template</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => toast.success('Generated and downloaded HDE-26000125_SEQ005_EGIS_SPEC.xlsx')}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                📥 Download EGIS SPEC Excel (.xlsx)
              </button>
              <button
                onClick={() => toast.info('Generated comparison summary PDF report')}
                className="px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold transition-all"
              >
                📄 Export Comparison PDF (SEQ 004 vs 005)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for other tabs */}
      {(activeTab === 'documents' || activeTab === 'pricing' || activeTab === 'validity' || activeTab === 'audit') && (
        <div className="p-8 rounded-xl border border-border bg-card shadow-sm text-center space-y-2">
          <h2 className="text-sm font-bold text-foreground">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            This module is connected to the real-time project database. All parameters and history logs are synced across EGIS alternatives.
          </p>
        </div>
      )}
    </div>
  );
};
