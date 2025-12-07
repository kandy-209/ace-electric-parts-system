# ♻️ Reuse Existing Supabase Database

**Situation**: You've run out of free Supabase projects and want to reuse an existing database.

**Solution**: You can absolutely use an existing Supabase project! Here's how.

---

## ✅ Yes, You Can Reuse an Existing Database!

You can use an existing Supabase project for this application. Just follow these steps:

---

## 📋 Step-by-Step Guide

### Step 1: Get Your Existing Supabase Credentials

1. **Go to**: https://supabase.com/dashboard
2. **Select** your existing project (the one you want to reuse)
3. **Go to**: **Settings** → **API**
4. **Copy these 3 values**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ Keep secret!)

### Step 2: Add to Your `.env.local`

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-existing-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-existing-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-existing-service-role-key
```

### Step 3: Create New Schema/Tables

**Important**: Your existing database might have different tables. We'll create new tables specifically for this project.

#### Option A: Use Schema Namespacing (Recommended)

Create tables with a prefix to avoid conflicts:

```sql
-- Example: ace_parts, ace_vendors, ace_rfqs, etc.
```

#### Option B: Use a Separate Schema

Create a new PostgreSQL schema in your existing database:

```sql
CREATE SCHEMA ace_electric;
SET search_path TO ace_electric, public;
```

---

## 🔧 Running Migrations on Existing Database

### Method 1: Via Supabase Dashboard (Easiest)

1. **Go to**: https://supabase.com/dashboard
2. **Select** your existing project
3. **Go to**: **SQL Editor**
4. **Copy and run** the migration files:
   - `supabase/migrations/001_create_tables.sql`
   - `supabase/migrations/002_comprehensive_schema.sql`

5. **Run them one at a time**, checking for errors

### Method 2: Via Supabase CLI

```bash
# Link to your existing project
npx supabase link --project-ref your-project-ref

# Run migrations
npx supabase db push
```

### Method 3: Manual SQL Execution

1. Open each migration file in `supabase/migrations/`
2. Copy the SQL
3. Paste into Supabase SQL Editor
4. Run it

---

## 🎯 Table Names: Prefix or Schema?

### Option 1: Prefix Tables (Simple)

Modify migration files to add prefix:

```sql
-- Instead of: CREATE TABLE parts
CREATE TABLE ace_parts (
  ...
);

-- Instead of: CREATE TABLE vendors
CREATE TABLE ace_vendors (
  ...
);
```

### Option 2: Use Schema (Professional)

1. Create schema first:
```sql
CREATE SCHEMA IF NOT EXISTS ace_electric;
```

2. Update all table references:
```sql
CREATE TABLE ace_electric.parts (
  ...
);
```

3. Update your code to use schema:
```typescript
// In supabase-client.ts or queries
supabase.from('ace_electric.parts').select('*')
```

---

## 🔍 Check Existing Tables

Before running migrations, check what tables exist:

1. **Go to**: Supabase Dashboard → **Table Editor**
2. **See** what tables you already have
3. **Decide**: 
   - Use prefixes? (`ace_parts`, `ace_vendors`)
   - Use new schema? (`ace_electric.parts`)
   - Replace existing? (⚠️ Back up first!)

---

## ⚠️ Important Considerations

### 1. Existing Data
- **Backup first**: Export existing data if important
- **Test migrations** on a copy if possible
- **Review migration SQL** before running

### 2. Conflicts
- Check for table name conflicts
- Check for function/trigger conflicts
- Use prefixes or schemas to avoid issues

### 3. Row Level Security (RLS)
- Your existing project might have RLS policies
- Review and adjust as needed
- Don't disable existing RLS without understanding impact

---

## 🚀 Quick Setup Script

I can create a script to:
1. Check your existing database
2. List existing tables
3. Modify migrations to use prefixes
4. Apply migrations safely

Would you like me to create this?

---

## 📝 Modified Migration Template

If you want to use prefixes, I can update all migration files to use `ace_` prefix. Just let me know!

Example:
```sql
-- Original
CREATE TABLE parts (...);

-- With prefix
CREATE TABLE ace_parts (...);
```

---

## ✅ Verification

After setting up:

```bash
# Test connection
npm run test:db

# Verify setup
npm run verify:setup
```

---

## 🆘 Troubleshooting

### "Table already exists" error
- Use prefixes or schema to avoid conflicts
- Or drop existing tables (⚠️ backup first!)

### "Permission denied" error
- Make sure you're using `service_role` key for migrations
- Check RLS policies

### "Schema doesn't exist" error
- Create schema first: `CREATE SCHEMA ace_electric;`

---

## 🎯 Recommended Approach

**Best for you**: Use table prefixes (`ace_` prefix)

**Why**:
- Simple and straightforward
- No schema changes needed
- Easy to identify project tables
- Can coexist with other tables

**Steps**:
1. I'll modify all migrations to use `ace_` prefix
2. You run the migrations
3. Everything works!

---

**Want me to create prefixed migrations? Just say the word!** 🚀

