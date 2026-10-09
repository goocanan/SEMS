import React from 'react';
import { Settings, Database, LayoutTemplate, Anchor, CheckCircle2 } from 'lucide-react';
import { STANDARD_PORTS, BUSINESS_RULES } from '@sems/shared';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Master Data & System Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure business rules, standard shipping ports, Excel parser templates, and master parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Rules Summary */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Settings className="w-4 h-4 text-primary" />
            <span>Core Business Rules (BR-01 .. BR-07)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg border border-border bg-muted/30 flex justify-between items-center">
              <div>
                <span className="font-semibold block">BR-01: Default EGIS Validity</span>
                <span className="text-muted-foreground">Lifespan of an issued EGIS alternative</span>
              </div>
              <span className="font-mono font-bold">{BUSINESS_RULES.DEFAULT_EGIS_VALIDITY_DAYS} Days</span>
            </div>

            <div className="p-3 rounded-lg border border-border bg-muted/30 flex justify-between items-center">
              <div>
                <span className="font-semibold block">BR-02: Default Price Validity</span>
                <span className="text-muted-foreground">Tender quotation price expiry duration</span>
              </div>
              <span className="font-mono font-bold">{BUSINESS_RULES.DEFAULT_PRICE_VALIDITY_DAYS} Days</span>
            </div>

            <div className="p-3 rounded-lg border border-border bg-muted/30 flex justify-between items-center">
              <div>
                <span className="font-semibold block">BR-05: Standard Warranty Period</span>
                <span className="text-muted-foreground">Default manufacturer warranty</span>
              </div>
              <span className="font-mono font-bold">{BUSINESS_RULES.DEFAULT_WARRANTY_MONTHS} Months</span>
            </div>
          </div>
        </div>

        {/* Standard Shipping Ports Master */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Anchor className="w-4 h-4 text-blue-600" />
              <span>Standard Shipping Ports</span>
            </div>
            <button
              onClick={() => toast.info('Add new port modal')}
              className="text-xs text-primary font-semibold hover:underline"
            >
              + Add Port
            </button>
          </div>

          <div className="space-y-2">
            {STANDARD_PORTS.map((port) => (
              <div
                key={port.code}
                className="p-3 rounded-lg border border-border bg-muted/30 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-foreground">{port.name}</span>
                  <span className="block text-[11px] text-muted-foreground">Country: {port.country}</span>
                </div>
                <span className="font-mono px-2 py-0.5 rounded bg-muted font-bold text-slate-600 dark:text-slate-300">
                  {port.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
