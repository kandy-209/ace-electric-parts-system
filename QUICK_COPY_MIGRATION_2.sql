-- Migration 2: Comprehensive Schema
-- Copy ALL of this into Supabase SQL Editor and run
-- Comprehensive Database Schema for Ace Electric Parts System
-- This schema supports all planned APIs and future ML/AI features
-- Created: December 2025

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "vector"; -- For ML embeddings (if using pgvector)

-- ============================================================================
-- CORE ENTITIES (existing, enhanced)
-- ============================================================================

-- Enhanced parts table with ML features
ALTER TABLE parts ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS ml_features JSONB DEFAULT '{}'::jsonb;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS popularity_score DECIMAL(5, 2) DEFAULT 0;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS last_quoted_date TIMESTAMP;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS quote_count INTEGER DEFAULT 0;
ALTER TABLE parts ADD COLUMN IF NOT EXISTS order_count INTEGER DEFAULT 0;

-- Enhanced vendors table
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS ml_features JSONB DEFAULT '{}'::jsonb;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS response_rate DECIMAL(5, 2);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS average_quote_time_hours DECIMAL(5, 2);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS win_rate DECIMAL(5, 2);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS total_quotes INTEGER DEFAULT 0;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS total_revenue DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS linkedin_url TEXT;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS portal_user_id UUID REFERENCES auth.users(id);

-- Enhanced RFQs table
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS customer_id TEXT;
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS sales_rep_id UUID;
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium';
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(12, 2);
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS awarded_vendor_id UUID REFERENCES vendors(vendor_id);
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS awarded_quote_id UUID;
ALTER TABLE rfqs ADD COLUMN IF NOT EXISTS notes TEXT;

-- ============================================================================
-- NEW TABLES: Order Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS orders (
  order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  rfq_id UUID REFERENCES rfqs(rfq_id),
  quote_id UUID,
  vendor_id UUID NOT NULL REFERENCES vendors(vendor_id),
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  sales_rep_id UUID,
  
  -- Order details
  line_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(12, 2) NOT NULL,
  tax DECIMAL(12, 2) DEFAULT 0,
  shipping DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled', 'completed')),
  order_date TIMESTAMP DEFAULT NOW(),
  expected_delivery_date TIMESTAMP,
  actual_delivery_date TIMESTAMP,
  
  -- Shipping
  shipping_address JSONB DEFAULT '{}'::jsonb,
  tracking_number TEXT,
  shipping_carrier TEXT,
  
  -- Payment
  payment_status TEXT CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue')) DEFAULT 'pending',
  payment_terms TEXT,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  paid_date TIMESTAMP,
  
  -- Documents
  order_form_url TEXT,
  invoice_url TEXT,
  packing_slip_url TEXT,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT
);

-- ============================================================================
-- NEW TABLES: Customer Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
  customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_number TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  
  -- Address
  billing_address JSONB DEFAULT '{}'::jsonb,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  
  -- Business info
  industry TEXT,
  company_size TEXT,
  tax_id TEXT,
  credit_limit DECIMAL(12, 2),
  payment_terms TEXT DEFAULT 'Net 30',
  
  -- CRM Integration
  crm_id TEXT, -- GoHighLevel contact ID
  crm_synced_at TIMESTAMP,
  
  -- Sales
  assigned_sales_rep_id UUID,
  customer_tier TEXT CHECK (customer_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  lifetime_value DECIMAL(12, 2) DEFAULT 0,
  last_order_date TIMESTAMP,
  last_contact_date TIMESTAMP,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect', 'lead')),
  
  -- Metadata
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Sales Reps & Teams
-- ============================================================================

CREATE TABLE IF NOT EXISTS sales_reps (
  rep_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  employee_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Role & Permissions
  role TEXT NOT NULL CHECK (role IN ('sales_rep', 'sales_manager', 'admin')),
  team_id UUID,
  manager_id UUID REFERENCES sales_reps(rep_id),
  
  -- Performance
  quota DECIMAL(12, 2),
  total_sales DECIMAL(12, 2) DEFAULT 0,
  commission_rate DECIMAL(5, 2),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_teams (
  team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_name TEXT NOT NULL,
  team_lead_id UUID REFERENCES sales_reps(rep_id),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Buyer-Seller Matching (ML Marketplace)
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_deals (
  deal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_number TEXT UNIQUE NOT NULL,
  
  -- Parties
  buyer_id UUID REFERENCES customers(customer_id),
  seller_vendor_id UUID REFERENCES vendors(vendor_id),
  part_id UUID REFERENCES parts(part_id),
  
  -- Deal details
  part_description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  
  -- Commission
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(12, 2) NOT NULL,
  commission_paid BOOLEAN DEFAULT FALSE,
  commission_paid_date TIMESTAMP,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'accepted', 'in_progress', 'completed', 'cancelled')),
  
  -- ML/AI metadata
  match_score DECIMAL(5, 2), -- ML confidence score
  matched_by_model TEXT, -- Which ML model matched this
  match_features JSONB DEFAULT '{}'::jsonb, -- Features used for matching
  
  -- Dates
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyer_intents (
  intent_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(customer_id),
  part_description TEXT NOT NULL,
  technical_requirements JSONB DEFAULT '{}'::jsonb,
  quantity INTEGER,
  budget DECIMAL(12, 2),
  urgency TEXT CHECK (urgency IN ('low', 'medium', 'high')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matched', 'fulfilled', 'expired')),
  
  -- ML features
  ml_features JSONB DEFAULT '{}'::jsonb,
  
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seller_listings (
  listing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(vendor_id),
  part_id UUID REFERENCES parts(part_id),
  part_description TEXT NOT NULL,
  specifications JSONB DEFAULT '{}'::jsonb,
  
  -- Pricing
  unit_price DECIMAL(10, 2),
  min_quantity INTEGER DEFAULT 1,
  max_quantity INTEGER,
  
  -- Availability
  quantity_available INTEGER,
  lead_time_days INTEGER,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  
  -- ML features
  ml_features JSONB DEFAULT '{}'::jsonb,
  
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Communication & Messaging
-- ============================================================================

CREATE TABLE IF NOT EXISTS communications (
  communication_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Parties
  from_type TEXT NOT NULL CHECK (from_type IN ('company', 'vendor', 'customer', 'sales_rep')),
  from_id UUID NOT NULL, -- Can reference different tables
  to_type TEXT NOT NULL CHECK (to_type IN ('company', 'vendor', 'customer', 'sales_rep')),
  to_id UUID NOT NULL,
  
  -- Message
  channel TEXT NOT NULL CHECK (channel IN ('email', 'linkedin', 'sms', 'portal', 'phone', 'in_app')),
  subject TEXT,
  message_body TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'failed')),
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  
  -- Metadata
  thread_id UUID, -- For grouping related messages
  parent_communication_id UUID REFERENCES communications(communication_id),
  template_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communication_templates (
  template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL CHECK (template_type IN ('rfq_invitation', 'quote_request', 'order_confirmation', 'follow_up', 'custom')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'linkedin', 'sms', 'portal')),
  
  subject TEXT,
  body_text TEXT NOT NULL,
  body_html TEXT,
  
  variables JSONB DEFAULT '[]'::jsonb, -- Available template variables
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Sales Notes & Activity Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS sales_notes (
  note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Related entities
  customer_id UUID REFERENCES customers(customer_id),
  vendor_id UUID REFERENCES vendors(vendor_id),
  rfq_id UUID REFERENCES rfqs(rfq_id),
  order_id UUID REFERENCES orders(order_id),
  
  -- Note details
  sales_rep_id UUID NOT NULL REFERENCES sales_reps(rep_id),
  note_type TEXT CHECK (note_type IN ('call', 'email', 'meeting', 'visit', 'general')),
  title TEXT,
  content TEXT NOT NULL,
  
  -- Call-specific
  call_duration_seconds INTEGER,
  call_outcome TEXT,
  
  -- Next actions
  next_action TEXT,
  next_action_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_activities (
  activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sales_rep_id UUID NOT NULL REFERENCES sales_reps(rep_id),
  
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'quote_sent', 'quote_received', 'order_placed', 'follow_up')),
  
  -- Related entities
  customer_id UUID REFERENCES customers(customer_id),
  vendor_id UUID REFERENCES vendors(vendor_id),
  rfq_id UUID REFERENCES rfqs(rfq_id),
  order_id UUID REFERENCES orders(order_id),
  
  -- Activity details
  description TEXT,
  outcome TEXT,
  duration_minutes INTEGER,
  
  activity_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Commission Tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS commissions (
  commission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Related entities
  sales_rep_id UUID NOT NULL REFERENCES sales_reps(rep_id),
  order_id UUID REFERENCES orders(order_id),
  deal_id UUID REFERENCES marketplace_deals(deal_id),
  
  -- Commission details
  commission_type TEXT NOT NULL CHECK (commission_type IN ('sale', 'marketplace', 'referral', 'bonus')),
  base_amount DECIMAL(12, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(12, 2) NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  approved_by UUID REFERENCES sales_reps(rep_id),
  approved_at TIMESTAMP,
  paid_at TIMESTAMP,
  paid_amount DECIMAL(12, 2),
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Analytics & Reporting
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL,
  
  -- Entity references
  user_id UUID,
  customer_id UUID,
  vendor_id UUID,
  rfq_id UUID,
  order_id UUID,
  
  -- Event data
  event_data JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_metrics (
  metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Scope
  metric_type TEXT NOT NULL, -- 'rfq', 'vendor', 'sales_rep', 'customer', etc.
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  
  -- Time period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('day', 'week', 'month', 'quarter', 'year')),
  
  -- Metrics
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb, -- Flexible metric storage
  
  calculated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(entity_type, entity_id, period_start, period_type)
);

-- ============================================================================
-- NEW TABLES: ML/AI Models & Training
-- ============================================================================

CREATE TABLE IF NOT EXISTS ml_models (
  model_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL UNIQUE,
  model_type TEXT NOT NULL CHECK (model_type IN ('classification', 'regression', 'recommendation', 'matching')),
  model_version TEXT NOT NULL,
  
  -- Model details
  description TEXT,
  algorithm TEXT, -- 'random_forest', 'neural_network', etc.
  hyperparameters JSONB DEFAULT '{}'::jsonb,
  
  -- Training
  training_data_range_start TIMESTAMP,
  training_data_range_end TIMESTAMP,
  training_samples INTEGER,
  trained_at TIMESTAMP,
  
  -- Performance
  accuracy DECIMAL(5, 4),
  precision DECIMAL(5, 4),
  recall DECIMAL(5, 4),
  f1_score DECIMAL(5, 4),
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'training' CHECK (status IN ('training', 'active', 'archived', 'failed')),
  is_active BOOLEAN DEFAULT FALSE,
  
  -- Storage
  model_file_path TEXT,
  feature_definitions JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ml_predictions (
  prediction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID NOT NULL REFERENCES ml_models(model_id),
  
  -- Input
  input_features JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Output
  prediction JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence DECIMAL(5, 4),
  
  -- Ground truth (for evaluation)
  actual_outcome JSONB,
  was_correct BOOLEAN,
  
  -- Context
  entity_type TEXT,
  entity_id UUID,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ml_training_jobs (
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES ml_models(model_id),
  
  -- Job details
  job_type TEXT NOT NULL CHECK (job_type IN ('training', 'evaluation', 'prediction', 'feature_extraction')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
  
  -- Parameters
  parameters JSONB DEFAULT '{}'::jsonb,
  
  -- Progress
  progress_percentage INTEGER DEFAULT 0,
  current_step TEXT,
  
  -- Results
  results JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  
  -- Timing
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Integration & Sync
-- ============================================================================

CREATE TABLE IF NOT EXISTS integrations (
  integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_type TEXT NOT NULL CHECK (integration_type IN ('gohighlevel', 'linkedin', 'email', 'sms', 'erp', 'accounting')),
  name TEXT NOT NULL,
  
  -- Configuration
  config JSONB NOT NULL DEFAULT '{}'::jsonb, -- Encrypted credentials
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Status
  last_sync_at TIMESTAMP,
  last_sync_status TEXT,
  last_error TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_jobs (
  sync_job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID NOT NULL REFERENCES integrations(integration_id),
  
  sync_type TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('import', 'export', 'bidirectional')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  
  -- Results
  records_processed INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  
  -- Timing
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Vendor Portal
-- ============================================================================

CREATE TABLE IF NOT EXISTS portal_users (
  portal_user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES vendors(vendor_id),
  user_id UUID REFERENCES auth.users(id),
  
  email TEXT NOT NULL,
  password_hash TEXT, -- If using portal auth
  
  -- Permissions
  can_view_rfqs BOOLEAN DEFAULT TRUE,
  can_submit_quotes BOOLEAN DEFAULT TRUE,
  can_edit_profile BOOLEAN DEFAULT TRUE,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Enhanced Contact Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_interactions (
  interaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(contact_id),
  vendor_id UUID REFERENCES vendors(vendor_id),
  
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('email', 'call', 'meeting', 'trade_show', 'linkedin', 'referral')),
  interaction_date TIMESTAMP NOT NULL,
  
  -- Details
  subject TEXT,
  notes TEXT,
  outcome TEXT,
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Parts indexes
CREATE INDEX IF NOT EXISTS idx_parts_search_vector ON parts USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_parts_popularity ON parts(popularity_score DESC);
CREATE INDEX IF NOT EXISTS idx_parts_last_quoted ON parts(last_quoted_date DESC);

-- Vendors indexes
CREATE INDEX IF NOT EXISTS idx_vendors_search_vector ON vendors USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_vendors_response_rate ON vendors(response_rate DESC);
CREATE INDEX IF NOT EXISTS idx_vendors_win_rate ON vendors(win_rate DESC);

-- RFQs indexes
CREATE INDEX IF NOT EXISTS idx_rfqs_customer ON rfqs(customer_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_sales_rep ON rfqs(sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
CREATE INDEX IF NOT EXISTS idx_rfqs_priority ON rfqs(priority);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date DESC);

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_sales_rep ON customers(assigned_sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_crm_id ON customers(crm_id);

-- Marketplace indexes
CREATE INDEX IF NOT EXISTS idx_deals_buyer ON marketplace_deals(buyer_id);
CREATE INDEX IF NOT EXISTS idx_deals_seller ON marketplace_deals(seller_vendor_id);
CREATE INDEX IF NOT EXISTS idx_deals_status ON marketplace_deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_match_score ON marketplace_deals(match_score DESC);

-- Communications indexes
CREATE INDEX IF NOT EXISTS idx_communications_from ON communications(from_type, from_id);
CREATE INDEX IF NOT EXISTS idx_communications_to ON communications(to_type, to_id);
CREATE INDEX IF NOT EXISTS idx_communications_thread ON communications(thread_id);
CREATE INDEX IF NOT EXISTS idx_communications_date ON communications(sent_at DESC);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type, event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_date ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_entity ON analytics_events(customer_id, vendor_id, rfq_id);

-- ML indexes
CREATE INDEX IF NOT EXISTS idx_ml_predictions_model ON ml_predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_entity ON ml_predictions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_date ON ml_predictions(created_at DESC);

-- ============================================================================
-- TRIGGERS FOR SEARCH VECTORS
-- ============================================================================

-- Function to update search vectors
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- Parts search vector
  IF TG_TABLE_NAME = 'parts' THEN
    NEW.search_vector := 
      setweight(to_tsvector('english', COALESCE(NEW.part_number, '')), 'A') ||
      setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
      setweight(to_tsvector('english', COALESCE(NEW.manufacturer, '')), 'C');
  END IF;
  
  -- Vendors search vector
  IF TG_TABLE_NAME = 'vendors' THEN
    NEW.search_vector := 
      setweight(to_tsvector('english', COALESCE(NEW.vendor_name, '')), 'A') ||
      setweight(to_tsvector('english', array_to_string(NEW.capabilities, ' ')), 'B') ||
      setweight(to_tsvector('english', array_to_string(NEW.materials, ' ')), 'C');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_parts_search_vector ON parts;
CREATE TRIGGER update_parts_search_vector
  BEFORE INSERT OR UPDATE ON parts
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

DROP TRIGGER IF EXISTS update_vendors_search_vector ON vendors;
CREATE TRIGGER update_vendors_search_vector
  BEFORE INSERT OR UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- ============================================================================
-- FUNCTIONS FOR ANALYTICS
-- ============================================================================

-- Function to calculate vendor performance
CREATE OR REPLACE FUNCTION calculate_vendor_performance(p_vendor_id UUID)
RETURNS TABLE (
  response_rate DECIMAL,
  average_quote_time DECIMAL,
  win_rate DECIMAL,
  total_quotes BIGINT,
  total_orders BIGINT,
  total_revenue DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(
      (COUNT(*) FILTER (WHERE rv.response_received = true)::DECIMAL / 
       NULLIF(COUNT(*), 0) * 100),
      0
    ) as response_rate,
    COALESCE(AVG(EXTRACT(EPOCH FROM (vq.quote_date - rv.sent_date)) / 3600), 0) as average_quote_time,
    COALESCE(
      (COUNT(*) FILTER (WHERE r.rfq_id IS NOT NULL)::DECIMAL / 
       NULLIF(COUNT(DISTINCT vq.quote_id), 0) * 100),
      0
    ) as win_rate,
    COUNT(DISTINCT vq.quote_id) as total_quotes,
    COUNT(DISTINCT o.order_id) as total_orders,
    COALESCE(SUM(o.total), 0) as total_revenue
  FROM vendors v
  LEFT JOIN rfq_vendors rv ON v.vendor_id = rv.vendor_id
  LEFT JOIN vendor_quotes vq ON rv.rfq_vendor_id = vq.rfq_vendor_id
  LEFT JOIN rfqs r ON r.awarded_vendor_id = v.vendor_id AND r.rfq_id = rv.rfq_id
  LEFT JOIN orders o ON o.vendor_id = v.vendor_id
  WHERE v.vendor_id = p_vendor_id
  GROUP BY v.vendor_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Active RFQs with quote counts
CREATE OR REPLACE VIEW active_rfqs_view AS
SELECT 
  r.*,
  COUNT(DISTINCT rv.vendor_id) as vendors_contacted,
  COUNT(DISTINCT vq.quote_id) as quotes_received,
  MIN(vq.total) as lowest_quote,
  MAX(vq.total) as highest_quote,
  AVG(vq.total) as average_quote
FROM rfqs r
LEFT JOIN rfq_vendors rv ON r.rfq_id = rv.rfq_id
LEFT JOIN vendor_quotes vq ON rv.rfq_vendor_id = vq.rfq_vendor_id
WHERE r.status IN ('draft', 'sent', 'quotes_received', 'comparing')
GROUP BY r.rfq_id;

-- View: Vendor performance summary
CREATE OR REPLACE VIEW vendor_performance_view AS
SELECT 
  v.*,
  COUNT(DISTINCT rv.rfq_id) as total_rfqs_received,
  COUNT(DISTINCT vq.quote_id) as total_quotes_submitted,
  COUNT(DISTINCT r.rfq_id) FILTER (WHERE r.awarded_vendor_id = v.vendor_id) as total_rfqs_won,
  COUNT(DISTINCT o.order_id) as total_orders,
  COALESCE(SUM(o.total), 0) as total_revenue,
  COALESCE(AVG(vq.total), 0) as average_quote_value
FROM vendors v
LEFT JOIN rfq_vendors rv ON v.vendor_id = rv.vendor_id
LEFT JOIN vendor_quotes vq ON rv.rfq_vendor_id = vq.rfq_vendor_id
LEFT JOIN rfqs r ON r.rfq_id = rv.rfq_id
LEFT JOIN orders o ON o.vendor_id = v.vendor_id
GROUP BY v.vendor_id;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (if needed)
-- ============================================================================

-- Enable RLS on sensitive tables if using Supabase Auth
-- ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sales_notes ENABLE ROW LEVEL SECURITY;

-- Example policy for sales reps to see their own customers
-- CREATE POLICY "Sales reps can view their customers"
--   ON customers FOR SELECT
--   USING (assigned_sales_rep_id = auth.uid());

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE marketplace_deals IS 'Buyer-seller deals facilitated by the ML marketplace with commission tracking';
COMMENT ON TABLE ml_models IS 'ML/AI models for matching, prediction, and recommendation';
COMMENT ON TABLE ml_predictions IS 'Stores predictions made by ML models for evaluation and improvement';
COMMENT ON TABLE analytics_events IS 'Event tracking for analytics and ML training data';
COMMENT ON TABLE performance_metrics IS 'Aggregated performance metrics for various entities';

