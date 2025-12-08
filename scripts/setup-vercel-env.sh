#!/bin/bash

# Helper script to prepare environment variables for Vercel
# This shows you what to add to Vercel Dashboard

echo "🔧 Vercel Environment Variables Setup Helper"
echo "=============================================="
echo ""

if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "   Please create it first with your environment variables."
    exit 1
fi

echo "📋 Environment variables found in .env.local:"
echo ""
echo "Required for Supabase (already configured):"
echo "-------------------------------------------"
grep -E "^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)=" .env.local | sed 's/=.*/=***/' 
echo ""

echo "Optional (for full features):"
echo "-----------------------------"
grep -E "^(OPENAI_|VAPI_|GOHIGHLEVEL_|UPSTASH_|INNGEST_)" .env.local | sed 's/=.*/=***/' || echo "  (none configured yet)"
echo ""

echo "🚀 Next Steps:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your project: ace-electric-parts-system"
echo "3. Go to: Settings → Environment Variables"
echo "4. Add the variables shown above"
echo "5. Select environments: Production, Preview, Development"
echo "6. Save and redeploy"
echo ""
echo "Or use Vercel CLI:"
echo "  vercel env add NEXT_PUBLIC_SUPABASE_URL production"
echo "  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production"
echo "  vercel env add SUPABASE_SERVICE_ROLE_KEY production"
echo ""

