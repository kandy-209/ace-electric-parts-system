// Core Types for Ace Electric Parts System

export interface Part {
  part_id: string;
  part_number: string;
  manufacturer_part_number?: string;
  description: string;
  category?: string;
  subcategory?: string;
  manufacturer?: string;
  oem_equivalents?: string[];
  technical_specs?: Record<string, any>;
  motor_compatibility?: {
    frame_sizes?: string[];
    hp_ranges?: string;
  };
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
  last_updated?: Date;
  data_source?: 'import' | 'scraping' | 'manual';
  seo_keywords?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface Vendor {
  vendor_id: string;
  vendor_name: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
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
  last_contact_date?: Date;
  notes?: string;
  discovered_via?: 'scraping' | 'linkedin' | 'email' | 'trade_show' | 'portal' | 'manual' | 'referral';
  created_at?: Date;
  updated_at?: Date;
}

export interface RFQ {
  rfq_id: string;
  rfq_number: string;
  created_date: Date;
  due_date?: Date;
  status: 'draft' | 'sent' | 'quotes_received' | 'comparing' | 'awarded' | 'expired';
  parts_requested: RFQPart[];
  special_requirements?: string;
  customer_quote_id?: string;
  created_by?: string;
}

export interface RFQPart {
  part_number?: string;
  description: string;
  quantity: number;
  specifications?: Record<string, any>;
  drawings?: string[];
  images?: string[];
}

export interface VendorQuote {
  quote_id: string;
  rfq_vendor_id: string;
  vendor_id: string;
  vendor_quote_number: string;
  quote_date: Date;
  line_items: QuoteLineItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  valid_until?: Date;
  lead_time_days?: number;
  terms?: string;
  quote_document_url?: string;
  extraction_confidence?: number;
  requires_review?: boolean;
}

export interface QuoteLineItem {
  part_number?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Contact {
  contact_id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  event_name?: string;
  event_date?: Date;
  business_card_image_url?: string;
  notes?: string;
  invited_to_portal?: boolean;
  portal_signup_date?: Date;
  created_at?: Date;
}

export interface ImportJob {
  job_id: string;
  source_type: 'excel' | 'pdf' | 'ocr' | 'database' | 'google_sheets' | 'crm' | 'email';
  source_name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  records_processed?: number;
  records_successful?: number;
  records_failed?: number;
  errors?: string[];
  started_at?: Date;
  completed_at?: Date;
}

export interface ScrapingJob {
  job_id: string;
  target_url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  parts_found?: number;
  parts_new?: number;
  parts_updated?: number;
  errors?: string[];
  started_at?: Date;
  completed_at?: Date;
}

