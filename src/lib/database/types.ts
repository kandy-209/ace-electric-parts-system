/**
 * Comprehensive TypeScript types for all database tables
 * Generated from database schema
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface PartsTable {
  part_id: string;
  part_number: string;
  manufacturer_part_number?: string;
  description: string;
  category?: string;
  subcategory?: string;
  manufacturer?: string;
  oem_equivalents?: Record<string, any>[];
  technical_specs?: Record<string, any>;
  motor_compatibility?: Record<string, any>;
  pump_compatibility?: Record<string, any>[];
  images?: string[];
  technical_drawings?: string[];
  datasheet_url?: string;
  certifications?: string[];
  unit_cost?: number;
  current_stock?: number;
  min_stock_level?: number;
  preferred_vendors?: string[];
  supplier_skus?: Record<string, any>;
  last_updated?: string;
  data_source?: string;
  seo_keywords?: string[];
  search_vector?: any;
  ml_features?: Record<string, any>;
  popularity_score?: number;
  last_quoted_date?: string;
  quote_count?: number;
  order_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface VendorsTable {
  vendor_id: string;
  vendor_name: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: Record<string, any>;
  capabilities?: string[];
  materials?: string[];
  processes?: string[];
  certifications?: string[];
  min_order_quantity?: number;
  max_order_quantity?: number;
  geographic_regions?: string[];
  response_time_avg_hours?: number;
  quality_rating?: number;
  is_verified?: boolean;
  is_preferred?: boolean;
  last_contact_date?: string;
  notes?: string;
  discovered_via?: 'scraping' | 'linkedin' | 'email' | 'trade_show' | 'portal' | 'manual' | 'referral';
  search_vector?: any;
  ml_features?: Record<string, any>;
  response_rate?: number;
  average_quote_time_hours?: number;
  win_rate?: number;
  total_quotes?: number;
  total_orders?: number;
  total_revenue?: number;
  linkedin_url?: string;
  portal_user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RFQsTable {
  rfq_id: string;
  rfq_number: string;
  created_date?: string;
  due_date?: string;
  status: 'draft' | 'sent' | 'quotes_received' | 'comparing' | 'awarded' | 'expired';
  parts_requested: Record<string, any>[];
  special_requirements?: string;
  customer_quote_id?: string;
  customer_id?: string;
  customer_name?: string;
  sales_rep_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  estimated_value?: number;
  awarded_vendor_id?: string;
  awarded_quote_id?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdersTable {
  order_id: string;
  order_number: string;
  rfq_id?: string;
  quote_id?: string;
  vendor_id: string;
  customer_id: string;
  customer_name: string;
  sales_rep_id?: string;
  line_items: Record<string, any>[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
  order_date?: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  shipping_address?: Record<string, any>;
  tracking_number?: string;
  shipping_carrier?: string;
  payment_status?: 'pending' | 'partial' | 'paid' | 'overdue';
  payment_terms?: string;
  paid_amount?: number;
  paid_date?: string;
  order_form_url?: string;
  invoice_url?: string;
  packing_slip_url?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface CustomersTable {
  customer_id: string;
  customer_number: string;
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  billing_address?: Record<string, any>;
  shipping_address?: Record<string, any>;
  industry?: string;
  company_size?: string;
  tax_id?: string;
  credit_limit?: number;
  payment_terms?: string;
  crm_id?: string;
  crm_synced_at?: string;
  assigned_sales_rep_id?: string;
  customer_tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  lifetime_value?: number;
  last_order_date?: string;
  last_contact_date?: string;
  status: 'active' | 'inactive' | 'prospect' | 'lead';
  notes?: string;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SalesRepsTable {
  rep_id: string;
  user_id?: string;
  employee_number: string;
  name: string;
  email: string;
  phone?: string;
  role: 'sales_rep' | 'sales_manager' | 'admin';
  team_id?: string;
  manager_id?: string;
  quota?: number;
  total_sales?: number;
  commission_rate?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// MARKETPLACE & ML TABLES
// ============================================================================

export interface MarketplaceDealsTable {
  deal_id: string;
  deal_number: string;
  buyer_id?: string;
  seller_vendor_id?: string;
  part_id?: string;
  part_description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  commission_rate: number;
  commission_amount: number;
  commission_paid?: boolean;
  commission_paid_date?: string;
  status: 'pending' | 'negotiating' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  match_score?: number;
  matched_by_model?: string;
  match_features?: Record<string, any>;
  created_at?: string;
  accepted_at?: string;
  completed_at?: string;
  updated_at?: string;
}

export interface BuyerIntentsTable {
  intent_id: string;
  customer_id?: string;
  part_description: string;
  technical_requirements?: Record<string, any>;
  quantity?: number;
  budget?: number;
  urgency?: 'low' | 'medium' | 'high';
  status: 'active' | 'matched' | 'fulfilled' | 'expired';
  ml_features?: Record<string, any>;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SellerListingsTable {
  listing_id: string;
  vendor_id: string;
  part_id?: string;
  part_description: string;
  specifications?: Record<string, any>;
  unit_price?: number;
  min_quantity?: number;
  max_quantity?: number;
  quantity_available?: number;
  lead_time_days?: number;
  status: 'active' | 'sold' | 'inactive';
  ml_features?: Record<string, any>;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MLModelsTable {
  model_id: string;
  model_name: string;
  model_type: 'classification' | 'regression' | 'recommendation' | 'matching';
  model_version: string;
  description?: string;
  algorithm?: string;
  hyperparameters?: Record<string, any>;
  training_data_range_start?: string;
  training_data_range_end?: string;
  training_samples?: number;
  trained_at?: string;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1_score?: number;
  performance_metrics?: Record<string, any>;
  status: 'training' | 'active' | 'archived' | 'failed';
  is_active?: boolean;
  model_file_path?: string;
  feature_definitions?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// COMMUNICATION TABLES
// ============================================================================

export interface CommunicationsTable {
  communication_id: string;
  from_type: 'company' | 'vendor' | 'customer' | 'sales_rep';
  from_id: string;
  to_type: 'company' | 'vendor' | 'customer' | 'sales_rep';
  to_id: string;
  channel: 'email' | 'linkedin' | 'sms' | 'portal' | 'phone' | 'in_app';
  subject?: string;
  message_body: string;
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  thread_id?: string;
  parent_communication_id?: string;
  template_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface CommunicationTemplatesTable {
  template_id: string;
  template_name: string;
  template_type: 'rfq_invitation' | 'quote_request' | 'order_confirmation' | 'follow_up' | 'custom';
  channel: 'email' | 'linkedin' | 'sms' | 'portal';
  subject?: string;
  body_text: string;
  body_html?: string;
  variables?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// SALES & COMMISSION TABLES
// ============================================================================

export interface SalesNotesTable {
  note_id: string;
  customer_id?: string;
  vendor_id?: string;
  rfq_id?: string;
  order_id?: string;
  sales_rep_id: string;
  note_type?: 'call' | 'email' | 'meeting' | 'visit' | 'general';
  title?: string;
  content: string;
  call_duration_seconds?: number;
  call_outcome?: string;
  next_action?: string;
  next_action_date?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CommissionsTable {
  commission_id: string;
  sales_rep_id: string;
  order_id?: string;
  deal_id?: string;
  commission_type: 'sale' | 'marketplace' | 'referral' | 'bonus';
  base_amount: number;
  commission_rate: number;
  commission_amount: number;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  approved_by?: string;
  approved_at?: string;
  paid_at?: string;
  paid_amount?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// ANALYTICS TABLES
// ============================================================================

export interface AnalyticsEventsTable {
  event_id: string;
  event_type: string;
  event_category: string;
  user_id?: string;
  customer_id?: string;
  vendor_id?: string;
  rfq_id?: string;
  order_id?: string;
  event_data?: Record<string, any>;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

// ============================================================================
// INTEGRATION TABLES
// ============================================================================

export interface IntegrationsTable {
  integration_id: string;
  integration_type: 'gohighlevel' | 'linkedin' | 'email' | 'sms' | 'erp' | 'accounting';
  name: string;
  config: Record<string, any>;
  is_active?: boolean;
  last_sync_at?: string;
  last_sync_status?: string;
  last_error?: string;
  created_at?: string;
  updated_at?: string;
}

// Additional types from schema.ts (to be added later)
export interface VendorQuotesTable {
  quote_id: string;
  rfq_vendor_id: string;
  vendor_id: string;
  vendor_quote_number: string;
  quote_date: string;
  line_items: Record<string, any>[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  valid_until?: string;
  lead_time_days?: number;
  terms?: string;
  quote_document_url?: string;
  extraction_confidence?: number;
  requires_review?: boolean;
}

export interface ContactsTable {
  contact_id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  event_name?: string;
  event_date?: string;
  business_card_image_url?: string;
  notes?: string;
  invited_to_portal?: boolean;
  portal_signup_date?: string;
  created_at?: string;
  updated_at?: string;
}

