-- Prefixed version for existing database
-- Original: 002_enhanced_schema.sql
-- All tables prefixed with 'ace_' to avoid conflicts
-- Generated: 2025-12-07T14:46:27.404Z

-- Enhanced Database Schema for Ace Electric Parts System
-- This migration adds comprehensive tables for orders, customers, inventory, analytics, ML, and more

-- ============================================================================
-- CUSTOMERS & CUSTOMER MANAGEMENT
-- ============================================================================

CREATE TABLE ace_customers (
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

CREATE INDEX idx_customers_crm_id ON customers(crm_id);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_company_name ON customers(company_name);
CREATE INDEX idx_customers_email ON customers(email);

-- Customer equipment registry
CREATE TABLE ace_customer_equipment (
  equipment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES ace_customers(customer_id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL,
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  installation_date TIMESTAMP,
  location TEXT,
  specifications JSONB DEFAULT '{}'::jsonb,
  maintenance_schedule JSONB DEFAULT '{}'::jsonb,
  last_service_date TIMESTAMP,
  next_service_date TIMESTAMP,
  warranty_expires_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customer_equipment_customer_id ON customer_equipment(customer_id);
CREATE INDEX idx_customer_equipment_type ON customer_equipment(equipment_type);

-- ============================================================================
-- ORDERS & ORDER MANAGEMENT
-- ============================================================================

CREATE TABLE ace_orders (
  order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES ace_customers(customer_id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES ace_vendors(vendor_id) ON DELETE SET NULL,
  quote_id UUID, -- Reference to accepted quote
  rfq_id UUID REFERENCES ace_rfqs(rfq_id) ON DELETE SET NULL,
  order_date TIMESTAMP DEFAULT NOW(),
  required_date TIMESTAMP,
  ship_date TIMESTAMP,
  delivery_date TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled', 'on_hold')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT,
  payment_date TIMESTAMP,
  shipping_method TEXT,
  tracking_number TEXT,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  billing_address JSONB DEFAULT '{}'::jsonb,
  special_instructions TEXT,
  internal_notes TEXT,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_order_number ON orders(order_number);

CREATE TABLE ace_order_items (
  order_item_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES ace_orders(order_id) ON DELETE CASCADE,
  part_id UUID REFERENCES ace_parts(part_id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  part_number TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(5, 2) DEFAULT 0,
  line_total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_production', 'completed', 'cancelled')),
  expected_delivery_date TIMESTAMP,
  actual_delivery_date TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_part_id ON order_items(part_id);

-- ============================================================================
-- INVENTORY MANAGEMENT
-- ============================================================================

CREATE TABLE ace_inventory (
  inventory_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES ace_parts(part_id) ON DELETE CASCADE,
  location TEXT, -- Warehouse location
  quantity_available INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  quantity_on_order INTEGER NOT NULL DEFAULT 0,
  reorder_point INTEGER DEFAULT 0,
  reorder_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  unit_cost DECIMAL(10, 2),
  average_cost DECIMAL(10, 2),
  last_count_date TIMESTAMP,
  last_count_quantity INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(part_id, location)
);

CREATE INDEX idx_inventory_part_id ON inventory(part_id);
CREATE INDEX idx_inventory_location ON inventory(location);
CREATE INDEX idx_inventory_low_stock ON inventory(reorder_point) WHERE quantity_available <= reorder_point;

CREATE TABLE ace_inventory_movements (
  movement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID REFERENCES ace_inventory(inventory_id) ON DELETE CASCADE,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('receipt', 'shipment', 'adjustment', 'transfer', 'reservation', 'release', 'count')),
  quantity INTEGER NOT NULL,
  quantity_before INTEGER NOT NULL,
  quantity_after INTEGER NOT NULL,
  reference_type TEXT, -- 'order', 'purchase_order', 'adjustment', etc.
  reference_id UUID,
  reason TEXT,
  performed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_movements_inventory_id ON inventory_movements(inventory_id);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(movement_type);
CREATE INDEX idx_inventory_movements_date ON inventory_movements(created_at);

-- ============================================================================
-- DOCUMENTS & FILE MANAGEMENT
-- ============================================================================

CREATE TABLE ace_documents (
  document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type TEXT NOT NULL CHECK (document_type IN ('quote', 'order', 'invoice', 'rfq', 'packing_slip', 'report', 'contract', 'specification', 'drawing')),
  entity_type TEXT NOT NULL, -- 'quote', 'order', 'customer', etc.
  entity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  template_id UUID, -- Reference to document template
  metadata JSONB DEFAULT '{}'::jsonb,
  generated_by TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('public', 'internal', 'private')),
  created_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_generated_at ON documents(generated_at);

-- ============================================================================
-- NOTIFICATIONS & COMMUNICATION
-- ============================================================================

CREATE TABLE ace_notifications (
  notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('user', 'customer', 'vendor', 'system')),
  recipient_id TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms', 'push', 'in_app', 'webhook')),
  channel TEXT, -- Specific channel identifier
  subject TEXT,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_type, recipient_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE TABLE ace_webhooks (
  webhook_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL, -- Array of event types to listen for
  secret TEXT, -- Secret for webhook signature verification
  active BOOLEAN DEFAULT TRUE,
  retry_policy JSONB DEFAULT '{"max_retries": 3, "backoff": "exponential"}'::jsonb,
  headers JSONB DEFAULT '{}'::jsonb,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_triggered_at TIMESTAMP
);

CREATE INDEX idx_webhooks_active ON webhooks(active);
CREATE INDEX idx_webhooks_events ON webhooks USING GIN(events);

CREATE TABLE ace_webhook_events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES ace_webhooks(webhook_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
  response_status INTEGER,
  response_body TEXT,
  attempt_count INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP,
  next_retry_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_webhook_id ON webhook_events(webhook_id);
CREATE INDEX idx_webhook_events_status ON webhook_events(status);
CREATE INDEX idx_webhook_events_type ON webhook_events(event_type);

-- ============================================================================
-- ANALYTICS & EVENT TRACKING
-- ============================================================================

CREATE TABLE ace_analytics_events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  event_category TEXT,
  entity_type TEXT,
  entity_id UUID,
  user_id TEXT,
  session_id TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  revenue DECIMAL(10, 2),
  occurred_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_analytics_events_occurred_at ON analytics_events(occurred_at);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_entity ON analytics_events(entity_type, entity_id);

-- Materialized view for common analytics queries
CREATE MATERIALIZED VIEW analytics_summary AS
SELECT
  DATE_TRUNC('day', occurred_at) as date,
  event_type,
  event_category,
  COUNT(*) as event_count,
  SUM(revenue) as total_revenue,
  COUNT(DISTINCT user_id) as unique_users
FROM ace_analytics_events
GROUP BY DATE_TRUNC('day', occurred_at), event_type, event_category;

CREATE INDEX idx_analytics_summary_date ON analytics_summary(date);

-- ============================================================================
-- ML/AI TRAINING DATA & MODELS
-- ============================================================================

CREATE TABLE ace_ml_training_data (
  data_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  data_type TEXT NOT NULL CHECK (data_type IN ('vendor_match', 'part_match', 'price_prediction', 'demand_forecast', 'quality_prediction')),
  entity_type TEXT,
  entity_id UUID,
  features JSONB NOT NULL, -- Input features
  labels JSONB, -- Target labels (if supervised)
  outcome JSONB, -- Actual outcome (for training)
  confidence DECIMAL(3, 2),
  model_version TEXT,
  is_labeled BOOLEAN DEFAULT FALSE,
  labeled_by TEXT,
  labeled_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ml_training_data_type ON ml_training_data(data_type);
CREATE INDEX idx_ml_training_data_labeled ON ml_training_data(is_labeled);
CREATE INDEX idx_ml_training_data_features ON ml_training_data USING GIN(features);

CREATE TABLE ace_ml_models (
  model_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_name TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('classification', 'regression', 'clustering', 'recommendation', 'matching')),
  version TEXT NOT NULL,
  status TEXT DEFAULT 'training' CHECK (status IN ('training', 'active', 'deprecated', 'archived')),
  training_data_range_start TIMESTAMP,
  training_data_range_end TIMESTAMP,
  training_samples INTEGER,
  accuracy_metrics JSONB DEFAULT '{}'::jsonb,
  hyperparameters JSONB DEFAULT '{}'::jsonb,
  model_url TEXT, -- S3/Storage URL for model file
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deployed_at TIMESTAMP
);

CREATE INDEX idx_ml_models_status ON ml_models(status);
CREATE INDEX idx_ml_models_type ON ml_models(model_type);
CREATE UNIQUE INDEX idx_ml_models_name_version ON ml_models(model_name, version);

CREATE TABLE ace_ml_predictions (
  prediction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES ace_ml_models(model_id) ON DELETE SET NULL,
  entity_type TEXT,
  entity_id UUID,
  input_features JSONB NOT NULL,
  predictions JSONB NOT NULL,
  confidence DECIMAL(3, 2),
  actual_outcome JSONB, -- For evaluation
  feedback_score INTEGER CHECK (feedback_score >= 1 AND feedback_score <= 5),
  feedback_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ml_predictions_model_id ON ml_predictions(model_id);
CREATE INDEX idx_ml_predictions_entity ON ml_predictions(entity_type, entity_id);
CREATE INDEX idx_ml_predictions_created_at ON ml_predictions(created_at);

-- ============================================================================
-- COMMISSIONS & MARKETPLACE
-- ============================================================================

CREATE TABLE ace_marketplace_listings (
  listing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_id UUID REFERENCES ace_parts(part_id) ON DELETE CASCADE,
  seller_id UUID, -- Vendor or customer ID
  seller_type TEXT CHECK (seller_type IN ('vendor', 'customer', 'internal')),
  listing_type TEXT CHECK (listing_type IN ('sell', 'buy', 'trade')),
  quantity INTEGER,
  unit_price DECIMAL(10, 2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled', 'expired')),
  condition TEXT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  location TEXT,
  shipping_options JSONB DEFAULT '{}'::jsonb,
  commission_rate DECIMAL(5, 2) DEFAULT 0,
  views INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_listings_part_id ON marketplace_listings(part_id);
CREATE INDEX idx_marketplace_listings_seller ON marketplace_listings(seller_type, seller_id);

CREATE TABLE ace_commissions (
  commission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('marketplace_sale', 'referral', 'affiliate')),
  order_id UUID REFERENCES ace_orders(order_id) ON DELETE SET NULL,
  listing_id UUID REFERENCES ace_marketplace_listings(listing_id) ON DELETE SET NULL,
  buyer_id UUID,
  seller_id UUID,
  referral_source TEXT,
  sale_amount DECIMAL(10, 2) NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  commission_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  payout_date TIMESTAMP,
  payout_method TEXT,
  payout_reference TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_order_id ON commissions(order_id);
CREATE INDEX idx_commissions_seller_id ON commissions(seller_id);
CREATE INDEX idx_commissions_payout_date ON commissions(payout_date);

-- ============================================================================
-- WORKFLOW AUTOMATION
-- ============================================================================

CREATE TABLE ace_workflows (
  workflow_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_name TEXT NOT NULL,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('approval', 'notification', 'data_sync', 'document_generation', 'custom')),
  trigger_event TEXT NOT NULL,
  trigger_conditions JSONB DEFAULT '{}'::jsonb,
  steps JSONB NOT NULL, -- Array of workflow steps
  is_active BOOLEAN DEFAULT TRUE,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflows_active ON workflows(is_active);
CREATE INDEX idx_workflows_trigger_event ON workflows(trigger_event);

CREATE TABLE ace_workflow_executions (
  execution_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id UUID REFERENCES ace_workflows(workflow_id) ON DELETE CASCADE,
  entity_type TEXT,
  entity_id UUID,
  trigger_event TEXT,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled', 'paused')),
  context JSONB DEFAULT '{}'::jsonb,
  result JSONB,
  error_message TEXT,
  started_by TEXT,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INTEGER
);

CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_entity ON workflow_executions(entity_type, entity_id);

CREATE TABLE ace_workflow_approvals (
  approval_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  execution_id UUID REFERENCES ace_workflow_executions(execution_id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  approver_type TEXT NOT NULL CHECK (approver_type IN ('user', 'role', 'customer', 'vendor')),
  approver_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'delegated')),
  comments TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workflow_approvals_execution_id ON workflow_approvals(execution_id);
CREATE INDEX idx_workflow_approvals_status ON workflow_approvals(status);

-- ============================================================================
-- INTEGRATIONS
-- ============================================================================

CREATE TABLE ace_integrations (
  integration_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_type TEXT NOT NULL CHECK (integration_type IN ('crm', 'erp', 'accounting', 'shipping', 'payment', 'inventory', 'email', 'other')),
  integration_name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'gohighlevel', 'quickbooks', 'shopify', etc.
  connection_status TEXT DEFAULT 'disconnected' CHECK (connection_status IN ('connected', 'disconnected', 'error', 'syncing')),
  credentials_encrypted TEXT, -- Encrypted credentials
  configuration JSONB DEFAULT '{}'::jsonb,
  sync_settings JSONB DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMP,
  last_sync_status TEXT,
  last_error TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_integrations_type ON integrations(integration_type);
CREATE INDEX idx_integrations_status ON integrations(connection_status);
CREATE INDEX idx_integrations_provider ON integrations(provider);

CREATE TABLE ace_integration_sync_logs (
  sync_log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES ace_integrations(integration_id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL CHECK (sync_type IN ('full', 'incremental', 'manual')),
  direction TEXT NOT NULL CHECK (direction IN ('import', 'export', 'bidirectional')),
  entity_type TEXT,
  records_synced INTEGER DEFAULT 0,
  records_succeeded INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  duration_ms INTEGER
);

CREATE INDEX idx_integration_sync_logs_integration_id ON integration_sync_logs(integration_id);
CREATE INDEX idx_integration_sync_logs_started_at ON integration_sync_logs(started_at);

-- ============================================================================
-- AUDIT & LOGGING
-- ============================================================================

CREATE TABLE ace_audit_logs (
  audit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view', 'export', 'approve', 'reject')),
  user_id TEXT,
  user_type TEXT,
  changes JSONB DEFAULT '{}'::jsonb, -- Before/after values
  ip_address INET,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Partition audit logs by month for performance
-- (PostgreSQL 10+ required for declarative partitioning)

-- ============================================================================
-- USER MANAGEMENT & PERMISSIONS
-- ============================================================================

CREATE TABLE ace_users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- For local auth, NULL if SSO
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  department TEXT,
  position TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP,
  password_reset_token TEXT,
  password_reset_expires_at TIMESTAMP,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE TABLE ace_roles (
  role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ace_permissions (
  permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  permission_name TEXT UNIQUE NOT NULL,
  resource_type TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_permissions_resource_action ON permissions(resource_type, action);

CREATE TABLE ace_user_roles (
  user_id UUID REFERENCES ace_users(user_id) ON DELETE CASCADE,
  role_id UUID REFERENCES ace_roles(role_id) ON DELETE CASCADE,
  assigned_by TEXT,
  assigned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE ace_role_permissions (
  role_id UUID REFERENCES ace_roles(role_id) ON DELETE CASCADE,
  permission_id UUID REFERENCES ace_permissions(permission_id) ON DELETE CASCADE,
  granted_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- ============================================================================
-- ENHANCED EXISTING TABLES
-- ============================================================================

-- Add indexes to existing tables
CREATE INDEX IF NOT EXISTS idx_vendors_capabilities ON vendors USING GIN(capabilities);
CREATE INDEX IF NOT EXISTS idx_vendors_materials ON vendors USING GIN(materials);
CREATE INDEX IF NOT EXISTS idx_parts_technical_specs ON parts USING GIN(technical_specs);
CREATE INDEX IF NOT EXISTS idx_rfqs_parts_requested ON rfqs USING GIN(parts_requested);
CREATE INDEX IF NOT EXISTS idx_vendor_quotes_line_items ON vendor_quotes USING GIN(line_items);

-- Add soft delete support to existing tables
ALTER TABLE ace_vendors ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE ace_parts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE ace_rfqs ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;
ALTER TABLE ace_contacts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Add created_by and updated_by tracking
ALTER TABLE ace_vendors ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE ace_vendors ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE ace_parts ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE ace_parts ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE ace_rfqs ADD COLUMN IF NOT EXISTS updated_by TEXT;

-- Add version tracking for key tables
ALTER TABLE ace_parts ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE ace_vendors ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ml_models_updated_at BEFORE UPDATE ON ml_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketplace_listings_updated_at BEFORE UPDATE ON marketplace_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Vendor performance view
CREATE OR REPLACE VIEW vendor_performance AS
SELECT
  v.vendor_id,
  v.vendor_name,
  COUNT(DISTINCT rv.rfq_id) as rfqs_received,
  COUNT(DISTINCT vq.quote_id) as quotes_submitted,
  COUNT(DISTINCT o.order_id) as orders_won,
  AVG(vq.total) as avg_quote_amount,
  AVG(o.total) as avg_order_amount,
  AVG(EXTRACT(EPOCH FROM (vq.created_at - rv.sent_date))/3600) as avg_response_time_hours,
  AVG(v.quality_rating) as avg_quality_rating,
  SUM(CASE WHEN vq.total IS NOT NULL THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(DISTINCT rv.rfq_id), 0) * 100 as quote_rate,
  SUM(CASE WHEN o.order_id IS NOT NULL THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(DISTINCT vq.quote_id), 0) * 100 as win_rate
FROM ace_vendors v
LEFT JOIN ace_rfq_vendors rv ON v.vendor_id = rv.vendor_id
LEFT JOIN ace_vendor_quotes vq ON v.vendor_id = vq.vendor_id
LEFT JOIN ace_orders o ON v.vendor_id = o.vendor_id AND o.status != 'cancelled'
WHERE v.deleted_at IS NULL
GROUP BY v.vendor_id, v.vendor_name;

-- Customer summary view
CREATE OR REPLACE VIEW customer_summary AS
SELECT
  c.customer_id,
  c.customer_number,
  c.company_name,
  c.contact_name,
  c.email,
  COUNT(DISTINCT q.quote_id) as total_quotes,
  COUNT(DISTINCT o.order_id) as total_orders,
  SUM(o.total) as total_spent,
  MAX(o.order_date) as last_order_date,
  COUNT(DISTINCT e.equipment_id) as equipment_count
FROM ace_customers c
LEFT JOIN ace_quotes q ON c.customer_id::TEXT = q.customer_id
LEFT JOIN ace_orders o ON c.customer_id = o.customer_id
LEFT JOIN ace_customer_equipment e ON c.customer_id = e.customer_id
WHERE c.deleted_at IS NULL
GROUP BY c.customer_id, c.customer_number, c.company_name, c.contact_name, c.email;

-- Parts demand forecast view
CREATE OR REPLACE VIEW parts_demand_forecast AS
SELECT
  p.part_id,
  p.part_number,
  p.description,
  COUNT(DISTINCT oi.order_id) as order_frequency,
  SUM(oi.quantity) as total_demand,
  AVG(oi.quantity) as avg_order_quantity,
  MAX(o.order_date) as last_ordered,
  MIN(o.order_date) as first_ordered,
  i.quantity_available,
  i.reorder_point,
  CASE
    WHEN i.quantity_available <= i.reorder_point THEN 'low_stock'
    WHEN i.quantity_available <= i.reorder_point * 1.5 THEN 'reorder_soon'
    ELSE 'in_stock'
  END as stock_status
FROM ace_parts p
LEFT JOIN ace_order_items oi ON p.part_id = oi.part_id
LEFT JOIN ace_orders o ON oi.order_id = o.order_id
LEFT JOIN ace_inventory i ON p.part_id = i.part_id
WHERE p.deleted_at IS NULL
GROUP BY p.part_id, p.part_number, p.description, i.quantity_available, i.reorder_point;

