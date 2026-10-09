-- ==============================================================================
-- SEMS Seed Data for Supabase
-- ==============================================================================

-- 1. Insert Initial Projects
INSERT INTO public.projects (
  id, project_code, name, customer_id, customer_name, end_user,
  consultant, contractor, location, building_type, product_type,
  unit_quantity, primary_marketing_id, primary_marketing_name,
  supporting_marketing, status, notes
) VALUES
(
  'prj-001',
  'PRJ-2026-00125',
  'Jakarta Tower',
  'cust-1',
  'PT ABC Indonesia',
  'ABC Capital Group',
  'PT Arsitek Megah Pratama',
  'PT Total Bangun Nusantara',
  'Jakarta',
  'COMMERCIAL',
  'ELEVATOR',
  6,
  'mkt-1',
  'Budi Santoso',
  ARRAY['Andi Wijaya', 'Siti Rahma'],
  'ACTIVE',
  'Premium commercial grade office development in Sudirman CBD.'
),
(
  'prj-002',
  'PRJ-2026-00126',
  'Grand Mall Surabaya',
  'cust-2',
  'PT Retail Nusantara',
  'Pakuwon Group',
  'PT Studio Desain Prima',
  'PT Wijaya Karya',
  'Surabaya',
  'COMMERCIAL',
  'ESCALATOR',
  12,
  'mkt-2',
  'Siti Rahma',
  ARRAY['Budi Santoso'],
  'BIDDING',
  'High traffic regional shopping center escalator package.'
),
(
  'prj-003',
  'PRJ-2026-00127',
  'Siloam Hospital Extension',
  'cust-3',
  'PT Siloam Medika Sejahtera',
  'Lippo Healthcare',
  'PT Medika Rancangan Prima',
  'PT Jaya Konstruksi',
  'Medan',
  'HOSPITAL',
  'ELEVATOR',
  4,
  'mkt-3',
  'Andi Wijaya',
  ARRAY[]::TEXT[],
  'ACTIVE',
  'Bed elevator and passenger emergency elevator installation.'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Project Aliases
INSERT INTO public.project_aliases (id, project_id, name, is_primary) VALUES
('al-1', 'prj-001', 'Jakarta Tower (Primary)', true),
('al-2', 'prj-001', 'JKT Tower', false),
('al-3', 'prj-001', 'Jakarta Tower Phase 1', false),
('al-4', 'prj-001', 'ABC Residence JKT', false),
('al-5', 'prj-002', 'Grand Mall SBY (Primary)', true),
('al-6', 'prj-003', 'Siloam Extension Medan (Primary)', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert EGIS Records
INSERT INTO public.egis_records (
  id, egis_id, project_id, project_name, alias_name, currency, production, status
) VALUES
(
  'egis-rec-001',
  'HDE-26000125',
  'prj-001',
  'Jakarta Tower',
  'Passenger Lift P1-P4 (High Rise)',
  'USD',
  'STEP_SHANGHAI',
  'ACTIVE'
),
(
  'egis-rec-002',
  'HDE-26000126',
  'prj-001',
  'Jakarta Tower',
  'Service Lift S1-S2 (Fireman)',
  'USD',
  'STEP_SHANGHAI',
  'ACTIVE'
),
(
  'egis-rec-003',
  'HDE-26000127',
  'prj-002',
  'Grand Mall Surabaya',
  'Indoor Escalators Ground to 4F',
  'USD',
  'LOCAL_ASSEMBLY',
  'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Revisions
INSERT INTO public.revisions (
  id, egis_ref_id, egis_id, seq_number, seq_code, process, revision_label,
  status, price, currency, price_date, price_expiry_date, created_by,
  created_by_name, approved_by, approved_by_name, change_count, source_file_name
) VALUES
(
  'rev-001',
  'egis-rec-001',
  'HDE-26000125',
  1,
  '001',
  'EGIS_SPEC_CHECK',
  'SPEC CHECK REV 0',
  'SUPERSEDED',
  145000.00,
  'USD',
  now() - INTERVAL '45 days',
  now() + INTERVAL '15 days',
  'usr-1',
  'Adi Pratama (Estimator)',
  'usr-4',
  'Dewi Lestari (Lead)',
  4,
  'HDE-26000125_001_SpecCheck.xlsx'
),
(
  'rev-002',
  'egis-rec-001',
  'HDE-26000125',
  2,
  '002',
  'FUP_ESTIMATION',
  'FUP REV 1 (Capacity Upgrade)',
  'ACTIVE',
  152500.00,
  'USD',
  now() - INTERVAL '15 days',
  now() + INTERVAL '45 days',
  'usr-1',
  'Adi Pratama (Estimator)',
  'usr-4',
  'Dewi Lestari (Lead)',
  7,
  'HDE-26000125_002_FUP_Final.xlsx'
)
ON CONFLICT (id) DO NOTHING;
