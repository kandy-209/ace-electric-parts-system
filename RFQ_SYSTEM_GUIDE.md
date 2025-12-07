# RFQ Broadcast & Vendor Discovery System Guide

## Overview

This system allows you to:
1. **Create RFQs** for custom parts you need
2. **Automatically find matching vendors** in your database, CRM, and via web scraping
3. **Broadcast RFQs** to all matching vendors via multiple channels (email, LinkedIn, portal)
4. **Discover new vendors** by scraping manufacturer directories
5. **Search parts marketplace** with AI-powered semantic search
6. **Manage everything** from the sales dashboard

## Key Features

### 1. RFQ Broadcast System (`/sales/rfq`)

**What it does:**
- Creates RFQ requests for custom parts
- Uses AI to match part requirements with vendor capabilities
- Automatically sends RFQ to all matching vendors in your database
- Supports multiple broadcast channels (email, LinkedIn, portal, SMS)

**How to use:**
1. Go to `/sales/rfq`
2. Enter parts description and technical requirements
3. Click "Find Matching Vendors" to see which vendors can fulfill the RFQ
4. Optionally click "Discover New Vendors" to search the web for new manufacturers
5. Select broadcast channels
6. Click "Create & Broadcast RFQ"

**AI Matching:**
- Analyzes part description and technical requirements
- Compares against vendor capabilities, materials, processes, certifications
- Provides match confidence scores (0-1)
- Explains why each vendor matches

### 2. Vendor Discovery Service

**What it does:**
- Searches Google for US manufacturers
- Scrapes manufacturer directories (ThomasNet, MFG.com, etc.)
- Extracts vendor information using AI
- Saves discovered vendors to database

**Sources:**
- Google Custom Search (can be configured with API)
- ThomasNet directory
- MFG.com directory
- Industry-specific databases (NEMA, IEEE, etc.)

**AI Extraction:**
- Extracts company name, email, phone, location
- Identifies capabilities (manufacturing processes, materials)
- Determines industries served
- Calculates match confidence

### 3. Parts Marketplace (`/sales/marketplace`)

**What it does:**
- Search your collected parts database
- AI-powered semantic search (understands intent, not just keywords)
- Filter by category
- Request quotes for any part
- See estimated costs

**How to use:**
1. Go to `/sales/marketplace`
2. Search by part number, description, manufacturer
3. Filter by category if needed
4. Click "Request Quote" to create RFQ for that part
5. Or click "View Details" to see full specifications

**AI Search:**
- Understands natural language queries
- Matches parts even if exact keywords don't match
- Ranks results by relevance
- Explains why each part matches

### 4. Sales Dashboard (`/sales/dashboard`)

**What it does:**
- Shows key metrics (active RFQs, quotes received, vendors contacted, parts in database)
- Quick access to all sales tools
- Recent RFQs list
- One-click navigation to all features

**Quick Actions:**
- Create RFQ
- Search Parts Marketplace
- Manage Vendors
- View Orders & Quotes

## Database Integration

### Vendors Table
- Stores vendor information (name, email, phone, website)
- Capabilities (manufacturing processes, materials)
- Certifications and quality ratings
- Discovery source (scraping, LinkedIn, trade show, etc.)

### RFQs Table
- RFQ details (description, requirements, quantity, urgency)
- Status tracking (draft, sent, quotes_received, comparing, awarded, expired)

### RFQ-Vendors Table
- Tracks which vendors received which RFQs
- Channel used (email, LinkedIn, portal, SMS)
- Response status

### Vendor Quotes Table
- Stores quotes received from vendors
- Line items, pricing, lead times
- Extraction confidence (if parsed from PDF/email)

## API Endpoints

### RFQ Management
- `POST /api/rfq/create` - Create new RFQ
- `POST /api/rfq/broadcast` - Broadcast RFQ to vendors
- `GET /api/rfq/recent` - Get recent RFQs

### Vendor Discovery
- `POST /api/vendors/discover` - Discover vendors via web scraping
- `GET /api/rfq/broadcast?parts_description=...` - Find matching vendors

### Parts Search
- `GET /api/parts/search?search=...&category=...` - AI-powered parts search

### Dashboard
- `GET /api/sales/stats` - Get dashboard statistics

## Workflow Examples

### Example 1: Need Custom Motor Part

1. Go to `/sales/rfq`
2. Enter: "Custom 215T frame motor, 10HP, 460V, explosion-proof"
3. Technical requirements: `{"frame": "215T", "hp": 10, "voltage": 460, "enclosure": "explosion_proof"}`
4. Click "Find Matching Vendors"
5. System finds vendors with:
   - Motor manufacturing capabilities
   - Explosion-proof certifications
   - Experience with 215T frames
6. Click "Discover New Vendors" to find more
7. Select channels: Email + Portal
8. Click "Create & Broadcast RFQ"
9. System sends RFQ to all matching vendors

### Example 2: Search for Existing Part

1. Go to `/sales/marketplace`
2. Search: "10HP motor 460V"
3. AI finds parts even if they don't exactly match keywords
4. See match reasons and confidence scores
5. Click "Request Quote" for best match
6. Pre-filled RFQ form appears

### Example 3: Sales Rep After Customer Call

1. Customer needs custom pump part
2. Go to `/sales/dashboard`
3. Click "Create RFQ"
4. Enter customer requirements
5. System finds 15 matching vendors
6. Broadcast to all via email
7. Check dashboard later to see quotes received
8. Compare quotes and award order

## Future Enhancements (ML/AI Marketplace)

The system is designed to collect data for building ML/AI algorithms:

1. **Reinforcement Learning**: Learn which vendors are best for which part types
2. **Predictive Matching**: Predict which vendors will respond and provide best quotes
3. **Commission-Based Marketplace**: Connect buyers with parts, earn commission on sales
4. **Recommendation Engine**: Suggest parts to buyers based on history
5. **Price Prediction**: Predict market prices based on historical data

## Configuration

### Environment Variables Required:
- `OPENAI_API_KEY` - For AI matching and extraction
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - For admin operations

### Optional (for enhanced features):
- Google Custom Search API key (for vendor discovery)
- SendGrid/Resend API key (for email sending)
- LinkedIn API credentials (for LinkedIn messaging)

## Next Steps

1. **Set up email sending** - Integrate SendGrid/Resend for actual email delivery
2. **Configure web scraping** - Set up Puppeteer/Playwright for directory scraping
3. **Add CRM integration** - Connect to GoHighLevel API
4. **Build vendor portal** - Self-service portal for vendors
5. **ML model training** - Start collecting data for ML algorithms
6. **Order form generation** - Automated PDF generation and sending

