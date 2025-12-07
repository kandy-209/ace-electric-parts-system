# ⚡ Quick Start: Get Your API Keys

## 🎯 Fast Track (5 Minutes)

### Step 1: Get Supabase Keys (2 min)
1. Go to: https://supabase.com → Sign up
2. Create project → Wait 2 min
3. Settings → API → Copy 3 keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Get OpenAI Key (1 min)
1. Go to: https://platform.openai.com/api-keys
2. Create new key → Copy immediately
   - `OPENAI_API_KEY`

### Step 3: Create `.env.local` (1 min)
Run interactive setup:
```bash
npm run setup:env
```

Or manually create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-proj-...
```

### Step 4: Verify (1 min)
```bash
npm run verify:setup
```

## ✅ You're Done!

See `API_KEYS_GUIDE.md` for:
- Detailed instructions
- Optional services (CRM, Voice, etc.)
- Troubleshooting

## 🔗 Direct Links

- **Supabase**: https://supabase.com/dashboard
- **OpenAI**: https://platform.openai.com/api-keys
- **Full Guide**: `API_KEYS_GUIDE.md`

