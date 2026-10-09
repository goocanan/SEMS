import React from 'react';
import { ScrollText, Search, User } from 'lucide-react';
import { MOCK_ACTIVITY_LOGS } from '@/mocks/sems-data';

export const AuditLogPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          System Audit Log
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tamper-evident activity trail tracking all spec uploads, approvals, price edits, and status changes.
        </p>
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
            {MOCK_ACTIVITY_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-semibold text-foreground">{log.user}</td>
                <td className="py-3.5 px-4 text-muted-foreground">{log.role}</td>
                <td className="py-3.5 px-4 font-medium text-primary">{log.action}</td>
                <td className="py-3.5 px-4 font-mono">{log.target}</td>
                <td className="py-3.5 px-4">{log.project}</td>
                <td className="py-3.5 px-4 text-right text-muted-foreground">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
