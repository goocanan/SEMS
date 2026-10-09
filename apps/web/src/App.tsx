import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/app-layout';
import { DashboardPage } from '@/pages/dashboard';
import { ProjectsPage } from '@/pages/projects';
import { CreateProjectPage } from '@/pages/projects/new';
import { ProjectDetailPage } from '@/pages/projects/[id]';
import { EgisListPage } from '@/pages/egis';
import { EgisDetailPage } from '@/pages/egis/[id]';
import { SpecificationsPage } from '@/pages/specifications';
import { ComparisonsPage } from '@/pages/comparisons';
import { EstimationsPage } from '@/pages/estimations';
import { ApprovalsPage } from '@/pages/approvals';
import { DocumentsPage } from '@/pages/documents';
import { EgisGeneratorPage } from '@/pages/egis-generator';
import { ReportsPage } from '@/pages/reports';
import { AuditLogPage } from '@/pages/audit-log';
import { UsersPage } from '@/pages/users';
import { SettingsPage } from '@/pages/settings';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<CreateProjectPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="egis" element={<EgisListPage />} />
          <Route path="egis/:id" element={<EgisDetailPage />} />
          <Route path="specifications" element={<SpecificationsPage />} />
          <Route path="comparisons" element={<ComparisonsPage />} />
          <Route path="estimations" element={<EstimationsPage />} />
          <Route path="approvals" element={<ApprovalsPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="egis-generator" element={<EgisGeneratorPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audit-log" element={<AuditLogPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/*" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
