#!/bin/bash

# Helper script to guide you through running migrations
# For NEW Supabase projects

echo "📊 Database Migration Helper"
echo "============================"
echo ""
echo "This script helps you run migrations on your NEW Supabase project."
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo ""
    echo "Create it first with your Supabase keys:"
    echo "  1. Run: npm run setup:env"
    echo "  2. Or create manually"
    exit 1
fi

echo "✅ Found .env.local"
echo ""

# Load env vars
export $(grep -v '^#' .env.local | xargs)

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "❌ NEXT_PUBLIC_SUPABASE_URL not set in .env.local"
    exit 1
fi

echo "📋 Supabase Project: $NEXT_PUBLIC_SUPABASE_URL"
echo ""

echo "📝 Migration files to run:"
ls -1 supabase/migrations/*.sql 2>/dev/null | while read file; do
    echo "  ✅ $(basename $file)"
done

echo ""
echo "🚀 To run migrations:"
echo ""
echo "Option 1: Via Supabase Dashboard (Recommended)"
echo "  1. Go to: https://supabase.com/dashboard"
echo "  2. Select your project"
echo "  3. Go to: SQL Editor"
echo "  4. Copy and paste each migration file in order:"
echo "     - 001_create_tables.sql"
echo "     - 002_comprehensive_schema.sql"
echo "     - 002_enhanced_schema.sql"
echo "  5. Click 'Run' for each"
echo ""

echo "Option 2: Via Supabase CLI"
echo "  npx supabase db push"
echo ""

read -p "Open Supabase Dashboard in browser? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://supabase.com/dashboard"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://supabase.com/dashboard"
    else
        echo "Please open: https://supabase.com/dashboard"
    fi
fi

echo ""
echo "✅ After running migrations, verify with:"
echo "   npm run test:db"

