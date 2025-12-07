# 🗂️ Supabase Dashboard Guide

**Your Project**: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe

---

## 🎯 Key Sections in Your Dashboard

### 1. 📊 **Overview** (Home)
- Project stats and health
- Database size
- API usage
- Recent activity

### 2. 🗄️ **Table Editor**
- View and edit data
- After running migrations, you'll see all your tables here
- **Location**: Left sidebar → Table Editor

### 3. 🔍 **SQL Editor** ⭐ (IMPORTANT for Migrations)
- Run SQL queries
- Run database migrations here
- **Location**: Left sidebar → SQL Editor
- **Direct link**: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/sql/new

### 4. 🔑 **API Settings** ⭐ (Get Your Keys)
- Get API keys
- Project URL
- Service role key
- **Location**: Settings (gear icon) → API
- **Direct link**: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/settings/api

### 5. 🔐 **Authentication**
- User management
- Auth providers
- **Location**: Left sidebar → Authentication

### 6. 📡 **Storage**
- File uploads
- Media management
- **Location**: Left sidebar → Storage

---

## 🚀 What You Need to Do Now

### Step 1: Get Service Role Key

1. **Go to**: Settings → API
   - Direct: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/settings/api

2. **Find "service_role" key** (scroll down)

3. **Click "Reveal"** to show it

4. **Copy the key** and add to `.env.local`

### Step 2: Run Database Migrations

1. **Go to**: SQL Editor
   - Direct: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/sql/new

2. **Click "New query"**

3. **Copy and paste** each migration file:
   - `supabase/migrations/001_create_tables.sql`
   - `supabase/migrations/002_comprehensive_schema.sql`
   - `supabase/migrations/002_enhanced_schema.sql`

4. **Click "Run"** (or press Ctrl/Cmd + Enter) for each

5. **Check for errors** (should show "Success")

### Step 3: Verify Tables Created

1. **Go to**: Table Editor
   - Direct: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/editor

2. **You should see** tables like:
   - `parts`
   - `vendors`
   - `rfqs`
   - `customers`
   - `orders`
   - And 50+ more!

---

## 🔗 Quick Links

### Essential Links:
- **Dashboard Home**: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe
- **API Settings**: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/settings/api
- **SQL Editor**: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/editor

---

## 📋 Checklist

- [ ] Get Service Role Key from API Settings
- [ ] Add Service Role Key to `.env.local`
- [ ] Run Migration 1: `001_create_tables.sql`
- [ ] Run Migration 2: `002_comprehensive_schema.sql`
- [ ] Run Migration 3: `002_enhanced_schema.sql`
- [ ] Verify tables in Table Editor
- [ ] Test connection: `npm run test:db`

---

## 💡 Tips

### SQL Editor Tips:
- Use `Ctrl/Cmd + Enter` to run queries
- Save queries for later reference
- Check "Show execution time" to see performance

### Table Editor Tips:
- Click column headers to sort
- Use filters to search data
- Right-click rows for options

### API Settings Tips:
- **anon key**: Safe for client-side (already have this ✅)
- **service_role key**: Server-side only (⚠️ keep secret!)
- Never expose service_role key in client code

---

## 🆘 Troubleshooting

### "Table already exists" error
- Some tables might exist already
- Migrations use `IF NOT EXISTS` so this is usually fine
- Check Table Editor to see what's there

### "Permission denied" error
- Make sure you're using **service_role** key for admin operations
- Check that you're the project owner

### Can't see tables after migration
- Refresh the Table Editor
- Check SQL Editor for error messages
- Verify migrations completed successfully

---

## 📖 Next Steps

After completing the dashboard setup:
1. ✅ Service Role Key added to `.env.local`
2. ✅ Migrations run successfully
3. ✅ Tables verified
4. ⏳ Test connection: `npm run test:db`
5. ⏳ Start development: `npm run dev`

---

**Need help?** Check `NEXT_STEPS.md` for complete setup instructions!

