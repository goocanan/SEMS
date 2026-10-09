import React, { useRef, useState } from 'react';
import {
  FileText,
  Download,
  FileSpreadsheet,
  Upload,
  Trash2,
  Plus,
  FileCheck,
} from 'lucide-react';
import { useProjectStore } from '@/stores/project-store';
import { toast } from 'sonner';

export const DocumentsPage: React.FC = () => {
  const { documents, addDocument, deleteDocument, projects } = useProjectStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedProject, setSelectedProject] = useState(projects[0]?.name || 'General');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeMb} MB`;

    addDocument({
      name: file.name,
      type: isExcel ? 'Excel' : 'PDF',
      size: sizeStr,
      project: selectedProject,
      url: URL.createObjectURL(file),
    });

    toast.success(`Uploaded ${file.name} successfully!`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (doc: { name: string; url?: string }) => {
    if (doc.url) {
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Generate synthetic downloadable text/csv blob
      const blob = new Blob([`SEMS Document Export\nName: ${doc.name}\nTimestamp: ${new Date().toISOString()}`], {
        type: 'text/plain;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    toast.success(`Downloaded ${doc.name}`);
  };

  const handleDelete = (id: string, name: string) => {
    deleteDocument(id);
    toast.info(`Deleted ${name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Document Library
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Centralized repository for all Excel estimation sheets, approval drawings, and comparison PDF reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="text-xs p-2 rounded-lg border border-border bg-background"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".xlsx,.xls,.pdf,.csv,.doc,.docx"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
            <tr>
              <th className="py-3 px-4">Document Name</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Format</th>
              <th className="py-3 px-4">File Size</th>
              <th className="py-3 px-4">Uploaded</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                  {doc.type === 'Excel' ? (
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span className="font-mono truncate max-w-xs">{doc.name}</span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-foreground">{doc.project}</td>
                <td className="py-3.5 px-4 font-mono">{doc.type}</td>
                <td className="py-3.5 px-4 font-mono text-muted-foreground">{doc.size}</td>
                <td className="py-3.5 px-4 text-muted-foreground">{doc.date}</td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 rounded hover:bg-muted text-primary transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id, doc.name)}
                      className="p-1.5 rounded hover:bg-muted text-rose-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
