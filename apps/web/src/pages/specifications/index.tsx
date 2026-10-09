import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { SPEC_CATEGORIES, CANONICAL_SPEC_FIELDS } from '@sems/shared';
import { toast } from 'sonner';

export const SpecificationsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isUploading, setIsUploading] = useState(false);

  const filteredFields = CANONICAL_SPEC_FIELDS.filter((f) => {
    const matchSearch =
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.key.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Excel workbook parsed successfully! 32 specification fields extracted with 98% confidence.');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Specification Engine & Dictionary
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Canonical field taxonomy and automated Excel workbook extraction engine.
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={handleSimulateUpload}
        className="p-8 rounded-2xl border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer text-center space-y-3 group"
      >
        <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
          <UploadCloud className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">
            {isUploading ? 'Parsing Excel Workbook...' : 'Upload Specification Excel (.xlsx, .xls)'}
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
            Drag and drop your Hyundai tender Excel file here, or click to browse. The parser maps parameters to standard specification fields automatically.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground pt-1">
          <span className="flex items-center gap-1 font-medium text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Auto sheet detection
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-medium text-blue-600">
            <CheckCircle2 className="w-3.5 h-3.5" /> Fuzzy cell mapper
          </span>
        </div>
      </div>

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
