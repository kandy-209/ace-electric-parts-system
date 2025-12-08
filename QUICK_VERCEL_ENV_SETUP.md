# ⚡ Quick Vercel Environment Variables Setup

## 🎯 Fastest Way (2 minutes)

### Step 1: Open Vercel Dashboard
**Direct Link**: https://vercel.com/andrewkosel93-1443s-projects/ace-electric-parts-system/settings/environment-variables

### Step 2: Add These 4 Variables

Click **"Add New"** for each:

#### 1. NEXT_PUBLIC_SUPABASE_URL
- **Value**: `https://xuranenlfkuvufgqxwqe.supabase.co`
- **Environments**: ✅ Production ✅ Preview ✅ Development

#### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmFuZW5sZmt1dnVmZ3F4d3FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwODY3MTksImV4cCI6MjA4MDY2MjcxOX0.PVFUM57ufzJmmceLlLgMdS0L4w9hhbsrUAopnFO6zVc`
- **Environments**: ✅ Production ✅ Preview ✅ Development

#### 3. SUPABASE_SERVICE_ROLE_KEY
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cmFuZW5sZmt1dnVmZ3F4d3FlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTA4NjcxOSwiZXhwIjoyMDgwNjYyNzE5fQ.GNSV_iBlxVC37tWogcOFGPJOLSaaKee_4-UhxJ1O1yo`
- **Environments**: ✅ Production ✅ Preview ✅ Development

#### 4. OPENAI_API_KEY
- **Value**: Get from https://platform.openai.com/api-keys (starts with `sk-proj-`)
- **Environments**: ✅ Production ✅ Preview ✅ Development

#### 5. NEXT_PUBLIC_SITE_URL (Optional)
- **Value**: `https://ace-electric-parts-system.vercel.app`
- **Environments**: ✅ Production ✅ Preview ✅ Development

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**

---

## ✅ Done!

After redeploy, your production site will have access to the database and AI features.

---

## 🧪 Test It

After redeploy, test your site:
- https://ace-electric-parts-system.vercel.app
- Check that pages load
- Test API endpoints

---

**That's it! Your app will be fully functional.** 🚀

