import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  FileSpreadsheet,
  GitCompare,
  Calculator,
  CheckCircle2,
  FileText,
  Cpu,
  LayoutTemplate,
  Database,
  BarChart3,
  ScrollText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hexagon,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  const mainNav: NavItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: FolderKanban, label: 'Projects', to: '/projects', badge: '128' },
    { icon: Layers, label: 'EGIS Master', to: '/egis' },
    { icon: FileSpreadsheet, label: 'Specifications', to: '/specifications' },
    { icon: GitCompare, label: 'Comparisons', to: '/comparisons', badge: '5', badgeColor: 'bg-blue-500/10 text-blue-600' },
    { icon: Calculator, label: 'Estimations', to: '/estimations' },
    { icon: CheckCircle2, label: 'Approvals', to: '/approvals', badge: '7', badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' },
    { icon: FileText, label: 'Documents', to: '/documents' },
    { icon: Cpu, label: 'EGIS Generator', to: '/egis-generator' },
  ];

  const adminNav: NavItem[] = [
    { icon: LayoutTemplate, label: 'Templates', to: '/settings/templates' },
    { icon: Database, label: 'Master Data', to: '/settings/master-data' },
    { icon: BarChart3, label: 'Reports', to: '/reports' },
    { icon: ScrollText, label: 'Audit Log', to: '/audit-log' },
    { icon: Users, label: 'Users', to: '/users' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out select-none z-30 ${
        sidebarCollapsed ? 'w-[70px]' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/80 bg-slate-900 text-white">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
            <Hexagon className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold tracking-tight text-base text-white flex items-center gap-1.5">
                SEMS
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 font-normal">
                  v1.1
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                PT Superhelindo Jaya
              </span>
            </div>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-6">
        {/* Main Section */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Operational
            </div>
          )}
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-primary-foreground' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                      {!sidebarCollapsed && item.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                            item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300')
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Administration Section */}
        <div>
          {!sidebarCollapsed && (
            <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Management
            </div>
          )}
          <nav className="space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                    } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-primary-foreground' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate flex-1">{item.label}</span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-border bg-slate-50/60 dark:bg-slate-900/40">
        <div
          className={`flex items-center gap-3 ${
            sidebarCollapsed ? 'justify-center' : 'px-2'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-500/30">
            BS
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-foreground truncate">
                Budi Santoso
              </span>
              <span className="text-[10px] text-muted-foreground truncate font-mono">
                Estimator • PT Superhelindo
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
