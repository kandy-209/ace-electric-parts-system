# ✅ Easiest Way to Run Migration 2

## 🚀 Quick Steps

### Option 1: Copy-Paste (Recommended - 30 seconds)

1. **Open Supabase SQL Editor**:
   - Go to: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/sql/new

2. **Open the migration file**:
   - File: `MIGRATION_2_SAFE.sql` (in your project root)

3. **Copy all**:
   - Select All (Cmd/Ctrl + A)
   - Copy (Cmd/Ctrl + C)

4. **Paste and run**:
   - Paste into SQL Editor (Cmd/Ctrl + V)
   - Click **"Run"** button

5. **Done!** ✅

---

### Option 2: Automated (requires database password)

If you want to automate this, you need your database password:

1. **Get database password**:
   - Supabase Dashboard → Project Settings → Database
   - Copy the "Database Password" (not the API keys)

2. **Add to .env.local**:
   ```bash
   SUPABASE_DB_PASSWORD=your_actual_db_password_here
   ```

3. **Run script**:
   ```bash
   node scripts/run-migration-2-direct.js
   ```

---

## 📁 File Location

**Migration file**: `/Users/lemonbear/Desktop/ace-electric-parts-system/MIGRATION_2_SAFE.sql`

This file:
- ✅ Checks if columns exist before adding
- ✅ Won't error on duplicate columns
- ✅ Safe to run multiple times
- ✅ Handles all edge cases

---

## 🎯 What Migration 2 Does

Adds ~30+ new tables for:
- ✅ Order management
- ✅ Customer management
- ✅ ML/AI features
- ✅ Marketplace
- ✅ Analytics
- ✅ Sales management
- ✅ Communication tracking
- ✅ Integration logging

---

**Recommended: Use Option 1 (Copy-Paste) - it's the fastest and most reliable!** ✅

