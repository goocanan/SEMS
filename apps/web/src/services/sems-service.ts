import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  MOCK_PROJECTS,
  MOCK_EGIS_DETAILS,
  MOCK_REVISIONS,
  MOCK_ACTIVITY_LOGS,
} from '@/mocks/sems-data';
import type { Project, Egis, Revision } from '@sems/shared';

export const semsService = {
  /**
   * Check if Supabase connection is active and available
   */
  isLive: isSupabaseConfigured,

  /**
   * Fetch all projects
   */
  async getProjects(): Promise<Project[]> {
    if (!supabase) return MOCK_PROJECTS;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          aliases:project_aliases(*),
          egis:egis_records(*)
        `)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_PROJECTS;
      }

      return data.map((row: any) => ({
        id: row.id,
        projectCode: row.project_code,
        name: row.name,
        customerId: row.customer_id,
        customerName: row.customer_name,
        endUser: row.end_user,
        consultant: row.consultant,
        contractor: row.contractor,
        location: row.location,
        buildingType: row.building_type,
        productType: row.product_type,
        unitQuantity: row.unit_quantity,
        primaryMarketingId: row.primary_marketing_id,
        primaryMarketingName: row.primary_marketing_name,
        supportingMarketing: row.supporting_marketing || [],
        status: row.status,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        aliases: (row.aliases || []).map((a: any) => ({
          id: a.id,
          name: a.name,
          isPrimary: a.is_primary,
          addedAt: a.added_at,
        })),
        egisSummaries: [],
      }));
    } catch {
      return MOCK_PROJECTS;
    }
  },

  /**
   * Fetch single project by ID
   */
  async getProjectById(id: string): Promise<Project | undefined> {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id);
  },

  /**
   * Fetch EGIS records
   */
  async getEgisList(): Promise<Egis[]> {
    if (!supabase) return MOCK_EGIS_DETAILS;

    try {
      const { data, error } = await supabase
        .from('egis_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_EGIS_DETAILS;
      }

      return MOCK_EGIS_DETAILS;
    } catch {
      return MOCK_EGIS_DETAILS;
    }
  },

  /**
   * Fetch revisions
   */
  async getRevisions(): Promise<Revision[]> {
    if (!supabase) return MOCK_REVISIONS;

    try {
      const { data, error } = await supabase
        .from('revisions')
        .select('*')
        .order('seq_number', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_REVISIONS;
      }

      return MOCK_REVISIONS;
    } catch {
      return MOCK_REVISIONS;
    }
  },

  /**
   * Fetch activity / audit logs
   */
  async getActivityLogs() {
    if (!supabase) return MOCK_ACTIVITY_LOGS;

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_ACTIVITY_LOGS;
      }

      return data;
    } catch {
      return MOCK_ACTIVITY_LOGS;
    }
  },
};
