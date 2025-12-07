# API & Database Roadmap

## Current APIs (Implemented)

### RFQ & Vendor Management
- ✅ `POST /api/rfq/create` - Create RFQ
- ✅ `POST /api/rfq/broadcast` - Broadcast RFQ to vendors
- ✅ `GET /api/rfq/recent` - Get recent RFQs
- ✅ `POST /api/vendors/discover` - Discover vendors via web scraping
- ✅ `GET /api/parts/search` - AI-powered parts search

### Sales & Dashboard
- ✅ `GET /api/sales/stats` - Dashboard statistics

### AI & Agents
- ✅ `GET /api/agents` - List all agents
- ✅ `POST /api/agents/[agentId]` - Execute agent
- ✅ `POST /api/agents/init` - Initialize agents
- ✅ `POST /api/chat` - Chat assistant
- ✅ `POST /api/voice` - Voice assistant

### Data Import
- ✅ `POST /api/import/excel` - Import Excel/CSV data

---

## Missing APIs (To Be Implemented)

### 1. Order Management APIs

**Purpose**: Manage orders created from quotes, track fulfillment, inventory updates

```
POST   /api/orders/create          - Create order from quote
GET    /api/orders                 - List orders (with filters, pagination)
GET    /api/orders/[orderId]       - Get order details
PUT    /api/orders/[orderId]       - Update order
POST   /api/orders/[orderId]/cancel - Cancel order
POST   /api/orders/[orderId]/fulfill - Mark order as fulfilled
GET    /api/orders/[orderId]/status - Get order status
GET    /api/orders/[orderId]/tracking - Get shipping/tracking info
POST   /api/orders/bulk-create     - Create multiple orders
GET    /api/orders/pending         - Get pending orders
GET    /api/orders/by-vendor       - Get orders by vendor
GET    /api/orders/by-customer     - Get orders by customer
```

### 2. Quote Management APIs

**Purpose**: Compare quotes, accept/reject, convert to orders

```
GET    /api/quotes                 - List quotes (with filters)
GET    /api/quotes/[quoteId]       - Get quote details
GET    /api/quotes/rfq/[rfqId]     - Get all quotes for an RFQ
POST   /api/quotes/[quoteId]/accept - Accept quote (creates order)
POST   /api/quotes/[quoteId]/reject - Reject quote
POST   /api/quotes/compare         - Compare multiple quotes side-by-side
GET    /api/quotes/best-match      - Get best quote for RFQ
POST   /api/quotes/[quoteId]/export-pdf - Export quote as PDF
GET    /api/quotes/analytics       - Quote analytics (win rate, avg price, etc.)
```

### 3. Customer Management APIs

**Purpose**: CRM integration, customer profiles, purchase history

```
GET    /api/customers              - List customers
GET    /api/customers/[customerId] - Get customer details
POST   /api/customers              - Create customer
PUT    /api/customers/[customerId] - Update customer
GET    /api/customers/[customerId]/history - Get purchase/quote history
GET    /api/customers/[customerId]/equipment - Get customer equipment
GET    /api/customers/[customerId]/quotes - Get customer quotes
GET    /api/customers/[customerId]/orders - Get customer orders
POST   /api/customers/sync-crm     - Sync with GoHighLevel CRM
GET    /api/customers/search       - Search customers
POST   /api/customers/[customerId]/notes - Add customer note
GET    /api/customers/[customerId]/stats - Customer statistics
```

### 4. Vendor Management APIs

**Purpose**: CRUD operations, performance tracking, ratings

```
GET    /api/vendors                - List vendors (with filters)
GET    /api/vendors/[vendorId]     - Get vendor details
POST   /api/vendors                - Create vendor
PUT    /api/vendors/[vendorId]     - Update vendor
DELETE /api/vendors/[vendorId]     - Delete vendor (soft delete)
GET    /api/vendors/[vendorId]/performance - Get vendor performance metrics
GET    /api/vendors/[vendorId]/quotes - Get vendor quote history
GET    /api/vendors/[vendorId]/orders - Get vendor order history
POST   /api/vendors/[vendorId]/rate - Rate vendor performance
GET    /api/vendors/[vendorId]/stats - Vendor statistics
GET    /api/vendors/search         - Search vendors by capabilities
POST   /api/vendors/[vendorId]/verify - Verify vendor credentials
GET    /api/vendors/preferred      - Get preferred vendors
POST   /api/vendors/[vendorId]/set-preferred - Set preferred status
GET    /api/vendors/analytics      - Vendor analytics dashboard
```

### 5. Inventory Management APIs

**Purpose**: Track stock levels, reorder points, inventory movements

```
GET    /api/inventory              - List inventory items
GET    /api/inventory/[partId]     - Get inventory for part
POST   /api/inventory/adjust       - Adjust inventory levels
POST   /api/inventory/reorder      - Create reorder request
GET    /api/inventory/low-stock    - Get low stock alerts
GET    /api/inventory/movements    - Get inventory movement history
POST   /api/inventory/receive      - Receive inventory (PO fulfillment)
POST   /api/inventory/reserve      - Reserve inventory for order
POST   /api/inventory/release      - Release reserved inventory
GET    /api/inventory/forecast     - Inventory forecasting
GET    /api/inventory/analytics    - Inventory analytics
```

### 6. Document Generation APIs

**Purpose**: Generate PDFs for quotes, orders, invoices, reports

```
POST   /api/documents/quote        - Generate quote PDF
POST   /api/documents/order        - Generate order PDF
POST   /api/documents/invoice      - Generate invoice PDF
POST   /api/documents/rfq          - Generate RFQ form PDF
POST   /api/documents/packing-slip - Generate packing slip
POST   /api/documents/report       - Generate custom report
GET    /api/documents/[documentId] - Download document
GET    /api/documents/list         - List generated documents
POST   /api/documents/template     - Create document template
```

### 7. Notification System APIs

**Purpose**: Email/SMS notifications, webhooks, alerts

```
POST   /api/notifications/send     - Send notification (email/SMS)
GET    /api/notifications          - List notifications
GET    /api/notifications/[id]     - Get notification details
POST   /api/notifications/preferences - Update notification preferences
POST   /api/webhooks/register      - Register webhook endpoint
DELETE /api/webhooks/[id]          - Delete webhook
POST   /api/webhooks/test          - Test webhook
GET    /api/webhooks/events        - Get webhook event history
```

### 8. Analytics & Reporting APIs

**Purpose**: Business intelligence, dashboards, reports

```
GET    /api/analytics/overview     - Overview analytics
GET    /api/analytics/rfq          - RFQ analytics
GET    /api/analytics/quotes       - Quote analytics (win rate, response time)
GET    /api/analytics/orders       - Order analytics (revenue, fulfillment)
GET    /api/analytics/vendors      - Vendor performance analytics
GET    /api/analytics/customers    - Customer analytics
GET    /api/analytics/parts        - Parts analytics (popular, trending)
GET    /api/analytics/revenue      - Revenue analytics
GET    /api/analytics/custom       - Custom analytics query
POST   /api/reports/generate       - Generate custom report
GET    /api/reports/[reportId]     - Get report
GET    /api/reports/scheduled      - Get scheduled reports
```

### 9. ML/AI Training Data APIs

**Purpose**: Collect and manage data for ML model training

```
POST   /api/ml/data/collect        - Collect training data point
GET    /api/ml/data                - Get training dataset
POST   /api/ml/data/label          - Label training data
GET    /api/ml/models              - List trained models
POST   /api/ml/models/train        - Train new model
GET    /api/ml/models/[modelId]    - Get model details
POST   /api/ml/models/[modelId]/predict - Make prediction
GET    /api/ml/models/[modelId]/performance - Model performance metrics
POST   /api/ml/matching            - AI-powered matching (vendor-part, buyer-seller)
GET    /api/ml/recommendations     - Get recommendations (parts, vendors)
```

### 10. Commission & Marketplace APIs

**Purpose**: Track commissions, manage buyer-seller connections

```
POST   /api/marketplace/listing    - Create marketplace listing
GET    /api/marketplace/listings   - Get marketplace listings
GET    /api/marketplace/[listingId] - Get listing details
POST   /api/marketplace/[listingId]/purchase - Purchase from marketplace
GET    /api/commissions            - Get commission records
GET    /api/commissions/[id]       - Get commission details
GET    /api/commissions/payout     - Calculate commission payouts
POST   /api/commissions/process    - Process commission payment
GET    /api/marketplace/analytics  - Marketplace analytics
POST   /api/marketplace/connect    - Connect buyer with seller
```

### 11. Workflow Automation APIs

**Purpose**: Multi-step processes, approvals, automation

```
POST   /api/workflows/create       - Create workflow
GET    /api/workflows              - List workflows
GET    /api/workflows/[workflowId] - Get workflow details
POST   /api/workflows/[workflowId]/execute - Execute workflow
GET    /api/workflows/[workflowId]/status - Get workflow status
POST   /api/workflows/[workflowId]/approve - Approve workflow step
POST   /api/workflows/[workflowId]/reject - Reject workflow step
GET    /api/workflows/pending      - Get pending workflow steps
GET    /api/workflows/history      - Get workflow execution history
```

### 12. Integration & Webhook APIs

**Purpose**: External system integration, webhooks

```
GET    /api/integrations           - List integrations
POST   /api/integrations/connect   - Connect external system
DELETE /api/integrations/[id]      - Disconnect integration
GET    /api/integrations/[id]/sync - Sync with external system
POST   /api/integrations/crm/sync  - Sync with CRM
POST   /api/integrations/erp/sync  - Sync with ERP
GET    /api/webhooks               - List webhooks
POST   /api/webhooks               - Create webhook
PUT    /api/webhooks/[id]          - Update webhook
DELETE /api/webhooks/[id]          - Delete webhook
POST   /api/webhooks/[id]/test     - Test webhook
GET    /api/webhooks/events        - Webhook event log
```

### 13. Search & Discovery APIs

**Purpose**: Advanced search, discovery, recommendations

```
POST   /api/search/semantic        - Semantic search across all entities
GET    /api/search/vendors         - Advanced vendor search
GET    /api/search/parts           - Advanced parts search
GET    /api/search/customers       - Advanced customer search
GET    /api/discover/parts         - Discover similar parts
GET    /api/discover/vendors       - Discover similar vendors
GET    /api/recommendations/parts  - Part recommendations for customer
GET    /api/recommendations/vendors - Vendor recommendations for RFQ
```

### 14. Audit & Logging APIs

**Purpose**: Audit trails, activity logs, compliance

```
GET    /api/audit/logs             - Get audit logs
GET    /api/audit/[entityType]/[entityId] - Get audit trail for entity
GET    /api/audit/users/[userId]   - Get user activity logs
GET    /api/audit/search           - Search audit logs
POST   /api/audit/export           - Export audit logs
GET    /api/logs/application       - Application logs
GET    /api/logs/api               - API access logs
GET    /api/logs/errors            - Error logs
```

### 15. User & Permission APIs

**Purpose**: User management, roles, permissions

```
GET    /api/users                  - List users
GET    /api/users/[userId]         - Get user details
POST   /api/users                  - Create user
PUT    /api/users/[userId]         - Update user
DELETE /api/users/[userId]         - Delete user
GET    /api/users/[userId]/permissions - Get user permissions
POST   /api/users/[userId]/permissions - Update permissions
GET    /api/roles                  - List roles
POST   /api/roles                  - Create role
GET    /api/permissions            - List available permissions
```

---

## Database Schema Enhancements

### New Tables Needed

1. **orders** - Order management
2. **order_items** - Order line items
3. **inventory** - Inventory tracking (separate from parts)
4. **inventory_movements** - Inventory movement history
5. **customers** - Customer management
6. **customer_equipment** - Customer equipment registry
7. **documents** - Document storage metadata
8. **notifications** - Notification history
9. **webhooks** - Webhook configurations
10. **webhook_events** - Webhook event log
11. **analytics_events** - Analytics event tracking
12. **ml_training_data** - ML training data collection
13. **ml_models** - ML model registry
14. **commissions** - Commission tracking
15. **marketplace_listings** - Marketplace listings
16. **workflows** - Workflow definitions
17. **workflow_executions** - Workflow execution logs
18. **integrations** - External system integrations
19. **audit_logs** - Audit trail
20. **users** - User accounts
21. **roles** - User roles
22. **permissions** - Permission definitions
23. **user_roles** - User-role mapping
24. **role_permissions** - Role-permission mapping

### Enhanced Existing Tables

Add indexes, constraints, and additional fields for:
- Performance optimization
- Data integrity
- Soft deletes
- Audit trails
- Versioning

