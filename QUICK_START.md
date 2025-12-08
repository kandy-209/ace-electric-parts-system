# ⚡ Quick Start Guide

## ✅ What's Done
- [x] Database migrations complete (50+ tables)
- [x] GitHub connected
- [x] Vercel linked
- [x] Local environment configured

---

## 🚀 Complete Setup (3 Steps)

### Step 1: Add Environment Variables to Vercel (5 min)

**Option A - Automated (Recommended):**
```bash
./scripts/add-all-vercel-env.sh
```

**Option B - Manual:**
1. Go to: https://vercel.com/dashboard
2. Select: `ace-electric-parts-system`
3. Settings → Environment Variables
4. Add these from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` (if you have it)
5. Select: Production, Preview, Development
6. Save → Redeploy

---

### Step 2: Test Locally (2 min)

```bash
npm run dev
```

**Visit:** http://localhost:3000

**Check:**
- ✅ Home page loads
- ✅ Can navigate to `/parts`
- ✅ Can navigate to `/rfq`
- ✅ Can access `/admin` pages

**Test database:**
```bash
npm run test:db
```

---

### Step 3: Verify Production (2 min)

1. **Check deployment:**
   - https://vercel.com/dashboard
   - Latest deployment should be ✅ Ready

2. **Visit production URL:**
   - Your Vercel URL (shown in dashboard)
   - Test that it works

3. **Verify env vars working:**
   - Check browser console (no errors)
   - Test API endpoints

---

## 📊 Status Check

```bash
# Test database connection
npm run test:db

# Check what's configured
./scripts/setup-vercel-env.sh

# Complete setup helper
./scripts/complete-setup.sh
```

---

## 🎯 You're Ready!

Once Step 1 is done:
- ✅ Application will work in production
- ✅ Database is ready
- ✅ APIs are ready
- ✅ Start importing data!

**Next:** Import your parts and vendor data!

