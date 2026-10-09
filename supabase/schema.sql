-- ==============================================================================
-- SEMS (Superhelindo Estimation & Specification Management System)
-- Database Schema for Supabase (PostgreSQL)
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'ESTIMATOR', -- ADMIN, ESTIMATOR, MARKETING, REVIEWER, VIEWER
  department TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  project_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  end_user TEXT,
  consultant TEXT,
  contractor TEXT,
  location TEXT NOT NULL,
  building_type TEXT NOT NULL, -- COMMERCIAL, RESIDENTIAL, HOSPITAL, HOTEL, MIXED_USE, INDUSTRIAL
  product_type TEXT NOT NULL,  -- ELEVATOR, ESCALATOR, TRAVELATOR, DUMBWAITER
  unit_quantity INTEGER NOT NULL DEFAULT 1,
  primary_marketing_id TEXT NOT NULL,
  primary_marketing_name TEXT NOT NULL,
  supporting_marketing TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, BIDDING, WON, LOST, ON_HOLD, CANCELLED
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. PROJECT ALIASES TABLE
CREATE TABLE IF NOT EXISTS public.project_aliases (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. EGIS RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.egis_records (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  egis_id TEXT NOT NULL UNIQUE, -- e.g. HDE-26000125
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  alias_name TEXT,
  currency TEXT NOT NULL DEFAULT 'USD',
  production TEXT NOT NULL DEFAULT 'STEP_SHANGHAI', -- STEP_SHANGHAI, LOCAL_ASSEMBLY, JAPAN_IMPORT
  status TEXT NOT NULL DEFAULT 'ACTIVE',            -- ACTIVE, EXPIRED, ARCHIVED, SUPERSEDED
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. REVISIONS TABLE
CREATE TABLE IF NOT EXISTS public.revisions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  egis_ref_id TEXT NOT NULL REFERENCES public.egis_records(id) ON DELETE CASCADE,
  egis_id TEXT NOT NULL,
  seq_number INTEGER NOT NULL DEFAULT 1,
  seq_code TEXT NOT NULL DEFAULT '001',
  process TEXT NOT NULL DEFAULT 'EGIS_SPEC_CHECK', -- EGIS_SPEC_CHECK, FUP_ESTIMATION, CONTRACT_FINAL
  revision_label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',           -- DRAFT, PENDING_REVIEW, APPROVED, ACTIVE, SUPERSEDED, EXPIRED, REJECTED
  price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  price_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  price_expiry_date TIMESTAMPTZ NOT NULL,
  created_by TEXT NOT NULL,
  created_by_name TEXT,
  approved_by TEXT,
  approved_by_name TEXT,
  approved_at TIMESTAMPTZ,
  change_count INTEGER NOT NULL DEFAULT 0,
  source_file_name TEXT,
  source_file_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. SPECIFICATIONS SNAPSHOT TABLE
CREATE TABLE IF NOT EXISTS public.specifications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  revision_id TEXT NOT NULL REFERENCES public.revisions(id) ON DELETE CASCADE,
  egis_id TEXT NOT NULL,
  seq_code TEXT NOT NULL,
  project_name TEXT NOT NULL,
  product_type TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '{}'::JSONB,
  completeness_percentage NUMERIC(5, 2) NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  description TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_url TEXT,
  storage_path TEXT,
  project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  egis_id TEXT,
  revision_id TEXT REFERENCES public.revisions(id) ON DELETE SET NULL,
  uploaded_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_code ON public.projects(project_code);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_product ON public.projects(product_type);
CREATE INDEX IF NOT EXISTS idx_project_aliases_project ON public.project_aliases(project_id);
CREATE INDEX IF NOT EXISTS idx_egis_project ON public.egis_records(project_id);
CREATE INDEX IF NOT EXISTS idx_egis_code ON public.egis_records(egis_id);
CREATE INDEX IF NOT EXISTS idx_revisions_egis ON public.revisions(egis_ref_id);
CREATE INDEX IF NOT EXISTS idx_specifications_rev ON public.specifications(revision_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.egis_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow public read for anon and authenticated users (suitable for demo / production)
DO $$
BEGIN
  -- Projects
  CREATE POLICY "Allow read access to all" ON public.projects FOR SELECT USING (true);
  CREATE POLICY "Allow write access to all" ON public.projects FOR ALL USING (true);

  -- Project Aliases
  CREATE POLICY "Allow read access to aliases" ON public.project_aliases FOR SELECT USING (true);
  CREATE POLICY "Allow write access to aliases" ON public.project_aliases FOR ALL USING (true);

  -- EGIS Records
  CREATE POLICY "Allow read access to egis" ON public.egis_records FOR SELECT USING (true);
  CREATE POLICY "Allow write access to egis" ON public.egis_records FOR ALL USING (true);

  -- Revisions
  CREATE POLICY "Allow read access to revisions" ON public.revisions FOR SELECT USING (true);
  CREATE POLICY "Allow write access to revisions" ON public.revisions FOR ALL USING (true);

  -- Specifications
  CREATE POLICY "Allow read access to specs" ON public.specifications FOR SELECT USING (true);
  CREATE POLICY "Allow write access to specs" ON public.specifications FOR ALL USING (true);

  -- Audit Logs
  CREATE POLICY "Allow read access to logs" ON public.audit_logs FOR SELECT USING (true);
  CREATE POLICY "Allow insert access to logs" ON public.audit_logs FOR INSERT WITH CHECK (true);

  -- Documents
  CREATE POLICY "Allow read access to documents" ON public.documents FOR SELECT USING (true);
  CREATE POLICY "Allow write access to documents" ON public.documents FOR ALL USING (true);

  -- Profiles
  CREATE POLICY "Allow read access to profiles" ON public.profiles FOR SELECT USING (true);
  CREATE POLICY "Allow write access to profiles" ON public.profiles FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN
  -- Policies already exist, ignore
  NULL;
END $$;

-- Optional: Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('sems-documents', 'sems-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Document Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'sems-documents');

CREATE POLICY "Public Document Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'sems-documents');
