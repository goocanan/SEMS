import React from 'react';
import { Search, Bell, Moon, Sun, Plus, UploadCloud } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useNavigate } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { theme, toggleTheme, setCommandOpen } = useAppStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6">
      {/* Global Search Bar (Trigger for cmdk palette) */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={() => setCommandOpen(true)}
          className="w-full max-w-md flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-border bg-slate-50/80 dark:bg-slate-900/60 text-muted-foreground hover:border-primary/50 hover:bg-card transition-all text-sm group shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
            <span className="text-slate-500 text-xs sm:text-sm">
              Search projects, EGIS IDs, specifications...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Action items on right */}
      <div className="flex items-center gap-3">
        {/* Quick upload specification */}
        <button
          onClick={() => navigate('/specifications')}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-foreground"
        >
          <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
          <span>Upload Spec</span>
        </button>

        {/* Quick create new project */}
        <button
          onClick={() => navigate('/projects/new')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/25 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-border mx-1" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/approvals')}
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="7 pending alerts & approvals"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-card animate-pulse" />
        </button>

        {/* User avatar badge */}
        <div className="flex items-center pl-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 flex items-center justify-center font-bold text-xs ring-2 ring-primary/20 cursor-pointer">
            BS
          </div>
        </div>
      </div>
    </header>
  );
};
