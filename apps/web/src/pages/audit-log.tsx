import React, { useState, useMemo } from 'react';
import { ScrollText, Search, User } from 'lucide-react';
import { useProjectStore } from '@/stores/project-store';

export const AuditLogPage: React.FC = () => {
  const { activities } = useProjectStore();
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    return activities.filter((log: any) => {
      const q = search.toLowerCase();
      return (
        log.user?.toLowerCase().includes(q) ||
        log.action?.toLowerCase().includes(q) ||
        log.target?.toLowerCase().includes(q) ||
        (log.project && log.project.toLowerCase().includes(q))
      );
    });
  }, [activities, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-primary" />
            System Audit Log
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tamper-evident activity trail tracking all spec uploads, approvals, price edits, and status changes.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs by user, action, target..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Entity</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No audit logs matching "{search}"
                </td>
              </tr>
            ) : (
              filteredLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-4 font-semibold text-foreground">{log.user}</td>
                  <td className="py-3.5 px-4 text-muted-foreground">{log.role || 'Member'}</td>
                  <td className="py-3.5 px-4 font-medium text-primary">{log.action}</td>
                  <td className="py-3.5 px-4 font-mono">{log.target}</td>
                  <td className="py-3.5 px-4">{log.project || '-'}</td>
                  <td className="py-3.5 px-4 text-right text-muted-foreground">{log.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
