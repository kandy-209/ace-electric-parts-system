# API Roadmap & Database Architecture

## Overview
This document outlines all APIs needed for the complete system and the robust database schema to support them.

## Required APIs by Category

### 1. RFQ & Quote Management APIs
- ✅ `POST /api/rfq/create` - Create RFQ
- ✅ `POST /api/rfq/broadcast` - Broadcast RFQ to vendors
- ✅ `GET /api/rfq/recent` - Get recent RFQs
- ⚠️ `GET /api/rfq/[rfqId]` - Get RFQ details
- ⚠️ `PUT /api/rfq/[rfqId]` - Update RFQ
- ⚠️ `DELETE /api/rfq/[rfqId]` - Cancel RFQ
- ⚠️ `GET /api/rfq/[rfqId]/quotes` - Get quotes for RFQ
- ⚠️ `POST /api/rfq/[rfqId]/award` - Award RFQ to vendor
- ⚠️ `GET /api/quotes/[quoteId]` - Get quote details
- ⚠️ `POST /api/quotes/[quoteId]/accept` - Accept quote
- ⚠️ `POST /api/quotes/[quoteId]/reject` - Reject quote
- ⚠️ `GET /api/quotes/compare?rfq_id=...` - Compare quotes side-by-side

### 2. Vendor Management APIs
- ✅ `POST /api/vendors/discover` - Discover vendors via web scraping
- ⚠️ `GET /api/vendors` - List vendors with filters
- ⚠️ `GET /api/vendors/[vendorId]` - Get vendor details
- ⚠️ `POST /api/vendors` - Create vendor manually
- ⚠️ `PUT /api/vendors/[vendorId]` - Update vendor
- ⚠️ `DELETE /api/vendors/[vendorId]` - Delete vendor
- ⚠️ `POST /api/vendors/[vendorId]/verify` - Verify vendor
- ⚠️ `POST /api/vendors/[vendorId]/rate` - Rate vendor performance
- ⚠️ `GET /api/vendors/[vendorId]/quotes` - Get vendor's quote history
- ⚠️ `GET /api/vendors/[vendorId]/performance` - Get vendor performance metrics
- ⚠️ `POST /api/vendors/[vendorId]/capabilities` - Update capabilities
- ⚠️ `GET /api/vendors/search?q=...` - Search vendors
- ⚠️ `POST /api/vendors/merge` - Merge duplicate vendors

### 3. Parts Marketplace APIs
- ✅ `GET /api/parts/search` - AI-powered parts search
- ⚠️ `GET /api/parts` - List parts with filters
- ⚠️ `GET /api/parts/[partId]` - Get part details
- ⚠️ `POST /api/parts` - Add part to database
- ⚠️ `PUT /api/parts/[partId]` - Update part
- ⚠️ `DELETE /api/parts/[partId]` - Delete part
- ⚠️ `POST /api/parts/[partId]/cross-references` - Add cross-reference
- ⚠️ `GET /api/parts/[partId]/vendors` - Get vendors who can supply part
- ⚠️ `GET /api/parts/[partId]/history` - Get pricing/availability history
- ⚠️ `POST /api/parts/bulk-import` - Bulk import parts
- ⚠️ `GET /api/parts/suggestions?query=...` - Get part suggestions (autocomplete)
- ⚠️ `POST /api/parts/[partId]/match-buyers` - Find buyers for part (ML)

### 4. Buyer-Seller Matching APIs (ML/AI Marketplace)
- ⚠️ `POST /api/matching/find-buyers?part_id=...` - Find potential buyers for part
- ⚠️ `POST /api/matching/find-sellers?part_description=...` - Find sellers for needed part
- ⚠️ `POST /api/matching/calculate-commission` - Calculate commission for match
- ⚠️ `POST /api/matching/create-deal` - Create buyer-seller deal
- ⚠️ `GET /api/matching/deals` - List active deals
- ⚠️ `GET /api/matching/deals/[dealId]` - Get deal details
- ⚠️ `POST /api/matching/deals/[dealId]/close` - Close deal
- ⚠️ `GET /api/matching/recommendations` - Get personalized recommendations
- ⚠️ `POST /api/matching/train-model` - Retrain ML model with new data

### 5. Order Management APIs
- ⚠️ `POST /api/orders` - Create order from quote
- ⚠️ `GET /api/orders` - List orders with filters
- ⚠️ `GET /api/orders/[orderId]` - Get order details
- ⚠️ `PUT /api/orders/[orderId]` - Update order
- ⚠️ `POST /api/orders/[orderId]/cancel` - Cancel order
- ⚠️ `POST /api/orders/[orderId]/ship` - Mark order as shipped
- ⚠️ `POST /api/orders/[orderId]/receive` - Mark order as received
- ⚠️ `GET /api/orders/[orderId]/status` - Get order status
- ⚠️ `POST /api/orders/[orderId]/generate-form` - Generate order form PDF
- ⚠️ `POST /api/orders/[orderId]/send` - Send order form to vendor

### 6. Customer Management APIs
- ⚠️ `GET /api/customers` - List customers
- ⚠️ `GET /api/customers/[customerId]` - Get customer details
- ⚠️ `POST /api/customers` - Create customer
- ⚠️ `PUT /api/customers/[customerId]` - Update customer
- ⚠️ `GET /api/customers/[customerId]/orders` - Get customer orders
- ⚠️ `GET /api/customers/[customerId]/quotes` - Get customer quotes
- ⚠️ `GET /api/customers/[customerId]/history` - Get customer history
- ⚠️ `POST /api/customers/[customerId]/sync-crm` - Sync with GoHighLevel CRM

### 7. Sales Rep Tools APIs
- ⚠️ `GET /api/sales/reps` - List sales reps
- ⚠️ `GET /api/sales/reps/[repId]/dashboard` - Get rep dashboard data
- ⚠️ `GET /api/sales/reps/[repId]/performance` - Get rep performance metrics
- ⚠️ `GET /api/sales/reps/[repId]/customers` - Get rep's customers
- ⚠️ `GET /api/sales/reps/[repId]/rfqs` - Get rep's RFQs
- ⚠️ `GET /api/sales/reps/[repId]/commissions` - Get rep commissions
- ⚠️ `POST /api/sales/notes` - Add sales note/call log
- ⚠️ `GET /api/sales/notes?customer_id=...` - Get customer notes

### 8. Analytics & Reporting APIs
- ✅ `GET /api/sales/stats` - Dashboard statistics
- ⚠️ `GET /api/analytics/rfq-metrics` - RFQ performance metrics
- ⚠️ `GET /api/analytics/vendor-metrics` - Vendor performance metrics
- ⚠️ `GET /api/analytics/sales-metrics` - Sales performance metrics
- ⚠️ `GET /api/analytics/marketplace-metrics` - Marketplace metrics
- ⚠️ `GET /api/analytics/commission-report` - Commission report
- ⚠️ `GET /api/analytics/revenue-report` - Revenue report
- ⚠️ `GET /api/analytics/export?type=...` - Export data

### 9. Communication APIs
- ⚠️ `POST /api/communication/send-email` - Send email via SendGrid/Resend
- ⚠️ `POST /api/communication/send-linkedin` - Send LinkedIn message
- ⚠️ `POST /api/communication/send-sms` - Send SMS
- ⚠️ `GET /api/communication/history?vendor_id=...` - Get communication history
- ⚠️ `POST /api/communication/templates` - Create email template
- ⚠️ `GET /api/communication/templates` - List templates

### 10. Data Import/Export APIs
- ✅ `POST /api/import/excel` - Import Excel/CSV
- ⚠️ `POST /api/import/crm` - Import from GoHighLevel CRM
- ⚠️ `POST /api/import/linkedin` - Import LinkedIn contacts
- ⚠️ `POST /api/import/trade-show` - Import trade show contacts
- ⚠️ `GET /api/export/vendors` - Export vendors
- ⚠️ `GET /api/export/parts` - Export parts
- ⚠️ `GET /api/export/rfqs` - Export RFQs

### 11. Web Scraping & Discovery APIs
- ✅ `POST /api/vendors/discover` - Discover vendors
- ⚠️ `POST /api/scraping/jobs` - Create scraping job
- ⚠️ `GET /api/scraping/jobs/[jobId]` - Get scraping job status
- ⚠️ `GET /api/scraping/jobs` - List scraping jobs
- ⚠️ `POST /api/scraping/extract-vendor` - Extract vendor from URL
- ⚠️ `GET /api/scraping/sources` - List scraping sources

### 12. Integration APIs
- ⚠️ `POST /api/integrations/gohighlevel/sync` - Sync with GoHighLevel
- ⚠️ `GET /api/integrations/gohighlevel/contacts` - Get GHL contacts
- ⚠️ `POST /api/integrations/gohighlevel/upload-file` - Upload to GHL
- ⚠️ `POST /api/integrations/linkedin/send-message` - Send LinkedIn message
- ⚠️ `GET /api/integrations/linkedin/connections` - Get LinkedIn connections

### 13. Vendor Portal APIs (for vendors)
- ⚠️ `POST /api/portal/auth/register` - Vendor registration
- ⚠️ `POST /api/portal/auth/login` - Vendor login
- ⚠️ `GET /api/portal/rfqs` - Get RFQs matched to vendor
- ⚠️ `POST /api/portal/rfqs/[rfqId]/quote` - Submit quote
- ⚠️ `GET /api/portal/profile` - Get vendor profile
- ⚠️ `PUT /api/portal/profile` - Update vendor profile
- ⚠️ `GET /api/portal/quotes` - Get vendor's submitted quotes

### 14. Authentication & Authorization APIs
- ⚠️ `POST /api/auth/login` - User login
- ⚠️ `POST /api/auth/logout` - User logout
- ⚠️ `POST /api/auth/register` - User registration
- ⚠️ `GET /api/auth/me` - Get current user
- ⚠️ `POST /api/auth/refresh` - Refresh token
- ⚠️ `GET /api/auth/permissions` - Get user permissions

### 15. ML/AI Training APIs
- ⚠️ `POST /api/ml/features/extract` - Extract features from data
- ⚠️ `POST /api/ml/models/train` - Train ML model
- ⚠️ `GET /api/ml/models` - List trained models
- ⚠️ `POST /api/ml/models/[modelId]/predict` - Make prediction
- ⚠️ `GET /api/ml/models/[modelId]/performance` - Get model performance

## Database Tables Needed

See `supabase/migrations/002_comprehensive_schema.sql` for complete schema.

