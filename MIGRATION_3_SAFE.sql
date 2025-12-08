-- Migration 3: Enhanced Schema (SAFE VERSION)
-- This version handles existing columns and tables safely
-- Created: December 2025

-- ============================================================================
-- ADDITIONAL COLUMNS TO EXISTING TABLES (Safe Column Addition)
-- ============================================================================

-- Add soft delete columns (only if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='deleted_at') THEN
        ALTER TABLE vendors ADD COLUMN deleted_at TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='deleted_at') THEN
        ALTER TABLE parts ADD COLUMN deleted_at TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='deleted_at') THEN
        ALTER TABLE rfqs ADD COLUMN deleted_at TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='contacts' AND column_name='deleted_at') THEN
        ALTER TABLE contacts ADD COLUMN deleted_at TIMESTAMP;
    END IF;
END $$;

-- Add audit tracking columns (only if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='created_by') THEN
        ALTER TABLE vendors ADD COLUMN created_by TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='updated_by') THEN
        ALTER TABLE vendors ADD COLUMN updated_by TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='created_by') THEN
        ALTER TABLE parts ADD COLUMN created_by TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='updated_by') THEN
        ALTER TABLE parts ADD COLUMN updated_by TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='updated_by') THEN
        ALTER TABLE rfqs ADD COLUMN updated_by TEXT;
    END IF;
END $$;

-- Add version tracking (only if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='version') THEN
        ALTER TABLE parts ADD COLUMN version INTEGER DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='version') THEN
        ALTER TABLE vendors ADD COLUMN version INTEGER DEFAULT 1;
    END IF;
END $$;

-- ============================================================================
-- NEW TABLES: Inventory Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS inventory (
  inventory_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID NOT NULL REFERENCES parts(part_id),
  location TEXT,
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  quantity_available INTEGER GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  reorder_point INTEGER,
  reorder_quantity INTEGER,
  unit_cost DECIMAL(10, 2),
  last_counted_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID NOT NULL REFERENCES inventory(inventory_id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('receipt', 'issue', 'adjustment', 'return', 'transfer')),
  quantity_change INTEGER NOT NULL,
  reference_type TEXT, -- 'order', 'repair', 'adjustment', etc.
  reference_id UUID,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Repair & Service Orders
-- ============================================================================

CREATE TABLE IF NOT EXISTS repair_orders (
  repair_order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_order_number TEXT UNIQUE NOT NULL,
  customer_id UUID,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Equipment details
  equipment_type TEXT NOT NULL,
  equipment_manufacturer TEXT,
  equipment_model TEXT,
  serial_number TEXT,
  
  -- Service details
  service_type TEXT NOT NULL CHECK (service_type IN ('repair', 'maintenance', 'inspection', 'upgrade', 'rewind', 'rebuild')),
  description TEXT NOT NULL,
  diagnosis TEXT,
  labor_hours DECIMAL(5, 2),
  labor_rate DECIMAL(10, 2),
  
  -- Parts & pricing
  parts_list JSONB DEFAULT '[]'::jsonb,
  parts_cost DECIMAL(12, 2) DEFAULT 0,
  labor_cost DECIMAL(12, 2) DEFAULT 0,
  tax DECIMAL(12, 2) DEFAULT 0,
  shipping DECIMAL(12, 2) DEFAULT 0,
  total_cost DECIMAL(12, 2) NOT NULL,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'diagnosing', 'quoted', 'approved', 'in_progress', 'testing', 'completed', 'shipped', 'delivered', 'cancelled')),
  received_date TIMESTAMP DEFAULT NOW(),
  quoted_date TIMESTAMP,
  approved_date TIMESTAMP,
  started_date TIMESTAMP,
  completed_date TIMESTAMP,
  shipped_date TIMESTAMP,
  delivered_date TIMESTAMP,
  
  -- Warranty
  warranty_period_days INTEGER,
  warranty_expires_date TIMESTAMP,
  
  -- Documents
  quote_url TEXT,
  work_order_url TEXT,
  invoice_url TEXT,
  test_report_url TEXT,
  
  -- Metadata
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  assigned_technician TEXT,
  notes TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS repair_parts (
  repair_part_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repair_order_id UUID NOT NULL REFERENCES repair_orders(repair_order_id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts(part_id),
  part_number TEXT,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10, 2),
  total_cost DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Quotes & Pricing
-- ============================================================================

CREATE TABLE IF NOT EXISTS shop_quotes (
  quote_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number TEXT UNIQUE NOT NULL,
  customer_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Quote details
  quote_type TEXT NOT NULL CHECK (quote_type IN ('repair', 'parts', 'service', 'installation', 'custom')),
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) DEFAULT 0,
  shipping DECIMAL(12, 2) DEFAULT 0,
  discount DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  valid_until TIMESTAMP,
  
  -- Pricing tiers
  pricing_tier TEXT CHECK (pricing_tier IN ('standard', 'volume', 'preferred', 'distributor')),
  
  -- Documents
  pdf_url TEXT,
  
  -- Metadata
  sales_rep_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  accepted_at TIMESTAMP
);

-- ============================================================================
-- NEW TABLES: Equipment & Assets
-- ============================================================================

CREATE TABLE IF NOT EXISTS equipment (
  equipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipment_type TEXT NOT NULL, -- 'motor', 'pump', 'generator', 'gearbox', etc.
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT UNIQUE,
  
  -- Specifications
  specifications JSONB DEFAULT '{}'::jsonb, -- HP, RPM, voltage, frame size, etc.
  
  -- Ownership
  customer_id UUID,
  owned_by_company BOOLEAN DEFAULT FALSE,
  
  -- Location
  location TEXT,
  installation_date TIMESTAMP,
  
  -- Maintenance
  last_service_date TIMESTAMP,
  next_service_date TIMESTAMP,
  service_history JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'repair', 'retired', 'sold', 'disposed')),
  
  -- Documents
  manual_url TEXT,
  warranty_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Contracts & Service Agreements
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_contracts (
  contract_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL,
  
  -- Contract details
  contract_type TEXT NOT NULL CHECK (contract_type IN ('maintenance', 'warranty', 'service_agreement', 'parts_supply')),
  start_date DATE NOT NULL,
  end_date DATE,
  auto_renew BOOLEAN DEFAULT FALSE,
  renewal_period_months INTEGER,
  
  -- Pricing
  monthly_fee DECIMAL(10, 2),
  annual_fee DECIMAL(12, 2),
  coverage_details JSONB DEFAULT '{}'::jsonb,
  
  -- Terms
  terms TEXT,
  payment_terms TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled', 'pending_renewal')),
  
  -- Metadata
  signed_date DATE,
  signed_by TEXT,
  contract_document_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Training & Certifications
-- ============================================================================

CREATE TABLE IF NOT EXISTS training_courses (
  course_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_name TEXT NOT NULL,
  course_code TEXT UNIQUE,
  description TEXT,
  category TEXT, -- 'motor_repair', 'safety', 'maintenance', etc.
  duration_hours DECIMAL(5, 2),
  prerequisites TEXT[],
  is_certification BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_trainings (
  training_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id TEXT, -- Can link to employees table or user ID
  course_id UUID REFERENCES training_courses(course_id),
  training_date DATE,
  completion_date DATE,
  status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'expired', 'failed')),
  score DECIMAL(5, 2),
  certificate_url TEXT,
  expiration_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  employee_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT,
  position TEXT,
  hire_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Import & Data Sync
-- ============================================================================

CREATE TABLE IF NOT EXISTS import_jobs (
  import_job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  import_type TEXT NOT NULL CHECK (import_type IN ('excel', 'csv', 'pdf', 'ocr', 'crm', 'email', 'api')),
  source_file_name TEXT,
  source_file_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'partial')),
  records_total INTEGER DEFAULT 0,
  records_processed INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Import records table (created after import_jobs)
CREATE TABLE IF NOT EXISTS import_records (
  import_record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  import_job_id UUID NOT NULL,
  row_number INTEGER,
  entity_type TEXT, -- 'part', 'vendor', 'contact', etc.
  entity_id UUID,
  raw_data JSONB DEFAULT '{}'::jsonb,
  processed_data JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'skipped')),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Web Scraping Jobs
-- ============================================================================

CREATE TABLE IF NOT EXISTS scraping_jobs (
  scraping_job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type TEXT NOT NULL CHECK (job_type IN ('vendor_discovery', 'part_data', 'price_monitoring', 'specification_extraction')),
  target_url TEXT,
  search_query TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  records_found INTEGER DEFAULT 0,
  records_processed INTEGER DEFAULT 0,
  records_extracted INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  results JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Quality Control & Testing
-- ============================================================================

CREATE TABLE IF NOT EXISTS quality_tests (
  test_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_type TEXT NOT NULL, -- 'megohm', 'hipot', 'vibration', 'balance', 'no_load', etc.
  equipment_id UUID REFERENCES equipment(equipment_id),
  repair_order_id UUID REFERENCES repair_orders(repair_order_id),
  test_date TIMESTAMP DEFAULT NOW(),
  performed_by TEXT,
  test_parameters JSONB DEFAULT '{}'::jsonb,
  test_results JSONB DEFAULT '{}'::jsonb,
  passed BOOLEAN,
  notes TEXT,
  test_report_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_inventory_part_id ON inventory(part_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_inventory_id ON inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(transaction_type);

-- Indexes for repair_orders (conditional)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'repair_orders') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'repair_orders' AND column_name = 'customer_id') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_repair_orders_customer') THEN
            CREATE INDEX idx_repair_orders_customer ON repair_orders(customer_id);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'repair_orders' AND column_name = 'status') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_repair_orders_status') THEN
            CREATE INDEX idx_repair_orders_status ON repair_orders(status);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'repair_orders' AND column_name = 'received_date') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_repair_orders_date') THEN
            CREATE INDEX idx_repair_orders_date ON repair_orders(received_date DESC);
        END IF;
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_repair_parts_repair_order ON repair_parts(repair_order_id);

-- Indexes for shop_quotes (conditional)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shop_quotes') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shop_quotes' AND column_name = 'customer_id') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_shop_quotes_customer') THEN
            CREATE INDEX idx_shop_quotes_customer ON shop_quotes(customer_id);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shop_quotes' AND column_name = 'status') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_shop_quotes_status') THEN
            CREATE INDEX idx_shop_quotes_status ON shop_quotes(status);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'shop_quotes' AND column_name = 'created_at') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_shop_quotes_date') THEN
            CREATE INDEX idx_shop_quotes_date ON shop_quotes(created_at DESC);
        END IF;
    END IF;
END $$;

-- Indexes for equipment (conditional)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'equipment') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'customer_id') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_equipment_customer') THEN
            CREATE INDEX idx_equipment_customer ON equipment(customer_id);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'serial_number') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_equipment_serial') THEN
            CREATE INDEX idx_equipment_serial ON equipment(serial_number);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'status') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_equipment_status') THEN
            CREATE INDEX idx_equipment_status ON equipment(status);
        END IF;
    END IF;
END $$;

-- Add foreign key constraint for equipment.customer_id AFTER customers table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
        -- Equipment FK
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'equipment_customer_id_fkey' AND table_name = 'equipment'
        ) THEN
            ALTER TABLE equipment 
            ADD CONSTRAINT equipment_customer_id_fkey 
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
        END IF;
        
        -- Repair orders FK
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'repair_orders_customer_id_fkey' AND table_name = 'repair_orders'
        ) THEN
            ALTER TABLE repair_orders 
            ADD CONSTRAINT repair_orders_customer_id_fkey 
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
        END IF;
        
        -- Service contracts FK
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'service_contracts_customer_id_fkey' AND table_name = 'service_contracts'
        ) THEN
            ALTER TABLE service_contracts 
            ADD CONSTRAINT service_contracts_customer_id_fkey 
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
        END IF;
        
        -- Shop quotes FK
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints 
            WHERE constraint_name = 'shop_quotes_customer_id_fkey' AND table_name = 'shop_quotes'
        ) THEN
            ALTER TABLE shop_quotes 
            ADD CONSTRAINT shop_quotes_customer_id_fkey 
            FOREIGN KEY (customer_id) REFERENCES customers(customer_id);
        END IF;
    END IF;
END $$;

-- Indexes for service_contracts (conditional)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'service_contracts') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_contracts' AND column_name = 'customer_id') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_contracts_customer') THEN
            CREATE INDEX idx_service_contracts_customer ON service_contracts(customer_id);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_contracts' AND column_name = 'status') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_contracts_status') THEN
            CREATE INDEX idx_service_contracts_status ON service_contracts(status);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'service_contracts' AND column_name = 'start_date') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_service_contracts_dates') THEN
            CREATE INDEX idx_service_contracts_dates ON service_contracts(start_date, end_date);
        END IF;
    END IF;
END $$;

-- Indexes for employee_trainings (conditional)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employee_trainings') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employee_trainings' AND column_name = 'employee_id') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_employee_trainings_employee') THEN
            CREATE INDEX idx_employee_trainings_employee ON employee_trainings(employee_id);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employee_trainings' AND column_name = 'course_id') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_employee_trainings_course') THEN
            CREATE INDEX idx_employee_trainings_course ON employee_trainings(course_id);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'employee_trainings' AND column_name = 'status') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_employee_trainings_status') THEN
            CREATE INDEX idx_employee_trainings_status ON employee_trainings(status);
        END IF;
    END IF;
END $$;

-- Indexes for import_jobs (conditional)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'import_jobs') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'import_jobs' AND column_name = 'status') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_import_jobs_status') THEN
            CREATE INDEX idx_import_jobs_status ON import_jobs(status);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'import_jobs' AND column_name = 'import_type') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_import_jobs_type') THEN
            CREATE INDEX idx_import_jobs_type ON import_jobs(import_type);
        END IF;
    END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_import_records_job ON import_records(import_job_id);

-- Add foreign key constraint for import_records AFTER table is created
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'import_records_import_job_id_fkey'
        AND table_name = 'import_records'
    ) THEN
        ALTER TABLE import_records 
        ADD CONSTRAINT import_records_import_job_id_fkey 
        FOREIGN KEY (import_job_id) 
        REFERENCES import_jobs(import_job_id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- Indexes for scraping_jobs (conditional)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scraping_jobs') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraping_jobs' AND column_name = 'status') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_scraping_jobs_status') THEN
            CREATE INDEX idx_scraping_jobs_status ON scraping_jobs(status);
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraping_jobs' AND column_name = 'job_type') 
           AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_scraping_jobs_type') THEN
            CREATE INDEX idx_scraping_jobs_type ON scraping_jobs(job_type);
        END IF;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_quality_tests_equipment ON quality_tests(equipment_id);
CREATE INDEX IF NOT EXISTS idx_quality_tests_repair_order ON quality_tests(repair_order_id);
CREATE INDEX IF NOT EXISTS idx_quality_tests_date ON quality_tests(test_date DESC);

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================

DROP TRIGGER IF EXISTS update_inventory_updated_at ON inventory;
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_repair_orders_updated_at ON repair_orders;
CREATE TRIGGER update_repair_orders_updated_at BEFORE UPDATE ON repair_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shop_quotes_updated_at ON shop_quotes;
CREATE TRIGGER update_shop_quotes_updated_at BEFORE UPDATE ON shop_quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipment_updated_at ON equipment;
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_contracts_updated_at ON service_contracts;
CREATE TRIGGER update_service_contracts_updated_at BEFORE UPDATE ON service_contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_training_courses_updated_at ON training_courses;
CREATE TRIGGER update_training_courses_updated_at BEFORE UPDATE ON training_courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTIONS FOR ANALYTICS
-- ============================================================================

-- Function to calculate repair order statistics (only if table exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'repair_orders') THEN
        EXECUTE 'CREATE OR REPLACE FUNCTION calculate_repair_stats(p_start_date TIMESTAMP, p_end_date TIMESTAMP)
        RETURNS TABLE (
          total_orders BIGINT,
          completed_orders BIGINT,
          total_revenue DECIMAL,
          average_repair_time_days DECIMAL,
          average_repair_cost DECIMAL
        ) AS $func$
        BEGIN
          RETURN QUERY
          SELECT
            COUNT(*)::BIGINT as total_orders,
            COUNT(*) FILTER (WHERE ro.status = ''completed'')::BIGINT as completed_orders,
            COALESCE(SUM(ro.total_cost), 0) as total_revenue,
            COALESCE(AVG(EXTRACT(EPOCH FROM (ro.completed_date - ro.received_date)) / 86400), 0) as average_repair_time_days,
            COALESCE(AVG(ro.total_cost), 0) as average_repair_cost
          FROM repair_orders ro
          WHERE ro.received_date >= p_start_date AND ro.received_date <= p_end_date;
        END;
        $func$ LANGUAGE plpgsql';
    END IF;
END $$;

-- Function to check inventory levels and generate reorder alerts (only if tables exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory')
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'parts') THEN
        EXECUTE 'CREATE OR REPLACE FUNCTION check_inventory_alerts()
        RETURNS TABLE (
          inventory_id UUID,
          part_id UUID,
          part_number TEXT,
          quantity_on_hand INTEGER,
          reorder_point INTEGER,
          quantity_needed INTEGER
        ) AS $func$
        BEGIN
          RETURN QUERY
          SELECT
            i.inventory_id,
            i.part_id,
            p.part_number,
            i.quantity_on_hand,
            i.reorder_point,
            GREATEST(0, i.reorder_point - i.quantity_on_hand) as quantity_needed
          FROM inventory i
          JOIN parts p ON i.part_id = p.part_id
          WHERE i.reorder_point IS NOT NULL
            AND i.quantity_on_hand <= i.reorder_point;
        END;
        $func$ LANGUAGE plpgsql';
    END IF;
END $$;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES (Only create if tables exist)
-- ============================================================================

-- View: Active repair orders with status summary
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'repair_orders') THEN
        EXECUTE 'CREATE OR REPLACE VIEW active_repair_orders_view AS
        SELECT 
          ro.*,
          COUNT(rp.repair_part_id) as parts_count,
          COALESCE(SUM(rp.total_cost), 0) as parts_total_cost
        FROM repair_orders ro
        LEFT JOIN repair_parts rp ON ro.repair_order_id = rp.repair_order_id
        WHERE ro.status NOT IN (''completed'', ''cancelled'', ''delivered'')
        GROUP BY ro.repair_order_id';
    END IF;
END $$;

-- View: Inventory summary with part details
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'inventory')
       AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'parts') THEN
        EXECUTE 'CREATE OR REPLACE VIEW inventory_summary_view AS
        SELECT 
          i.*,
          p.part_number,
          p.description,
          p.manufacturer,
          CASE 
            WHEN i.quantity_on_hand <= 0 THEN ''out_of_stock''
            WHEN i.reorder_point IS NOT NULL AND i.quantity_on_hand <= i.reorder_point THEN ''low_stock''
            ELSE ''in_stock''
          END as stock_status
        FROM inventory i
        JOIN parts p ON i.part_id = p.part_id';
    END IF;
END $$;

-- View: Equipment service schedule
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'equipment') THEN
        EXECUTE 'CREATE OR REPLACE VIEW equipment_service_schedule_view AS
        SELECT 
          e.*,
          c.company_name as customer_name,
          CASE 
            WHEN e.next_service_date IS NULL THEN ''no_schedule''
            WHEN e.next_service_date < NOW() THEN ''overdue''
            WHEN e.next_service_date <= NOW() + INTERVAL ''30 days'' THEN ''due_soon''
            ELSE ''scheduled''
          END as service_status,
          EXTRACT(DAYS FROM (e.next_service_date - NOW())) as days_until_service
        FROM equipment e
        LEFT JOIN customers c ON e.customer_id = c.customer_id
        WHERE e.status = ''active''
          AND e.next_service_date IS NOT NULL
        ORDER BY e.next_service_date ASC';
    END IF;
END $$;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE inventory IS 'Parts inventory with location tracking and reorder points';
COMMENT ON TABLE repair_orders IS 'Shop repair and service orders with full lifecycle tracking';
COMMENT ON TABLE shop_quotes IS 'Customer-facing quotes for repairs, parts, and services';
COMMENT ON TABLE equipment IS 'Equipment registry for motors, pumps, generators, etc.';
COMMENT ON TABLE service_contracts IS 'Service agreements and maintenance contracts';
COMMENT ON TABLE training_courses IS 'Training courses and certification programs';
COMMENT ON TABLE import_jobs IS 'Tracks data imports from various sources';
COMMENT ON TABLE scraping_jobs IS 'Web scraping jobs for vendor discovery and data collection';
COMMENT ON TABLE quality_tests IS 'Quality control test results and reports';

