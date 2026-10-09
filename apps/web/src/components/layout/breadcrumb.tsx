import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getReadableName = (path: string) => {
    switch (path) {
      case 'projects':
        return 'Projects';
      case 'egis':
        return 'EGIS Master';
      case 'specifications':
        return 'Specifications';
      case 'comparisons':
        return 'Comparisons';
      case 'estimations':
        return 'Estimations';
      case 'approvals':
        return 'Approvals';
      case 'documents':
        return 'Documents';
      case 'egis-generator':
        return 'EGIS Generator';
      case 'settings':
        return 'Settings';
      case 'audit-log':
        return 'Audit Log';
      case 'new':
        return 'Create New';
      default:
        if (path.startsWith('prj-') || path.startsWith('PRJ-')) {
          return 'Project Details';
        }
        if (path.startsWith('HDE-') || path.startsWith('egis-')) {
          return path;
        }
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
  };

  return (
    <nav className="flex items-center text-xs text-muted-foreground mb-4 select-none">
      <Link
        to="/"
        className="flex items-center hover:text-foreground transition-colors font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        Dashboard
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const readable = getReadableName(value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-400" />
            {isLast ? (
              <span className="font-semibold text-foreground tracking-tight">{readable}</span>
            ) : (
              <Link to={to} className="hover:text-foreground transition-colors font-medium">
                {readable}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
