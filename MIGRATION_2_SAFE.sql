-- Migration 2: Comprehensive Schema (SAFE VERSION)
-- This version handles existing columns safely
-- Created: December 2025

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "vector"; -- For ML embeddings (if using pgvector)

-- ============================================================================
-- CORE ENTITIES (existing, enhanced) - Safe Column Addition
-- ============================================================================

-- Enhanced parts table with ML features (only add if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='search_vector') THEN
        ALTER TABLE parts ADD COLUMN search_vector tsvector;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='ml_features') THEN
        ALTER TABLE parts ADD COLUMN ml_features JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='popularity_score') THEN
        ALTER TABLE parts ADD COLUMN popularity_score DECIMAL(5, 2) DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='last_quoted_date') THEN
        ALTER TABLE parts ADD COLUMN last_quoted_date TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='quote_count') THEN
        ALTER TABLE parts ADD COLUMN quote_count INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='parts' AND column_name='order_count') THEN
        ALTER TABLE parts ADD COLUMN order_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Enhanced vendors table (only add if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='search_vector') THEN
        ALTER TABLE vendors ADD COLUMN search_vector tsvector;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='ml_features') THEN
        ALTER TABLE vendors ADD COLUMN ml_features JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='response_rate') THEN
        ALTER TABLE vendors ADD COLUMN response_rate DECIMAL(5, 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='average_quote_time_hours') THEN
        ALTER TABLE vendors ADD COLUMN average_quote_time_hours DECIMAL(5, 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='win_rate') THEN
        ALTER TABLE vendors ADD COLUMN win_rate DECIMAL(5, 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='total_quotes') THEN
        ALTER TABLE vendors ADD COLUMN total_quotes INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='total_orders') THEN
        ALTER TABLE vendors ADD COLUMN total_orders INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='total_revenue') THEN
        ALTER TABLE vendors ADD COLUMN total_revenue DECIMAL(12, 2) DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='linkedin_url') THEN
        ALTER TABLE vendors ADD COLUMN linkedin_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vendors' AND column_name='portal_user_id') THEN
        ALTER TABLE vendors ADD COLUMN portal_user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Enhanced RFQs table (only add if doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='customer_id') THEN
        ALTER TABLE rfqs ADD COLUMN customer_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='customer_name') THEN
        ALTER TABLE rfqs ADD COLUMN customer_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='sales_rep_id') THEN
        ALTER TABLE rfqs ADD COLUMN sales_rep_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='priority') THEN
        ALTER TABLE rfqs ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='estimated_value') THEN
        ALTER TABLE rfqs ADD COLUMN estimated_value DECIMAL(12, 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='awarded_vendor_id') THEN
        ALTER TABLE rfqs ADD COLUMN awarded_vendor_id UUID REFERENCES vendors(vendor_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='awarded_quote_id') THEN
        ALTER TABLE rfqs ADD COLUMN awarded_quote_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rfqs' AND column_name='notes') THEN
        ALTER TABLE rfqs ADD COLUMN notes TEXT;
    END IF;
END $$;

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

CREATE TABLE IF NOT EXISTS order_items (
  item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  part_id UUID REFERENCES parts(part_id),
  part_number TEXT,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Customer Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
  customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_number TEXT UNIQUE NOT NULL,
  company_name TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  billing_address JSONB DEFAULT '{}'::jsonb,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  tax_id TEXT,
  credit_limit DECIMAL(10, 2),
  payment_terms TEXT,
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'portal')),
  crm_id TEXT, -- GoHighLevel or other CRM ID
  crm_sync_date TIMESTAMP,
  industry TEXT,
  company_size TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'prospect', 'lead')),
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  last_order_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP -- Soft delete
);

CREATE INDEX IF NOT EXISTS idx_customers_crm_id ON customers(crm_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_company_name ON customers(company_name);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- Customer equipment registry
CREATE TABLE IF NOT EXISTS customer_equipment (
  equipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
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

-- ============================================================================
-- NEW TABLES: Analytics & Reporting
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  entity_type TEXT, -- 'part', 'vendor', 'rfq', 'order', etc.
  entity_id UUID,
  user_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_entity ON analytics_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);

CREATE TABLE IF NOT EXISTS performance_metrics (
  metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  value DECIMAL(12, 2) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(metric_date, metric_type)
);

-- ============================================================================
-- NEW TABLES: ML/AI Features
-- ============================================================================

CREATE TABLE IF NOT EXISTS ml_training_data (
  data_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_type TEXT NOT NULL, -- 'part_match', 'vendor_match', 'price_prediction', etc.
  input_features JSONB NOT NULL,
  output_labels JSONB,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ml_models (
  model_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL UNIQUE,
  model_type TEXT NOT NULL,
  version TEXT NOT NULL,
  training_data_range_start TIMESTAMP,
  training_data_range_end TIMESTAMP,
  accuracy_metrics JSONB DEFAULT '{}'::jsonb,
  model_parameters JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ml_predictions (
  prediction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES ml_models(model_id),
  input_features JSONB NOT NULL,
  predictions JSONB NOT NULL,
  confidence DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Marketplace Features
-- ============================================================================

CREATE TABLE IF NOT EXISTS marketplace_listings (
  listing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES parts(part_id),
  seller_vendor_id UUID REFERENCES vendors(vendor_id),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('for_sale', 'wanted', 'auction')),
  price DECIMAL(10, 2),
  quantity_available INTEGER,
  condition TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold', 'expired', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyer_intents (
  intent_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(customer_id),
  part_description TEXT NOT NULL,
  technical_requirements JSONB DEFAULT '{}'::jsonb,
  quantity INTEGER,
  budget_range DECIMAL(12, 2),
  urgency TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'matched', 'fulfilled', 'expired')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_deals (
  deal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES marketplace_listings(listing_id),
  buyer_intent_id UUID REFERENCES buyer_intents(intent_id),
  buyer_customer_id UUID REFERENCES customers(customer_id),
  seller_vendor_id UUID REFERENCES vendors(vendor_id),
  final_price DECIMAL(10, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commissions (
  commission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deal_id UUID REFERENCES marketplace_deals(deal_id),
  amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: User Management & Permissions
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles (
  role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  permission_name TEXT UNIQUE NOT NULL,
  description TEXT,
  resource_type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(role_id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(role_id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(permission_id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

-- ============================================================================
-- NEW TABLES: Integration & Sync
-- ============================================================================

CREATE TABLE IF NOT EXISTS integrations (
  integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_type TEXT NOT NULL, -- 'gohighlevel', 'email', 'linkedin', etc.
  integration_name TEXT NOT NULL,
  config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_sync_logs (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES integrations(integration_id),
  sync_type TEXT NOT NULL,
  records_processed INTEGER DEFAULT 0,
  records_successful INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_jobs (
  job_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES integrations(integration_id),
  job_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  config JSONB DEFAULT '{}'::jsonb,
  results JSONB DEFAULT '{}'::jsonb,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Communications
-- ============================================================================

CREATE TABLE IF NOT EXISTS communications (
  communication_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  communication_type TEXT NOT NULL CHECK (communication_type IN ('email', 'sms', 'linkedin', 'portal', 'phone')),
  from_email TEXT,
  to_email TEXT,
  from_phone TEXT,
  to_phone TEXT,
  subject TEXT,
  body TEXT,
  related_entity_type TEXT, -- 'rfq', 'order', 'customer', etc.
  related_entity_id UUID,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'failed', 'opened')),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS communication_templates (
  template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name TEXT NOT NULL UNIQUE,
  template_type TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id),
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Workflows & Automation
-- ============================================================================

CREATE TABLE IF NOT EXISTS workflows (
  workflow_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_name TEXT NOT NULL UNIQUE,
  trigger_event TEXT NOT NULL,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_executions (
  execution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES workflows(workflow_id),
  trigger_entity_type TEXT,
  trigger_entity_id UUID,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
  current_step INTEGER DEFAULT 0,
  results JSONB DEFAULT '{}'::jsonb,
  errors JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS workflow_approvals (
  approval_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID REFERENCES workflow_executions(execution_id),
  approver_user_id UUID REFERENCES users(user_id),
  step_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Sales Management
-- ============================================================================

CREATE TABLE IF NOT EXISTS sales_reps (
  rep_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id),
  rep_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  territory TEXT,
  commission_rate DECIMAL(5, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_teams (
  team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_name TEXT NOT NULL UNIQUE,
  manager_user_id UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_activities (
  activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rep_id UUID REFERENCES sales_reps(rep_id),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'quote_sent', 'follow_up')),
  customer_id UUID REFERENCES customers(customer_id),
  description TEXT,
  outcome TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_notes (
  note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rep_id UUID REFERENCES sales_reps(rep_id),
  customer_id UUID REFERENCES customers(customer_id),
  note_text TEXT NOT NULL,
  is_important BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Documents & Files
-- ============================================================================

CREATE TABLE IF NOT EXISTS documents (
  document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type TEXT NOT NULL, -- 'quote', 'invoice', 'order_form', 'spec_sheet', etc.
  related_entity_type TEXT, -- 'order', 'quote', 'part', etc.
  related_entity_id UUID,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Webhooks
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhooks (
  webhook_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  secret_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS webhook_events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES webhooks(webhook_id),
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  response_status INTEGER,
  response_body TEXT,
  retry_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Portal Users
-- ============================================================================

CREATE TABLE IF NOT EXISTS portal_users (
  portal_user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(vendor_id),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'vendor',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- NEW TABLES: Audit & Logging
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  changed_by TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customer_equipment_customer_id ON customer_equipment(customer_id);
CREATE INDEX IF NOT EXISTS idx_ml_predictions_model_id ON ml_predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_buyer_intents_status ON buyer_intents(status);
CREATE INDEX IF NOT EXISTS idx_communications_related ON communications(related_entity_type, related_entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Add updated_at triggers for new tables
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_equipment_updated_at ON customer_equipment;
CREATE TRIGGER update_customer_equipment_updated_at BEFORE UPDATE ON customer_equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ml_models_updated_at ON ml_models;
CREATE TRIGGER update_ml_models_updated_at BEFORE UPDATE ON ml_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketplace_listings_updated_at ON marketplace_listings;
CREATE TRIGGER update_marketplace_listings_updated_at BEFORE UPDATE ON marketplace_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_buyer_intents_updated_at ON buyer_intents;
CREATE TRIGGER update_buyer_intents_updated_at BEFORE UPDATE ON buyer_intents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_integrations_updated_at ON integrations;
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_communication_templates_updated_at ON communication_templates;
CREATE TRIGGER update_communication_templates_updated_at BEFORE UPDATE ON communication_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workflows_updated_at ON workflows;
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sales_reps_updated_at ON sales_reps;
CREATE TRIGGER update_sales_reps_updated_at BEFORE UPDATE ON sales_reps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_webhooks_updated_at ON webhooks;
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_portal_users_updated_at ON portal_users;
CREATE TRIGGER update_portal_users_updated_at BEFORE UPDATE ON portal_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

