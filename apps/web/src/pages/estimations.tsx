import React from 'react';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';
import { useProjectStore } from '@/stores/project-store';
import { CurrencyDisplay } from '@/components/shared/currency-display';

export const EstimationsPage: React.FC = () => {
  const { projects } = useProjectStore();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Estimations & Cost Tracking
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Portfolio-wide estimation pricing across USD, CNY, and KRW supply sources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Active Tender Pipeline
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">$14.8M USD</div>
          <span className="text-xs text-emerald-600 font-medium flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> +8.4% from last quarter
          </span>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Direct China (CNY) Pipeline
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">¥86.5M CNY</div>
          <span className="text-xs text-muted-foreground">32 active tenders</span>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase">
            Average Unit Cost
          </span>
          <div className="text-2xl font-bold font-mono text-foreground">$24,500 USD</div>
          <span className="text-xs text-muted-foreground">Passenger 1000kg-1350kg</span>
        </div>
      </div>

      {/* Project Estimations Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border font-bold text-sm text-foreground">
          Recent Project Quotations
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
            <tr>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Primary EGIS Option</th>
              <th className="py-3 px-4">Units</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Price Validity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.map((p) => {
              const primaryEgis = p.egisSummaries?.[0];
              return (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{p.name}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{p.customerName}</td>
                  <td className="py-3.5 px-4 font-mono font-medium text-primary">
                    {primaryEgis?.egisId || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{p.unitQuantity}x</td>
                  <td className="py-3.5 px-4 font-bold">
                    <CurrencyDisplay
                      amount={primaryEgis?.latestPrice}
                      currency={primaryEgis?.currency}
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-mono text-muted-foreground">
                      {primaryEgis?.priceValidity?.label || '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
