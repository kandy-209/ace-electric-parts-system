# ⚡ Quick Start: Using Existing Supabase Database

## ✅ Solution: Use Table Prefixes

I've created prefixed migrations so you can use your existing Supabase project without conflicts!

---

## 🚀 Quick Steps (5 minutes)

### Step 1: Get Your Existing Supabase Keys

1. Go to: https://supabase.com/dashboard
2. Select your existing project
3. Go to: **Settings** → **API**
4. Copy these 3 values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Add to `.env.local`

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-existing-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-existing-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-existing-service-role-key
```

### Step 3: Generate Prefixed Migrations

```bash
node scripts/add-prefix-to-migrations.js
```

This creates migrations in `supabase/migrations-prefixed/` with `ace_` prefix.

### Step 4: Run Migrations in Supabase

1. Go to: Supabase Dashboard → **SQL Editor**
2. Open each file from `supabase/migrations-prefixed/` in order:
   - `001_create_tables.sql`
   - `002_comprehensive_schema.sql`
   - `002_enhanced_schema.sql`
3. Copy and paste into SQL Editor
4. Click "Run"

### Step 5: Verify

```bash
npm run test:db
```

---

## 📋 What Changed?

All tables now have `ace_` prefix:

- `parts` → `ace_parts`
- `vendors` → `ace_vendors`
- `rfqs` → `ace_rfqs`
- etc.

This prevents conflicts with your existing tables!

---

## 🔧 Update Code (If Needed)

The application code will need to be updated to use prefixed table names. 

**Option 1**: Update code references (I can help with this)
**Option 2**: Create views/aliases (advanced)

---

## ✅ Benefits

- ✅ No conflicts with existing tables
- ✅ Use your existing free Supabase project
- ✅ All your data in one place
- ✅ Easy to identify Ace Electric tables

---

## 📖 Full Guide

See `REUSE_EXISTING_SUPABASE.md` for detailed instructions.

---

**Ready? Run: `node scripts/add-prefix-to-migrations.js`** 🚀

