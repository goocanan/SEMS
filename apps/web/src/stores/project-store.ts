import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Project,
  Egis,
  Revision,
  RevisionStatus,
  ProjectStatus,
  Currency,
  Production,
  BuildingType,
  ProductType,
  calculateEgisValidity,
  calculatePriceValidity,
} from '@sems/shared';
import {
  MOCK_PROJECTS,
  MOCK_EGIS_DETAILS,
  MOCK_REVISIONS,
  MOCK_ACTIVITY_LOGS,
} from '@/mocks/sems-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  project: string;
  url?: string;
}

export interface ActivityLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  project?: string;
  time: string;
  type?: string;
  badge?: string;
}

const INITIAL_DOCS: DocumentItem[] = [
  { id: 'doc-1', name: 'JKT_TOWER_SPEC_CHECK_V2.xlsx', type: 'Excel', size: '2.4 MB', date: '2 days ago', project: 'Jakarta Tower' },
  { id: 'doc-2', name: 'JKT_TOWER_APPROVAL_SHEET.xlsx', type: 'Excel', size: '1.8 MB', date: '12 days ago', project: 'Jakarta Tower' },
  { id: 'doc-3', name: 'SBY_MALL_FUP_REV1.xlsx', type: 'Excel', size: '3.1 MB', date: '15 days ago', project: 'Grand Mall Surabaya' },
  { id: 'doc-4', name: 'BALI_CLIFF_PANORAMIC_SPEC.xlsx', type: 'Excel', size: '1.2 MB', date: '20 days ago', project: 'Bali Resort' },
  { id: 'doc-5', name: 'COMPARISON_REPORT_SEQ004_005.pdf', type: 'PDF', size: '850 KB', date: '1 day ago', project: 'Jakarta Tower' },
];

interface CreateProjectPayload {
  name: string;
  customerName: string;
  location: string;
  buildingType: BuildingType;
  productType: ProductType;
  unitQuantity: number;
  marketingName: string;
  aliases?: string[];
  production?: Production;
  currency?: Currency;
}

interface ProjectState {
  projects: Project[];
  egisList: Egis[];
  revisions: Revision[];
  documents: DocumentItem[];
  activities: ActivityLogItem[];
  isLoading: boolean;

  // Actions
  createProject: (payload: CreateProjectPayload) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addAlias: (projectId: string, aliasName: string) => void;

  // Revisions & Approvals
  createRevision: (rev: Partial<Revision> & { egisRefId: string; egisId: string }) => Revision;
  approveRevision: (revisionId: string, approvedByName?: string) => void;
  rejectRevision: (revisionId: string, reason?: string) => void;

  // Documents
  addDocument: (doc: Omit<DocumentItem, 'id' | 'date'>) => DocumentItem;
  deleteDocument: (id: string) => void;

  // Reset
  resetToDefaults: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: MOCK_PROJECTS,
      egisList: MOCK_EGIS_DETAILS,
      revisions: MOCK_REVISIONS,
      documents: INITIAL_DOCS,
      activities: MOCK_ACTIVITY_LOGS,
      isLoading: false,

      createProject: (payload) => {
        const id = `prj-${Date.now()}`;
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        const projectCode = `PRJ-2026-${randomNum}`;
        const now = new Date().toISOString();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 180);
        const expiryIso = futureDate.toISOString();

        const egisCode = `HDE-260${Math.floor(1000 + Math.random() * 9000)}`;

        const aliasList = [
          { id: `al-${Date.now()}-1`, name: `${payload.name} (Primary)`, isPrimary: true, addedAt: now },
          ...(payload.aliases || []).map((name, i) => ({
            id: `al-${Date.now()}-${i + 2}`,
            name,
            isPrimary: false,
            addedAt: now,
          })),
        ];

        const initialEgisSummary = {
          id: `egis-${Date.now()}`,
          egisId: egisCode,
          aliasName: 'Initial Alternative (Primary)',
          currency: payload.currency || Currency.USD,
          production: payload.production || Production.CHINA,
          latestSeqNumber: 1,
          latestPrice: 120000,
          egisValidity: calculateEgisValidity(expiryIso),
          priceValidity: calculatePriceValidity(expiryIso),
          status: 'ACTIVE',
        };

        const newProject: Project = {
          id,
          projectCode,
          name: payload.name,
          aliases: aliasList,
          customerId: `cust-${Date.now()}`,
          customerName: payload.customerName,
          location: payload.location,
          buildingType: payload.buildingType,
          productType: payload.productType,
          unitQuantity: payload.unitQuantity,
          primaryMarketingId: 'mkt-1',
          primaryMarketingName: payload.marketingName,
          status: ProjectStatus.ACTIVE,
          notes: 'Created via SEMS Project Generator',
          createdAt: now,
          updatedAt: now,
          egisSummaries: [initialEgisSummary],
        };

        // Create initial revision
        const newRevision: Revision = {
          id: `rev-${Date.now()}`,
          egisRefId: initialEgisSummary.id,
          egisId: egisCode,
          seqNumber: 1,
          seqCode: '001',
          process: 'EGIS_SPEC_CHECK' as any,
          revisionLabel: 'SPEC CHECK REV 0',
          status: RevisionStatus.PENDING_REVIEW,
          price: 120000,
          currency: payload.currency || Currency.USD,
          priceDate: now,
          priceExpiryDate: expiryIso,
          createdBy: 'usr-current',
          createdByName: payload.marketingName || 'Current Estimator',
          changeCount: 1,
          sourceFileName: `${egisCode}_001_Initial.xlsx`,
          notes: 'Initial sequence submission awaiting sign-off.',
          createdAt: now,
          updatedAt: now,
        };

        // Log activity
        const newActivity: ActivityLogItem = {
          id: `act-${Date.now()}`,
          user: payload.marketingName || 'Estimator',
          role: 'Estimator',
          action: 'Created new project and EGIS alternative',
          target: `${payload.name} (${egisCode})`,
          time: 'Just now',
          badge: 'green',
        };

        set((state) => ({
          projects: [newProject, ...state.projects],
          revisions: [newRevision, ...state.revisions],
          activities: [newActivity, ...state.activities],
        }));

        // Fire-and-forget background sync if Supabase is available
        if (supabase && isSupabaseConfigured) {
          supabase.from('projects').insert([{
            id: newProject.id,
            project_code: newProject.projectCode,
            name: newProject.name,
            customer_id: newProject.customerId,
            customer_name: newProject.customerName,
            location: newProject.location,
            building_type: newProject.buildingType,
            product_type: newProject.productType,
            unit_quantity: newProject.unitQuantity,
            primary_marketing_id: newProject.primaryMarketingId,
            primary_marketing_name: newProject.primaryMarketingName,
            status: newProject.status,
            notes: newProject.notes,
          }]).then();
        }

        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      addAlias: (projectId, aliasName) => {
        const now = new Date().toISOString();
        const alias = {
          id: `al-${Date.now()}`,
          name: aliasName.trim(),
          isPrimary: false,
          addedAt: now,
        };

        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id !== projectId) return p;
            return {
              ...p,
              aliases: [...p.aliases, alias],
              updatedAt: now,
            };
          }),
        }));
      },

      createRevision: (rev) => {
        const now = new Date().toISOString();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const seqNumber = (rev.seqNumber || 1);
        const seqCode = String(seqNumber).padStart(3, '0');

        const newRev: Revision = {
          id: `rev-${Date.now()}`,
          egisRefId: rev.egisRefId,
          egisId: rev.egisId,
          seqNumber,
          seqCode,
          process: rev.process || ('FUP_ESTIMATION' as any),
          revisionLabel: rev.revisionLabel || `FUP REV ${seqNumber}`,
          status: RevisionStatus.PENDING_REVIEW,
          price: rev.price || 125000,
          currency: rev.currency || Currency.USD,
          priceDate: now,
          priceExpiryDate: futureDate.toISOString(),
          createdBy: 'usr-1',
          createdByName: 'Current Estimator',
          changeCount: rev.changeCount || 1,
          sourceFileName: rev.sourceFileName || `${rev.egisId}_${seqCode}.xlsx`,
          notes: rev.notes || 'Submitted for validation',
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          revisions: [newRev, ...state.revisions],
        }));

        return newRev;
      },

      approveRevision: (revisionId, approvedByName = 'Dewi Lestari (Lead)') => {
        const now = new Date().toISOString();
        set((state) => {
          const target = state.revisions.find((r) => r.id === revisionId);
          if (!target) return state;

          const updatedRevisions = state.revisions.map((r) =>
            r.id === revisionId
              ? {
                  ...r,
                  status: RevisionStatus.APPROVED,
                  approvedBy: 'usr-lead',
                  approvedByName,
                  approvedAt: now,
                  updatedAt: now,
                }
              : r
          );

          const newActivity: ActivityLogItem = {
            id: `act-${Date.now()}`,
            user: approvedByName,
            role: 'Lead Estimator',
            action: `Approved Revision SEQ ${target.seqCode}`,
            target: `${target.egisId} (${target.revisionLabel})`,
            time: 'Just now',
            badge: 'blue',
          };

          return {
            revisions: updatedRevisions,
            activities: [newActivity, ...state.activities],
          };
        });
      },

      rejectRevision: (revisionId, reason = 'Changes requested') => {
        const now = new Date().toISOString();
        set((state) => {
          const target = state.revisions.find((r) => r.id === revisionId);
          if (!target) return state;

          const updatedRevisions = state.revisions.map((r) =>
            r.id === revisionId
              ? {
                  ...r,
                  status: RevisionStatus.REJECTED,
                  notes: `${r.notes || ''} [Rejected: ${reason}]`,
                  updatedAt: now,
                }
              : r
          );

          const newActivity: ActivityLogItem = {
            id: `act-${Date.now()}`,
            user: 'Lead Estimator',
            role: 'Lead Estimator',
            action: `Rejected Revision SEQ ${target.seqCode}`,
            target: `${target.egisId} — ${reason}`,
            time: 'Just now',
            badge: 'amber',
          };

          return {
            revisions: updatedRevisions,
            activities: [newActivity, ...state.activities],
          };
        });
      },

      addDocument: (doc) => {
        const newDoc: DocumentItem = {
          ...doc,
          id: `doc-${Date.now()}`,
          date: 'Just now',
        };

        set((state) => ({
          documents: [newDoc, ...state.documents],
        }));

        return newDoc;
      },

      deleteDocument: (id) => {
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
        }));
      },

      resetToDefaults: () => {
        set({
          projects: MOCK_PROJECTS,
          egisList: MOCK_EGIS_DETAILS,
          revisions: MOCK_REVISIONS,
          documents: INITIAL_DOCS,
          activities: MOCK_ACTIVITY_LOGS,
        });
      },
    }),
    {
      name: 'sems_app_storage_v1',
    }
  )
);
