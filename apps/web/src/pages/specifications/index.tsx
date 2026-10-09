import React, { useState, useRef, useMemo } from 'react';
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
  Building2,
  HeartPulse,
  Truck,
  Eye,
  Home,
  TrendingUp,
} from 'lucide-react';
import {
  SPEC_CATEGORIES,
  Currency,
  ElevatorProfileId,
  ELEVATOR_PROFILES,
  getFieldsForProfile,
} from '@sems/shared';
import { parseExcelSpecification, ParsedSpecResult } from '@/lib/excel-parser';
import { useProjectStore } from '@/stores/project-store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const SpecificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addDocument, createRevision } = useProjectStore();

  const [activeProfile, setActiveProfile] = useState<ElevatorProfileId>('PASSENGER');
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

  // Active fields for current profile
  const profileFields = useMemo(() => getFieldsForProfile(activeProfile), [activeProfile]);

  const filteredFields = useMemo(() => {
    return profileFields.filter((f) => {
      const matchSearch =
        f.label.toLowerCase().includes(search.toLowerCase()) ||
        f.key.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [profileFields, search, selectedCategory]);

  const handleProcessFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls, or .csv)');
      return;
    }

    try {
      setIsUploading(true);
      // Pass active profile to parser (or auto-detect if user kept on default)
      const result = await parseExcelSpecification(file, activeProfile);
      setParsedResult(result);
      setRevisionPrice(result.detectedPrice || 135000);

      // Align active profile if auto-detected different profile
      if (result.detectedProfile && result.detectedProfile !== activeProfile) {
        setActiveProfile(result.detectedProfile);
      }

      // Pre-select first EGIS of selected project
      if (selectedProject?.egisSummaries?.[0]) {
        setSelectedEgisId(selectedProject.egisSummaries[0].egisId);
      }

      toast.success(
        `Parsed "${file.name}"! Configured for ${
          ELEVATOR_PROFILES.find((p) => p.id === result.detectedProfile)?.name || 'Elevator'
        }.`
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
      notes: `Imported via Profile [${parsedResult.detectedProfile}] with ${parsedResult.confidenceAvg}% confidence.`,
    });

    toast.success(
      `Saved Sequence SEQ 00${nextSeq} for ${selectedProject.name}! Added to Approvals Queue and Document Library.`
    );
    setParsedResult(null);
    navigate(`/projects/${selectedProject.id}`);
  };

  // Generate Profile-Specific Sample Excel/CSV Template
  const handleDownloadSampleExcel = () => {
    let rows: string[] = [];

    if (activeProfile === 'HOSPITAL_BED') {
      rows = [
        'HYUNDAI HOSPITAL & BED ELEVATOR SPECIFICATION WORKBOOK',
        'Model,HYUNDAI LUXEN-BED',
        'Rated Capacity,1600 kg',
        'Passenger Count,21 persons',
        'Rated Speed,1.75 m/s',
        'Number of Stops,12',
        'Number of Openings,12',
        'Door Type,2-Panel Side Opening (2S)',
        'Door Width,1200 mm',
        'Door Height,2100 mm',
        'Car Inside Width (CA),1500 mm',
        'Car Inside Depth (CB),2400 mm',
        'Car Inside Height (CH),2400 mm',
        'Hospital Stretcher Clearance,2400 mm (Standard ICU Bed Compatible)',
        'Medical Door Hold Time,15 sec',
        'Hospital Priority Service Switch,Yes',
        'Anti-Microbial Interior Coating,Yes (Silver-Ion Coating)',
        'Protective Bumper Rail Height,900 mm Stainless Steel',
        'Quotation Price,148000 USD',
      ];
    } else if (activeProfile === 'FREIGHT_CARGO') {
      rows = [
        'HYUNDAI HEAVY DUTY FREIGHT & CARGO ELEVATOR SPECIFICATION',
        'Model,HYUNDAI FREIGHT-MRL',
        'Rated Capacity,3000 kg',
        'Rated Speed,0.75 m/s',
        'Number of Stops,6',
        'Number of Openings,6',
        'Door Type,Vertical Bi-Parting (2P-V)',
        'Door Width,2000 mm',
        'Door Height,2400 mm',
        'Car Inside Width (CA),2200 mm',
        'Car Inside Depth (CB),2800 mm',
        'Car Inside Height (CH),2600 mm',
        'Freight Loading Class,Class A (General Freight)',
        'Flooring Plate Steel Thickness,4.5 mm Checkered Steel Plate',
        'Entrance Sill Heavy-Duty Protection,Reinforced Steel Sill',
        'Quotation Price,185000 USD',
      ];
    } else if (activeProfile === 'PANORAMIC') {
      rows = [
        'HYUNDAI PANORAMIC OBSERVATION ELEVATOR SPECIFICATION',
        'Model,HYUNDAI LUXEN-PANORAMIC',
        'Rated Capacity,1350 kg',
        'Rated Speed,2.0 m/s',
        'Number of Stops,18',
        'Door Type,2-Panel Center Opening Glass Door',
        'Door Width,1100 mm',
        'Observation Glass Sides,3-Sides Laminated Observation Glass',
        'Laminated Glass Thickness,12.7 mm Toughened Laminated',
        'Under-Car Aerodynamic Dome Cover,Yes (Stainless Steel Mirror Dome)',
        'Exterior Car Illumination LED Strip,Yes (Full Perimeter Daylight 4000K)',
        'Quotation Price,162000 USD',
      ];
    } else if (activeProfile === 'ESCALATOR_WALK') {
      rows = [
        'HYUNDAI COMMERCIAL ESCALATOR SPECIFICATION WORKBOOK',
        'Model,HYUNDAI HYBRID-ESCALATOR',
        'Rated Speed,0.5 m/s',
        'Travel Height,5.0 m',
        'Step / Pallet Width,1000 mm',
        'Angle of Inclination,30 Degrees',
        'Structural Truss Span Length,11.8 m',
        'Balustrade Glass Type,Slim Glass Panel (10mm Tempered)',
        'Skirt Deflector Safety Brushes,Yes',
        'VVVF Auto Energy Saving Standby Mode,Yes',
        'Quotation Price,62000 USD',
      ];
    } else if (activeProfile === 'HOME_VILLA') {
      rows = [
        'HYUNDAI VILLA & HOME LIFT SPECIFICATION WORKBOOK',
        'Model,HYUNDAI NEW YZER-VILLA',
        'Rated Capacity,400 kg',
        'Passenger Count,5 persons',
        'Rated Speed,0.4 m/s',
        'Number of Stops,4',
        'Ultra Shallow Pit Depth,250 mm',
        'Low Overhead Clearance,2800 mm',
        'Single-Phase 220V Power Compatibility,Yes',
        'Door Type,Automatic 2-Panel Center Opening',
        'Quotation Price,38000 USD',
      ];
    } else {
      rows = [
        'HYUNDAI PASSENGER ELEVATOR SPECIFICATION WORKBOOK',
        'Model,LUXEN-MR',
        'Rated Capacity,1350 kg',
        'Passenger Count,18 persons',
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
      ];
    }

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAMPLE_${activeProfile}_SPEC_TEMPLATE.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded sample template for ${activeProfile}!`);
  };

  const getProfileIcon = (id: ElevatorProfileId) => {
    switch (id) {
      case 'HOSPITAL_BED':
        return <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />;
      case 'FREIGHT_CARGO':
        return <Truck className="w-3.5 h-3.5 text-amber-500" />;
      case 'PANORAMIC':
        return <Eye className="w-3.5 h-3.5 text-purple-500" />;
      case 'HOME_VILLA':
        return <Home className="w-3.5 h-3.5 text-indigo-500" />;
      case 'ESCALATOR_WALK':
        return <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
            Specification Engine & Multi-Profile Parser
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Dynamic taxonomy and automated Excel extractor tailored to specific elevator & escalator types.
          </p>
        </div>

        <button
          onClick={handleDownloadSampleExcel}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-primary shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Template ({ELEVATOR_PROFILES.find((p) => p.id === activeProfile)?.name})</span>
        </button>
      </div>

      {/* Elevator Profiles Selection Bar */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-foreground block">
          Select Unit Profile / Template Taxonomy:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {ELEVATOR_PROFILES.map((profile) => {
            const isSelected = activeProfile === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => {
                  setActiveProfile(profile.id);
                  toast.info(`Switched taxonomy to ${profile.name}`);
                }}
                className={`p-3 rounded-xl border text-left transition-all space-y-1 relative ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                    : 'border-border bg-card hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-1 rounded-md bg-background border border-border/80">
                    {getProfileIcon(profile.id)}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="text-xs font-bold text-foreground truncate mt-1">
                  {profile.name}
                </div>
                <div className="text-[10px] text-muted-foreground line-clamp-1">
                  {profile.description}
                </div>
              </button>
            );
          })}
        </div>
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/15 text-primary mb-2">
            {getProfileIcon(activeProfile)}
            <span>Active Profile: {ELEVATOR_PROFILES.find((p) => p.id === activeProfile)?.name}</span>
          </div>
          <h2 className="text-sm font-bold text-foreground">
            {isUploading ? 'Parsing Excel Workbook...' : 'Upload Specification Excel (.xlsx, .xls, .csv)'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Drop your tender Excel file here. The parser automatically extracts standard specifications as well as specialized {ELEVATOR_PROFILES.find((p) => p.id === activeProfile)?.name} parameters.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Auto Profile Detection
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-blue-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Dynamic Field Mapping
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-purple-600">
            <Sparkles className="w-3.5 h-3.5" /> Auto Sequence Bump
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
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  {getProfileIcon(parsedResult.detectedProfile)}
                  <span>{ELEVATOR_PROFILES.find((p) => p.id === parsedResult.detectedProfile)?.name}</span>
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
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Extracted Parameters ({Object.keys(parsedResult.extractedFields).length} Fields)</span>
              <span className="text-[11px] text-muted-foreground font-normal">
                Taxonomy Profile: <strong className="text-foreground">{parsedResult.detectedProfile}</strong>
              </span>
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
            placeholder={`Search ${ELEVATOR_PROFILES.find((p) => p.id === activeProfile)?.name} dictionary...`}
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
                <th className="py-3 px-4">Profile Availability</th>
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
                    {field.category === 'SPECIAL_FEATURES' ? (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                        Specialized ({activeProfile})
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                        Standard
                      </span>
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
