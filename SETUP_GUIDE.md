# Setup Guide - Step by Step

## Step 1: Environment Variables Setup

### Required Environment Variables

Create a `.env.local` file in the root directory with:

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI (Required for AI features)
OPENAI_API_KEY=your_openai_api_key

# Optional: Email Service (SendGrid or Resend)
SENDGRID_API_KEY=your_sendgrid_key
# OR
RESEND_API_KEY=your_resend_key

# Optional: Google Custom Search (for vendor discovery)
GOOGLE_CUSTOM_SEARCH_API_KEY=your_google_api_key
GOOGLE_CUSTOM_SEARCH_ENGINE_ID=your_search_engine_id

# Optional: LinkedIn API (for LinkedIn messaging)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Optional: GoHighLevel CRM
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=your_ghl_location_id
```

### Getting Your Supabase Credentials

1. Go to https://supabase.com
2. Create a new project (or use existing)
3. Go to Project Settings → API
4. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### Getting OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy to `OPENAI_API_KEY`

## Step 2: Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy contents of `supabase/migrations/001_create_tables.sql`
4. Paste and run
5. Copy contents of `supabase/migrations/002_comprehensive_schema.sql`
6. Paste and run

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 3: Verify Setup

Run these commands to verify everything is working:

```bash
# Install dependencies (if not done)
npm install

# Test build
npm run build

# Start development server
npm run dev
```

Then visit: http://localhost:3000

## Step 4: Test Database Connection

Create a test script or use the Supabase dashboard to verify tables were created:

1. Go to Supabase Dashboard → Table Editor
2. You should see all tables:
   - parts
   - vendors
   - rfqs
   - orders
   - customers
   - etc.

## Next Steps

Once database is set up:
- Test API endpoints
- Add some test data
- Start building UI features

