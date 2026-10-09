import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import { Breadcrumb } from './breadcrumb';
import { CommandPalette } from '../shared/command-palette';
import { Toaster } from 'sonner';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
      </div>

      {/* Command Palette (⌘K) */}
      <CommandPalette />

      {/* Toast notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};
