import React from 'react';
import { FileText, Download, FileSpreadsheet, File } from 'lucide-react';
import { toast } from 'sonner';

export const DocumentsPage: React.FC = () => {
  const docs = [
    { name: 'JKT_TOWER_SPEC_CHECK_V2.xlsx', type: 'Excel', size: '2.4 MB', date: '2 days ago', project: 'Jakarta Tower' },
    { name: 'JKT_TOWER_APPROVAL_SHEET.xlsx', type: 'Excel', size: '1.8 MB', date: '12 days ago', project: 'Jakarta Tower' },
    { name: 'SBY_MALL_FUP_REV1.xlsx', type: 'Excel', size: '3.1 MB', date: '15 days ago', project: 'Surabaya Grand Mall' },
    { name: 'BALI_CLIFF_PANORAMIC_SPEC.xlsx', type: 'Excel', size: '1.2 MB', date: '20 days ago', project: 'Bali Resort' },
    { name: 'COMPARISON_REPORT_SEQ004_005.pdf', type: 'PDF', size: '850 KB', date: '1 day ago', project: 'Jakarta Tower' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Document Library
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Centralized repository for all Excel estimation sheets, approval drawings, and comparison PDF reports.
        </p>
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
            {docs.map((doc, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-medium flex items-center gap-2">
                  {doc.type === 'Excel' ? (
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <FileText className="w-4 h-4 text-rose-500" />
                  )}
                  <span className="font-mono">{doc.name}</span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-foreground">{doc.project}</td>
                <td className="py-3.5 px-4 font-mono">{doc.type}</td>
                <td className="py-3.5 px-4 font-mono text-muted-foreground">{doc.size}</td>
                <td className="py-3.5 px-4 text-muted-foreground">{doc.date}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => toast.success(`Downloaded ${doc.name}`)}
                    className="p-1.5 rounded hover:bg-muted text-primary"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
