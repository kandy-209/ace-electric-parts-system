-- Migration fix: Use IF NOT EXISTS to handle existing tables
-- Run this if you get "already exists" errors

-- Enable UUID extension (safe to run multiple times)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Parts table (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS parts (
  part_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_number TEXT UNIQUE NOT NULL,
  manufacturer_part_number TEXT,
  description TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  manufacturer TEXT,
  oem_equivalents JSONB DEFAULT '[]'::jsonb,
  technical_specs JSONB DEFAULT '{}'::jsonb,
  motor_compatibility JSONB DEFAULT '{}'::jsonb,
  pump_compatibility JSONB DEFAULT '[]'::jsonb,
  images TEXT[] DEFAULT '{}',
  technical_drawings TEXT[] DEFAULT '{}',
  datasheet_url TEXT,
  certifications JSONB DEFAULT '[]'::jsonb,
  unit_cost DECIMAL(10, 2),
  current_stock INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  preferred_vendors JSONB DEFAULT '[]'::jsonb,
  supplier_skus JSONB DEFAULT '{}'::jsonb,
  last_updated TIMESTAMP,
  data_source TEXT DEFAULT 'manual',
  seo_keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Part cross-references
CREATE TABLE IF NOT EXISTS part_cross_references (
  cross_ref_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES parts(part_id) ON DELETE CASCADE,
  cross_reference_part_number TEXT NOT NULL,
  cross_reference_manufacturer TEXT,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('exact_match', 'compatible', 'upgrade', 'downgrade')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  vendor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  address JSONB DEFAULT '{}'::jsonb,
  capabilities JSONB DEFAULT '[]'::jsonb,
  materials JSONB DEFAULT '[]'::jsonb,
  processes JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  min_order_quantity INTEGER,
  max_order_quantity INTEGER,
  geographic_regions TEXT[] DEFAULT '{}',
  response_time_avg_hours DECIMAL(5, 2),
  quality_rating DECIMAL(3, 2) CHECK (quality_rating >= 0 AND quality_rating <= 5),
  is_verified BOOLEAN DEFAULT FALSE,
  is_preferred BOOLEAN DEFAULT FALSE,
  last_contact_date TIMESTAMP,
  notes TEXT,
  discovered_via TEXT CHECK (discovered_via IN ('scraping', 'linkedin', 'email', 'trade_show', 'portal', 'manual', 'referral')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RFQs table
CREATE TABLE IF NOT EXISTS rfqs (
  rfq_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_number TEXT UNIQUE NOT NULL,
  created_date TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'quotes_received', 'comparing', 'awarded', 'expired')),
  parts_requested JSONB NOT NULL DEFAULT '[]'::jsonb,
  special_requirements TEXT,
  customer_quote_id TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RFQ-Vendor relationships
CREATE TABLE IF NOT EXISTS rfq_vendors (
  rfq_vendor_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_id UUID REFERENCES rfqs(rfq_id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  sent_date TIMESTAMP DEFAULT NOW(),
  response_received BOOLEAN DEFAULT FALSE,
  response_date TIMESTAMP,
  channel TEXT CHECK (channel IN ('email', 'linkedin', 'portal', 'sms')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(rfq_id, vendor_id)
);

-- Vendor quotes table
CREATE TABLE IF NOT EXISTS vendor_quotes (
  quote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rfq_vendor_id UUID REFERENCES rfq_vendors(rfq_vendor_id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(vendor_id) ON DELETE CASCADE,
  vendor_quote_number TEXT NOT NULL,
  quote_date TIMESTAMP DEFAULT NOW(),
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  valid_until TIMESTAMP,
  lead_time_days INTEGER,
  terms TEXT,
  quote_document_url TEXT,
  extraction_confidence DECIMAL(3, 2) CHECK (extraction_confidence >= 0 AND extraction_confidence <= 1),
  requires_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  contact_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  event_name TEXT,
  event_date TIMESTAMP,
  business_card_image_url TEXT,
  notes TEXT,
  invited_to_portal BOOLEAN DEFAULT FALSE,
  portal_signup_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT UNIQUE NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('shop_repair', 'field_service', 'installation', 'maintenance')),
  customer_name TEXT NOT NULL,
  customer_id TEXT,
  equipment_type TEXT,
  equipment_model TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  assigned_tech TEXT,
  assigned_truck TEXT,
  start_date TIMESTAMP,
  completion_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  quote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number TEXT UNIQUE NOT NULL,
  quote_type TEXT NOT NULL CHECK (quote_type IN ('shop_repair', 'field_service', 'sales', 'installation')),
  customer_name TEXT NOT NULL,
  customer_id TEXT,
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  quote_tier TEXT CHECK (quote_tier IN ('good', 'better', 'best')),
  valid_until TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Repairs table
CREATE TABLE IF NOT EXISTS repairs (
  repair_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(job_id) ON DELETE SET NULL,
  repair_number TEXT UNIQUE NOT NULL,
  motor_type TEXT,
  frame_size TEXT,
  horsepower TEXT,
  repair_scope TEXT NOT NULL,
  warranty_start_date TIMESTAMP,
  warranty_duration_days INTEGER,
  warranty_expires_at TIMESTAMP,
  completed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Equipment table
CREATE TABLE IF NOT EXISTS equipment (
  equipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  installation_date TIMESTAMP,
  last_service_date TIMESTAMP,
  next_service_date TIMESTAMP,
  specifications JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  contract_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number TEXT UNIQUE NOT NULL,
  customer_id TEXT NOT NULL,
  contract_type TEXT NOT NULL CHECK (contract_type IN ('maintenance', 'service', 'warranty')),
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  renewal_date TIMESTAMP,
  auto_renew BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'renewed')),
  terms JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Training courses table
CREATE TABLE IF NOT EXISTS training_courses (
  course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration_hours INTEGER,
  prerequisites JSONB DEFAULT '[]'::jsonb,
  learning_objectives JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Employees table
CREATE TABLE IF NOT EXISTS employees (
  employee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL,
  skills JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  hire_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Import jobs table
CREATE TABLE IF NOT EXISTS import_jobs (
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_type TEXT NOT NULL CHECK (source_type IN ('excel', 'pdf', 'ocr', 'database', 'google_sheets', 'crm', 'email')),
  source_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scraping jobs table
CREATE TABLE IF NOT EXISTS scraping_jobs (
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  parts_found INTEGER DEFAULT 0,
  parts_new INTEGER DEFAULT 0,
  parts_updated INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_parts_part_number ON parts(part_number);
CREATE INDEX IF NOT EXISTS idx_parts_category ON parts(category);
CREATE INDEX IF NOT EXISTS idx_parts_manufacturer ON parts(manufacturer);
CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(vendor_name);
CREATE INDEX IF NOT EXISTS idx_vendors_discovered_via ON vendors(discovered_via);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
CREATE INDEX IF NOT EXISTS idx_rfqs_created_date ON rfqs(created_date);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_repairs_warranty_expires ON repairs(warranty_expires_at);
CREATE INDEX IF NOT EXISTS idx_contracts_renewal_date ON contracts(renewal_date);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);

-- Create updated_at trigger function (safe to recreate)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers (DROP IF EXISTS then CREATE)
DROP TRIGGER IF EXISTS update_parts_updated_at ON parts;
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vendors_updated_at ON vendors;
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rfqs_updated_at ON rfqs;
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON rfqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vendor_quotes_updated_at ON vendor_quotes;
CREATE TRIGGER update_vendor_quotes_updated_at BEFORE UPDATE ON vendor_quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_quotes_updated_at ON quotes;
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_repairs_updated_at ON repairs;
CREATE TRIGGER update_repairs_updated_at BEFORE UPDATE ON repairs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipment_updated_at ON equipment;
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contracts_updated_at ON contracts;
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_training_courses_updated_at ON training_courses;
CREATE TRIGGER update_training_courses_updated_at BEFORE UPDATE ON training_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

