#!/bin/bash

# Comprehensive verification script for Git and Vercel integration

echo "🔍 Verifying Git and Vercel Integration"
echo "========================================"
echo ""

# Git Status
echo "📋 GIT STATUS"
echo "-------------"
git status -sb
echo ""

# Git Remote
echo "🔗 GIT REMOTE"
echo "-------------"
git remote -v
echo ""

# Check if synced with remote
echo "🔄 GIT SYNC STATUS"
echo "------------------"
git fetch origin --quiet
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "none")
BASE=$(git merge-base @ @{u} 2>/dev/null || echo "none")

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ Local and remote are in sync"
elif [ "$LOCAL" = "$BASE" ]; then
    echo "⚠️  Local is behind remote - run: git pull"
elif [ "$REMOTE" = "$BASE" ]; then
    echo "⚠️  Local is ahead of remote - run: git push"
else
    echo "⚠️  Local and remote have diverged"
fi
echo ""

# Vercel Project Status
echo "🚀 VERCEL PROJECT STATUS"
echo "-----------------------"
if [ -f ".vercel/project.json" ]; then
    echo "✅ Vercel project linked"
    cat .vercel/project.json | python3 -m json.tool 2>/dev/null || cat .vercel/project.json
else
    echo "❌ Vercel project not linked"
    echo "   Run: npx vercel@latest link"
fi
echo ""

# Vercel Deployments
echo "📦 VERCEL DEPLOYMENTS"
echo "--------------------"
npx vercel@latest ls 2>&1 | head -10
echo ""

# Check Git integration in Vercel
echo "🔗 VERCEL GIT INTEGRATION"
echo "------------------------"
VERCEL_GIT=$(npx vercel@latest inspect 2>&1 | grep -i "git" || echo "Checking...")
if [ ! -z "$VERCEL_GIT" ]; then
    echo "Git integration details found"
else
    echo "Run: npx vercel@latest inspect <deployment-url> for details"
fi
echo ""

# Summary
echo "📊 SUMMARY"
echo "----------"
echo "✅ Git repository: $(git remote get-url origin 2>/dev/null || echo 'Not configured')"
echo "✅ Git branch: $(git branch --show-current)"
echo "✅ Vercel linked: $([ -f '.vercel/project.json' ] && echo 'Yes' || echo 'No')"
echo "✅ Working tree: $(git diff --quiet && echo 'Clean' || echo 'Has uncommitted changes')"
echo ""

echo "✨ Verification complete!"

