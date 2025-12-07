# 🚀 Vercel Environment Variables Setup

**Project ID**: `prj_TcncP39x2troQUb6ZQxLoZnZrTJA`  
**Project Name**: `ace-electric-parts-system`  
**Dashboard**: https://vercel.com/andrewkosel93-1443s-projects/ace-electric-parts-system

## 📋 Quick Steps to Add Environment Variables

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to**: https://vercel.com/dashboard
2. **Click** on your project: `ace-electric-parts-system`
3. **Go to**: Settings → Environment Variables
4. **Add each variable**:

#### Required Variables

Add these **REQUIRED** variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `OPENAI_API_KEY` | `sk-proj-...` | Production, Preview, Development |

#### Optional Variables

Add these if you're using them:

| Variable Name | Environment |
|--------------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production, Preview, Development |
| `GOHIGHLEVEL_API_KEY` | Production, Preview, Development |
| `GOHIGHLEVEL_LOCATION_ID` | Production, Preview, Development |
| `VAPI_API_KEY` | Production, Preview, Development |
| `INNGEST_SIGNING_KEY` | Production, Preview, Development |
| `INNGEST_EVENT_KEY` | Production, Preview, Development |
| `UPSTASH_REDIS_URL` | Production, Preview, Development |

5. **For each variable**:
   - Click "Add New"
   - Paste the **Key** name
   - Paste the **Value**
   - Select environments: ✅ Production ✅ Preview ✅ Development
   - Click "Save"

6. **Redeploy** after adding variables:
   - Go to **Deployments** tab
   - Click the **"..."** menu on latest deployment
   - Click **"Redeploy"**

### Method 2: Via Vercel CLI

```bash
# Add a single variable
npx vercel@latest env add NEXT_PUBLIC_SUPABASE_URL production preview development

# Or add all at once (interactive)
npx vercel@latest env add
```

---

## 🔍 Verify Variables Are Set

### Check via Dashboard
1. Go to: Settings → Environment Variables
2. You should see all your variables listed

### Check via CLI
```bash
npx vercel@latest env ls
```

---

## 📝 Complete Variable List

Copy-paste ready format for Dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx...
NEXT_PUBLIC_SITE_URL=https://ace-electric-parts-system.vercel.app
```

---

## ⚠️ Important Notes

1. **After adding variables**, you MUST redeploy for them to take effect
2. **Service Role Key** should only be in Production environment (optional)
3. **NEXT_PUBLIC_*** variables are exposed to the browser (safe for public keys)
4. **Non-NEXT_PUBLIC_** variables are server-only (use for secrets)

---

## 🔒 Security Best Practices

- ✅ Use different keys for Development/Preview/Production
- ✅ Rotate keys every 90 days
- ✅ Never commit `.env.local` to Git (already in `.gitignore`)
- ✅ Use Vercel's encrypted storage (automatic)

---

## 🆘 Troubleshooting

### Variables not working?
1. Make sure you **redeployed** after adding variables
2. Check variable names match exactly (case-sensitive)
3. Verify no extra spaces in values

### Check deployment logs:
```bash
npx vercel@latest logs
```

### View specific deployment:
```bash
npx vercel@latest inspect [deployment-url]
```

---

## 🎯 Quick Commands

```bash
# List all environment variables
npx vercel@latest env ls

# Remove a variable
npx vercel@latest env rm VARIABLE_NAME

# Pull environment variables locally (creates .env.local.vercel)
npx vercel@latest env pull .env.local.vercel
```

---

## 📊 Your Project Info

- **Project ID**: `prj_TcncP39x2troQUb6ZQxLoZnZrTJA`
- **Organization**: `andrewkosel93-1443s-projects`
- **Production URL**: https://ace-electric-parts-system.vercel.app
- **Dashboard**: https://vercel.com/dashboard

---

**Need help?** Check `API_KEYS_GUIDE.md` for where to get each API key!

