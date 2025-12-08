#!/bin/bash

# Script to help add all environment variables to Vercel
# This will guide you through the process

echo "🚀 Adding Environment Variables to Vercel"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    exit 1
fi

echo "📋 Found .env.local file"
echo ""

# Extract variables
SUPABASE_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL=" .env.local | cut -d'=' -f2)
SUPABASE_ANON_KEY=$(grep "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2)
SUPABASE_SERVICE_KEY=$(grep "^SUPABASE_SERVICE_ROLE_KEY=" .env.local | cut -d'=' -f2)
OPENAI_KEY=$(grep "^OPENAI_API_KEY=" .env.local | cut -d'=' -f2)
SITE_URL=$(grep "^NEXT_PUBLIC_SITE_URL=" .env.local | cut -d'=' -f2 || echo "")

echo "Ready to add these variables to Vercel:"
echo ""
echo "✅ NEXT_PUBLIC_SUPABASE_URL"
echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "✅ SUPABASE_SERVICE_ROLE_KEY"
[ ! -z "$OPENAI_KEY" ] && echo "✅ OPENAI_API_KEY"
[ ! -z "$SITE_URL" ] && echo "✅ NEXT_PUBLIC_SITE_URL"
echo ""

echo "Using Vercel CLI (interactive mode)..."
echo ""

# Check if logged in
if ! npx vercel@latest whoami &>/dev/null; then
    echo "🔐 You need to log in to Vercel first"
    echo "   Run: npx vercel@latest login"
    echo ""
    read -p "Do you want to login now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx vercel@latest login
    else
        echo "Skipping login. You can add variables manually via dashboard."
        exit 0
    fi
fi

# Link project if needed
if [ ! -f ".vercel/project.json" ]; then
    echo "📦 Linking Vercel project..."
    npx vercel@latest link --yes --project=ace-electric-parts-system
fi

echo ""
echo "Adding environment variables..."
echo ""

# Add variables
if [ ! -z "$SUPABASE_URL" ]; then
    echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
    echo "$SUPABASE_URL" | npx vercel@latest env add NEXT_PUBLIC_SUPABASE_URL production preview development
fi

if [ ! -z "$SUPABASE_ANON_KEY" ]; then
    echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
    echo "$SUPABASE_ANON_KEY" | npx vercel@latest env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development
fi

if [ ! -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
    echo "$SUPABASE_SERVICE_KEY" | npx vercel@latest env add SUPABASE_SERVICE_ROLE_KEY production preview development
fi

if [ ! -z "$OPENAI_KEY" ]; then
    echo "Adding OPENAI_API_KEY..."
    echo "$OPENAI_KEY" | npx vercel@latest env add OPENAI_API_KEY production preview development
fi

if [ ! -z "$SITE_URL" ]; then
    echo "Adding NEXT_PUBLIC_SITE_URL..."
    echo "$SITE_URL" | npx vercel@latest env add NEXT_PUBLIC_SITE_URL production preview development
fi

echo ""
echo "✅ Environment variables added!"
echo ""
echo "📋 Next: Redeploy your application"
echo "   1. Go to: https://vercel.com/dashboard"
echo "   2. Select your project"
echo "   3. Go to Deployments → Click ... → Redeploy"
echo ""

