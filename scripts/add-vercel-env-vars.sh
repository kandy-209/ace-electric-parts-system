#!/bin/bash

# Script to help add environment variables to Vercel
# This script shows you what to add and provides copy-paste ready values

echo "🚀 Vercel Environment Variables Setup Helper"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "Please create it first with your credentials."
    exit 1
fi

echo "📋 Your current environment variables:"
echo ""

# Read and display variables (safely)
echo "Required Variables to Add to Vercel:"
echo "-----------------------------------"
echo ""

# Supabase
if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d '=' -f2-)
    echo "1. NEXT_PUBLIC_SUPABASE_URL"
    echo "   Value: $SUPABASE_URL"
    echo ""
fi

if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    SUPABASE_ANON=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local | cut -d '=' -f2-)
    echo "2. NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   Value: ${SUPABASE_ANON:0:50}..." # Show first 50 chars
    echo ""
fi

if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
    SUPABASE_SERVICE=$(grep "SUPABASE_SERVICE_ROLE_KEY" .env.local | cut -d '=' -f2-)
    echo "3. SUPABASE_SERVICE_ROLE_KEY"
    echo "   Value: ${SUPABASE_SERVICE:0:50}..." # Show first 50 chars
    echo ""
fi

# OpenAI
if grep -q "OPENAI_API_KEY" .env.local; then
    OPENAI_KEY=$(grep "OPENAI_API_KEY" .env.local | cut -d '=' -f2-)
    if [ "$OPENAI_KEY" != "PASTE_YOUR_OPENAI_KEY_HERE" ]; then
        echo "4. OPENAI_API_KEY"
        echo "   Value: ${OPENAI_KEY:0:20}..." # Show first 20 chars
        echo ""
    else
        echo "⚠️  4. OPENAI_API_KEY - NOT SET (placeholder found)"
        echo "   Get it from: https://platform.openai.com/api-keys"
        echo ""
    fi
fi

# Site URL
if grep -q "NEXT_PUBLIC_SITE_URL" .env.local; then
    SITE_URL=$(grep "NEXT_PUBLIC_SITE_URL" .env.local | cut -d '=' -f2-)
    echo "5. NEXT_PUBLIC_SITE_URL (Optional)"
    echo "   Value: $SITE_URL"
    echo ""
fi

echo ""
echo "📝 How to Add to Vercel:"
echo "------------------------"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click on: ace-electric-parts-system"
echo "3. Go to: Settings → Environment Variables"
echo "4. Click 'Add New' for each variable above"
echo "5. Copy the values from your .env.local file"
echo "6. Select: ✅ Production ✅ Preview ✅ Development"
echo "7. Click 'Save'"
echo "8. Go to Deployments → Redeploy latest"
echo ""
echo "🔗 Direct Link:"
echo "https://vercel.com/andrewkosel93-1443s-projects/ace-electric-parts-system/settings/environment-variables"
echo ""

