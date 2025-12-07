# 🔑 Get Your Service Role Key

## Quick Steps

1. **Go to**: https://supabase.com/dashboard/project/xuranenlfkuvufgqxwqe/settings/api

2. **Scroll down** to find the keys section

3. **Look for "service_role" key** (NOT the "anon" key)

4. **Click "Reveal"** to show the key (it's hidden by default for security)

5. **Copy the key** (it will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

6. **Paste it** into your `.env.local` file:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## ⚠️ Important Security Notes

- **Never commit** the service_role key to Git (already in `.gitignore`)
- **Never expose** it in client-side code
- **Only use** for server-side operations (migrations, admin tasks)
- **Keep it secret** - it has full admin access to your database

## 🔍 Difference Between Keys

- **anon/public key**: Safe for client-side, has limited permissions
- **service_role key**: Server-side only, has full admin access (⚠️ keep secret!)

## ✅ After Adding Service Role Key

1. **Save** `.env.local`
2. **Test connection**: `npm run test:db`
3. **Run migrations**: `npm run migrate:db`

