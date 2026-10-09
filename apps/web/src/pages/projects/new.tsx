import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FolderKanban,
  ExternalLink,
} from 'lucide-react';
import {
  BuildingType,
  ProductType,
  Production,
  Currency,
  calculateStringSimilarity,
} from '@sems/shared';
import { useProjectStore } from '@/stores/project-store';
import { toast } from 'sonner';

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, createProject } = useProjectStore();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [customer, setCustomer] = useState('PT ABC Indonesia');
  const [location, setLocation] = useState('Jakarta');
  const [buildingType, setBuildingType] = useState<BuildingType>(BuildingType.COMMERCIAL);
  const [productType, setProductType] = useState<ProductType>(ProductType.ELEVATOR);
  const [unitQuantity, setUnitQuantity] = useState(6);
  const [marketing, setMarketing] = useState('Budi Santoso');

  // Step 2 Aliases
  const [aliases, setAliases] = useState<string[]>([]);
  const [newAlias, setNewAlias] = useState('');

  // Step 3 EGIS Setup
  const [production, setProduction] = useState<Production>(Production.CHINA);
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const [port, setPort] = useState('Shanghai Port');
  const [warranty, setWarranty] = useState(12);

  // Real-time Duplicate Detection
  const duplicateMatch = React.useMemo(() => {
    if (!name || name.trim().length < 3) return null;

    let bestMatch = null;
    let maxSim = 0;

    for (const proj of projects) {
      // Check primary name
      const sim = calculateStringSimilarity(name, proj.name);
      if (sim > maxSim) {
        maxSim = sim;
        bestMatch = { project: proj, similarity: sim, matchedName: proj.name };
      }

      // Check aliases
      for (const al of proj.aliases) {
        const alSim = calculateStringSimilarity(name, al.name);
        if (alSim > maxSim) {
          maxSim = alSim;
          bestMatch = { project: proj, similarity: alSim, matchedName: al.name };
        }
      }
    }

    if (maxSim >= 0.6) {
      return bestMatch;
    }
    return null;
  }, [name, projects]);

  const handleAddAlias = () => {
    if (newAlias.trim()) {
      setAliases([...aliases, newAlias.trim()]);
      setNewAlias('');
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a project name.');
      return;
    }
    const newProject = createProject({
      name: name.trim(),
      customerName: customer.trim() || 'PT General Customer',
      location: location || 'Jakarta',
      buildingType,
      productType,
      unitQuantity: Number(unitQuantity) || 1,
      marketingName: marketing || 'Budi Santoso',
      aliases,
      production,
      currency,
    });
    toast.success(`Project "${newProject.name}" (${newProject.projectCode}) created successfully!`);
    navigate(`/projects/${newProject.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Projects</span>
      </button>

      {/* Header & Steps Indicator */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create New Project
          </h1>
          <p className="text-sm text-muted-foreground">
            Set up project parameters, verify duplicate names, and establish the initial EGIS alternative.
          </p>
        </div>

        {/* Stepper Bar */}
        <div className="flex items-center justify-between border-y border-border py-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Project Information
            </span>
          </div>

          <div className="h-0.5 w-12 bg-border" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 2 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 2 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Aliases & Marketing
            </span>
          </div>

          <div className="h-0.5 w-12 bg-border" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep >= 3 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              3
            </span>
            <span className={`text-xs font-semibold ${currentStep >= 3 ? 'text-foreground' : 'text-muted-foreground'}`}>
              Initial EGIS Alternative
            </span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-xl border border-border bg-card shadow-sm space-y-6">
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Project Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jakarta Tower Phase 2"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Type name to trigger real-time duplicate check across existing projects and aliases.
              </span>
            </div>

            {/* Real-time Duplicate Detection Alert */}
            {duplicateMatch && (
              <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/20 space-y-3 animate-in fade-in-50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h2 className="text-xs font-bold text-amber-800 dark:text-amber-300">
                      Possible Duplicate Match Detected (
                      {Math.round(duplicateMatch.similarity * 100)}% Match)
                    </h2>
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      Found existing project: <strong className="font-semibold">{duplicateMatch.project.name}</strong> ({duplicateMatch.project.projectCode}) matching "{duplicateMatch.matchedName}". Customer: {duplicateMatch.project.customerName}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => navigate(`/projects/${duplicateMatch.project.id}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Open Existing Project</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Or continue creating if this is a distinct tender.
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Customer / Developer *
                </label>
                <input
                  type="text"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Location (City) *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Building Type *
                </label>
                <select
                  value={buildingType}
                  onChange={(e) => setBuildingType(e.target.value as BuildingType)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                >
                  {Object.values(BuildingType).map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Product Type *
                </label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as ProductType)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                >
                  {Object.values(ProductType).map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Unit Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={unitQuantity}
                  onChange={(e) => setUnitQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Primary Marketing *
                </label>
                <input
                  type="text"
                  value={marketing}
                  onChange={(e) => setMarketing(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-foreground">Project Aliases & Tender Nicknames</h2>
              <p className="text-xs text-muted-foreground">
                Add known tender aliases (e.g., architect codes, consultant codes, phase names) so incoming Excel files automatically resolve to this project.
              </p>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  placeholder="e.g. JKT-TW-P1 or Lot 5B"
                  className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  type="button"
                  onClick={handleAddAlias}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Add Alias
                </button>
              </div>

              {/* Alias Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
                  {name || 'Primary Name'} (Primary)
                </span>
                {aliases.map((al, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground font-medium flex items-center gap-1.5"
                  >
                    <span>{al}</span>
                    <button
                      type="button"
                      onClick={() => setAliases(aliases.filter((_, i) => i !== idx))}
                      className="text-muted-foreground hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-foreground">First EGIS Alternative Configuration</h2>
              <p className="text-xs text-muted-foreground">
                According to the PRD: 1 Project can have multiple EGIS IDs (e.g. China vs Korea manufacturing, USD vs CNY). Define the primary option below.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Production Origin *
                </label>
                <select
                  value={production}
                  onChange={(e) => setProduction(e.target.value as Production)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                >
                  <option value={Production.CHINA}>China (Hyundai Elevator China)</option>
                  <option value={Production.KOREA}>Korea (Hyundai Elevator Korea)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Quotation Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-medium"
                >
                  <option value={Currency.USD}>USD (United States Dollar)</option>
                  <option value={Currency.CNY}>CNY (Chinese Yuan)</option>
                  <option value={Currency.EUR}>EUR (Euro)</option>
                  <option value={Currency.IDR}>IDR (Indonesian Rupiah)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Port of Shipment *
                </label>
                <input
                  type="text"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Warranty Period (Months)
                </label>
                <input
                  type="number"
                  min="6"
                  max="60"
                  value={warranty}
                  onChange={(e) => setWarranty(parseInt(e.target.value) || 12)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step Buttons */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete & Launch Project</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
