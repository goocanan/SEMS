import { create } from 'zustand';

interface AppStore {
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Theme state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Command palette state
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;

  // Active project list view
  projectViewMode: 'card' | 'table';
  setProjectViewMode: (mode: 'card' | 'table') => void;
}

export const useAppStore = create<AppStore>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  theme: (localStorage.getItem('sems_theme') as 'light' | 'dark') || 'light',
  setTheme: (theme) => {
    localStorage.setItem('sems_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('sems_theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: next };
    });
  },

  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  toggleCommand: () => set((state) => ({ commandOpen: !state.commandOpen })),

  projectViewMode: 'card',
  setProjectViewMode: (mode) => set({ projectViewMode: mode }),
}));
