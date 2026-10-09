import React, { useState } from 'react';
import { Cpu, Download, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { MOCK_PROJECTS } from '@/mocks/sems-data';
import { toast } from 'sonner';

export const EgisGeneratorPage: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(MOCK_PROJECTS[0].id);
  const selectedProject = MOCK_PROJECTS.find((p) => p.id === selectedProjectId) || MOCK_PROJECTS[0];

  const handleGenerate = () => {
    toast.success(`EGIS SPEC Excel generated successfully for ${selectedProject.name}!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          EGIS SPEC Generator
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Generate production-ready Hyundai Elevator EGIS SPEC Excel workbooks from approved revisions.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold block mb-1.5 text-foreground">Select Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background"
            >
              {MOCK_PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.projectCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-foreground">Select EGIS Alternative</label>
            <select className="w-full p-2.5 rounded-lg border border-border bg-background font-mono">
              {selectedProject.egisSummaries?.map((eg) => (
                <option key={eg.id} value={eg.egisId}>
                  {eg.egisId} — {eg.production}/{eg.currency} (SEQ 00{eg.latestSeqNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-foreground">Factory Specification Template</label>
            <select className="w-full p-2.5 rounded-lg border border-border bg-background">
              <option>Standard Hyundai Elevator SPEC Template (v3.4)</option>
              <option>Hyundai Escalator Public Duty Template (v2.1)</option>
            </select>
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="p-5 rounded-xl border border-border bg-slate-50/60 dark:bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Workbook Pre-Validation Checklist
            </span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All mandatory cells verified
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-card border border-border">
              <span className="text-muted-foreground block text-[11px]">Model & Capacity</span>
              <span className="font-semibold">LUXEN-MR • 1,350 kg</span>
            </div>
            <div className="p-2.5 rounded-lg bg-card border border-border">
              <span className="text-muted-foreground block text-[11px]">Speed & Stops</span>
              <span className="font-semibold">2.0 m/s • 22 Stops</span>
            </div>
            <div className="p-2.5 rounded-lg bg-card border border-border">
              <span className="text-muted-foreground block text-[11px]">Door Operator</span>
              <span className="font-semibold">2P Center Opening</span>
            </div>
            <div className="p-2.5 rounded-lg bg-card border border-border">
              <span className="text-muted-foreground block text-[11px]">Controller</span>
              <span className="font-semibold">STVF7 32-bit</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download EGIS SPEC Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
