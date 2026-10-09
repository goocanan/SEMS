import React from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { toast } from 'sonner';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Management Reports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quarterly estimation throughput, win-loss ratio, and EGIS revision frequency.
          </p>
        </div>

        <button
          onClick={() => toast.success('Exported Quarterly Estimation Report (PDF)')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Summary Report</span>
        </button>
      </div>

      <div className="p-12 rounded-2xl border border-border bg-card shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-foreground">Analytics Engine Active</h2>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Over 128 projects and 194 EGIS records tracked. All charts and KPIs update dynamically based on live tender sequences.
        </p>
      </div>
    </div>
  );
};
