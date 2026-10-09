import React from 'react';
import { Users, Plus, Shield } from 'lucide-react';
import { toast } from 'sonner';

export const UsersPage: React.FC = () => {
  const users = [
    { name: 'Budi Santoso', email: 'budi.santoso@superhelindo.co.id', role: 'Lead Estimator', department: 'Estimation Dept' },
    { name: 'Andi Wijaya', email: 'andi.wijaya@superhelindo.co.id', role: 'Senior Estimator', department: 'Technical Estimation' },
    { name: 'Siti Rahma', email: 'siti.rahma@superhelindo.co.id', role: 'Marketing Manager', department: 'Commercial & Sales' },
    { name: 'Hendra Gunawan', email: 'hendra.g@superhelindo.co.id', role: 'Technical Director', department: 'Management' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User Management & Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Role-based access controls for Estimators, Marketing, and Management Approvers.
          </p>
        </div>

        <button
          onClick={() => toast.info('Invite user modal')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted text-muted-foreground uppercase font-semibold border-b border-border">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <td className="py-3.5 px-4 font-semibold text-foreground">{u.name}</td>
                <td className="py-3.5 px-4 text-muted-foreground font-mono">{u.email}</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">{u.department}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-emerald-600 font-semibold">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
