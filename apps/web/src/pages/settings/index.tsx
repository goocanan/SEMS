import React, { useState, useRef } from 'react';
import {
  Settings,
  Database,
  LayoutTemplate,
  Anchor,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  Download,
  Upload,
  Layers,
  HeartPulse,
  Truck,
  Eye,
  Home,
  TrendingUp,
  Building2,
  Hash,
} from 'lucide-react';
import {
  STANDARD_PORTS,
  BUSINESS_RULES,
  ELEVATOR_PROFILES,
  ElevatorProfileId,
  getFieldsForProfile,
  generateEgisId,
  EGIS_FORMAT_PATTERNS,
} from '@sems/shared';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useProjectStore } from '@/stores/project-store';
import { toast } from 'sonner';

interface TemplateConfigItem {
  profileId: ElevatorProfileId;
  templateFileName: string;
  version: string;
  lastUpdated: string;
  format: 'XLSX' | 'CSV';
  isActive: boolean;
}

const INITIAL_TEMPLATES: TemplateConfigItem[] = [
  {
    profileId: 'PASSENGER',
    templateFileName: 'HYUNDAI_LUXEN_PASSENGER_SPEC_V3.4.xlsx',
    version: 'v3.4 (Standard 2026)',
    lastUpdated: '12 Oct 2026',
    format: 'XLSX',
    isActive: true,
  },
  {
    profileId: 'HOSPITAL_BED',
    templateFileName: 'HYUNDAI_HOSPITAL_BED_SPEC_V2.1.xlsx',
    version: 'v2.1 (Medical Stretcher)',
    lastUpdated: '05 Sep 2026',
    format: 'XLSX',
    isActive: true,
  },
  {
    profileId: 'FREIGHT_CARGO',
    templateFileName: 'HYUNDAI_FREIGHT_HEAVYDUTY_V1.8.xlsx',
    version: 'v1.8 (Class A/B/C Cargo)',
    lastUpdated: '20 Aug 2026',
    format: 'XLSX',
    isActive: true,
  },
  {
    profileId: 'PANORAMIC',
    templateFileName: 'HYUNDAI_PANORAMIC_OBSERVATION_V2.0.xlsx',
    version: 'v2.0 (Glass Transom)',
    lastUpdated: '15 Jul 2026',
    format: 'XLSX',
    isActive: true,
  },
  {
    profileId: 'HOME_VILLA',
    templateFileName: 'HYUNDAI_YZER_VILLA_COMPACT_V1.2.xlsx',
    version: 'v1.2 (Shallow Pit Villa)',
    lastUpdated: '10 Jun 2026',
    format: 'XLSX',
    isActive: true,
  },
  {
    profileId: 'ESCALATOR_WALK',
    templateFileName: 'HYUNDAI_ESCALATOR_PUBLIC_DUTY_V3.0.xlsx',
    version: 'v3.0 (Truss & Step 1000mm)',
    lastUpdated: '01 Oct 2026',
    format: 'XLSX',
    isActive: true,
  },
];

export const SettingsPage: React.FC = () => {
  const { resetToDefaults, egisFormatPattern, setEgisFormatPattern, egisList, updateEgisId } = useProjectStore();
  const [templates, setTemplates] = useState<TemplateConfigItem[]>(INITIAL_TEMPLATES);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingProfileId, setUploadingProfileId] = useState<ElevatorProfileId | null>(null);

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (projects, revisions, documents) back to initial default values?')) {
      resetToDefaults();
      toast.success('App data successfully reset to initial demo defaults!');
    }
  };

  const handleDownloadMasterTemplate = (item: TemplateConfigItem) => {
    const fields = getFieldsForProfile(item.profileId);
    const rows = [
      `HYUNDAI ${item.profileId.replace('_', ' ')} OFFICIAL SPECIFICATION TEMPLATE`,
      `Template Version,${item.version}`,
      `File Name,${item.templateFileName}`,
      '',
      'PARAMETER / FIELD LABEL,VALUE,UNIT,CANONICAL KEY',
      ...fields.map((f) => `"${f.label}",${f.dataType === 'number' ? '0' : 'Sample Value'},${f.unit || '-'},${f.key}`),
    ];

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = item.templateFileName.replace('.xlsx', '.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded master template: ${item.templateFileName}`);
  };

  const triggerUploadNewTemplate = (profileId: ElevatorProfileId) => {
    setUploadingProfileId(profileId);
    fileInputRef.current?.click();
  };

  const handleFileUploaded = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingProfileId) return;

    setTemplates((prev) =>
      prev.map((t) =>
        t.profileId === uploadingProfileId
          ? {
              ...t,
              templateFileName: file.name,
              version: `Custom (${new Date().toLocaleDateString()})`,
              lastUpdated: 'Just now',
            }
          : t
      )
    );

    toast.success(`Set "${file.name}" as active master template for ${uploadingProfileId}!`);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setUploadingProfileId(null);
  };

  const getProfileIcon = (id: ElevatorProfileId) => {
    switch (id) {
      case 'HOSPITAL_BED':
        return <HeartPulse className="w-4 h-4 text-emerald-500" />;
      case 'FREIGHT_CARGO':
        return <Truck className="w-4 h-4 text-amber-500" />;
      case 'PANORAMIC':
        return <Eye className="w-4 h-4 text-purple-500" />;
      case 'HOME_VILLA':
        return <Home className="w-4 h-4 text-indigo-500" />;
      case 'ESCALATOR_WALK':
        return <TrendingUp className="w-4 h-4 text-cyan-500" />;
      default:
        return <Building2 className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Custom Template Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUploaded}
        className="hidden"
        accept=".xlsx,.xls,.csv"
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Master Data & System Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Configure template assignments per elevator type, business rules, database cloud sync, and standard shipping ports.
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
      </div>

      {/* EGIS ID NUMBERING FORMAT CONFIGURATION */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Hash className="w-4 h-4 text-purple-600" />
              <span>EGIS ID Numbering Format (Format Penomoran EGIS)</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tentukan format penamaan kode identifikasi EGIS untuk proyek dan urutan sequence revisinya.
            </p>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded bg-purple-500/10 text-purple-600 font-bold border border-purple-500/20">
            Preview: {generateEgisId({ year: 2026, month: 10, runningNumber: 125, seqNumber: 2, pattern: egisFormatPattern })}
          </span>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground block">
            Pilih Pola Format Standar:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                id: EGIS_FORMAT_PATTERNS.STANDARD_SEMS,
                title: 'ID{YYYY} {MM} {NUM} - SEQ{SEQ}',
                sample: 'ID2026 10 0125 - SEQ2',
                badge: 'Format Standar Baru (Aktif)',
                desc: 'Prefix Negara/ID + Tahun 4 digit + Bulan 2 digit + No Urut 4 digit + Suffix Sequence revisi',
              },
              {
                id: EGIS_FORMAT_PATTERNS.STANDARD_BASE,
                title: 'ID{YYYY} {MM} {NUM}',
                sample: 'ID2026 10 0125',
                badge: 'Base Package Format',
                desc: 'ID dasar tanpa penulisan - SEQ di dalam nama ID utama (SEQ dicatat di kolom revisi)',
              },
              {
                id: EGIS_FORMAT_PATTERNS.COMPACT_DASH,
                title: 'ID-{YYYY}{MM}-{NUM}-S{SEQ}',
                sample: 'ID-202610-0125-S2',
                badge: 'Compact Format',
                desc: 'Pemisah strip (-) tanpa spasi untuk kompatibilitas sistem integrasi ERP/SAP',
              },
              {
                id: EGIS_FORMAT_PATTERNS.HYUNDAI_LEGACY,
                title: 'HDE-{YY}{NUM}',
                sample: 'HDE-26000125',
                badge: 'Legacy Hyundai Factory',
                desc: 'Format lama penomoran pabrik Hyundai (HDE- + 2 digit tahun + 6 digit running)',
              },
            ].map((fmt) => (
              <div
                key={fmt.id}
                onClick={() => {
                  setEgisFormatPattern(fmt.id);
                  toast.success(`Format EGIS ID diubah ke: ${fmt.sample}`);
                }}
                className={`p-4 rounded-xl border text-xs cursor-pointer transition-all ${
                  egisFormatPattern === fmt.id
                    ? 'border-purple-500 bg-purple-500/5 ring-1 ring-purple-500 shadow-sm'
                    : 'border-border bg-card hover:border-border/80 hover:bg-muted/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono font-bold text-sm text-foreground">{fmt.sample}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    egisFormatPattern === fmt.id
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {fmt.badge}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-muted-foreground mb-1">{fmt.title}</div>
                <p className="text-[11px] text-muted-foreground">{fmt.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-border">
            <div className="text-muted-foreground text-[11px]">
              Token: <code className="text-foreground font-mono">{'{PREFIX}'}</code>, <code className="text-foreground font-mono">{'{YYYY}'}</code>, <code className="text-foreground font-mono">{'{MM}'}</code>, <code className="text-foreground font-mono">{'{NUM}'}</code>, <code className="text-foreground font-mono">{'{SEQ}'}</code>
            </div>
            <button
              onClick={() => {
                egisList.forEach((e, idx) => {
                  const num = String(125 + idx).padStart(4, '0');
                  const seq = e.currentSeqNumber || 2;
                  const newId = generateEgisId({
                    year: 2026,
                    month: 10,
                    runningNumber: num,
                    seqNumber: seq,
                    pattern: egisFormatPattern,
                  });
                  updateEgisId(e.egisId, newId);
                });
                toast.success('Semua EGIS ID yang aktif berhasil diperbarui ke format baru!');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all shadow-sm"
            >
              🔄 Terapkan Format ke Seluruh EGIS Aktif
            </button>
          </div>
        </div>
      </div>

      {/* MASTER SPEC SHEET TEMPLATES CONFIGURATION */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Master Excel Spec Sheet Templates per Type</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set, customize, or download the active master Excel workbook template for each elevator and escalator type.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Elevator / Unit Type</th>
                <th className="py-3 px-4">Assigned Master Template File</th>
                <th className="py-3 px-4">Template Version</th>
                <th className="py-3 px-4">Active Fields Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {templates.map((tpl) => {
                const profileObj = ELEVATOR_PROFILES.find((p) => p.id === tpl.profileId);
                const fieldsCount = getFieldsForProfile(tpl.profileId).length;

                return (
                  <tr key={tpl.profileId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4 font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-muted">{getProfileIcon(tpl.profileId)}</span>
                        <span>{profileObj?.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-primary">
                      {tpl.templateFileName}
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">{tpl.version}</td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-muted font-bold text-slate-700 dark:text-slate-300">
                        {fieldsCount} parameters
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active Master
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownloadMasterTemplate(tpl)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted text-[11px] font-semibold text-primary transition-colors"
                          title="Download master template"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => triggerUploadNewTemplate(tpl.profileId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary hover:bg-primary/90 text-[11px] font-semibold text-primary-foreground shadow-sm transition-colors"
                          title="Assign new template file"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Set Template</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standard Shipping Ports Master */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
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
  );
};
