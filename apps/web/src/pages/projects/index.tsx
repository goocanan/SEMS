import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useProjectStore } from '@/stores/project-store';
import { ValidityBadge } from '@/components/shared/validity-badge';
import { CurrencyDisplay } from '@/components/shared/currency-display';
import { StatusBadge } from '@/components/shared/status-badge';
import { useAppStore } from '@/stores/app-store';

export const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectViewMode, setProjectViewMode } = useAppStore();
  const { projects } = useProjectStore();

  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
        p.customerName.toLowerCase().includes(search.toLowerCase()) ||
        p.aliases.some((a) => a.name.toLowerCase().includes(search.toLowerCase()));

      const matchProduct = selectedProduct === 'ALL' || p.productType === selectedProduct;
      const matchLocation = selectedLocation === 'ALL' || p.location === selectedLocation;

      return matchSearch && matchProduct && matchLocation;
    });
  }, [search, selectedProduct, selectedLocation]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Projects Portfolio
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage projects, aliases, multiple EGIS alternatives, and revision sequences
          </p>
        </div>

        <button
          onClick={() => navigate('/projects/new')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold shadow-sm shadow-primary/20 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Filter and View Control Bar */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, alias, code, or customer..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Filters & View Switch */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0">
            {/* Product Type Filter */}
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
            >
              <option value="ALL">All Products</option>
              <option value="ELEVATOR">Elevator</option>
              <option value="ESCALATOR">Escalator</option>
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="text-xs px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
            >
              <option value="ALL">All Locations</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Surabaya">Surabaya</option>
              <option value="Bali">Bali</option>
              <option value="Medan">Medan</option>
              <option value="Tangerang">Tangerang</option>
            </select>

            {/* View Switch */}
            <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted">
              <button
                onClick={() => setProjectViewMode('card')}
                aria-label="Card View"
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  projectViewMode === 'card'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setProjectViewMode('table')}
                aria-label="Table View"
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  projectViewMode === 'table'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Grid View */}
      {projectViewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-border/70 space-y-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {project.name}
                    </h2>
                    <span className="text-xs text-muted-foreground block">
                      {project.customerName}
                    </span>
                  </div>
                  <StatusBadge status={project.status} />
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground pt-1">
                  <span>📍 {project.location}</span>
                  <span>👤 {project.primaryMarketingName}</span>
                  <span className="font-mono">
                    🏗 {project.unitQuantity} units ({project.productType})
                  </span>
                </div>

                {/* Aliases tag list */}
                {project.aliases.length > 1 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {project.aliases.slice(1).map((a) => (
                      <span
                        key={a.id}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium"
                      >
                        alias: {a.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* EGIS Alternatives Box */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 space-y-2 border-b border-border/70">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>EGIS Alternatives</span>
                  <span className="font-mono text-primary font-bold">
                    {project.egisSummaries?.length || 0} Options
                  </span>
                </div>

                <div className="space-y-2">
                  {project.egisSummaries?.map((egis) => (
                    <div
                      key={egis.id}
                      onClick={() => navigate(`/egis/${egis.egisId}`)}
                      className="p-2.5 rounded-lg border border-border/80 bg-card hover:border-primary/40 transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-xs text-foreground">
                          {egis.egisId}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">
                            SEQ {egis.latestSeqNumber}
                          </span>
                          <CurrencyDisplay amount={egis.latestPrice} currency={egis.currency} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-1 text-[11px] pt-0.5">
                        <span className="text-muted-foreground font-medium">
                          {egis.production} / {egis.currency}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <ValidityBadge validity={egis.egisValidity} type="EGIS" size="sm" />
                          <ValidityBadge validity={egis.priceValidity} type="Price" size="sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer action button */}
              <div className="p-3 bg-card flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground">
                  {project.projectCode}
                </span>
                <button
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Open Project</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold border-b border-border">
                <tr>
                  <th className="py-3 px-4">Project / Code</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Product / Units</th>
                  <th className="py-3 px-4">Marketing</th>
                  <th className="py-3 px-4">EGIS Count</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProjects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{p.name}</div>
                      <div className="text-xs font-mono text-muted-foreground">{p.projectCode}</div>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{p.customerName}</td>
                    <td className="py-3.5 px-4 text-muted-foreground">{p.location}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono">
                        {p.unitQuantity}x {p.productType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{p.primaryMarketingName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs font-semibold">
                        {p.egisSummaries?.length || 0} Alternatives
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/projects/${p.id}`);
                        }}
                        className="p-1.5 rounded-md hover:bg-muted text-primary"
                        title="Open Project"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
