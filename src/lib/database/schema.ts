// Database Schema Types - Matches Supabase PostgreSQL schema

export interface PartsTable {
  part_id: string;
  part_number: string;
  manufacturer_part_number?: string;
  description: string;
  category?: string;
  subcategory?: string;
  manufacturer?: string;
  oem_equivalents?: string[];
  technical_specs?: Record<string, any>;
  motor_compatibility?: Record<string, any>;
  pump_compatibility?: string[];
  images?: string[];
  technical_drawings?: string[];
  datasheet_url?: string;
  certifications?: string[];
  unit_cost?: number;
  current_stock?: number;
  min_stock_level?: number;
  preferred_vendors?: string[];
  supplier_skus?: Record<string, string>;
  last_updated?: string;
  data_source?: 'import' | 'scraping' | 'manual';
  seo_keywords?: string[];
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
  created_at?: string;
  updated_at?: string;
}

export interface RFQsTable {
  rfq_id: string;
  rfq_number: string;
  created_date: string;
  due_date?: string;
  status: 'draft' | 'sent' | 'quotes_received' | 'comparing' | 'awarded' | 'expired';
  parts_requested: Record<string, any>[];
  special_requirements?: string;
  customer_quote_id?: string;
  created_by?: string;
}

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
}

