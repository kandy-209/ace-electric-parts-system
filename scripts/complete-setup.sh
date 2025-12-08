#!/bin/bash

# Complete setup automation script
# This helps you finish all remaining setup steps

echo "🚀 Completing Setup Steps"
echo "========================"
echo ""

# Step 1: Check environment variables
echo "Step 1: Checking environment variables..."
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    
    MISSING=0
    grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local || MISSING=1
    grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local || MISSING=1
    grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local || MISSING=1
    
    if [ $MISSING -eq 0 ]; then
        echo "✅ All required variables present"
    else
        echo "⚠️  Some variables missing"
    fi
else
    echo "❌ .env.local not found"
    echo "   Run: npm run setup:env"
    exit 1
fi

echo ""
echo "Step 2: Testing database connection..."
npm run test:db

echo ""
echo "Step 3: Starting development server..."
echo "   (This will run in background)"
echo "   Visit: http://localhost:3000"
echo ""

# Start dev server in background
npm run dev > /dev/null 2>&1 &
DEV_PID=$!

echo "   Dev server PID: $DEV_PID"
echo "   To stop: kill $DEV_PID"
echo ""

sleep 5

echo "Step 4: Testing application..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Application is running!"
    echo "   Open: http://localhost:3000"
else
    echo "⏳ Application starting... (may take a moment)"
fi

echo ""
echo "========================================="
echo "📋 Next Steps:"
echo ""
echo "1. ✅ Add environment variables to Vercel:"
echo "   Run: ./scripts/add-all-vercel-env.sh"
echo "   OR use Vercel Dashboard (see VERCEL_ENV_SETUP.md)"
echo ""
echo "2. ✅ Test locally:"
echo "   Visit: http://localhost:3000"
echo "   Check all pages work"
echo ""
echo "3. ✅ Redeploy on Vercel after adding env vars"
echo ""
echo "4. ✅ Import initial data (when ready)"
echo "   Visit: http://localhost:3000/admin/import"
echo ""
echo "========================================="
echo ""

