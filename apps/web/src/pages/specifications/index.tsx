import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  X,
  ArrowRight,
  Download,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SPEC_CATEGORIES, CANONICAL_SPEC_FIELDS, Currency } from '@sems/shared';
import { parseExcelSpecification, ParsedSpecResult } from '@/lib/excel-parser';
import { useProjectStore } from '@/stores/project-store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const SpecificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addDocument, createRevision } = useProjectStore();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Parsed result modal state
  const [parsedResult, setParsedResult] = useState<ParsedSpecResult | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const [selectedEgisId, setSelectedEgisId] = useState('');
  const [revisionPrice, setRevisionPrice] = useState(135000);
  const [revisionLabel, setRevisionLabel] = useState('SPEC CHECK REV 1');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const filteredFields = CANONICAL_SPEC_FIELDS.filter((f) => {
    const matchSearch =
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.key.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleProcessFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      return;
    }

    try {
      setIsUploading(true);
      const result = await parseExcelSpecification(file);
      setParsedResult(result);
      setRevisionPrice(result.detectedPrice || 135000);

      // Pre-select first EGIS of selected project
      if (selectedProject?.egisSummaries?.[0]) {
        setSelectedEgisId(selectedProject.egisSummaries[0].egisId);
      }

      toast.success(
        `Parsed "${file.name}"! ${Object.keys(result.extractedFields).length} specification parameters extracted.`
      );
    } catch (err: any) {
      toast.error('Failed to parse Excel file: ' + (err?.message || 'Invalid format'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleSaveRevision = () => {
    if (!parsedResult) return;

    const targetEgis = selectedEgisId || selectedProject?.egisSummaries?.[0]?.egisId || 'HDE-26000125';
    const targetRef = selectedProject?.egisSummaries?.[0]?.id || 'egis-001';

    // 1. Add file to Document Library
    addDocument({
      name: parsedResult.fileName,
      type: 'Excel',
      size: parsedResult.fileSize,
      project: selectedProject.name,
    });

    // 2. Create new revision sequence
    const nextSeq = (selectedProject?.egisSummaries?.[0]?.latestSeqNumber || 1) + 1;
    createRevision({
      egisRefId: targetRef,
      egisId: targetEgis,
      seqNumber: nextSeq,
      revisionLabel,
      price: Number(revisionPrice) || 135000,
      currency: Currency.USD,
      sourceFileName: parsedResult.fileName,
      notes: `Imported from Excel specification workbook (${parsedResult.confidenceAvg}% confidence score).`,
    });

    toast.success(
      `Saved Sequence SEQ 00${nextSeq} for ${selectedProject.name}! Added to Approvals Queue and Document Library.`
    );
    setParsedResult(null);
    navigate(`/projects/${selectedProject.id}`);
  };

  // Helper to generate and download a sample Excel file for testing
  const handleDownloadSampleExcel = () => {
    const csvContent = [
      'HYUNDAI ELEVATOR SPECIFICATION WORKBOOK',
      'Model,LUXEN-MR',
      'Rated Capacity,1350 kg',
      'Rated Speed,2.5 m/s',
      'Number of Stops,24',
      'Number of Openings,24',
      'Travel Height,78.5 m',
      'Overhead Height,4800 mm',
      'Pit Depth,2100 mm',
      'Door Type,2-Panel Center Opening (2P-CO)',
      'Door Width,1100 mm',
      'Door Height,2100 mm',
      'Control System,STVF7 32-bit Microprocessor',
      'Drive Machine,Gearless Permanent Magnet PMSM',
      'Car Inside Width,1600 mm',
      'Car Inside Depth,1500 mm',
      'Car Inside Height,2400 mm',
      'Quotation Price,142500 USD',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SAMPLE_HYUNDAI_SPEC_TENDER.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Sample specification file downloaded! You can now drag and drop it into the parser.');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
            Specification Engine & Excel Parser
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Automated Excel workbook extraction engine and canonical specification taxonomy dictionary.
          </p>
        </div>

        <button
          onClick={handleDownloadSampleExcel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-primary transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Sample Excel / CSV</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".xlsx,.xls,.csv"
      />

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 group ${
          isDragging
            ? 'border-primary bg-primary/15 scale-[1.01]'
            : 'border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10'
        }`}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">
            {isUploading ? 'Parsing Excel Workbook...' : 'Upload Specification Excel (.xlsx, .xls, .csv)'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Drag and drop your tender Excel file here, or click to browse. The parser reads cells, extracts dimensions, speeds, capacities, and maps to standard fields automatically.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> SheetJS live parsing
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-blue-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Auto fuzzy cell mapper
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-purple-600">
            <Sparkles className="w-3.5 h-3.5" /> Automatic sequence generation
          </span>
        </div>
      </div>

      {/* Parsed Specification Review Drawer / Modal */}
      {parsedResult && (
        <div className="p-6 rounded-2xl border border-primary/40 bg-card shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {parsedResult.confidenceAvg}% Confidence Score
                </span>
                <span className="text-xs text-muted-foreground">
                  Detected Sheets: {parsedResult.sheetNames.join(', ')}
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground mt-1 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Parsed: {parsedResult.fileName} ({parsedResult.fileSize})
              </h2>
            </div>

            <button
              onClick={() => setParsedResult(null)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground self-start sm:self-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Target Assignment Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs bg-muted/40 p-4 rounded-xl border border-border">
            <div>
              <label className="font-semibold block mb-1 text-foreground">Attach to Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  const p = projects.find((prj) => prj.id === e.target.value);
                  if (p?.egisSummaries?.[0]) setSelectedEgisId(p.egisSummaries[0].egisId);
                }}
                className="w-full p-2 rounded-lg border border-border bg-background"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.projectCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-foreground">EGIS Alternative</label>
              <select
                value={selectedEgisId}
                onChange={(e) => setSelectedEgisId(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background font-mono"
              >
                {selectedProject?.egisSummaries?.map((eg) => (
                  <option key={eg.id} value={eg.egisId}>
                    {eg.egisId} (SEQ 00{eg.latestSeqNumber})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1 text-foreground">Revision Sequence Label</label>
              <input
                type="text"
                value={revisionLabel}
                onChange={(e) => setRevisionLabel(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background font-medium"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-foreground">Quotation Price ($ USD)</label>
              <input
                type="number"
                value={revisionPrice}
                onChange={(e) => setRevisionPrice(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-border bg-background font-mono font-bold"
              />
            </div>
          </div>

          {/* Extracted Parameters Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Extracted Parameters ({Object.keys(parsedResult.extractedFields).length} Fields)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto p-1">
              {Object.values(parsedResult.extractedFields).map((field) => (
                <div
                  key={field.fieldKey}
                  className="p-3 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">{field.fieldLabel}</span>
                    <span className="font-mono text-[10px] text-primary/70">{field.sourceCell}</span>
                  </div>
                  <div className="font-bold text-foreground text-sm truncate">
                    {String(field.value)} {field.unit || ''}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              onClick={() => setParsedResult(null)}
              className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-xs font-semibold text-muted-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRevision}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-md shadow-primary/20 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Save as New Revision Sequence</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search field dictionary by name or key..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-xs px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium w-full md:w-auto"
        >
          <option value="ALL">All Categories</option>
          {SPEC_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Canonical Dictionary Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
              <tr>
                <th className="py-3 px-4">Field Label</th>
                <th className="py-3 px-4">Canonical Key</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Data Type</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Validation Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredFields.map((field) => (
                <tr key={field.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-semibold text-foreground">{field.label}</td>
                  <td className="py-3 px-4 font-mono text-primary font-medium">{field.key}</td>
                  <td className="py-3 px-4 text-muted-foreground">{field.category}</td>
                  <td className="py-3 px-4 font-mono uppercase">{field.dataType}</td>
                  <td className="py-3 px-4 font-mono">{field.unit || '—'}</td>
                  <td className="py-3 px-4">
                    {field.required ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-semibold">
                        Mandatory
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Optional</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
