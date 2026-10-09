import React from 'react';
import { Settings, Database, LayoutTemplate, Anchor, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { STANDARD_PORTS, BUSINESS_RULES } from '@sems/shared';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useProjectStore } from '@/stores/project-store';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { resetToDefaults } = useProjectStore();

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (projects, revisions, documents) back to initial default values?')) {
      resetToDefaults();
      toast.success('App data successfully reset to initial demo defaults!');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Master Data & System Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure business rules, database connection, standard shipping ports, and master parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supabase & Cloud Sync Status */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Database & Cloud Sync</span>
            </div>
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Supabase Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <AlertCircle className="w-3.5 h-3.5" /> Local Storage (Offline Mode)
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {isSupabaseConfigured
              ? 'Your SEMS instance is connected to Supabase PostgreSQL. Project creations and revision updates are synced in the cloud.'
              : 'Running in offline persistent mode using browser local storage. To connect to Supabase, provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'}
          </p>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Demo Data Reset</span>
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-rose-600 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>

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
        <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Anchor className="w-4 h-4 text-blue-600" />
              <span>Standard Shipping Ports</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
