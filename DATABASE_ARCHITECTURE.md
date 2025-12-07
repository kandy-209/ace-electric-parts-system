# Database Architecture Documentation

## Overview
This is an extremely robust database schema designed to support:
- Current RFQ and vendor management needs
- Future ML/AI marketplace features
- Commission-based buyer-seller matching
- Comprehensive analytics and reporting
- Scalability to millions of records

## Database Design Principles

### 1. Normalization
- Third Normal Form (3NF) where appropriate
- Strategic denormalization for performance (e.g., search vectors, ML features)
- JSONB for flexible schema where needed (capabilities, specifications)

### 2. Scalability
- Indexes on all foreign keys
- Indexes on frequently queried columns
- Full-text search indexes (GIN indexes)
- Partitioning ready (can partition by date ranges if needed)

### 3. Performance
- Materialized views for complex aggregations
- Search vectors for fast text search
- Computed columns for common metrics
- Efficient JSONB indexing

### 4. Extensibility
- JSONB columns for flexible data (ML features, metadata)
- Generic entity references (entity_type, entity_id)
- Plugin architecture for integrations

## Core Tables

### 1. Parts (`parts`)
**Purpose**: Central parts database
**Key Features**:
- Full-text search vectors
- ML feature storage
- Popularity tracking
- Quote/order history

**Relationships**:
- One-to-many: `part_cross_references`
- Many-to-many: Vendors (via RFQs)

### 2. Vendors (`vendors`)
**Purpose**: Vendor/manufacturer management
**Key Features**:
- Capabilities, materials, processes (JSONB arrays)
- Performance metrics (response rate, win rate)
- Portal user linkage
- ML feature storage

**Relationships**:
- One-to-many: RFQs, Quotes, Orders
- One-to-one: Portal users

### 3. RFQs (`rfqs`)
**Purpose**: Request for Quote management
**Key Features**:
- Multi-part support (JSONB array)
- Status workflow tracking
- Customer and sales rep linkage
- Award tracking

**Relationships**:
- Many-to-many: Vendors (via `rfq_vendors`)
- One-to-many: Vendor quotes
- One-to-one: Awarded order

### 4. Orders (`orders`)
**Purpose**: Order management and fulfillment
**Key Features**:
- Complete order lifecycle
- Payment tracking
- Shipping information
- Document storage (PDFs)

**Relationships**:
- Many-to-one: Vendor, Customer, RFQ
- One-to-many: Commission records

### 5. Customers (`customers`)
**Purpose**: Customer relationship management
**Key Features**:
- CRM integration (GoHighLevel)
- Sales rep assignment
- Customer tier tracking
- Lifetime value calculation

**Relationships**:
- One-to-many: Orders, RFQs, Notes
- Many-to-one: Sales rep

## ML/AI Tables

### 1. ML Models (`ml_models`)
**Purpose**: Store trained ML models
**Features**:
- Version tracking
- Performance metrics
- Hyperparameters
- Training data range

### 2. ML Predictions (`ml_predictions`)
**Purpose**: Store predictions for model evaluation
**Features**:
- Input features and outputs
- Confidence scores
- Ground truth comparison
- Entity linkage

### 3. Marketplace Deals (`marketplace_deals`)
**Purpose**: Buyer-seller matching with commission
**Features**:
- Match score from ML
- Commission calculation
- Deal lifecycle tracking

### 4. Buyer Intents (`buyer_intents`)
**Purpose**: Track buyer needs for matching
**Features**:
- Part requirements
- ML features for matching
- Status tracking

### 5. Seller Listings (`seller_listings`)
**Purpose**: Track seller inventory/availability
**Features**:
- Pricing and quantity
- ML features for matching
- Status management

## Analytics Tables

### 1. Analytics Events (`analytics_events`)
**Purpose**: Event tracking for analytics
**Features**:
- Flexible event data (JSONB)
- Entity references
- Session tracking

### 2. Performance Metrics (`performance_metrics`)
**Purpose**: Aggregated metrics storage
**Features**:
- Time-period based
- Flexible metric storage (JSONB)
- Pre-calculated for performance

## Integration Tables

### 1. Integrations (`integrations`)
**Purpose**: External system connections
**Features**:
- Encrypted config storage
- Sync status tracking
- Multiple integration types

### 2. Sync Jobs (`sync_jobs`)
**Purpose**: Track data synchronization
**Features**:
- Bidirectional sync
- Error tracking
- Progress monitoring

## Communication Tables

### 1. Communications (`communications`)
**Purpose**: Unified communication tracking
**Features**:
- Multi-channel support
- Thread grouping
- Template linkage

### 2. Communication Templates (`communication_templates`)
**Purpose**: Reusable message templates
**Features**:
- Multi-channel templates
- Variable substitution
- HTML/text support

## Sales Management Tables

### 1. Sales Reps (`sales_reps`)
**Purpose**: Sales team management
**Features**:
- Hierarchy (manager/team)
- Quota tracking
- Commission rates

### 2. Sales Notes (`sales_notes`)
**Purpose**: Customer interaction tracking
**Features**:
- Multiple note types
- Next action tracking
- Call metrics

### 3. Commissions (`commissions`)
**Purpose**: Commission calculation and payout
**Features**:
- Multiple commission types
- Approval workflow
- Payment tracking

## Indexes Strategy

### Primary Indexes
- All primary keys (automatic)
- All foreign keys
- Unique constraints

### Search Indexes
- Full-text search vectors (GIN indexes)
- Trigram indexes for fuzzy matching
- JSONB path indexes for nested queries

### Performance Indexes
- Status columns
- Date columns (DESC)
- Frequently filtered columns
- Composite indexes for common queries

### Analytics Indexes
- Event type/category
- Entity references
- Date ranges

## Functions & Views

### Functions
1. `update_search_vector()` - Auto-update search vectors
2. `calculate_vendor_performance()` - Compute vendor metrics
3. `update_updated_at_column()` - Auto-update timestamps

### Views
1. `active_rfqs_view` - RFQs with quote statistics
2. `vendor_performance_view` - Vendor performance summary

## Data Integrity

### Constraints
- CHECK constraints for status fields
- FOREIGN KEY constraints
- UNIQUE constraints where needed
- NOT NULL where required

### Triggers
- Auto-update `updated_at` timestamps
- Auto-generate search vectors
- Audit logging (can be added)

## Security

### Row Level Security (RLS)
- Can be enabled for multi-tenant scenarios
- Policies for sales rep data isolation
- Vendor portal data isolation

### Encryption
- Integration credentials (JSONB encrypted)
- Sensitive customer data (can encrypt fields)

## Scalability Considerations

### Partitioning Ready
- Can partition `analytics_events` by date
- Can partition `ml_predictions` by date
- Can partition `communications` by date

### Archival Strategy
- Completed orders can be archived
- Old analytics events can be aggregated
- ML predictions can be purged after evaluation

### Caching Strategy
- Materialized views for dashboards
- Redis for frequently accessed data
- Query result caching

## ML/AI Data Collection

### Training Data Sources
1. RFQ → Vendor matches (historical)
2. Quote acceptances/rejections
3. Order completions
4. Vendor performance metrics
5. Buyer-seller marketplace deals

### Feature Engineering
- Stored in `ml_features` JSONB columns
- Extracted from parts, vendors, RFQs
- Updated via background jobs

### Model Deployment
- Models stored with versioning
- A/B testing support
- Rollback capability

## Migration Strategy

1. Run `001_create_tables.sql` first (existing tables)
2. Run `002_comprehensive_schema.sql` (new tables, enhancements)
3. Data migration scripts as needed
4. Index creation (non-blocking where possible)

## Performance Benchmarks

### Query Performance Targets
- Simple lookups: < 10ms
- Complex joins: < 100ms
- Full-text search: < 200ms
- Analytics queries: < 1s (can use materialized views)

### Scale Targets
- 1M+ parts
- 100K+ vendors
- 1M+ RFQs
- 10M+ orders
- 100M+ analytics events

## Backup & Recovery

### Backup Strategy
- Daily full backups
- Hourly incremental backups
- Point-in-time recovery
- Cross-region replication

### Recovery Strategy
- Tested restore procedures
- Documented RTO/RPO
- Disaster recovery plan

## Monitoring

### Key Metrics to Monitor
- Table sizes
- Index usage
- Query performance
- Lock contention
- Replication lag

### Alerting
- Slow query detection
- Disk space usage
- Connection pool exhaustion
- Replication lag

