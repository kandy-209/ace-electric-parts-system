# Deployment Checklist

## Pre-Deployment

- [x] Code is committed to Git
- [ ] Remote repository configured (GitHub/GitLab)
- [ ] Code pushed to remote
- [ ] Environment variables configured
- [ ] Database migrations run

## Vercel Deployment

### Step 1: Connect to Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings

### Step 2: Environment Variables in Vercel

Add all environment variables from `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- (and optional ones)

### Step 3: Deploy

Vercel will automatically deploy on push to `main` branch.

## Database Setup

1. Run migrations in Supabase:
   - Go to Supabase Dashboard → SQL Editor
   - Run `001_create_tables.sql`
   - Run `002_comprehensive_schema.sql`

## Post-Deployment

- [ ] Test all API endpoints
- [ ] Verify database connection
- [ ] Test RFQ broadcast
- [ ] Test vendor discovery
- [ ] Set up monitoring (Vercel Analytics)

