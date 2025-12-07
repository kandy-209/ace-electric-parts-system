# 🆕 New Supabase Project Setup

Great! You created a new Supabase project. Here's how to set it up.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Your Supabase Keys

1. **Go to**: https://supabase.com/dashboard
2. **Select** your new project: `ace-electric-parts-system` (or whatever you named it)
3. **Go to**: **Settings** → **API**
4. **Copy these 3 values**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ Keep secret!)

### Step 2: Add to `.env.local`

Create or update `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Run Database Migrations

#### Option A: Via Supabase Dashboard (Easiest) ✅ Recommended

1. **Go to**: Supabase Dashboard → **SQL Editor**
2. **Click**: "New query"
3. **Run migrations in order**:

**Migration 1**: Copy and paste `supabase/migrations/001_create_tables.sql`
   - Click "Run" (or Ctrl/Cmd + Enter)

**Migration 2**: Copy and paste `supabase/migrations/002_comprehensive_schema.sql`
   - Click "Run"

**Migration 3**: Copy and paste `supabase/migrations/002_enhanced_schema.sql`
   - Click "Run"

#### Option B: Via Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
npx supabase login

# Link to your project (you'll need the project ref)
npx supabase link --project-ref your-project-ref

# Push migrations
npx supabase db push
```

### Step 4: Verify Setup

```bash
# Test database connection
npm run test:db

# Verify environment setup
npm run verify:setup
```

---

## 📋 What Gets Created?

The migrations will create **50+ tables** for:

- ✅ Parts database
- ✅ Vendors & RFQs
- ✅ Orders & Customers
- ✅ Inventory management
- ✅ ML/AI features
- ✅ Analytics & reporting
- ✅ User management
- ✅ And much more!

---

## 🔍 Verify Tables Were Created

1. **Go to**: Supabase Dashboard → **Table Editor**
2. **You should see** tables like:
   - `parts`
   - `vendors`
   - `rfqs`
   - `customers`
   - `orders`
   - etc.

---

## ⚙️ Add to Vercel

Don't forget to add environment variables to Vercel:

1. **Go to**: https://vercel.com/dashboard
2. **Select**: `ace-electric-parts-system`
3. **Go to**: Settings → Environment Variables
4. **Add** the same 3 Supabase variables
5. **Redeploy** after adding

---

## 🆘 Troubleshooting

### "Table already exists" error
- Your project might have some default tables
- That's okay - migrations use `CREATE TABLE IF NOT EXISTS`
- You can skip those errors

### "Permission denied" error
- Make sure you're using the **service_role** key for migrations
- Check that you have admin access to the project

### Connection errors
- Verify the URL and keys are correct
- Check that the project is fully initialized (wait 2-3 minutes after creation)

---

## ✅ Next Steps After Setup

1. ✅ Database migrations completed
2. ✅ Environment variables set in `.env.local`
3. ✅ Environment variables added to Vercel
4. ⏳ Test the connection: `npm run test:db`
5. ⏳ Start developing: `npm run dev`

---

## 📖 Related Guides

- **API Keys Setup**: `API_KEYS_GUIDE.md`
- **Vercel Setup**: `VERCEL_ENV_SETUP.md`
- **Full Setup**: `SETUP_GUIDE.md`

---

**You're all set! Use the regular migrations (not the prefixed ones) since you have a new project.** 🎉

