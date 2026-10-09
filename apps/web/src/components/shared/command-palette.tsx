import React, { useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, Layers, Plus, UploadCloud, GitCompare, Calculator } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { MOCK_PROJECTS } from '@/mocks/sems-data';

export const CommandPalette: React.FC = () => {
  const { commandOpen, setCommandOpen } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandOpen, setCommandOpen]);

  if (!commandOpen) return null;

  const handleSelect = (to: string) => {
    setCommandOpen(false);
    navigate(to);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in-50">
      <div
        className="fixed inset-0"
        onClick={() => setCommandOpen(false)}
      />
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-10 animate-in zoom-in-95">
        <Command className="flex flex-col w-full">
          <div className="flex items-center px-4 border-b border-border">
            <Search className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Type a command, project name, or EGIS ID..."
              className="w-full py-3.5 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-muted-foreground border">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[360px] overflow-y-auto p-2 space-y-2">
            <Command.Empty className="p-4 text-center text-xs text-muted-foreground">
              No matching results found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group heading="Quick Actions" className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
              <Command.Item
                onSelect={() => handleSelect('/projects/new')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>Create New Project</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/specifications')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                <UploadCloud className="w-4 h-4 text-blue-500" />
                <span>Upload & Parse Specification</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect('/comparisons')}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                <GitCompare className="w-4 h-4 text-purple-500" />
                <span>Open Specification Comparisons</span>
              </Command.Item>
            </Command.Group>

            {/* Projects */}
            <Command.Group heading="Projects" className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
              {MOCK_PROJECTS.map((project) => (
                <Command.Item
                  key={project.id}
                  onSelect={() => handleSelect(`/projects/${project.id}`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FolderKanban className="w-4 h-4 text-slate-400" />
                    <span className="font-medium truncate">{project.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">{project.projectCode}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{project.customerName}</span>
                </Command.Item>
              ))}
            </Command.Group>

            {/* EGIS IDs */}
            <Command.Group heading="EGIS Alternatives" className="px-2 py-1 text-[11px] font-semibold text-muted-foreground">
              {MOCK_PROJECTS.flatMap((p) => p.egisSummaries || []).map((egis) => (
                <Command.Item
                  key={egis.id}
                  onSelect={() => handleSelect(`/egis/${egis.egisId}`)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono font-medium text-xs text-primary">{egis.egisId}</span>
                    <span className="text-xs text-muted-foreground">{egis.aliasName || 'Alternative'}</span>
                  </div>
                  <span className="text-xs font-mono">{egis.production} / {egis.currency}</span>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
};
