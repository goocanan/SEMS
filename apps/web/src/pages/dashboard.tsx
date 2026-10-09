import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Layers,
  CheckCircle2,
  GitCompare,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_ACTIVITY_LOGS } from '@/mocks/sems-data';
import { ValidityBadge } from '@/components/shared/validity-badge';
import { CurrencyDisplay } from '@/components/shared/currency-display';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Compute summary stats
  const totalProjects = 128;
  const totalEgis = 194;
  const pendingApprovals = 7;
  const pendingComparisons = 5;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-mono font-medium border border-blue-500/30">
            <span>Hyundai Elevator & Escalator</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Estimation & Specification Hub
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Welcome back, Budi. Track all project EGIS revisions, price validities, and specification diffs in one central command center.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => navigate('/projects/new')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
          <button
            onClick={() => navigate('/specifications')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Upload Spec</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div
          onClick={() => navigate('/projects')}
          className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight">{totalProjects}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +3 this week
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Across Indonesia regions</span>
        </div>

        {/* Total EGIS */}
        <div
          onClick={() => navigate('/egis')}
          className="p-5 rounded-xl border border-border bg-card hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Active EGIS
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight">{totalEgis}</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +5 this week
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">1.5 EGIS avg per project</span>
        </div>

        {/* Pending Approvals */}
        <div
          onClick={() => navigate('/approvals')}
          className="p-5 rounded-xl border border-border bg-card hover:border-amber-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Approvals
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-amber-600">
              {pendingApprovals}
            </span>
            <span className="text-xs text-rose-500 font-medium">Needs action</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">SEQ revisions waiting review</span>
        </div>

        {/* Pending Comparisons */}
        <div
          onClick={() => navigate('/comparisons')}
          className="p-5 rounded-xl border border-border bg-card hover:border-purple-500/50 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Diff Comparisons
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GitCompare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight">{pendingComparisons}</span>
            <span className="text-xs text-blue-500 font-medium">Active diffs</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1 block">Excel upload audits</span>
        </div>
      </div>

      {/* Urgent Validity Alert Banner */}
      <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span>Expiring Validity Warnings</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono">
                3 Urgent
              </span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              HDE-26000126 (Jakarta Tower) and Surabaya Mall Option A prices have expired. Please issue a refreshed SEQ quotation.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/projects/prj-001')}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 whitespace-nowrap pl-12 sm:pl-0"
        >
          <span>Review Items</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Two Column Layout: Workflow & Validity Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Status Distribution */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-semibold text-sm text-foreground">Workflow Stage Breakdown</h2>
              <p className="text-xs text-muted-foreground">Projects by current specification stage</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">128 Total</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-blue-600 dark:text-blue-400">1. Quotation Phase</span>
                <span className="font-mono">23 projects (18%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-indigo-600 dark:text-indigo-400">2. FUP (Follow Up Plan)</span>
                <span className="font-mono">41 projects (32%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-amber-600 dark:text-amber-400">3. Approval Drawing</span>
                <span className="font-mono">18 projects (14%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-purple-600 dark:text-purple-400">4. Spec Check</span>
                <span className="font-mono">12 projects (9%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '9%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-medium">
                <span className="text-emerald-600 dark:text-emerald-400">5. Final EGIS Specification</span>
                <span className="font-mono">34 projects (27%)</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '27%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Validity Overview Breakdown */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-semibold text-sm text-foreground">Validity Overview</h2>
              <p className="text-xs text-muted-foreground">EGIS 180-day & Price 30-day health status</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500">194 EGIS</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* EGIS Validity Panel */}
            <div className="p-3.5 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                EGIS Validity (180d)
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt; 60 days
                  </span>
                  <span className="font-mono font-bold">128</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> 31 - 60 days
                  </span>
                  <span className="font-mono font-bold">34</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> 8 - 30 days
                  </span>
                  <span className="font-mono font-bold">22</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> ≤ 7 days / Exp
                  </span>
                  <span className="font-mono font-bold text-rose-600">10</span>
                </div>
              </div>
            </div>

            {/* Price Validity Panel */}
            <div className="p-3.5 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Price Validity (30d)
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt; 30 days
                  </span>
                  <span className="font-mono font-bold">89</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> 8 - 30 days
                  </span>
                  <span className="font-mono font-bold">54</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-orange-500" /> 1 - 7 days
                  </span>
                  <span className="font-mono font-bold">26</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-600 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> Expired (≤ 0d)
                  </span>
                  <span className="font-mono font-bold text-rose-600">25</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Projects & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects List (Span 2) */}
        <div className="lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-semibold text-sm text-foreground">Recent Active Projects</h2>
              <p className="text-xs text-muted-foreground">Quick view of multi-EGIS alternatives</p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
            >
              <span>View All 128</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-border/60">
            {MOCK_PROJECTS.slice(0, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-lg p-2 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {project.name}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {project.projectCode}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {project.customerName}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                      <span>📍 {project.location}</span>
                      <span>👤 {project.primaryMarketingName}</span>
                      <span>
                        🏗 {project.unitQuantity} Units ({project.productType})
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {project.egisSummaries?.length || 0} EGIS Alternatives
                    </span>
                  </div>
                </div>

                {/* EGIS Alternatives Inline Preview */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {project.egisSummaries?.map((egis) => (
                    <div
                      key={egis.id}
                      className="p-2 rounded-lg border border-border bg-card/60 text-xs space-y-1 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-primary">{egis.egisId}</span>
                        <span className="text-[10px] text-muted-foreground">SEQ {egis.latestSeqNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span>{egis.production}/{egis.currency}</span>
                        <CurrencyDisplay amount={egis.latestPrice} currency={egis.currency} />
                      </div>
                      <div className="pt-1 flex items-center justify-between gap-1 border-t border-border/60">
                        <ValidityBadge validity={egis.egisValidity} type="EGIS" size="sm" />
                        <ValidityBadge validity={egis.priceValidity} type="Price" size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-semibold text-sm text-foreground">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">Audit log stream</p>
            </div>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            {MOCK_ACTIVITY_LOGS.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {act.user.charAt(0)}
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="font-medium text-foreground">
                    <span className="font-semibold">{act.user}</span>{' '}
                    <span className="text-muted-foreground font-normal">({act.role})</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {act.action}: <span className="font-medium">{act.target}</span>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                    <span className="font-mono text-primary/80">{act.project}</span>
                    <span>{act.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
