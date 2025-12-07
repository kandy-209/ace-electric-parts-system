# Ace Electric Motor & Pump Co. - Complete AI-Powered System

World-class Next.js application integrating **37 AI agents** across all business operations.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📋 Project Status

### ✅ Phase 1: Foundation & Agent Framework (COMPLETE)
- ✅ Agent framework architecture (BaseAgent, Registry, Orchestrator)
- ✅ Database schema (all tables created)
- ✅ Agent API endpoints
- ✅ Admin dashboard foundation

### ✅ Phase 2: Shop & Repair Agents (COMPLETE - 9/9)
1. ✅ Shop Quoting Agent - Builds Good/Better/Best repair quotes
2. ✅ Repair Workflow Agent - Guides techs through SOPs
3. ✅ Warranty Tracker Agent - Tracks warranties & flags expirations
4. ✅ Parts ID Agent - Recognizes parts from photos/labels
5. ✅ Inventory Tracker Agent - Manages job stock & reorder thresholds
6. ✅ Motor Reliability Testing Agent - Packages test results into reports
7. ✅ Job Documentation Agent - Organizes pictures/videos/reports
8. ✅ Generator & Pump Report Agent - Ensures correct report templates
9. ✅ Safety Compliance Agent - Confirms hazard analysis, lockout/tagout, signatures

### 🚧 Phase 3: Field Service Agents (0/6)
- Field Service Quoting Agent
- Dispatch Agent
- Site Safety Agent
- Field Documentation Agent
- Alignment & Balancing Agent
- Emergency Response Agent

### 🚧 Phase 4: Sales & Customer Agents (0/8)
- Sales Quoting Agent
- Installation Add-On Agent
- Customer Portal Agent
- Follow-Up Agent
- Renewal Agent
- Customer Training Agent
- Marketing Campaign Agent
- Reseller Support Agent

### 🚧 Phase 5: Purchasing & Vendor Agents (0/4)
- Procurement Agent
- Vendor Tracker Agent
- Obsolescence Agent
- Purchase Approval Agent

### 🚧 Phase 6: Reliability & Predictive Agents (0/5)
- Predictive Maintenance Agent
- Root Cause Analysis Agent
- Condition Monitoring Agent
- Baseline Tracking Agent
- Failure Pattern Agent

### 🚧 Phase 7: Training & Internal Support Agents (0/5)
- Training Curriculum Agent
- Testing & Quiz Agent
- Lab Setup Agent
- Employee Onboarding Agent
- Performance Coaching Agent

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.7 + React 19.0.1
- **Database**: Supabase PostgreSQL Pro
- **AI**: OpenAI GPT-4o (structured outputs)
- **Voice**: Vapi.ai v2
- **Scraping**: Puppeteer 24.32.0+ / Playwright
- **OCR**: Tesseract.js 6.0.1+
- **PDF**: pdf-parse 2.4.5+ / React-PDF 10.2.0+
- **Caching**: Upstash Redis
- **Queue**: Inngest v3+
- **CRM**: GoHighLevel API
- **Validation**: Zod 4.1.13+
- **Styling**: Tailwind CSS 4.0+

## 📁 Project Structure

```
ace-electric-parts-system/
├── src/
│   ├── app/
│   │   ├── admin/          # Admin dashboards
│   │   ├── api/            # API routes
│   │   ├── parts/          # Public parts catalog
│   │   └── vendors/        # Vendor portal
│   ├── lib/
│   │   ├── agents/         # All 37 AI agents
│   │   ├── database/      # Database client & schema
│   │   ├── import/        # Data import system
│   │   ├── scraping/      # Web scraping engine
│   │   └── ...
│   └── components/        # React components
├── supabase/
│   └── migrations/        # Database migrations
└── docs/                  # Documentation
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `OPENAI_API_KEY` - OpenAI API key
- `NEXT_PUBLIC_APP_URL` - Your app URL

## 📊 Database

Run migrations:

```bash
npm run db:migrate
```

## 🤖 Using Agents

All agents are accessible via the API:

```typescript
// Execute an agent
const response = await fetch('/api/agents', {
  method: 'POST',
  body: JSON.stringify({
    agent_id: 'shop-quoting',
    input: {
      customer_name: 'ABC Company',
      motor_type: 'Electric Motor',
      repair_scope: 'Rewind and rebuild'
    }
  })
});
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run import:excel` - Import Excel file via CLI
- `npm run vendors:discover` - Start vendor discovery
- `npm run scrape:start` - Start web scraping job
- `npm run db:migrate` - Run database migrations

## 🎯 Next Steps

1. Set up Supabase database and run migrations
2. Configure environment variables
3. Build remaining agents (28 more to go!)
4. Implement parts catalog with SEO
5. Build vendor portal and RFQ system
6. Add chat and voice assistants

## 📚 Documentation

- [AI Agents Roadmap](./docs/AI_AGENTS_ROADMAP.md)
- [Database Schema](./supabase/migrations/001_create_tables.sql)

## 🤝 Contributing

This is a private project for Ace Electric Motor & Pump Co.

## 📄 License

Proprietary - All rights reserved
