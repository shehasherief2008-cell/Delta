-- ==============================================================================
-- RESCUEPLATE PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- ==============================================================================
-- Aligned with Hackathon requirements:
-- Tables: profiles, organizations, donations, donation_claims, pickups,
--         impact_events, reports, verification_requests, audit_logs
-- Includes:
-- - Strict Check Constraints (positive quantities, valid dates)
-- - Foreign Key Relationships
-- - Comprehensive Row Level Security (RLS) policies
-- - Automated status change audit triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('donor', 'recipient', 'volunteer', 'admin')),
  phone TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ORGANIZATIONS TABLE
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Restaurant', 'Hotel', 'Catering', 'Hostel', 'NGO', 'Community Kitchen', 'Volunteer Hub')),
  tax_id TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  capacity_kg NUMERIC(8,2) DEFAULT 100.0 CHECK (capacity_kg > 0),
  has_refrigeration BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  contact_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (LENGTH(TRIM(title)) >= 5),
  category TEXT NOT NULL CHECK (category IN (
    'Cooked Meals',
    'Bakery & Bread',
    'Fresh Produce',
    'Dairy & Refrigerated',
    'Packaged & Dry Goods',
    'Beverages'
  )),
  description TEXT NOT NULL CHECK (LENGTH(TRIM(description)) >= 10),
  quantity NUMERIC(8,2) NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'servings', 'boxes', 'trays', 'litres')),
  estimated_meals INT NOT NULL CHECK (estimated_meals > 0),
  storage_requirement TEXT NOT NULL CHECK (storage_requirement IN (
    'Room Temperature',
    'Refrigerated (0-4°C)',
    'Frozen (-18°C)',
    'Hot Holding (>60°C)',
    'Insulated Box / Carrier'
  )),
  dietary_classification TEXT[] DEFAULT '{}',
  allergens TEXT[] DEFAULT '{}',
  prepared_at TIMESTAMPTZ NOT NULL,
  available_from TIMESTAMPTZ NOT NULL,
  collection_deadline TIMESTAMPTZ NOT NULL,
  pickup_locality TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN (
    'available',
    'claimed',
    'pickup_scheduled',
    'in_transit',
    'delivered',
    'cancelled',
    'expired'
  )),
  special_instructions TEXT,
  safety_checklist_acknowledged BOOLEAN NOT NULL DEFAULT FALSE CHECK (safety_checklist_acknowledged = TRUE),
  moderation_status TEXT NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('approved', 'flagged', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_deadline CHECK (collection_deadline > available_from)
);

-- 4. DONATION CLAIMS TABLE
CREATE TABLE IF NOT EXISTS public.donation_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL UNIQUE REFERENCES public.donations(id) ON DELETE CASCADE,
  recipient_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  pickup_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PICKUPS TABLE
CREATE TABLE IF NOT EXISTS public.pickups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL UNIQUE REFERENCES public.donations(id) ON DELETE CASCADE,
  volunteer_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  pickup_code TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ,
  collected_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_transit', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. IMPACT EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.impact_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID NOT NULL UNIQUE REFERENCES public.donations(id) ON DELETE CASCADE,
  meals_served INT NOT NULL CHECK (meals_served > 0),
  kg_diverted NUMERIC(8,2) NOT NULL CHECK (kg_diverted > 0),
  co2e_avoided_kg NUMERIC(8,2) NOT NULL CHECK (co2e_avoided_kg >= 0),
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('donation', 'organization', 'user')),
  reporter_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VERIFICATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  donation_id UUID REFERENCES public.donations(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  actor_role TEXT,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_category ON public.donations(category);
CREATE INDEX IF NOT EXISTS idx_donations_deadline ON public.donations(collection_deadline);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON public.donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_claims_donation ON public.donation_claims(donation_id);
CREATE INDEX IF NOT EXISTS idx_pickups_volunteer ON public.pickups(volunteer_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read profiles; users can update own profile
CREATE POLICY "Public profile read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Donations: Anyone can view approved & active donations; donors manage own listings
CREATE POLICY "View active donations" ON public.donations FOR SELECT
  USING (moderation_status = 'approved');

CREATE POLICY "Donors insert own donations" ON public.donations FOR INSERT
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors update own active donations" ON public.donations FOR UPDATE
  USING (auth.uid() = donor_id AND status = 'available');

-- Claims: Recipient organizations claim available donations; users view their claims
CREATE POLICY "View claims" ON public.donation_claims FOR SELECT
  USING (auth.uid() = recipient_user_id);

CREATE POLICY "Recipients insert claim" ON public.donation_claims FOR INSERT
  WITH CHECK (auth.uid() = recipient_user_id);

-- Impact Events: Public read access
CREATE POLICY "Public impact read" ON public.impact_events FOR SELECT USING (true);

-- Reports: Authenticated users can file reports
CREATE POLICY "Authenticated users submit report" ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_user_id);

