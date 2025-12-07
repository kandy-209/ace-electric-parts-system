# 🔐 Complete API Keys & Environment Variables Guide

This guide walks you through getting all the API keys and environment variables needed for your Ace Electric application.

## 📋 Quick Checklist

- [ ] **Supabase** (Database) - REQUIRED
- [ ] **OpenAI** (AI Features) - REQUIRED  
- [ ] **Site URL** (SEO) - Optional (has default)
- [ ] **GoHighLevel CRM** - Optional (for CRM integration)
- [ ] **Vapi.ai** - Optional (for voice calls)
- [ ] **Inngest** - Optional (for background jobs)
- [ ] **Upstash Redis** - Optional (for caching)

---

## ✅ REQUIRED - Must Have These

### 1. Supabase (Database) 🔴 REQUIRED

**What it's for:** Your main database for parts, vendors, RFQs, customers, etc.

**Steps to get:**

1. **Go to**: https://supabase.com
2. **Sign up** (or log in)
3. **Create a new project**:
   - Click "New Project"
   - Organization: Choose or create one
   - Name: `ace-electric-parts-system` (or your preference)
   - Database Password: Create a strong password (save it!)
   - Region: Choose closest to you (e.g., `US East`)
   - Click "Create new project"
4. **Wait 2-3 minutes** for project to initialize
5. **Get your keys**:
   - Go to: **Project Settings** → **API**
   - You'll see:
     - **Project URL**: `https://xxxxx.supabase.co`
     - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ Keep secret!)

**Add to `.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**📖 Help**: https://supabase.com/docs/guides/getting-started

---

### 2. OpenAI (AI Features) 🔴 REQUIRED

**What it's for:** AI-powered parts search, vendor matching, RFQ generation, chat assistant

**Steps to get:**

1. **Go to**: https://platform.openai.com/api-keys
2. **Sign up** (or log in)
3. **Create API key**:
   - Click "Create new secret key"
   - Name it: `ace-electric-parts` (or any name)
   - Click "Create secret key"
   - **⚠️ COPY IT IMMEDIATELY** (you won't see it again!)
4. **Add credits** (if needed):
   - Go to: https://platform.openai.com/account/billing
   - Add payment method
   - Add credits (minimum $5)

**Add to `.env.local`:**
```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx...
```

**💡 Tips:**
- Uses GPT-4o-mini by default (cheaper)
- GPT-4o used for complex reasoning
- Free tier: $5 free credits (expires after 3 months)
- Pay-as-you-go pricing

**📖 Help**: https://platform.openai.com/docs/guides/rate-limits

---

### 3. Site URL (SEO) 🟡 Optional

**What it's for:** SEO metadata, sitemap, robots.txt (has default if not set)

**Steps:**

Just add your production URL:

**Add to `.env.local`:**
```bash
NEXT_PUBLIC_SITE_URL=https://ace-electric-parts-system.vercel.app
# Or your custom domain:
# NEXT_PUBLIC_SITE_URL=https://aceelectricparts.com
```

**Default:** Uses `https://aceelectricparts.com` if not set

---

## 🟢 OPTIONAL - Enhance Your App

### 4. GoHighLevel CRM 🔵 Optional

**What it's for:** CRM integration, contact management, opportunity tracking, email automation

**Steps to get:**

1. **Go to**: https://www.gohighlevel.com/
2. **Sign up** for an account
3. **Get API key**:
   - Log in to your GHL dashboard
   - Go to: **Settings** → **Integrations** → **API**
   - Click "Create API Key"
   - Copy the key
4. **Get Location ID**:
   - In your GHL dashboard, go to your location
   - The Location ID is in the URL: `https://app.gohighlevel.com/location/[LOCATION_ID]/...`

**Add to `.env.local`:**
```bash
GOHIGHLEVEL_API_KEY=your_api_key_here
GOHIGHLEVEL_LOCATION_ID=your_location_id_here
```

**📖 Help**: https://highlevel.stoplight.io/docs/integrations

---

### 5. Vapi.ai (Voice Calls) 🔵 Optional

**What it's for:** Voice assistant, inbound/outbound calls, real-time transcription

**Steps to get:**

1. **Go to**: https://vapi.ai/
2. **Sign up** for an account
3. **Get API key**:
   - Go to: **Dashboard** → **Settings** → **API Keys**
   - Click "Create API Key"
   - Copy the key

**Add to `.env.local`:**
```bash
VAPI_API_KEY=your_vapi_api_key_here
```

**📖 Help**: https://docs.vapi.ai/

---

### 6. Inngest (Background Jobs) 🔵 Optional

**What it's for:** Background job processing (scraping, email sending, PDF generation)

**Steps to get:**

1. **Go to**: https://www.inngest.com/
2. **Sign up** for an account
3. **Create an app**:
   - Go to dashboard
   - Click "Create App"
   - Name it: `ace-electric-parts`
4. **Get keys**:
   - Go to: **App Settings** → **Keys**
   - Copy:
     - **Signing Key**
     - **Event Key**

**Add to `.env.local`:**
```bash
INNGEST_SIGNING_KEY=your_signing_key_here
INNGEST_EVENT_KEY=your_event_key_here
```

**📖 Help**: https://www.inngest.com/docs

---

### 7. Upstash Redis (Caching) 🔵 Optional

**What it's for:** Distributed caching, rate limiting (falls back to memory if not set)

**Steps to get:**

1. **Go to**: https://upstash.com/
2. **Sign up** for an account
3. **Create database**:
   - Click "Create Database"
   - Name: `ace-electric-parts-cache`
   - Region: Choose closest to you
   - Click "Create"
4. **Get connection string**:
   - Click on your database
   - Go to "Details" tab
   - Copy the "REST URL" or "Redis URL"

**Add to `.env.local`:**
```bash
UPSTASH_REDIS_URL=your_redis_url_here
# Or if using REST API:
UPSTASH_REDIS_REST_URL=your_rest_url_here
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

**📖 Help**: https://docs.upstash.com/redis

---

## 📝 Complete `.env.local` Template

Create a file named `.env.local` in your project root:

```bash
# ============================================
# REQUIRED - Must Have These
# ============================================

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI AI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx...

# Site URL (Optional - has default)
NEXT_PUBLIC_SITE_URL=https://ace-electric-parts-system.vercel.app

# ============================================
# OPTIONAL - Enhance Your App
# ============================================

# GoHighLevel CRM
# GOHIGHLEVEL_API_KEY=your_api_key_here
# GOHIGHLEVEL_LOCATION_ID=your_location_id_here

# Vapi.ai Voice Calls
# VAPI_API_KEY=your_vapi_api_key_here

# Inngest Background Jobs
# INNGEST_SIGNING_KEY=your_signing_key_here
# INNGEST_EVENT_KEY=your_event_key_here

# Upstash Redis Caching
# UPSTASH_REDIS_URL=your_redis_url_here

# ============================================
# Development
# ============================================
NODE_ENV=development
```

---

## 🚀 Quick Setup Script

After creating `.env.local`, verify everything:

```bash
npm run verify:setup
```

This will check which variables are set and which are missing.

---

## 🔒 Security Reminders

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Keep service_role keys secret** - Never expose in client-side code
3. **Rotate keys periodically** - Update every 90 days
4. **Use different keys for dev/prod** - Never use production keys locally

---

## 📊 Priority Order

**Get these first (REQUIRED):**
1. ✅ Supabase (database)
2. ✅ OpenAI (AI features)

**Then add (OPTIONAL - as needed):**
3. Site URL (if you have custom domain)
4. GoHighLevel (if using CRM)
5. Vapi.ai (if using voice)
6. Inngest (if using background jobs)
7. Upstash (if using caching)

---

## ✅ Next Steps

1. **Create `.env.local`** with required variables
2. **Run verification**: `npm run verify:setup`
3. **Add to Vercel**: Go to Vercel Dashboard → Settings → Environment Variables
4. **Test locally**: `npm run dev`
5. **Deploy**: Changes auto-deploy on push!

---

## 🆘 Need Help?

- **Supabase Issues**: https://supabase.com/docs/guides/getting-started
- **OpenAI Issues**: https://help.openai.com/
- **General Setup**: See `SETUP_GUIDE.md`

