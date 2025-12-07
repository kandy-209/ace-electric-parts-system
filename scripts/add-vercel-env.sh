#!/bin/bash

# Script to help add environment variables to Vercel
# Usage: ./scripts/add-vercel-env.sh

echo "🔐 Vercel Environment Variables Setup"
echo "======================================"
echo ""
echo "Project ID: prj_TcncP39x2troQUb6ZQxLoZnZrTJA"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo "   Run: npm run setup:env"
    echo "   Or create .env.local manually"
    exit 1
fi

echo "✅ Found .env.local"
echo ""
echo "You have two options:"
echo ""
echo "Option 1: Add via Vercel Dashboard (Recommended)"
echo "   1. Go to: https://vercel.com/dashboard"
echo "   2. Select: ace-electric-parts-system"
echo "   3. Go to: Settings → Environment Variables"
echo "   4. Add variables from .env.local"
echo ""
echo "Option 2: Add via CLI (Interactive)"
echo "   Run: npx vercel@latest env add"
echo ""

read -p "Do you want to view your current .env.local variables? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Current variables in .env.local:"
    echo "--------------------------------"
    grep -v "^#" .env.local | grep -v "^$" | while IFS='=' read -r key value; do
        if [ ! -z "$key" ]; then
            # Mask sensitive values
            if [[ "$key" == *"KEY"* ]] || [[ "$key" == *"SECRET"* ]] || [[ "$key" == *"TOKEN"* ]]; then
                masked_value="${value:0:10}... (hidden)"
            else
                masked_value="$value"
            fi
            echo "  $key=$masked_value"
        fi
    done
fi

echo ""
echo "📋 Next Steps:"
echo "   1. Copy variables from .env.local"
echo "   2. Add them to Vercel Dashboard (see VERCEL_ENV_SETUP.md)"
echo "   3. Redeploy your application"
echo ""
echo "📖 Full guide: VERCEL_ENV_SETUP.md"

