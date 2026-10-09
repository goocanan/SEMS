import React, { useState } from 'react';
import { Download, FileSpreadsheet, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useProjectStore } from '@/stores/project-store';
import { toast } from 'sonner';

export const EgisGeneratorPage: React.FC = () => {
  const { projects, addDocument } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const egisOptions = selectedProject?.egisSummaries || [];
  const [selectedEgisId, setSelectedEgisId] = useState(egisOptions[0]?.egisId || 'HDE-26000125');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const activeEgis = egisOptions.find((e) => e.egisId === selectedEgisId) || egisOptions[0];
      const filename = `${selectedProject.name.replace(/\s+/g, '_')}_${selectedEgisId}_SPEC.csv`;

      // Build structured CSV content
      const csvRows = [
        ['HYUNDAI ELEVATOR EGIS SPECIFICATION WORKBOOK'],
        ['Generated At', new Date().toLocaleString()],
        ['Project Code', selectedProject.projectCode],
        ['Project Name', selectedProject.name],
        ['Customer', selectedProject.customerName],
        ['Building Type', selectedProject.buildingType],
        ['Product Type', selectedProject.productType],
        ['Unit Quantity', String(selectedProject.unitQuantity)],
        ['EGIS ID', selectedEgisId],
        ['Currency', activeEgis?.currency || 'USD'],
        ['Production Factory', activeEgis?.production || 'STEP_SHANGHAI'],
        ['Sequence Code', `00${activeEgis?.latestSeqNumber || 1}`],
        ['Latest Price', String(activeEgis?.latestPrice || 125000)],
        [],
        ['CATEGORY', 'FIELD KEY', 'FIELD LABEL', 'SPEC VALUE', 'UNIT'],
        ['GENERAL', 'model', 'Model Type', 'LUXEN-MR', '-'],
        ['GENERAL', 'capacity', 'Rated Capacity', '1350', 'kg'],
        ['GENERAL', 'speed', 'Rated Speed', '2.0', 'm/s'],
        ['GENERAL', 'stops', 'Number of Stops / Openings', '22 / 22', 'Floors'],
        ['DOOR', 'door_type', 'Door Operator', '2-Panel Center Opening (2P-CO)', '-'],
        ['DOOR', 'door_width', 'Clear Entrance Width', '1100', 'mm'],
        ['DOOR', 'door_height', 'Clear Entrance Height', '2100', 'mm'],
        ['CONTROL', 'controller', 'Control System', 'STVF7 32-bit Microprocessor', '-'],
        ['CONTROL', 'drive', 'Drive Machine', 'Gearless Permanent Magnet PMSM', '-'],
        ['CAR', 'car_internal_w', 'Car Inside Width', '1600', 'mm'],
        ['CAR', 'car_internal_d', 'Car Inside Depth', '1500', 'mm'],
        ['CAR', 'car_internal_h', 'Car Inside Height', '2400', 'mm'],
        ['SAFETY', 'safety_gear', 'Safety Gear Type', 'Progressive Safety Clamp', '-'],
        ['SAFETY', 'buffer', 'Buffer Type', 'Oil Buffer (EN81-20 Compliant)', '-'],
      ];

      const csvContent = csvRows.map((r) => r.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      // Trigger file download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Save to document library
      addDocument({
        name: filename,
        type: 'Excel',
        size: '18.4 KB',
        project: selectedProject.name,
      });

      setIsGenerating(false);
      toast.success(`EGIS SPEC Excel/CSV successfully generated and added to Document Library!`);
    }, 600);
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
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const prj = projects.find((p) => p.id === e.target.value);
                if (prj?.egisSummaries?.[0]) {
                  setSelectedEgisId(prj.egisSummaries[0].egisId);
                }
              }}
              className="w-full p-2.5 rounded-lg border border-border bg-background"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.projectCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold block mb-1.5 text-foreground">Select EGIS Alternative</label>
            <select
              value={selectedEgisId}
              onChange={(e) => setSelectedEgisId(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background font-mono"
            >
              {egisOptions.map((eg) => (
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
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/25 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Generating Workbook...' : 'Generate & Download EGIS SPEC Excel'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
